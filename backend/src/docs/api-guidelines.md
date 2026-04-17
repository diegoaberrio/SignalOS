````md
# SignalOS API Guidelines for Frontend

## Base URL local

```txt
http://localhost:3000/api/v1
````

## Autenticación

Las rutas privadas usan JWT con header:

```txt
Authorization: Bearer TU_TOKEN
```

## Orden recomendado de consumo en frontend

### Zona pública

1. `GET /public/catalogs/zones`
2. `GET /public/catalogs/sectors`
3. `GET /public/catalogs/intentions`
4. `POST /public/interactions`

### Zona privada

1. `POST /auth/login`
2. `GET /auth/me`
3. `GET /dashboard/summary`
4. `GET /companies`
5. `GET /companies/:id`
6. `GET /companies/:id/interactions`

### Admin

1. `GET /users`
2. `GET /users/:id`
3. `POST /users`
4. `PATCH /users/:id`
5. `PATCH /users/:id/status`

## Convenciones importantes

* mantener `snake_case` al consumir la API
* no asumir que todas las respuestas tienen `meta`
* sí asumir que las respuestas tienen `success` y `message`
* en listados, usar `data` como array principal
* para paginación, leer `meta.pagination`
* para filtros aplicados, leer `meta.filters`

## Estados que debe manejar el frontend

* loading
* success
* empty
* validation_error
* unauthorized
* forbidden
* not_found
* server_error

## Entidades más importantes para UI

### Company list item

* `id`
* `company_name`
* `sector`
* `zone`
* `current_intention`
* `priority`
* `total_interactions_count`
* `last_interaction_at`
* `company_status`

### Company detail

* datos base de empresa
* sector
* zona
* intención
* prioridad
* fechas
* estado
* historial separado por endpoint

### Dashboard summary

* `totals`
* `priority_breakdown`
* `recent_activity`

## Regla importante

No cambiar contratos JSON sin acordarlo antes, porque el frontend está pensado para renderizar estos objetos con mínima transformación.

```

