const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { connectRabbitMQ, consumeMessages } = require('./config/rabbitmq');
const { requestLogger } = require('./common/middlewares/logger');
const { errorHandler, notFound } = require('./common/middlewares/errorHandler');
const { rateLimit } = require('./common/middlewares/rateLimiter');

const userRoutes = require('./modules/users/user.routes');
const characterRoutes = require('./modules/characters/character.routes');
const locationRoutes = require('./modules/locations/location.routes');
const episodeRoutes = require('./modules/episodes/episode.routes');
const favoriteRoutes = require('./modules/favorites/favorite.routes');
const fileRoutes = require('./modules/files/file.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');


const app = express();

// Configuración de CORS desde variables de entorno
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:4200', 'http://localhost:3000'];

app.use(cors({
  origin: corsOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 horas
}));

// Compresión HTTP
if (process.env.COMPRESSION_ENABLED === 'true') {
  app.use(compression({
    threshold: parseInt(process.env.COMPRESSION_THRESHOLD) || 1024,
    level: 6
  }));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos del directorio de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(requestLogger);

// Rate limiting global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde'
}));
// En app.js antes de las rutas protegidas
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API funcionando',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
// Swagger — solo si está habilitado
if (process.env.SWAGGER_ENABLED === 'true') {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = require('./config/swagger');

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { background-color: #0f3460; }',
    customSiteTitle: 'Rick & Morty API Docs'
  }));

  app.get('/api/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📄 Swagger disponible en http://localhost:3000/api/docs');
}
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🚀 Rick & Morty API funcionando!' });
});

app.use(notFound);
app.use(errorHandler);



const start = async () => {
  await connectDB();
  await connectRedis();
  await connectRabbitMQ();

  consumeMessages('notifications', (msg) => {
    console.log('📬 Notificación:', msg);
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
  });
};

start();

module.exports = app;