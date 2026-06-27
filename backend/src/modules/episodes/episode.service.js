const rickMortyClient = require('../../common/utils/httpClient');
const { getCache, setCache } = require('../../config/redis');
const { buildApiFilters, sortArray } = require('../../common/utils/queryBuilder');

const getEpisodes = async (page = 1, filters = {}) => {
  const { name, episode, sort } = filters;
  
  const allowedFilters = ['name', 'episode'];
  const apiParams = buildApiFilters(filters, allowedFilters);
  
  const cacheKey = `episodes:${page}:${JSON.stringify(apiParams)}:${sort || ''}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const params = { page, ...apiParams };
  let data = await rickMortyClient.get('/episode', { params });

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
 * Buscar episodios por texto
 */
const searchEpisodes = async (searchTerm, page = 1) => {
  const cacheKey = `episodes:search:${searchTerm}:${page}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const data = await rickMortyClient.get('/episode', { 
    params: { name: searchTerm, page } 
  });

  await setCache(cacheKey, data, 1800);
  return data;
};

const getEpisodeById = async (id) => {
  const cacheKey = `episode:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const data = await rickMortyClient.get(`/episode/${id}`);
  await setCache(cacheKey, data, 3600);
  return data;
};

const getEpisodeStats = async () => {
  const cacheKey = 'episodes:stats';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const data = await rickMortyClient.get('/episode');
  let stats = { total: data.info.count, perSeason: {} };

  for (let i = 1; i <= data.info.pages; i++) {
    const page = await rickMortyClient.get(`/episode?page=${i}`);
    page.results.forEach(e => {
      const season = e.episode.substring(0, 3); // S01, S02...
      stats.perSeason[season] = (stats.perSeason[season] || 0) + 1;
    });
  }

  await setCache(cacheKey, stats, 7200);
  return stats;
};

/**
 * Exportar episodios
 */
const exportEpisodes = async (filters = {}) => {
  const allowedFilters = ['name', 'episode'];
  const apiParams = buildApiFilters(filters, allowedFilters);
  
  const data = await rickMortyClient.get('/episode', { params: apiParams });
  return data.results || [];
};

module.exports = { 
  getEpisodes, 
  getEpisodeById, 
  getEpisodeStats, 
  searchEpisodes, 
  exportEpisodes 
};