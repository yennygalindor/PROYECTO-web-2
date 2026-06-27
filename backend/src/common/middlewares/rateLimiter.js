const { getCache, setCache } = require('../../config/redis');

/**
 * Middleware de rate limiting usando Redis
 */
const rateLimit = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutos por defecto
    max = 100, // máximo de requests
    message = 'Demasiadas solicitudes, por favor intenta más tarde',
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return async (req, res, next) => {
    try {
      const identifier = req.ip || req.connection.remoteAddress;
      const key = `rate-limit:${identifier}`;

      // Obtener contador actual
      const current = await getCache(key);
      const count = current ? parseInt(current) : 0;

      if (count >= max) {
        return res.status(429).json({
          success: false,
          message,
          retryAfter: Math.ceil(windowMs / 1000)
        });
      }

      // Incrementar contador
      await setCache(key, count + 1, Math.ceil(windowMs / 1000));

      // Headers informativos
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, max - count - 1));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + windowMs).toISOString());

      next();
    } catch (error) {
      console.error('Error en rate limiter:', error);
      // En caso de error, permitir la solicitud
      next();
    }
  };
};

module.exports = { rateLimit };
