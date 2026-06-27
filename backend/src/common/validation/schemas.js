const Joi = require('joi');

/**
 * Esquema de validación para paginación
 */
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

/**
 * Esquema de validación para filtros de personajes
 */
const characterFiltersSchema = Joi.object({
  name: Joi.string().trim().max(100),
  status: Joi.string().valid('alive', 'dead', 'unknown').insensitive(),
  species: Joi.string().trim().max(100),
  type: Joi.string().trim().max(100),
  gender: Joi.string().valid('female', 'male', 'genderless', 'unknown').insensitive(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().trim(),
  search: Joi.string().trim().max(200)
});

/**
 * Esquema de validación para filtros de ubicaciones
 */
const locationFiltersSchema = Joi.object({
  name: Joi.string().trim().max(100),
  type: Joi.string().trim().max(100),
  dimension: Joi.string().trim().max(100),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().trim(),
  search: Joi.string().trim().max(200)
});

/**
 * Esquema de validación para filtros de episodios
 */
const episodeFiltersSchema = Joi.object({
  name: Joi.string().trim().max(100),
  episode: Joi.string().trim().regex(/^S\d{2}E\d{2}$/i),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().trim(),
  search: Joi.string().trim().max(200)
});

/**
 * Esquema de validación para IDs de MongoDB
 */
const mongoIdSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'ID inválido'
  })
});

/**
 * Esquema de validación para favoritos
 */
const favoriteSchema = Joi.object({
  resourceType: Joi.string().valid('character', 'location', 'episode').required(),
  resourceId: Joi.number().integer().positive().required(),
  notes: Joi.string().trim().max(500).allow('', null)
});

/**
 * Esquema de validación para actualizar favorito
 */
const updateFavoriteSchema = Joi.object({
  notes: Joi.string().trim().max(500).allow('', null)
});

/**
 * Esquema de validación para subida de archivos
 */
const fileUploadSchema = Joi.object({
  description: Joi.string().trim().max(500).allow('', null),
  category: Joi.string().trim().max(100)
});

/**
 * Esquema de validación para exportación
 */
const exportSchema = Joi.object({
  format: Joi.string().valid('json', 'csv', 'excel', 'xlsx').insensitive().default('json'),
  fields: Joi.string().trim()
});

module.exports = {
  paginationSchema,
  characterFiltersSchema,
  locationFiltersSchema,
  episodeFiltersSchema,
  mongoIdSchema,
  favoriteSchema,
  updateFavoriteSchema,
  fileUploadSchema,
  exportSchema
};
