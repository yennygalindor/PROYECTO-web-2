const characterService = require('./character.service');
const { handleExport } = require('../../common/utils/exportData');

const getCharacters = async (req, res, next) => {
  try {
    const { page, name, status, species, type, gender, sort } = req.query;
    const data = await characterService.getCharacters(page, { 
      name, 
      status, 
      species, 
      type, 
      gender, 
      sort 
    });
    res.json({ success: true, data });
  } catch (error) { 
    next(error); 
  }
};

const searchCharacters = async (req, res, next) => {
  try {
    const searchTerm = req.query.q || req.query.search;
    const page = req.query.page || 1;
    
    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda (parámetro q o search)'
      });
    }
    
    const data = await characterService.searchCharacters(searchTerm, page);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getCharacterById = async (req, res, next) => {
  try {
    const data = await characterService.getCharacterById(req.params.id);
    res.json({ success: true, data });
  } catch (error) { 
    next(error); 
  }
};

const getCharacterStats = async (req, res, next) => {
  try {
    const data = await characterService.getCharacterStats();
    res.json({ success: true, data });
  } catch (error) { 
    next(error); 
  }
};

const getCharactersByIds = async (req, res, next) => {
  try {
    const data = await characterService.getCharactersByIds(req.params.ids);
    res.json({ success: true, data });
  } catch (error) { 
    next(error); 
  }
};

/**
 * Exportar personajes
 */
const exportCharacters = handleExport(
  async (req) => {
    const { name, status, species, type, gender } = req.query;
    return await characterService.exportCharacters({ 
      name, 
      status, 
      species, 
      type, 
      gender 
    });
  },
  [
    { key: 'id', header: 'ID', width: 10 },
    { key: 'name', header: 'Nombre', width: 25 },
    { key: 'status', header: 'Estado', width: 15 },
    { key: 'species', header: 'Especie', width: 20 },
    { key: 'type', header: 'Tipo', width: 20 },
    { key: 'gender', header: 'Género', width: 15 },
    { key: 'origin.name', header: 'Origen', width: 25 },
    { key: 'location.name', header: 'Ubicación', width: 25 }
  ]
);

module.exports = { 
  getCharacters, 
  searchCharacters,
  getCharacterById, 
  getCharacterStats, 
  getCharactersByIds,
  exportCharacters
};