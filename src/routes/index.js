const { Router } = require('express');
const { autenticar, permitir } = require('../middlewares/auth');
const auth = require('../controllers/authController');
const sorteos = require('../controllers/sorteoController');
const tickets = require('../controllers/ticketController');
const caja = require('../controllers/cajaController');

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Inicia sesión y entrega un token JWT
 *     description: Valida las credenciales del usuario y retorna un token con vigencia de 8 horas por defecto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Faltan usuario o contraseña
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Usuario inactivo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/auth/login', auth.login);

/**
 * @openapi
 * /auth/perfil:
 *   get:
 *     tags: [Autenticación]
 *     summary: Consulta el perfil del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos públicos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 */
router.get('/auth/perfil', autenticar, auth.perfil);

/**
 * @openapi
 * /sorteos:
 *   get:
 *     tags: [Sorteos]
 *     summary: Lista los sorteos disponibles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [CHANCE, BALOTO]
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ABIERTO, JUGADO]
 *     responses:
 *       200:
 *         description: Listado de sorteos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sorteo'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *   post:
 *     tags: [Sorteos]
 *     summary: Crea un sorteo (solo ADMIN)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tipo, nombre, fecha]
 *             properties:
 *               tipo:
 *                 type: string
 *                 enum: [CHANCE, BALOTO]
 *               nombre:
 *                 type: string
 *                 example: Lotería del Valle
 *               fecha:
 *                 type: string
 *                 format: date-time
 *                 description: Debe ser una fecha futura
 *               acumulado:
 *                 type: number
 *                 description: Solo aplica para sorteos de tipo BALOTO
 *                 example: 4500000000
 *     responses:
 *       201:
 *         description: Sorteo creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sorteo'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         $ref: '#/components/responses/Prohibido'
 */
router.get('/sorteos', autenticar, sorteos.listar);
router.get('/sorteos/:id', autenticar, sorteos.obtener);
router.post('/sorteos', autenticar, permitir('ADMIN'), sorteos.crear);

/**
 * @openapi
 * /sorteos/{id}:
 *   get:
 *     tags: [Sorteos]
 *     summary: Obtiene un sorteo por su identificador
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Sorteo encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sorteo'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 */

/**
 * @openapi
 * /sorteos/{id}/resultado:
 *   post:
 *     tags: [Sorteos]
 *     summary: Registra el resultado y liquida los tiquetes (solo ADMIN)
 *     description: >
 *       Para sorteos CHANCE el resultado es una cadena de 4 dígitos.
 *       Para BALOTO se envía un objeto con numeros y superbalota.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resultado]
 *             properties:
 *               resultado:
 *                 oneOf:
 *                   - type: string
 *                     example: '1234'
 *                   - $ref: '#/components/schemas/JugadaBaloto'
 *     responses:
 *       200:
 *         description: Resultado registrado y tiquetes liquidados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sorteo'
 *       400:
 *         description: Resultado con formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         $ref: '#/components/responses/Prohibido'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         $ref: '#/components/responses/Conflicto'
 */
router.post('/sorteos/:id/resultado', autenticar, permitir('ADMIN'), sorteos.registrarResultado);

/**
 * @openapi
 * /tickets/chance:
 *   post:
 *     tags: [Tiquetes]
 *     summary: Vende un tiquete de chance (solo VENDEDOR)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sorteoId, apuestas]
 *             properties:
 *               sorteoId:
 *                 type: integer
 *                 example: 1
 *               cliente:
 *                 type: string
 *                 nullable: true
 *                 example: Juan Pérez
 *               apuestas:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 5
 *                 items:
 *                   $ref: '#/components/schemas/ApuestaChance'
 *     responses:
 *       201:
 *         description: Tiquete de chance generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Apuestas inválidas o fuera de rango
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         $ref: '#/components/responses/Prohibido'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         description: Sorteo cerrado o no disponible
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/tickets/chance', autenticar, permitir('VENDEDOR'), tickets.venderChance);

/**
 * @openapi
 * /tickets/baloto:
 *   post:
 *     tags: [Tiquetes]
 *     summary: Vende un tiquete de Baloto (solo VENDEDOR)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sorteoId, jugadas]
 *             properties:
 *               sorteoId:
 *                 type: integer
 *                 example: 3
 *               cliente:
 *                 type: string
 *                 nullable: true
 *               jugadas:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 10
 *                 items:
 *                   $ref: '#/components/schemas/JugadaBaloto'
 *     responses:
 *       201:
 *         description: Tiquete de Baloto generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Jugadas inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         $ref: '#/components/responses/Prohibido'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         $ref: '#/components/responses/Conflicto'
 */
