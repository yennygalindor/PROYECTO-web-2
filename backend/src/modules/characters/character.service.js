const rickMortyClient = require('../../common/utils/httpClient');
const { getCache, setCache } = require('../../config/redis');
const { buildApiFilters, sortArray } = require('../../common/utils/queryBuilder');

/**
 * Obtener personajes con filtros avanzados
 */
const getCharacters = async (page = 1, filters = {}) => {
  const { name, status, species, type, gender, sort } = filters;
  
  // Construir parámetros para la API
  const allowedFilters = ['name', 'status', 'species', 'type', 'gender'];
  const apiParams = buildApiFilters(filters, allowedFilters);
  
  const cacheKey = `characters:${page}:${JSON.stringify(apiParams)}:${sort || ''}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const params = { page, ...apiParams };
  let data = await rickMortyClient.get('/character', { params });

  // Aplicar ordenamiento personalizado si se especifica
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
 * Buscar personajes por texto
 */
const searchCharacters = async (searchTerm, page = 1) => {
  const cacheKey = `characters:search:${searchTerm}:${page}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const data = await rickMortyClient.get('/character', { 
    params: { name: searchTerm, page } 
  });

  await setCache(cacheKey, data, 1800);
  return data;
};

const getCharacterById = async (id) => {
  const cacheKey = `character:${id}`;
  const cached = await getCache(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const data = await rickMortyClient.get(`/character/${id}`);
  await setCache(cacheKey, data, 3600);
  return data;
};

const getCharacterStats = async () => {
  const cacheKey = 'characters:stats';
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const data = await rickMortyClient.get('/character');
  const allPages = data.info.pages;
  let stats = { 
    total: data.info.count, 
    alive: 0, 
    dead: 0, 
    unknown: 0, 
    species: {},
    byGender: { male: 0, female: 0, genderless: 0, unknown: 0 }
  };

  for (let i = 1; i <= Math.min(allPages, 5); i++) {
    const page = await rickMortyClient.get(`/character?page=${i}`);
    page.results.forEach(c => {
      // Status
      if (c.status === 'Alive') stats.alive++;
      else if (c.status === 'Dead') stats.dead++;
      else stats.unknown++;
      
      // Species
      stats.species[c.species] = (stats.species[c.species] || 0) + 1;
      
      // Gender
      const gender = c.gender.toLowerCase();
      if (stats.byGender.hasOwnProperty(gender)) {
        stats.byGender[gender]++;
      }
    });
  }

  await setCache(cacheKey, stats, 7200);
  return stats;
};

const getCharactersByIds = async (ids) => {
  const cacheKey = `characters:multiple:${ids}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const data = await rickMortyClient.get(`/character/${ids}`);
  await setCache(cacheKey, data, 3600);
  return data;
};

/**
 * Exportar personajes (obtener todos los de una página sin paginación del lado del servidor)
 */
const exportCharacters = async (filters = {}) => {
  const allowedFilters = ['name', 'status', 'species', 'type', 'gender'];
  const apiParams = buildApiFilters(filters, allowedFilters);
  
  const data = await rickMortyClient.get('/character', { params: apiParams });
  
  return data.results || [];
};

module.exports = { 
  getCharacters, 
  searchCharacters,
  getCharacterById, 
  getCharacterStats, 
  getCharactersByIds,
  exportCharacters
};
