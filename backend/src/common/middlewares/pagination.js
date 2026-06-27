/**
 * Middleware de paginación
 * Procesa y valida parámetros de paginación
 */
const paginate = (req, res, next) => {
  const page = parseInt(req.query.page) || parseInt(process.env.DEFAULT_PAGE) || 1;
  const limit = parseInt(req.query.limit) || parseInt(process.env.DEFAULT_LIMIT) || 10;
  const maxLimit = parseInt(process.env.MAX_LIMIT) || 100;

  // Validar que sean números positivos
  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: 'El número de página debe ser mayor a 0'
    });
  }

  if (limit < 1) {
    return res.status(400).json({
      success: false,
      message: 'El límite debe ser mayor a 0'
    });
  }

  // Limitar el máximo de resultados por página
  const finalLimit = Math.min(limit, maxLimit);

  // Calcular offset para queries de base de datos
  const offset = (page - 1) * finalLimit;

  // Agregar a req para uso posterior
  req.pagination = {
    page,
    limit: finalLimit,
    offset,
    maxLimit
  };

  next();
};

/**
 * Helper para crear respuesta paginada
 */
const createPaginatedResponse = (data, total, req) => {
  const { page, limit } = req.pagination;
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null
    }
  };
};

module.exports = { paginate, createPaginatedResponse };