router.post('/tickets/baloto', autenticar, permitir('VENDEDOR'), tickets.venderBaloto);

/**
 * @openapi
 * /tickets:
 *   get:
 *     tags: [Tiquetes]
 *     summary: Lista los tiquetes del usuario autenticado
 *     description: Un ADMIN puede consultar los tiquetes de todos los vendedores.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           example: '2026-11-12'
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *           enum: [ACTIVO, ANULADO, PAGADO, CADUCADO]
 *     responses:
 *       200:
 *         description: Listado de tiquetes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 */
router.get('/tickets', autenticar, tickets.listar);

/**
 * @openapi
 * /tickets/{codigo}:
 *   get:
 *     tags: [Tiquetes]
 *     summary: Consulta un tiquete por su código
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: CH-9F2A1B3C
 *     responses:
 *       200:
 *         description: Tiquete con los datos del sorteo y la marca de ganador
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Ticket'
 *                 - type: object
 *                   properties:
 *                     sorteo:
 *                       $ref: '#/components/schemas/Sorteo'
 *                     ganador:
 *                       type: boolean
 *                       nullable: true
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 */
router.get('/tickets/:codigo', autenticar, tickets.consultar);

/**
 * @openapi
 * /tickets/{codigo}/anular:
 *   post:
 *     tags: [Tiquetes]
 *     summary: Anula un tiquete activo
 *     description: >
 *       El vendedor solo puede anular tiquetes propios dentro de los minutos
 *       configurados en MINUTOS_ANULACION. Un ADMIN no tiene esa restricción.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: CH-9F2A1B3C
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [motivo]
 *             properties:
 *               motivo:
 *                 type: string
 *                 example: El cliente cambió el número
 *     responses:
 *       200:
 *         description: Tiquete anulado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Falta el motivo de anulación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         description: El tiquete pertenece a otro vendedor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         $ref: '#/components/responses/Conflicto'
 */
router.post('/tickets/:codigo/anular', autenticar, tickets.anular);

/**
 * @openapi
 * /tickets/{codigo}/pagar:
 *   post:
 *     tags: [Tiquetes]
 *     summary: Paga el premio de un tiquete ganador (solo VENDEDOR)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         example: CH-9F2A1B3C
 *     responses:
 *       200:
 *         description: Pago registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 ticketId:
 *                   type: integer
 *                   example: 1
 *                 codigo:
 *                   type: string
 *                   example: CH-9F2A1B3C
 *                 usuarioId:
 *                   type: integer
 *                   example: 2
 *                 valor:
 *                   type: integer
 *                   example: 4500000
 *                 fecha:
 *                   type: string
 *                   format: date-time
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         $ref: '#/components/responses/Prohibido'
 *       404:
 *         $ref: '#/components/responses/NoEncontrado'
 *       409:
 *         description: Sorteo sin jugar, tiquete ya pagado o sin premio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       410:
 *         description: Premio caducado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/tickets/:codigo/pagar', autenticar, permitir('VENDEDOR'), tickets.pagar);

/**
 * @openapi
 * /caja/resumen:
 *   get:
 *     tags: [Caja]
 *     summary: Consulta el resumen de caja del día
 *     description: Un ADMIN puede consultar la caja de otro vendedor con el parámetro vendedorId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           example: '2026-11-12'
 *       - in: query
 *         name: vendedorId
 *         schema:
 *           type: integer
 *         description: Solo aplicable cuando el usuario autenticado es ADMIN
 *     responses:
 *       200:
 *         description: Resumen de ventas, pagos y saldo esperado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CajaResumen'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 */
router.get('/caja/resumen', autenticar, caja.resumen);

/**
 * @openapi
 * /caja/cierre:
 *   post:
 *     tags: [Caja]
 *     summary: Registra el cierre diario de caja (solo VENDEDOR)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [efectivoReportado]
 *             properties:
 *               efectivoReportado:
 *                 type: integer
 *                 example: 10700
 *               fecha:
 *                 type: string
 *                 example: '2026-11-12'
 *     responses:
 *       201:
 *         description: Cierre registrado con estado CUADRADA, SOBRANTE o FALTANTE
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/CajaResumen'
 *                 - type: object
 *                   properties:
 *                     efectivoReportado:
 *                       type: integer
 *                     diferencia:
 *                       type: integer
 *                     estado:
 *                       type: string
 *                       enum: [CUADRADA, SOBRANTE, FALTANTE]
 *       400:
 *         description: Efectivo reportado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/NoAutorizado'
 *       403:
 *         $ref: '#/components/responses/Prohibido'
 *       409:
 *         description: La caja del día ya fue cerrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/caja/cierre', autenticar, permitir('VENDEDOR'), caja.cerrar);

module.exports = router;
