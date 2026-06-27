const router = require('express').Router();
const authMiddleware = require('../../config/auth0');
const syncUser = require('../../common/middlewares/syncUser');
const { paginate } = require('../../common/middlewares/pagination');
const { validateSchema } = require('../../common/middlewares/validation');
const { 
  favoriteSchema, 
  updateFavoriteSchema,
  mongoIdSchema 
} = require('../../common/validation/schemas');
const { 
  getFavorites, 
  searchFavorites,
  getFavoriteById,
  addFavorite,
  updateFavorite,
  removeFavorite,
  getFavoriteStats,
  exportFavorites
} = require('./favorite.controller');

router.use(authMiddleware);
router.use(syncUser);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Obtener favoritos del usuario con filtros y paginación
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: resourceType
 *         schema:
 *           type: string
 *           enum: [character, location, episode]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Campo de ordenamiento (ej. -createdAt, name)
 *     responses:
 *       200:
 *         description: Lista paginada de favoritos
 */
router.get('/', paginate, getFavorites);

/**
 * @swagger
 * /api/favorites/search:
 *   get:
 *     summary: Buscar favoritos por texto
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/search', paginate, searchFavorites);

/**
 * @swagger
 * /api/favorites/stats:
 *   get:
 *     summary: Obtener estadísticas de favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de favoritos
 */
router.get('/stats', getFavoriteStats);

/**
 * @swagger
 * /api/favorites/export:
 *   get:
 *     summary: Exportar favoritos (JSON, CSV, Excel)
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, excel, xlsx]
 *           default: json
 *     responses:
 *       200:
 *         description: Datos exportados
 */
router.get('/export', exportFavorites);

/**
 * @swagger
 * /api/favorites/{id}:
 *   get:
 *     summary: Obtener un favorito por ID
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del favorito
 *       404:
 *         description: Favorito no encontrado
 */
router.get('/:id', validateSchema(mongoIdSchema, 'params'), getFavoriteById);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Agregar a favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceType, resourceId]
 *             properties:
 *               resourceType:
 *                 type: string
 *                 enum: [character, location, episode]
 *               resourceId:
 *                 type: integer
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Agregado a favoritos
 *       400:
 *         description: Ya está en favoritos o datos inválidos
 */
router.post('/', validateSchema(favoriteSchema), addFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   patch:
 *     summary: Actualizar favorito
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorito actualizado
 *       404:
 *         description: Favorito no encontrado
 */
router.patch(
  '/:id', 
  validateSchema(mongoIdSchema, 'params'),
  validateSchema(updateFavoriteSchema),
  updateFavorite
);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Eliminar de favoritos
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Eliminado de favoritos
 *       404:
 *         description: Favorito no encontrado
 */
router.delete('/:id', validateSchema(mongoIdSchema, 'params'), removeFavorite);

module.exports = router;