const fileService = require('./file.service');
const { createPaginatedResponse } = require('../../common/middlewares/pagination');
const path = require('path');

/**
 * Subir archivo
 */
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha proporcionado ningún archivo'
      });
    }

    const file = await fileService.saveFile(
      req.user.id,
      req.file,
      req.body
    );

    res.status(201).json({
      success: true,
      message: 'Archivo subido correctamente',
      data: file
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Subir múltiples archivos
 */
const uploadMultipleFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se han proporcionado archivos'
      });
    }

    const savedFiles = [];
    for (const file of req.files) {
      const saved = await fileService.saveFile(
        req.user.id,
        file,
        req.body
      );
      savedFiles.push(saved);
    }

    res.status(201).json({
      success: true,
      message: `${savedFiles.length} archivo(s) subido(s) correctamente`,
      data: savedFiles
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener archivos con filtros y paginación
 */
const getFiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const filters = {
      category: req.query.category,
      mimetype: req.query.mimetype
    };

    Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

    const { files, total } = await fileService.getFiles(
      userId,
      filters,
      req.pagination
    );

    const response = createPaginatedResponse(files, total, req);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar archivos
 */
const searchFiles = async (req, res, next) => {
  try {
    const searchTerm = req.query.q || req.query.search;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un término de búsqueda'
      });
    }

    const { files, total } = await fileService.searchFiles(
      req.user.id,
      searchTerm,
      req.pagination
    );

    const response = createPaginatedResponse(files, total, req);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Descargar archivo
 */
const downloadFile = async (req, res, next) => {
  try {
    const file = await fileService.getFileById(req.user.id, req.params.id);

    res.download(file.path, file.originalName, (err) => {
      if (err) {
        console.error('Error al descargar archivo:', err);
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar archivo
 */
const deleteFile = async (req, res, next) => {
  try {
    const result = await fileService.deleteFile(req.user.id, req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas de archivos
 */
const getFileStats = async (req, res, next) => {
  try {
    const stats = await fileService.getFileStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  searchFiles,
  downloadFile,
  deleteFile,
  getFileStats
};
