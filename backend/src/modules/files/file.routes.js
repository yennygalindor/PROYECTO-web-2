const router = require('express').Router();
const authMiddleware = require('../../config/auth0');
const syncUser = require('../../common/middlewares/syncUser');
const { upload, handleUploadError } = require('../../common/middlewares/fileUpload');
const { paginate } = require('../../common/middlewares/pagination');
const { validateSchema } = require('../../common/middlewares/validation');
const { mongoIdSchema } = require('../../common/validation/schemas');
const {
  uploadFile,
  uploadMultipleFiles,
  getFiles,
  searchFiles,
  downloadFile,
  deleteFile,
  getFileStats
} = require('./file.controller');

router.use(authMiddleware);
router.use(syncUser);

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Subir un archivo
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Archivo subido correctamente
 *       400:
 *         description: Error en la subida
 */
router.post('/upload', upload.single('file'), handleUploadError, uploadFile);

/**
 * @swagger
 * /api/files/upload-multiple:
 *   post:
 *     summary: Subir múltiples archivos
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Archivos subidos correctamente
 */
router.post('/upload-multiple', upload.array('files', 10), handleUploadError, uploadMultipleFiles);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Obtener archivos con filtros y paginación
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: mimetype
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de archivos
 */
router.get('/', paginate, getFiles);

/**
 * @swagger
 * /api/files/search:
 *   get:
 *     summary: Buscar archivos
 *     tags: [Files]
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
router.get('/search', paginate, searchFiles);

/**
 * @swagger
 * /api/files/stats:
 *   get:
 *     summary: Obtener estadísticas de archivos
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas
 */
router.get('/stats', getFileStats);

/**
 * @swagger
 * /api/files/{id}/download:
 *   get:
 *     summary: Descargar archivo
 *     tags: [Files]
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
 *         description: Archivo descargado
 *       404:
 *         description: Archivo no encontrado
 */
router.get('/:id/download', validateSchema(mongoIdSchema, 'params'), downloadFile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Eliminar archivo
 *     tags: [Files]
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
 *         description: Archivo eliminado
 *       404:
 *         description: Archivo no encontrado
 */
router.delete('/:id', validateSchema(mongoIdSchema, 'params'), deleteFile);

module.exports = router;
