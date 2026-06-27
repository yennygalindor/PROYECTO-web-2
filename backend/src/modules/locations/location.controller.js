const locationService = require('./location.service');
const { handleExport } = require('../../common/utils/exportData');

const getLocations = async (req, res, next) => {
  try {
    const { page, name, type, dimension, sort } = req.query;
    const data = await locationService.getLocations(page, { name, type, dimension, sort });
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * Buscar locaciones
 */
const searchLocations = async (req, res, next) => {
  try {
    const searchTerm = req.query.q || req.query.search;
    const page = req.query.page || 1;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }
    
    const data = await locationService.searchLocations(searchTerm, page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getLocationById = async (req, res, next) => {
  try {
    const data = await locationService.getLocationById(req.params.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

const getLocationStats = async (req, res, next) => {
  try {
    const data = await locationService.getLocationStats();
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

/**
 * Exportar locaciones
 */
const exportLocations = handleExport(
  async (req) => {
    const { name, type, dimension } = req.query;
    return await locationService.exportLocations({ name, type, dimension });
  },
  [
    { key: 'id', header: 'ID', width: 10 },
    { key: 'name', header: 'Nombre', width: 30 },
    { key: 'type', header: 'Tipo', width: 25 },
    { key: 'dimension', header: 'Dimensión', width: 30 }
  ]
);

module.exports = { 
  getLocations, 
  getLocationById, 
  getLocationStats, 
  searchLocations, 
  exportLocations 
};