# SignalOS Backend Startup Checklist

## Antes de arrancar

- [ ] PostgreSQL encendido
- [ ] Base de datos `signalos_db` creada
- [ ] `.env` presente
- [ ] credenciales DB correctas
- [ ] `schema.sql` ejecutado
- [ ] `seed.sql` ejecutado
- [ ] dependencias instaladas con `npm install`

## Arranque

- [ ] ejecutar `npm run dev`
- [ ] verificar conexión a PostgreSQL
- [ ] abrir `http://localhost:3000/api/v1/health`
- [ ] comprobar respuesta OK

## Auth mínima

- [ ] existe usuario admin
- [ ] login funciona
- [ ] `/auth/me` responde con token

## Módulos principales

- [ ] catálogos públicos responden
- [ ] flujo público responde
- [ ] companies responde
- [ ] dashboard responde
- [ ] users responde con admin