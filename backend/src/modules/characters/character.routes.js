const router = require('express').Router();
const authMiddleware = require('../../config/auth0');
const syncUser = require('../../common/middlewares/syncUser');
const { validateSchema } = require('../../common/middlewares/validation');
const { characterFiltersSchema } = require('../../common/validation/schemas');
const { 
  getCharacters, 
  searchCharacters,
  getCharacterById, 
  getCharacterStats, 
  getCharactersByIds,
  exportCharacters
} = require('./character.controller');

router.use(authMiddleware);
router.use(syncUser);

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Obtener lista de personajes con filtros avanzados
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrar por nombre
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [alive, dead, unknown]
 *         description: Filtrar por estado
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filtrar por especie
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrar por tipo
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [female, male, genderless, unknown]
 *         description: Filtrar por género
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Ordenar por campo (ej. name, -name para descendente)
 *     responses:
 *       200:
 *         description: Lista de personajes paginada
 *       401:
 *         description: No autenticado
 */
router.get('/', validateSchema(characterFiltersSchema, 'query'), getCharacters);

/**
 * @swagger
 * /api/characters/search:
 *   get:
 *     summary: Buscar personajes por texto
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Resultados de búsqueda
 */
router.get('/search', searchCharacters);

/**
 * @swagger
 * /api/characters/stats:
 *   get:
 *     summary: Obtener estadísticas de personajes
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas generales de personajes
 */
router.get('/stats', getCharacterStats);

/**
 * @swagger
 * /api/characters/export:
 *   get:
 *     summary: Exportar personajes (JSON, CSV, Excel)
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, csv, excel, xlsx]
 *           default: json
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos exportados
 */
router.get('/export', exportCharacters);

/**
 * @swagger
 * /api/characters/multiple/{ids}:
 *   get:
 *     summary: Obtener múltiples personajes por IDs
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ids
 *         required: true
 *         schema:
 *           type: string
 *         description: IDs separados por coma (ej. 1,2,3)
 *     responses:
 *       200:
 *         description: Lista de personajes
 */
router.get('/multiple/:ids', getCharactersByIds);

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Obtener personaje por ID
 *     tags: [Characters]
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
 *         description: Detalle del personaje
 *       404:
 *         description: Personaje no encontrado
 */
router.get('/:id', getCharacterById);

module.exports = router;