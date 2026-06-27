const favoriteService = require('./favorite.service');
const { createPaginatedResponse } = require('../../common/middlewares/pagination');
const { handleExport } = require('../../common/utils/exportData');

/**
 * Obtener favoritos con filtros y paginación
 */
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = {
      resourceType: req.query.resourceType,
      resourceId: req.query.resourceId
    };
    
    // Remover valores undefined
    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);
    
    const { favorites, total } = await favoriteService.getFavorites(
      userId, 
      filters, 
      req.pagination
    );
    
    const response = createPaginatedResponse(favorites, total, req);
    res.json(response);
  } catch (error) { 
    next(error); 
  }
};

/**
 * Buscar favoritos
 */
const searchFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const searchTerm = req.query.q || req.query.search;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda (parámetro q o search)'
      });
    }
    
    const { favorites, total } = await favoriteService.searchFavorites(
      userId,
      searchTerm,
      req.pagination
    );
    
    const response = createPaginatedResponse(favorites, total, req);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un favorito por ID
 */
const getFavoriteById = async (req, res, next) => {
  try {
    const favorite = await favoriteService.getFavoriteById(req.user.id, req.params.id);
    res.json({ success: true, data: favorite });
  } catch (error) {
    next(error);
  }
};

/**
 * Agregar favorito
 */
const addFavorite = async (req, res, next) => {
  try {
    const data = await favoriteService.addFavorite(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) { 
    next(error); 
  }
};

/**
 * Actualizar favorito
 */
const updateFavorite = async (req, res, next) => {
  try {
    const data = await favoriteService.updateFavorite(
      req.user.id, 
      req.params.id, 
      req.body
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar favorito
 */
const removeFavorite = async (req, res, next) => {
  try {
    const data = await favoriteService.removeFavorite(req.user.id, req.params.id);
    res.json({ success: true, data });
  } catch (error) { 
    next(error); 
  }
};

/**
 * Obtener estadísticas de favoritos
 */
const getFavoriteStats = async (req, res, next) => {
  try {
    const stats = await favoriteService.getFavoriteStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

/**
 * Exportar favoritos
 */
const exportFavorites = handleExport(
  async (req) => {
    return await favoriteService.exportFavorites(req.user.id);
  },
  [
    { key: '_id', header: 'ID' },
    { key: 'resourceType', header: 'Tipo' },
    { key: 'resourceId', header: 'ID del Recurso' },
    { key: 'notes', header: 'Notas' },
    { key: 'createdAt', header: 'Fecha de Creación' }
  ]
);

module.exports = { 
  getFavorites, 
  searchFavorites,
  getFavoriteById,
  addFavorite,
  updateFavorite,
  removeFavorite,
  getFavoriteStats,
  exportFavorites
};