const router = require('express').Router();
const authMiddleware = require('../../config/auth0');
const syncUser = require('../../common/middlewares/syncUser');
const { validateSchema } = require('../../common/middlewares/validation');
const { locationFiltersSchema } = require('../../common/validation/schemas');
const { getLocations, getLocationById, getLocationStats, searchLocations, exportLocations } = require('./location.controller');

router.use(authMiddleware);
router.use(syncUser);

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: Obtener lista de locaciones con filtros avanzados
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: dimension
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Ordenar por campo (ej. name, -name para descendente)
 *     responses:
 *       200:
 *         description: Lista de locaciones paginada
 */
router.get('/', validateSchema(locationFiltersSchema, 'query'), getLocations);

/**
 * @swagger
 * /api/locations/search:
 *   get:
 *     summary: Buscar locaciones por texto
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/search', searchLocations);

/**
 * @swagger
 * /api/locations/export:
 *   get:
 *     summary: Exportar locaciones (JSON, CSV, Excel)
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, excel, xlsx]
 *     responses:
 *       200:
 *         description: Datos exportados
 */
router.get('/export', exportLocations);

/**
 * @swagger
 * /api/locations/stats:
 *   get:
 *     summary: Obtener estadísticas de locaciones
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de locaciones
 */
router.get('/stats', getLocationStats);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Obtener locación por ID
 *     tags: [Locations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la locación
 */
router.get('/:id', getLocationById);

module.exports = router;