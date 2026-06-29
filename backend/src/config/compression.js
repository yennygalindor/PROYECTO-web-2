const compression = require('compression');

// Configuración de compresión HTTP
const compressionOptions = {
  // Nivel de compresión (0-9, siendo 9 el máximo)
  level: 6,
  
  // Umbral mínimo para comprimir (en bytes)
  threshold: 1024, // Solo comprimir respuestas > 1KB
  
  // Filtro personalizado para decidir qué comprimir
  filter: (req, res) => {
    // No comprimir si el cliente lo solicita explícitamente
    if (req.headers['x-no-compression']) {
      return false;
    }

    // No comprimir respuestas de streaming
    if (res.getHeader('Content-Type')?.includes('stream')) {
      return false;
    }

    // No comprimir imágenes ya comprimidas
    const contentType = res.getHeader('Content-Type');
    if (contentType && (
      contentType.includes('image/jpeg') ||
      contentType.includes('image/png') ||
      contentType.includes('image/gif') ||
      contentType.includes('video/')
    )) {
      return false;
    }

    // Usar el filtro predeterminado de compression
    return compression.filter(req, res);
  }
};

module.exports = compressionOptions;
