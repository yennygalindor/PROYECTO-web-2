const router = require('express').Router();
const authMiddleware = require('../../config/auth0');
const syncUser = require('../../common/middlewares/syncUser');
const { validateSchema } = require('../../common/middlewares/validation');
const { episodeFiltersSchema } = require('../../common/validation/schemas');
const { getEpisodes, getEpisodeById, getEpisodeStats, searchEpisodes, exportEpisodes } = require('./episode.controller');

router.use(authMiddleware);
router.use(syncUser);

/**
 * @swagger
 * /api/episodes:
 *   get:
 *     summary: Obtener lista de episodios con filtros avanzados
 *     tags: [Episodes]
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
 *         name: episode
 *         schema:
 *           type: string
 *         description: Código del episodio (ej. S01E01)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Ordenar por campo (ej. name, -episode)
 *     responses:
 *       200:
 *         description: Lista de episodios paginada
 */
router.get('/', validateSchema(episodeFiltersSchema, 'query'), getEpisodes);

/**
 * @swagger
 * /api/episodes/search:
 *   get:
 *     summary: Buscar episodios por texto
 *     tags: [Episodes]
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
router.get('/search', searchEpisodes);

/**
 * @swagger
 * /api/episodes/export:
 *   get:
 *     summary: Exportar episodios (JSON, CSV, Excel)
 *     tags: [Episodes]
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
router.get('/export', exportEpisodes);

/**
 * @swagger
 * /api/episodes/stats:
 *   get:
 *     summary: Obtener estadísticas de episodios
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de episodios
 */
router.get('/stats', getEpisodeStats);

/**
 * @swagger
 * /api/episodes/{id}:
 *   get:
 *     summary: Obtener episodio por ID
 *     tags: [Episodes]
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
 *         description: Detalle del episodio
 */
router.get('/:id', getEpisodeById);

module.exports = router;