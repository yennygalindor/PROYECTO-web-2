const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const { connectDB } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { connectRabbitMQ, consumeMessages } = require('./config/rabbitmq');
const { requestLogger } = require('./common/middlewares/logger');
const { errorHandler, notFound } = require('./common/middlewares/errorHandler');

// Configuraciones
const corsOptions = require('./config/cors');
const compressionOptions = require('./config/compression');

// Rutas
const userRoutes = require('./modules/users/user.routes');
const characterRoutes = require('./modules/characters/character.routes');
const locationRoutes = require('./modules/locations/location.routes');
const episodeRoutes = require('./modules/episodes/episode.routes');
const favoriteRoutes = require('./modules/favorites/favorite.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// ===== SEGURIDAD Y MIDDLEWARE DE OPTIMIZACIÓN =====

// Helmet: Configurar headers de seguridad HTTP
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Desactivar CSP para desarrollo
}));

// CORS avanzado
app.use(cors(corsOptions));

// Compresión HTTP (GZIP)
app.use(compression(compressionOptions));

// Rate limiting: Limitar solicitudes por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 solicitudes por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Aplicar rate limiting general a todas las rutas API
app.use('/api/', limiter);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logger de solicitudes
app.use(requestLogger);
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
// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/favorites', favoriteRoutes);

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