const episodeService = require('./episode.service');
const { handleExport } = require('../../common/utils/exportData');

const getEpisodes = async (req, res, next) => {
  try {
    const { page, name, episode, sort } = req.query;
    const data = await episodeService.getEpisodes(page, { name, episode, sort });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * Buscar episodios
 */
const searchEpisodes = async (req, res, next) => {
  try {
    const searchTerm = req.query.q || req.query.search;
    const page = req.query.page || 1;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const data = await episodeService.searchEpisodes(searchTerm, page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getEpisodeById = async (req, res, next) => {
  try {
    const data = await episodeService.getEpisodeById(req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

const getEpisodeStats = async (req, res, next) => {
  try {
    const data = await episodeService.getEpisodeStats();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * Exportar episodios
 */
const exportEpisodes = handleExport(
  async (req) => {
    const { name, episode } = req.query;
    return await episodeService.exportEpisodes({ name, episode });
  },
  [
    { key: 'id', header: 'ID', width: 10 },
    { key: 'name', header: 'Nombre', width: 35 },
    { key: 'episode', header: 'Código', width: 15 },
    { key: 'air_date', header: 'Fecha de Emisión', width: 20 }
  ]
);

module.exports = { 
  getEpisodes, 
  getEpisodeById, 
  getEpisodeStats, 
  searchEpisodes, 
  exportEpisodes 
};