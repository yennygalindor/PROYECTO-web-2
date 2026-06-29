// Configuración avanzada de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:4200',
      'http://localhost:3000',
      'http://127.0.0.1:4200',
      'http://127.0.0.1:3000'
    ];

    // Permitir dominios adicionales desde variables de entorno
    if (process.env.ALLOWED_ORIGINS) {
      const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
      allowedOrigins.push(...envOrigins);
    }

    // Permitir solicitudes sin origen (como Postman o aplicaciones móviles)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origen ${origin} no permitido por CORS`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: [
    'Content-Length',
    'Content-Type',
    'X-Total-Count',
    'X-Page-Number',
    'X-Page-Size'
  ],
  credentials: true,
  maxAge: 86400, // 24 horas en segundos
  preflightContinue: false,
  optionsSuccessStatus: 204
};

module.exports = corsOptions;
