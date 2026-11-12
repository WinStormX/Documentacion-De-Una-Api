# 📋 Matriz de Trazabilidad de Requisitos (RTM)

**Proyecto:** Puesto de Chance API
**Programa:** Análisis y Desarrollo de Software (ADSO) — SENA
**Autor:** Aprendiz en formación — trimestre 4
**Versión:** 1.0
**Fecha:** Noviembre de 2026

---

## 1. Objetivo

Este documento relaciona cada **Historia de Usuario (HU)** con el código que la implementa y con la prueba automatizada (o verificación manual) que demuestra su funcionamiento. De esta forma se puede comprobar que los requisitos definidos tienen un desarrollo real y una evidencia de calidad asociada.

> 📌 **Nota:** las filas de ejemplo de la guía (`StudentController.js`, `EvidenceService.java`, `ReportModule.py`, `test_register_pass`, etc.) corresponden a otro dominio. Para este proyecto se adaptaron al contexto real de un puesto de chance, conservando la misma estructura de trazabilidad.

---

## 2. Convenciones

| Campo | Significado |
|---|---|
| **ID HU** | Identificador único de la historia de usuario |
| **Descripción / Requisito** | Necesidad funcional del usuario |
| **Módulo / Controlador** | Archivo donde está implementado |
| **Caso de Prueba** | Prueba automatizada o verificación asociada |
| **Estado QA** | `Aprobado`, `Parcial` o `Pendiente` |

Estados:

- ✅ **Aprobado:** el requisito está implementado y tiene prueba automatizada que pasa.
- 🟡 **Parcial:** está implementado, pero la prueba cubre solo una parte del flujo.
- ⏳ **Pendiente:** existe la funcionalidad, pero aún no tiene prueba automatizada.

---

## 3. Matriz de Trazabilidad

| ID HU | Descripción / Requisito | Módulo / Controlador | Endpoint | Caso de Prueba | Estado QA |
|---|---|---|---|---|---|
| **HU-001** | Como usuario quiero iniciar sesión con usuario y contraseña para acceder al sistema y obtener un token JWT. | `src/services/authService.js` → `login()`<br>`src/controllers/authController.js` → `login`<br>`src/routes/index.js` → `POST /auth/login` | `POST /api/v1/auth/login` | `tests/auth.test.js` → `test_login_exitoso`<br>`test_login_credenciales_invalidas` | ✅ Aprobado |
| **HU-002** | Como sistema debo proteger las rutas y limitar cada operación según el rol (`ADMIN` / `VENDEDOR`). | `src/middlewares/auth.js` → `autenticar()` y `permitir()`<br>`src/routes/index.js` | Todas las rutas protegidas | `tests/auth.test.js` → `test_ruta_protegida_sin_token`<br>`tests/tickets.test.js` → `test_admin_no_vende` | ✅ Aprobado |
| **HU-003** | Como vendedor quiero registrar una venta de chance con una o varias apuestas para entregar un tiquete al cliente. | `src/services/ticketService.js` → `venderChance()`<br>`src/controllers/ticketController.js` → `venderChance` | `POST /api/v1/tickets/chance` | `tests/tickets.test.js` → `test_venta_chance` | ✅ Aprobado |
| **HU-004** | Como sistema debo validar número, modalidad y valor de cada apuesta de chance antes de venderla. | `src/services/chanceService.js` → `validarApuesta()` y `calcularPremio()` | `POST /api/v1/tickets/chance` | `tests/chance.test.js` → `test_validacion_apuesta_invalida`<br>`test_premio_directo_4_cifras`<br>`test_premio_directo_ultimas_cifras`<br>`test_premio_combinado_divide_por_permutaciones` | ✅ Aprobado |
| **HU-005** | Como vendedor quiero registrar una venta de Baloto con jugadas manuales o aleatorias para ofrecer ese producto. | `src/services/ticketService.js` → `venderBaloto()`<br>`src/controllers/ticketController.js` → `venderBaloto` | `POST /api/v1/tickets/baloto` | `tests/tickets.test.js` → `test_venta_baloto` | ✅ Aprobado |
| **HU-006** | Como sistema debo validar las jugadas de Baloto (5 números distintos del 1 al 43 y superbalota del 1 al 16). | `src/services/balotoService.js` → `validarJugada()` y `generarAleatoria()` | `POST /api/v1/tickets/baloto` | `tests/baloto.test.js` → `test_jugada_aleatoria_valida`<br>`test_jugada_numeros_repetidos` | ✅ Aprobado |
| **HU-007** | Como vendedor quiero anular un tiquete activo dentro del tiempo permitido y dejando el motivo, para corregir errores de venta. | `src/services/ticketService.js` → `anular()`<br>`src/controllers/ticketController.js` → `anular` | `POST /api/v1/tickets/:codigo/anular` | `tests/tickets.test.js` → `test_anulacion_ticket`<br>`test_anulacion_fuera_de_tiempo` | ✅ Aprobado |
| **HU-008** | Como administrador quiero registrar el resultado oficial de un sorteo para liquidar automáticamente los tiquetes. | `src/services/sorteoService.js` → `registrarResultado()` y `liquidarTicket()`<br>`src/controllers/sorteoController.js` → `registrarResultado` | `POST /api/v1/sorteos/:id/resultado` | `tests/tickets.test.js` → `test_resultado_y_pago_premio`<br>`tests/baloto.test.js` → `test_premio_por_aciertos` | ✅ Aprobado |
| **HU-009** | Como vendedor quiero pagar el premio de un tiquete ganador para entregar el dinero al cliente, evitando pagos dobles o vencidos. | `src/services/ticketService.js` → `pagarPremio()`<br>`src/controllers/ticketController.js` → `pagar` | `POST /api/v1/tickets/:codigo/pagar` | `tests/tickets.test.js` → `test_resultado_y_pago_premio` | ✅ Aprobado |
| **HU-010** | Como vendedor quiero consultar el resumen diario de caja y registrar el cierre para cuadrar las ventas y los premios pagados. | `src/services/cajaService.js` → `resumen()` y `cerrar()`<br>`src/controllers/cajaController.js` | `GET /api/v1/caja/resumen`<br>`POST /api/v1/caja/cierre` | `tests/caja.test.js` → `test_resumen_caja_diario`<br>`test_cierre_caja_con_faltante` | ✅ Aprobado |
| **HU-011** | Como administrador quiero crear sorteos y consultarlos para organizar la operación del puesto. | `src/services/sorteoService.js` → `crear()`, `listar()` y `obtener()`<br>`src/controllers/sorteoController.js` | `POST /api/v1/sorteos`<br>`GET /api/v1/sorteos`<br>`GET /api/v1/sorteos/:id` | `tests/caja.test.js` → `test_admin_crea_sorteo` | ✅ Aprobado |
| **HU-012** | Como vendedor quiero que el sistema bloquee la venta cuando el sorteo ya cerró o ya fue jugado. | `src/services/sorteoService.js` → `verificarVentaPermitida()` | `POST /api/v1/tickets/chance`<br>`POST /api/v1/tickets/baloto` | `tests/tickets.test.js` → `test_venta_sorteo_cerrado` | ✅ Aprobado |
| **HU-013** | Como usuario quiero consultar mis tiquetes y el detalle de uno en particular para verificar su estado y si ganó. | `src/services/ticketService.js` → `listar()` y `consultar()`<br>`src/controllers/ticketController.js` | `GET /api/v1/tickets`<br>`GET /api/v1/tickets/:codigo` | `tests/tickets.test.js` → `test_resultado_y_pago_premio` (consulta del tiquete) | 🟡 Parcial |
| **HU-014** | Como usuario quiero consultar mi perfil autenticado para conocer mi nombre y rol. | `src/services/authService.js` → `perfil()`<br>`src/controllers/authController.js` → `perfil` | `GET /api/v1/auth/perfil` | Sin prueba automatizada; verificación manual en Swagger UI | ⏳ Pendiente |
| **HU-015** | Como desarrollador quiero documentar la API de forma interactiva para facilitar las pruebas y el mantenimiento. | `src/config/swagger.js`<br>`src/routes/index.js` (anotaciones `@openapi`)<br>`src/app.js` | `GET /api-docs` | Verificación manual: Swagger UI carga el esquema OpenAPI 3.0 | ✅ Aprobado |
| **HU-016** | Como administrador quiero consultar la caja de cualquier vendedor para supervisar la operación. | `src/controllers/cajaController.js` → `resumen` (parámetro `vendedorId`) | `GET /api/v1/caja/resumen?vendedorId=` | Sin prueba automatizada para el rol ADMIN | ⏳ Pendiente |

