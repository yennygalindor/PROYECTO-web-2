const Favorite = require('./favorite.model');
const { publishMessage } = require('../../config/rabbitmq');
const { QueryBuilder } = require('../../common/utils/queryBuilder');

/**
 * Obtener favoritos con filtros avanzados y paginación
 */
const getFavorites = async (userId, filters = {}, pagination = {}) => {
  const query = { userId, ...filters };
  
  const builder = new QueryBuilder(Favorite, query);
  
  // Aplicar filtros, ordenamiento y paginación
  const favorites = await builder
    .filter()
    .sort()
    .paginate(pagination)
    .execute();
  
  // Contar total para paginación
  const total = await builder.countTotal();
  
  return { favorites, total };
};

/**
 * Buscar favoritos por texto
 */
const searchFavorites = async (userId, searchTerm, pagination = {}) => {
  const searchRegex = new RegExp(searchTerm, 'i');
  
  const query = {
    userId,
    $or: [
      { name: searchRegex },
      { type: searchRegex },
      { notes: searchRegex }
    ]
  };
  
  const favorites = await Favorite.find(query)
    .sort('-createdAt')
    .skip(pagination.offset || 0)
    .limit(pagination.limit || 10);
  
  const total = await Favorite.countDocuments(query);
  
  return { favorites, total };
};

/**
 * Obtener un favorito por ID
 */
const getFavoriteById = async (userId, id) => {
  const favorite = await Favorite.findOne({ _id: id, userId });
  if (!favorite) {
    throw { status: 404, message: 'Favorito no encontrado' };
  }
  return favorite;
};

/**
 * Agregar favorito
 */
const addFavorite = async (userId, data) => {
  const existing = await Favorite.findOne({ 
    userId, 
    resourceType: data.resourceType, 
    resourceId: data.resourceId 
  });
  
  if (existing) {
    throw { status: 400, message: 'Ya está en favoritos' };
  }

  const favorite = await Favorite.create({ ...data, userId });

  await publishMessage('notifications', {
    userId,
    message: `Agregaste un ${data.resourceType} a favoritos`,
    resourceType: data.resourceType,
    resourceId: data.resourceId
  });

  return favorite;
};

/**
 * Actualizar favorito (notas, categoría, etc)
 */
const updateFavorite = async (userId, id, updates) => {
  const favorite = await Favorite.findOneAndUpdate(
    { _id: id, userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  
  if (!favorite) {
    throw { status: 404, message: 'Favorito no encontrado' };
  }
  
  return favorite;
};

/**
 * Eliminar favorito
 */
const removeFavorite = async (userId, id) => {
  const favorite = await Favorite.findOneAndDelete({ _id: id, userId });
  if (!favorite) {
    throw { status: 404, message: 'Favorito no encontrado' };
  }
  return { message: 'Eliminado de favoritos' };
};

/**
 * Obtener estadísticas de favoritos
 */
const getFavoriteStats = async (userId) => {
  const stats = await Favorite.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$resourceType',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const total = await Favorite.countDocuments({ userId });
  
  return {
    total,
    byType: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {})
  };
};

/**
 * Exportar todos los favoritos del usuario
 */
const exportFavorites = async (userId) => {
  return await Favorite.find({ userId })
    .select('-__v -userId')
    .sort('-createdAt')
    .lean();
};

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
