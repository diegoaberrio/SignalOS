````md
# SignalOS Backend

Backend API del MVP de **SignalOS**, una plataforma B2B de inteligencia comercial territorial.

## Stack

- Node.js
- Express
- PostgreSQL
- JWT
- Zod

## Objetivo del backend

Este backend soporta dos áreas principales del MVP:

- **zona pública**
  - catálogos
  - envío de interacciones públicas
- **zona privada**
  - login
  - perfil autenticado
  - listado de empresas
  - detalle de empresas
  - historial de interacciones
  - dashboard básico
  - gestión de usuarios internos

---

## Ruta de trabajo local

```powershell
PS C:\Users\diego\Desktop\PROYECTOS_DESPLEGAR\SignalOS\backend>
````

---

## Requisitos previos

Antes de arrancar el proyecto, debes tener instalado:

* Node.js
* npm
* PostgreSQL
* psql o pgAdmin
* Visual Studio Code

---

## Instalación inicial

### 1. Instalar dependencias

```powershell
npm install
```

### 2. Configurar variables de entorno

Crear `.env` basado en `.env.example`.

### 3. Crear base de datos

La base de datos usada en desarrollo es:

```txt
signalos_db
```

### 4. Ejecutar esquema SQL

```powershell
psql -U postgres -d signalos_db -f .\sql\schema.sql
```

### 5. Ejecutar seed inicial

```powershell
psql -U postgres -d signalos_db -f .\sql\seed.sql
```

### 6. Arrancar backend

```powershell
npm run dev
```

---

## Variables de entorno

Archivo `.env` esperado:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=signalos_db
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_REAL

JWT_SECRET=signalos_super_secret_dev_key
JWT_EXPIRES_IN=8h

CORS_ORIGIN=http://localhost:5173
```

### Descripción breve

* `PORT`: puerto local del backend
* `NODE_ENV`: entorno actual
* `DB_HOST`: host de PostgreSQL
* `DB_PORT`: puerto de PostgreSQL
* `DB_NAME`: base de datos del proyecto
* `DB_USER`: usuario PostgreSQL
* `DB_PASSWORD`: password del usuario PostgreSQL
* `JWT_SECRET`: secreto para firmar tokens
* `JWT_EXPIRES_IN`: duración del token
* `CORS_ORIGIN`: origen permitido del frontend React + Vite

---

## Scripts disponibles

```powershell
npm run dev
npm start
```

### Scripts

* `npm run dev`: arranque con nodemon para desarrollo
* `npm start`: arranque simple con node

---

## Estructura del proyecto

```txt
backend/
├─ src/
│  ├─ app.js
│  ├─ server.js
│  ├─ config/
│  ├─ middlewares/
│  ├─ utils/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ catalog/
│  │  ├─ public-interactions/
│  │  ├─ companies/
│  │  ├─ dashboard/
│  │  └─ users/
│  └─ routes/
├─ sql/
│  ├─ schema.sql
│  └─ seed.sql
├─ tests/
├─ .env
├─ .env.example
├─ package.json
└─ README.md
```

---

## Base URL local

```txt
http://localhost:3000/api/v1
```

---

## Endpoints principales

## Salud

### GET `/health`

Comprueba que la API está viva.

---

## Catálogos públicos

### GET `/public/catalogs/zones`

### GET `/public/catalogs/sectors`

### GET `/public/catalogs/intentions`

Sirven para poblar formularios públicos y filtros del panel privado.

---

## Flujo público

### POST `/public/interactions`

Recibe una interacción pública, valida datos, consolida empresa, registra interacción, guarda eventos opcionales y calcula prioridad inicial.

---

## Auth

### POST `/auth/login`

Login de usuario interno.

### GET `/auth/me`

Devuelve perfil autenticado usando JWT.

---

## Companies

### GET `/companies`

Listado paginado de empresas con filtros, búsqueda y orden.

### GET `/companies/:id`

Detalle de empresa.

### GET `/companies/:id/interactions`

Historial de interacciones de una empresa.

---

## Dashboard

### GET `/dashboard/summary`

Métricas básicas del MVP:

* total de empresas
* total de interacciones
* distribución por prioridad
* actividad reciente

---

## Users

### GET `/users`

### GET `/users/:id`

### POST `/users`

### PATCH `/users/:id`

### PATCH `/users/:id/status`

Gestión básica de usuarios internos. Solo para `admin`.

---

## Autenticación

Las rutas privadas requieren header:

```txt
Authorization: Bearer TU_TOKEN
```

### Flujo recomendado

1. login con `/auth/login`
2. guardar token
3. usar token en rutas privadas

---

## Convención de respuestas

### Éxito

```json
{
  "success": true,
  "message": "Text",
  "data": {},
  "meta": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "code": "VALIDATION_ERROR",
      "message": "email is required"
    }
  ]
}
```

---

## Checklist de arranque rápido

Antes de trabajar, comprobar:

* PostgreSQL está levantado
* `.env` existe y tiene credenciales correctas
* `signalos_db` existe
* `schema.sql` y `seed.sql` ya fueron ejecutados
* `npm install` completado
* `npm run dev` levanta sin errores
* `/api/v1/health` responde correctamente

---

## Checklist para integración con frontend React + Vite

El frontend debe asumir:

* base URL configurable por entorno
* rutas públicas y privadas separadas
* JWT por Bearer token
* respuestas consistentes con `success`, `message`, `data`, `meta`
* ids numéricos en respuestas principales
* estados mínimos en UI:

  * loading
  * success
  * empty
  * validation_error
  * unauthorized
  * forbidden
  * not_found
  * server_error

### Variable sugerida en frontend

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

---

## Notas del MVP

Este backend está orientado a un MVP funcional, no a una versión enterprise. Prioriza:

* claridad
* modularidad simple
* integración limpia con frontend
* crecimiento posterior sin rehacer la base

Quedan fuera del MVP actual:

* refresh tokens
* recuperación de contraseña
* exportaciones
* auditoría avanzada
* multi-tenant estricto
* scoring avanzado
* integraciones externas
* testing completo de cobertura alta

---

## Estado actual del backend

El backend ya tiene implementado y validado:

* servidor base
* conexión PostgreSQL
* catálogos públicos
* flujo público real
* autenticación
* companies
* dashboard
* users
* endurecimiento final de validaciones y respuestas

```


