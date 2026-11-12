const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Configuración de OpenAPI 3.0 para la documentación interactiva (Swagger UI).
 * Las anotaciones @openapi viven junto a cada ruta en src/routes/index.js.
 */
const opciones = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Puesto de Chance API',
      version: '1.0.0',
      description:
        'API REST para la venta de chance y Baloto, anulación de tiquetes, pago de premios, ' +
        'administración de sorteos y cierre de caja de un puesto de apuestas.',
      contact: {
        name: 'Proyecto formativo SENA - ADSO',
      },
      license: { name: 'Uso académico' },
    },
    servers: [
      { url: 'http://localhost:3000/api/v1', description: 'Servidor local de desarrollo' },
    ],
    tags: [
      { name: 'Salud', description: 'Verificación del estado del servicio' },
      { name: 'Autenticación', description: 'Inicio de sesión y perfil del usuario' },
      { name: 'Sorteos', description: 'Consulta y administración de sorteos' },
      { name: 'Tiquetes', description: 'Venta, consulta, anulación y pago de tiquetes' },
      { name: 'Caja', description: 'Resumen y cierre diario de caja' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en POST /auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Credenciales inválidas' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['usuario', 'password'],
          properties: {
            usuario: { type: 'string', example: 'vendedor1' },
            password: { type: 'string', example: 'vende123' },
          },
        },
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 2 },
            usuario: { type: 'string', example: 'vendedor1' },
            nombre: { type: 'string', example: 'Ana Pérez' },
            rol: { type: 'string', enum: ['ADMIN', 'VENDEDOR'] },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            usuario: { $ref: '#/components/schemas/Usuario' },
          },
        },
        Sorteo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            tipo: { type: 'string', enum: ['CHANCE', 'BALOTO'] },
            nombre: { type: 'string', example: 'Lotería de Bogotá' },
            fecha: { type: 'string', format: 'date-time' },
            estado: { type: 'string', enum: ['ABIERTO', 'JUGADO'] },
            resultado: { nullable: true, example: '1234' },
            acumulado: { type: 'number', example: 4500000000 },
          },
        },
        ApuestaChance: {
          type: 'object',
          required: ['numero', 'valor'],
          properties: {
            numero: { type: 'string', example: '1234', description: 'Entre 1 y 4 cifras' },
            modalidad: { type: 'string', enum: ['DIRECTO', 'COMBINADO'], default: 'DIRECTO' },
            valor: { type: 'integer', example: 5000, description: 'Múltiplo de 100' },
          },
        },
        JugadaBaloto: {
          type: 'object',
          properties: {
            numeros: {
              type: 'array',
              maxItems: 5,
              items: { type: 'integer', minimum: 1, maximum: 43 },
              example: [1, 2, 3, 4, 5],
            },
            superbalota: { type: 'integer', minimum: 1, maximum: 16, example: 6 },
            aleatoria: {
              type: 'boolean',
              description: 'Si es true se ignoran numeros y superbalota y se genera una jugada al azar',
              example: true,
            },
          },
        },
        Ticket: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            codigo: { type: 'string', example: 'CH-9F2A1B3C' },
            tipo: { type: 'string', enum: ['CHANCE', 'BALOTO'] },
            sorteoId: { type: 'integer', example: 1 },
            vendedorId: { type: 'integer', example: 2 },
            cliente: { nullable: true, example: 'Juan Pérez' },
            total: { type: 'integer', example: 5000 },
            estado: { type: 'string', enum: ['ACTIVO', 'ANULADO', 'PAGADO', 'CADUCADO'] },
            premio: { nullable: true, example: 4500000 },
            creadoEn: { type: 'string', format: 'date-time' },
          },
        },
        CajaResumen: {
          type: 'object',
          properties: {
            vendedorId: { type: 'integer', example: 2 },
            fecha: { type: 'string', example: '2026-11-12' },
            tiquetesVendidos: { type: 'integer', example: 2 },
            tiquetesAnulados: { type: 'integer', example: 0 },
            ventasChance: { type: 'integer', example: 5000 },
            ventasBaloto: { type: 'integer', example: 5700 },
            totalVendido: { type: 'integer', example: 10700 },
            premiosPagados: { type: 'integer', example: 0 },
            totalPagado: { type: 'integer', example: 0 },
            saldoEsperado: { type: 'integer', example: 10700 },
            cerrada: { type: 'boolean', example: false },
          },
        },
      },
      responses: {
        NoAutorizado: {
          description: 'Token ausente, inválido o expirado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        Prohibido: {
          description: 'El rol del usuario no permite la operación',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        NoEncontrado: {
          description: 'Recurso no encontrado',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
        Conflicto: {
          description: 'La operación no es válida en el estado actual del recurso',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
  },
  // glob 11 no resuelve patrones absolutos en Windows; se usa una ruta
  // relativa al directorio de trabajo (se espera ejecutar desde la raíz).
  apis: [
    path
      .relative(process.cwd(), path.join(__dirname, '..', 'routes', '*.js'))
      .split(path.sep)
      .join('/'),
  ],
};

module.exports = swaggerJsdoc(opciones);
