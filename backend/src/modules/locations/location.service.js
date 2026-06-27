const rickMortyClient = require('../../common/utils/httpClient');
const { getCache, setCache } = require('../../config/redis');
const { buildApiFilters, sortArray } = require('../../common/utils/queryBuilder');

const getLocations = async (page = 1, filters = {}) => {
  const { name, type, dimension, sort } = filters;
  
  const allowedFilters = ['name', 'type', 'dimension'];
  const apiParams = buildApiFilters(filters, allowedFilters);
  
  const cacheKey = `locations:${page}:${JSON.stringify(apiParams)}:${sort || ''}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const params = { page, ...apiParams };
  let data = await rickMortyClient.get('/location', { params });

  // Aplicar ordenamiento personalizado
  if (sort && data.results) {
    const [field, order] = sort.startsWith('-') 
      ? [sort.substring(1), 'desc'] 
      : [sort, 'asc'];
    data.results = sortArray(data.results, field, order);
  }

  await setCache(cacheKey, data, 3600);
  return data;
};

/**
 * Buscar locaciones por texto
 */
const searchLocations = async (searchTerm, page = 1) => {
  const cacheKey = `locations:search:${searchTerm}:${page}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const data = await rickMortyClient.get('/location', { 
    params: { name: searchTerm, page } 
  });

  await setCache(cacheKey, data, 1800);
  return data;
};

const getLocationById = async (id) => {
  const cacheKey = `location:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const data = await rickMortyClient.get(`/location/${id}`);
  await setCache(cacheKey, data, 3600);
  return data;
};

const getLocationStats = async () => {
  const cacheKey = 'locations:stats';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const data = await rickMortyClient.get('/location');
  let stats = { total: data.info.count, types: {}, dimensions: {} };

  for (let i = 1; i <= Math.min(data.info.pages, 5); i++) {
    const page = await rickMortyClient.get(`/location?page=${i}`);
    page.results.forEach(l => {
      stats.types[l.type] = (stats.types[l.type] || 0) + 1;
      stats.dimensions[l.dimension] = (stats.dimensions[l.dimension] || 0) + 1;
    });
  }

  await setCache(cacheKey, stats, 7200);
  return stats;
};

/**
 * Exportar locaciones
 */
const exportLocations = async (filters = {}) => {
  const allowedFilters = ['name', 'type', 'dimension'];
  const apiParams = buildApiFilters(filters, allowedFilters);
  
  const data = await rickMortyClient.get('/location', { params: apiParams });
  return data.results || [];
};

module.exports = { 
  getLocations, 
  getLocationById, 
  getLocationStats, 
  searchLocations, 
  exportLocations 
};