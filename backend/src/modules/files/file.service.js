const File = require('./file.model');
const { QueryBuilder } = require('../../common/utils/queryBuilder');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

/**
 * Guardar información del archivo en base de datos
 */
const saveFile = async (userId, fileData, metadata = {}) => {
  const file = await File.create({
    userId,
    filename: fileData.filename,
    originalName: fileData.originalname,
    mimetype: fileData.mimetype,
    size: fileData.size,
    path: fileData.path,
    description: metadata.description || '',
    category: metadata.category || 'general'
  });

  return file;
};

/**
 * Obtener archivos del usuario con filtros y paginación
 */
const getFiles = async (userId, filters = {}, pagination = {}) => {
  const query = { userId, ...filters };
  
  const builder = new QueryBuilder(File, query);
  
  const files = await builder
    .filter()
    .sort()
    .paginate(pagination)
    .execute();
  
  const total = await builder.countTotal();
  
  return { files, total };
};

/**
 * Buscar archivos por texto
 */
const searchFiles = async (userId, searchTerm, pagination = {}) => {
  const searchRegex = new RegExp(searchTerm, 'i');
  
  const query = {
    userId,
    $or: [
      { originalName: searchRegex },
      { description: searchRegex },
      { category: searchRegex }
    ]
  };
  
  const files = await File.find(query)
    .sort('-createdAt')
    .skip(pagination.offset || 0)
    .limit(pagination.limit || 10);
  
  const total = await File.countDocuments(query);
  
  return { files, total };
};

/**
 * Obtener archivo por ID
 */
const getFileById = async (userId, fileId) => {
  const file = await File.findOne({ _id: fileId, userId });
  
  if (!file) {
    throw { status: 404, message: 'Archivo no encontrado' };
  }
  
  // Incrementar contador de descargas
  file.downloadCount += 1;
  await file.save();
  
  return file;
};

/**
 * Eliminar archivo
 */
const deleteFile = async (userId, fileId) => {
  const file = await File.findOne({ _id: fileId, userId });
  
  if (!file) {
    throw { status: 404, message: 'Archivo no encontrado' };
  }
  
  // Eliminar archivo físico
  try {
    await fs.unlink(file.path);
  } catch (error) {
    console.error('Error al eliminar archivo físico:', error);
  }
  
  // Eliminar registro de base de datos
  await File.deleteOne({ _id: fileId });
  
  return { message: 'Archivo eliminado correctamente' };
};

/**
 * Obtener estadísticas de archivos
 */
const getFileStats = async (userId) => {
  const stats = await File.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: '$size' },
        avgSize: { $avg: '$size' },
        totalDownloads: { $sum: '$downloadCount' }
      }
    }
  ]);
  
  const byCategory = await File.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalSize: { $sum: '$size' }
      }
    }
  ]);
  
  const byType = await File.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$mimetype',
        count: { $sum: 1 }
      }
    }
  ]);
  
  return {
    general: stats[0] || {
      totalFiles: 0,
      totalSize: 0,
      avgSize: 0,
      totalDownloads: 0
    },
    byCategory: byCategory.reduce((acc, item) => {
      acc[item._id] = {
        count: item.count,
        totalSize: item.totalSize
      };
      return acc;
    }, {}),
    byType: byType.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

module.exports = {
  saveFile,
  getFiles,
  searchFiles,
  getFileById,
  deleteFile,
  getFileStats
};