---

## 4. Resumen de cobertura

| Estado | Cantidad | Porcentaje |
|---|---:|---:|
| ✅ Aprobado | 13 | 81 % |
| 🟡 Parcial | 1 | 6 % |
| ⏳ Pendiente | 2 | 13 % |
| **Total** | **16** | **100 %** |

**Cobertura automatizada:** 13 de 16 historias cuentan con al menos una prueba automatizada que pasa (81 %).

---

## 5. Evidencia de ejecución

Para reproducir las pruebas:

```bash
npm install
npm test
```

Resultado esperado: todas las suites de `tests/` en verde. Jest muestra el listado de casos ejecutados, entre ellos los referenciados en esta matriz.

Para validar la documentación interactiva:

```bash
npm run dev
```

Luego abrir `http://localhost:3000/api-docs` y comprobar que se listan los módulos de Autenticación, Sorteos, Tiquetes y Caja.

---

## 6. Observaciones y deuda técnica

1. **HU-013 (Parcial):** la consulta de un tiquete está cubierta indirectamente, pero faltan pruebas específicas para los filtros `fecha` y `estado` del listado.
2. **HU-014 (Pendiente):** el endpoint de perfil funciona, pero no tiene una prueba dedicada que valide el token y la ausencia de la contraseña en la respuesta.
3. **HU-016 (Pendiente):** falta probar que un usuario con rol `VENDEDOR` no pueda consultar la caja de otro vendedor.
4. **Persistencia:** los datos viven en memoria (`src/data/store.js`); al reiniciar el servidor se pierden. Es una limitación académica conocida.
5. **Seguridad:** el secreto JWT por defecto debe reemplazarse siempre mediante la variable de entorno `JWT_SECRET`.
6. **Cobertura:** se recomienda ejecutar `npm test -- --coverage` y agregar pruebas para los casos pendientes antes de una entrega final.

---

## 7. Control de versiones del documento

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | Noviembre de 2026 | Creación de la matriz con 16 historias de usuario y su trazabilidad |
