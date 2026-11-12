# 🎰 Puesto de Chance API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Jest](https://img.shields.io/badge/Testing-Jest-C21325?logo=jest&logoColor=white)](https://jestjs.io/)
[![Swagger](https://img.shields.io/badge/API_Docs-OpenAPI_3-85EA2D?logo=swagger&logoColor=black)](https://swagger.io/)
[![License](https://img.shields.io/badge/Uso-Acad%C3%A9mico-blue)](#-notas-del-autor)

API REST desarrollada con **Node.js + Express** para administrar la operación básica de un **puesto de chance**: venta de tiquetes de chance y Baloto, anulación dentro de un tiempo límite, liquidación y pago de premios, administración de sorteos y cierre diario de caja.

El proyecto hace parte de mi proceso de formación como **aprendiz del SENA** y busca aplicar buenas prácticas de organización por capas, validación de reglas de negocio, autenticación con JWT, pruebas automatizadas y documentación de APIs.

> ⚠️ **Aclaración importante:** la información se guarda en memoria (`src/data/store.js`). Al reiniciar el servidor los datos vuelven al estado inicial. No está pensado para producción, sino como ejercicio académico.

---

## 📑 Tabla de contenido

1. [Descripción general](#-descripción-general)
2. [Características principales](#-características-principales)
3. [Arquitectura del proyecto](#-arquitectura-del-proyecto)
4. [Tecnologías utilizadas](#-tecnologías-utilizadas)
5. [Prerrequisitos](#-prerrequisitos)
6. [Instalación local paso a paso](#-instalación-local-paso-a-paso)
7. [Variables de entorno](#-variables-de-entorno)
8. [Ejecución y scripts](#-ejecución-y-scripts)
9. [Usuarios de prueba](#-usuarios-de-prueba)
10. [Endpoints principales](#-endpoints-principales)
11. [Documentación interactiva de la API](#-documentación-interactiva-de-la-api)
12. [Pruebas automatizadas](#-pruebas-automatizadas)
13. [Matriz de trazabilidad de requisitos](#-matriz-de-trazabilidad-de-requisitos)
14. [Reglas de negocio](#-reglas-de-negocio)
15. [Notas del autor](#-notas-del-autor)
16. [Mejoras futuras](#-mejoras-futuras)

---

## 📖 Descripción general

El sistema simula el funcionamiento de un puesto de apuestas. Permite que un **vendedor** inicie sesión, consulte los sorteos abiertos, venda tiquetes de chance o Baloto, anule una venta si se equivocó, consulte si un tiquete ganó, pague el premio y realice el cierre de caja del día. El **administrador** puede crear sorteos, registrar los resultados oficiales y consultar la caja de cualquier vendedor.

La API está organizada por capas:

- **Rutas:** definen los endpoints y aplican autenticación y roles.
- **Controladores:** reciben la petición HTTP y devuelven la respuesta.
- **Servicios:** contienen las reglas de negocio y las validaciones.
- **Datos:** almacén en memoria que simula la base de datos.

---

## ✨ Características principales

- Autenticación con **JWT** y contraseñas cifradas con **bcrypt**.
- Autorización por roles: `ADMIN` y `VENDEDOR`.
- Venta de tiquetes de **chance** (1 a 4 cifras, modalidad directa o combinada).
- Venta de tiquetes de **Baloto** (5 números + superbalota, manual o aleatoria).
- Anulación de tiquetes con control de tiempo y motivo obligatorio.
- Registro de resultados y **liquidación automática** de premios.
- Pago de premios con control de caducidad y bloqueo de doble pago.
- Resumen y **cierre diario de caja** con diferencia (cuadrada, sobrante o faltante).
- Validación centralizada de errores con respuestas JSON claras.
- **Documentación interactiva con Swagger UI**.
- **Pruebas automatizadas con Jest y Supertest**.

---

## 🏗️ Arquitectura del proyecto

```text
documentacionApi/
├── src/
│   ├── app.js                    # Configuración de Express y Swagger
│   ├── server.js                 # Arranque del servidor
│   ├── config/
│   │   ├── index.js              # Lectura de variables de entorno
│   │   └── swagger.js            # Definición OpenAPI 3.0
│   ├── controllers/              # Capa HTTP (auth, tickets, sorteos, caja)
│   ├── data/
│   │   └── store.js              # Datos en memoria y datos de ejemplo
│   ├── middlewares/
│   │   ├── auth.js               # Verificación JWT y roles
│   │   └── errorHandler.js       # Manejo centralizado de errores
│   ├── routes/
│   │   └── index.js              # Endpoints + anotaciones @openapi
│   ├── services/                 # Reglas de negocio
│   │   ├── authService.js
│   │   ├── chanceService.js
│   │   ├── balotoService.js
│   │   ├── sorteoService.js
│   │   ├── ticketService.js
│   │   └── cajaService.js
│   └── utils/                    # Utilidades (errores y fechas)
├── tests/                        # Pruebas con Jest + Supertest
├── docs/
│   └── RTM.md                    # Matriz de trazabilidad de requisitos
├── .env.example                  # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18 o superior | Entorno de ejecución |
| Express | 4.x | Framework HTTP |
| JavaScript | ES2022 (CommonJS) | Lenguaje del backend |
| JSON Web Token | 9.x | Autenticación sin estado |
| bcryptjs | 2.4.x | Cifrado de contraseñas |
| dotenv | 16.x | Variables de entorno |
| CORS | 2.8.x | Acceso desde otros clientes |
| Morgan | 1.10.x | Registro de peticiones |
| Swagger UI Express | 5.x | Documentación interactiva |
| swagger-jsdoc | 6.x | Generación de OpenAPI desde JSDoc |
| Jest | 29.x | Pruebas automatizadas |
| Supertest | 7.x | Pruebas de endpoints HTTP |
| Nodemon | 3.x | Recarga automática en desarrollo |

---

## ✅ Prerrequisitos

Antes de instalar el proyecto asegúrate de tener:

- **Node.js 18 o superior** (recomendado 20 LTS). Verifica con:
  ```bash
  node --version
  ```
- **npm 9 o superior** (se instala junto con Node.js). Verifica con:
  ```bash
  npm --version
  ```
- **Git** para clonar el repositorio. Verifica con:
  ```bash
  git --version
  ```
- Un editor de código, por ejemplo **Visual Studio Code**.
- Un cliente para probar APIs, por ejemplo **Postman**, **Thunder Client** o la misma Swagger UI.

> 💡 En Windows puedes instalar Node.js desde [nodejs.org](https://nodejs.org/) o con `winget install OpenJS.NodeJS.LTS`.

---

## 🚀 Instalación local paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/crgonzalez3212/documentacionApi.git
cd documentacionApi
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Crear el archivo de variables de entorno

En **Linux/macOS**:

```bash
cp .env.example .env
```

En **Windows PowerShell**:

```powershell
Copy-Item .env.example .env
```

Luego abre `.env` y cambia al menos `JWT_SECRET` por un valor propio.

### 4. Verificar la configuración

El archivo `.env` debe quedar similar a esto:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=un-secreto-largo-y-dificil-de-adivinar
JWT_EXPIRES_IN=8h
ZONA_HORARIA=America/Bogota
MINUTOS_ANULACION=10
MINUTOS_CIERRE_VENTAS=15
APUESTA_MIN_CHANCE=500
APUESTA_MAX_CHANCE=50000
VALOR_BALOTO=5700
DIAS_CADUCIDAD_PREMIO=365
```

### 5. Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

También puedes iniciarlo en modo normal:

```bash
npm start
```

Deberías ver en consola:

```text
Puesto de chance API escuchando en http://localhost:3000
```

### 6. Comprobar que todo funciona

Abre en el navegador o ejecuta:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{ "estado": "ok", "hora": "2026-11-12T20:00:00.000Z" }
```

### 7. Abrir la documentación interactiva

Visita:

```text
http://localhost:3000/api-docs
```

### 8. Iniciar sesión y probar un endpoint

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"vendedor1\",\"password\":\"vende123\"}"
```

Con el token devuelto puedes consultar, por ejemplo, los sorteos:

```bash
curl http://localhost:3000/api/v1/sorteos \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🔐 Variables de entorno

Todas las variables son opcionales porque el proyecto tiene valores por defecto, pero se recomienda definirlas en `.env`. La plantilla completa está en [`.env.example`](.env.example).

| Variable | Descripción | Valor por defecto |
|---|---|---|
| `NODE_ENV` | Entorno de ejecución (`development`, `test`, `production`) | `development` |
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Secreto para firmar los tokens JWT | `cambiar-este-secreto` |
| `JWT_EXPIRES_IN` | Vigencia del token | `8h` |
| `ZONA_HORARIA` | Zona horaria para fechas de caja | `America/Bogota` |
| `MINUTOS_ANULACION` | Minutos en que el vendedor puede anular | `10` |
| `MINUTOS_CIERRE_VENTAS` | Minutos antes del sorteo en que se cierran ventas | `15` |
| `APUESTA_MIN_CHANCE` | Apuesta mínima de chance | `500` |
| `APUESTA_MAX_CHANCE` | Apuesta máxima de chance | `50000` |
| `VALOR_BALOTO` | Valor de cada jugada de Baloto | `5700` |
| `DIAS_CADUCIDAD_PREMIO` | Días para reclamar un premio | `365` |

> 🔒 **Nunca** subas el archivo `.env` real al repositorio. Solo debe versionarse `.env.example`.

---

## ▶️ Ejecución y scripts

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor con Node.js |
| `npm run dev` | Inicia con Nodemon y recarga automática |
| `npm test` | Ejecuta todas las pruebas con Jest |
| `npm test -- --coverage` | Ejecuta las pruebas y muestra cobertura |

Servicios disponibles al iniciar:

| URL | Descripción |
|---|---|
| `http://localhost:3000/health` | Estado del servidor |
| `http://localhost:3000/api-docs` | Swagger UI |
| `http://localhost:3000/api/v1` | Base de los endpoints |

---

## 👥 Usuarios de prueba

El almacén en memoria crea estos usuarios automáticamente al iniciar:

| Usuario | Contraseña | Rol | Uso |
|---|---|---|---|
| `admin` | `admin123` | `ADMIN` | Crear sorteos, registrar resultados, ver caja de vendedores |
| `vendedor1` | `vende123` | `VENDEDOR` | Vender, anular, consultar y pagar premios |
| `vendedor2` | `vende456` | `VENDEDOR` | Probar restricciones entre vendedores |

> Estas credenciales son solo para desarrollo y pruebas locales. No deben usarse en producción.

---

## 🔌 Endpoints principales

Todos los endpoints (excepto el login) requieren el encabezado:

```http
Authorization: Bearer <token>
```

### Autenticación

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Público | Inicia sesión y devuelve el token |
| `GET` | `/api/v1/auth/perfil` | Autenticado | Consulta el perfil del usuario |

### Sorteos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/sorteos` | Autenticado | Lista sorteos (filtros `tipo` y `estado`) |
| `GET` | `/api/v1/sorteos/:id` | Autenticado | Consulta un sorteo |
| `POST` | `/api/v1/sorteos` | `ADMIN` | Crea un sorteo |
| `POST` | `/api/v1/sorteos/:id/resultado` | `ADMIN` | Registra resultado y liquida tiquetes |

### Tiquetes

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `POST` | `/api/v1/tickets/chance` | `VENDEDOR` | Vende un tiquete de chance |
| `POST` | `/api/v1/tickets/baloto` | `VENDEDOR` | Vende un tiquete de Baloto |
| `GET` | `/api/v1/tickets` | Autenticado | Lista tiquetes (filtros `fecha` y `estado`) |
| `GET` | `/api/v1/tickets/:codigo` | Autenticado | Consulta un tiquete y su sorteo |
| `POST` | `/api/v1/tickets/:codigo/anular` | Autenticado | Anula un tiquete activo |
| `POST` | `/api/v1/tickets/:codigo/pagar` | `VENDEDOR` | Paga el premio de un tiquete |

### Caja

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| `GET` | `/api/v1/caja/resumen` | Autenticado | Resumen de caja del día |
| `POST` | `/api/v1/caja/cierre` | `VENDEDOR` | Cierre diario de caja |

### Ejemplo de venta de chance

```http
POST /api/v1/tickets/chance
Authorization: Bearer <token de vendedor>
Content-Type: application/json

{
  "sorteoId": 1,
  "cliente": "Juan Pérez",
  "apuestas": [
    { "numero": "1234", "modalidad": "DIRECTO", "valor": 2000 },
    { "numero": "56", "valor": 1000 }
  ]
}
```

Respuesta `201 Created`:

```json
{
  "id": 1,
  "codigo": "CH-9F2A1B3C",
  "tipo": "CHANCE",
  "sorteoId": 1,
  "vendedorId": 2,
  "cliente": "Juan Pérez",
  "apuestas": [
    { "numero": "1234", "cifras": 4, "modalidad": "DIRECTO", "valor": 2000 },
    { "numero": "56", "cifras": 2, "modalidad": "DIRECTO", "valor": 1000 }
  ],
  "total": 3000,
  "estado": "ACTIVO",
  "premio": null,
  "creadoEn": "2026-11-12T20:15:00.000Z"
}
```

### Ejemplo de error

```json
{ "error": "No tiene permisos para esta acción" }
```

Códigos de estado usados: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `410` y `500`.

---

## 📚 Documentación interactiva de la API

La documentación se genera con **OpenAPI 3.0** a partir de las anotaciones `@openapi` escritas en `src/routes/index.js` y se muestra con **Swagger UI**.

1. Inicia el servidor con `npm run dev`.
2. Abre `http://localhost:3000/api-docs`.
3. Ejecuta `POST /auth/login` con un usuario de prueba.
4. Copia el `token` de la respuesta.
5. Haz clic en **Authorize** y pega el token (sin la palabra `Bearer`).
6. Ya puedes probar cualquier endpoint desde el navegador con **Try it out**.

Contenido documentado:

- Autenticación y perfiles.
- CRUD básico de sorteos y registro de resultados.
- Venta, consulta, anulación y pago de tiquetes.
- Resumen y cierre de caja.
- Esquemas de datos (`Ticket`, `Sorteo`, `CajaResumen`, `Error`, etc.).
- Códigos de error y restricciones por rol.

El código de las funciones críticas está comentado con **JSDoc**, incluyendo `@param`, `@returns` y `@throws`, por ejemplo en `ticketService.venderChance`, `ticketService.anular`, `ticketService.pagarPremio`, `sorteoService.registrarResultado`, `cajaService.cerrar`, `authService.login`, `chanceService.calcularPremio` y `balotoService.calcularPremio`.

---

## 🧪 Pruebas automatizadas

Las pruebas están en la carpeta `tests/` y usan **Jest + Supertest**. Cada prueba reinicia el almacén de datos para que sean independientes.

Ejecutar todas las pruebas:

```bash
npm test
```

Resultado esperado: **todas las suites en verde** (autenticación, chance, Baloto, tiquetes, caja y sorteos).

Suites incluidas:

| Archivo | Qué valida |
|---|---|
| `tests/auth.test.js` | Login, credenciales inválidas y rutas protegidas |
| `tests/chance.test.js` | Premios directos, combinados y validaciones |
| `tests/baloto.test.js` | Jugadas aleatorias, números repetidos y tabla de premios |
| `tests/tickets.test.js` | Venta, anulación, pago y roles |
| `tests/caja.test.js` | Resumen, cierre con faltante y creación de sorteos |

Casos destacados:

- `test_login_exitoso` y `test_login_credenciales_invalidas`
- `test_venta_chance` y `test_venta_baloto`
- `test_anulacion_ticket` y `test_anulacion_fuera_de_tiempo`
- `test_resultado_y_pago_premio`
- `test_cierre_caja_con_faltante`
- `test_admin_no_vende` y `test_ruta_protegida_sin_token`

---

## 🧭 Matriz de trazabilidad de requisitos

La matriz completa, con la relación entre historias de usuario, implementación y pruebas, está en [`docs/RTM.md`](docs/RTM.md).

Resumen:

| ID HU | Requisito | Módulo / Servicio | Caso de prueba | Estado QA |
|---|---|---|---|---|
| HU-001 | Inicio de sesión con JWT | `authService.js` / `authController.js` | `test_login_exitoso` | Aprobado |
| HU-002 | Control de acceso por roles | `middlewares/auth.js` | `test_admin_no_vende` | Aprobado |
| HU-003 | Venta de chance | `ticketService.venderChance` | `test_venta_chance` | Aprobado |
| HU-004 | Venta de Baloto | `ticketService.venderBaloto` | `test_venta_baloto` | Aprobado |
| HU-005 | Anulación de tiquetes | `ticketService.anular` | `test_anulacion_ticket` | Aprobado |
| HU-006 | Registro de resultados | `sorteoService.registrarResultado` | `test_resultado_y_pago_premio` | Aprobado |
| HU-007 | Pago de premios | `ticketService.pagarPremio` | `test_resultado_y_pago_premio` | Aprobado |
| HU-008 | Cierre de caja | `cajaService.cerrar` | `test_cierre_caja_con_faltante` | Aprobado |
| HU-009 | Creación de sorteos | `sorteoService.crear` | `test_admin_crea_sorteo` | Aprobado |

---

## 📏 Reglas de negocio

- **Chance:** el número debe tener entre 1 y 4 dígitos; el valor debe ser múltiplo de 100 y estar entre `APUESTA_MIN_CHANCE` y `APUESTA_MAX_CHANCE`.
- **Chance combinado:** solo aplica para 3 o 4 cifras y el número no puede tener todas las cifras iguales.
- **Baloto:** 5 números distintos entre 1 y 43, más una superbalota entre 1 y 16. Cada tiquete puede tener entre 1 y 10 jugadas.
- **Ventas:** se cierran `MINUTOS_CIERRE_VENTAS` minutos antes de la fecha del sorteo.
- **Anulación:** el vendedor solo puede anular sus tiquetes dentro de `MINUTOS_ANULACION` minutos y debe indicar un motivo. No se anulan tiquetes de sorteos ya jugados.
- **Pago de premios:** solo se paga una vez, el sorteo debe estar jugado y el premio no puede estar caducado.
- **Caja:** solo se cierra una vez por día y se clasifica como `CUADRADA`, `SOBRANTE` o `FALTANTE`.

---

## ✍️ Notas del autor

Soy aprendiz del programa **Análisis y Desarrollo de Software (ADSO)** del **SENA** y actualmente estoy cursando el **trimestre 4**. Este proyecto lo desarrollé como parte de mi proceso de formación para practicar el diseño de APIs REST, la separación de responsabilidades, la seguridad básica con JWT y las pruebas automatizadas.

Aunque el proyecto funciona y las pruebas pasan, reconozco que todavía es una versión académica: el almacenamiento es en memoria, no hay base de datos real y quedan funcionalidades por reforzar (por ejemplo, pruebas para los filtros de listado y para la consulta de perfil). La idea es seguir mejorándolo en los próximos trimestres y tomar estos ejercicios como base para proyectos más completos.

Comentarios, correcciones y sugerencias son bienvenidos. 🙌

---

## 🔮 Mejoras futuras

- Reemplazar el almacén en memoria por **PostgreSQL** o **MongoDB**.
- Agregar migraciones y un ORM (Sequelize o Prisma).
- Implementar refresh tokens y cierre de sesión.
- Añadir paginación y filtros avanzados en los listados.
- Completar la cobertura de pruebas para todos los endpoints.
- Configurar un pipeline de CI/CD con GitHub Actions.
- Desplegar la API en un servicio en la nube.
- Crear un frontend para vendedores y administradores.

---

<p align="center">
  Hecho con dedicación como parte de mi formación en el SENA 💚
</p>
