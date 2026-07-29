# Despliegue en Railway (todo en Railway, sin Supabase)

Este proyecto usa **Postgres propio + auth propia + volumen** en lugar de Supabase.

## 1. Crear el proyecto y la base de datos

1. En Railway: **New Project → Deploy from GitHub repo** (o `railway init` con la CLI).
2. Añade un servicio **Postgres**: **New → Database → PostgreSQL**.
3. Añade un **Volume** al servicio de la app (pestaña del servicio → **Volumes → Attach**),
   con mount path `/data`.

## 2. Variables de entorno (servicio de la app)

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `${{ Postgres.DATABASE_URL }}` (referencia de Railway) |
| `DATABASE_SSL` | `false` (conexión interna) |
| `SESSION_SECRET` | genera uno: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `UPLOAD_DIR` | `/data/uploads` (dentro del volumen) |
| `FLOW_API_KEY`, `FLOW_SECRET_KEY`, `FLOW_ENV` | tus credenciales de Flow |
| `NEXT_PUBLIC_SITE_URL` | la URL pública de Railway (Settings → Networking → Generate Domain) |
| `ADMIN_EMAIL` | email del admin |
| `NEXT_PUBLIC_ADMIN_EMAIL` | mismo valor que `ADMIN_EMAIL` |

## 3. Crear las tablas y el usuario admin

Una sola vez, con la CLI de Railway (o cualquier shell con `DATABASE_URL` apuntando al proxy público):

```bash
# Con el proxy público de Railway hace falta SSL:
DATABASE_SSL=true \
DATABASE_URL="postgresql://...proxy.rlwy.net:PORT/railway" \
ADMIN_EMAIL="carolina@comunidadfungi.com" \
ADMIN_PASSWORD="una-contraseña-segura" \
npm run db:setup
```

Esto aplica `supabase/schema.sql` y crea/actualiza el usuario admin.

## 4. Webhooks de Flow

En el panel de Flow, apunta la URL de confirmación a:

```
https://TU-DOMINIO-RAILWAY/api/flow/webhook
```

`NEXT_PUBLIC_SITE_URL` ya se usa para construir las URLs de retorno/confirmación.

## Notas

- **Build/Start**: Nixpacks detecta Next.js. Start = `npm run start` (`railway.json`). `next start` respeta `PORT`.
- **Imágenes subidas**: se guardan en el volumen (`UPLOAD_DIR`) y se sirven en `/api/media/<archivo>`.
- **Migrar datos existentes desde Supabase** (si los hay): exporta las tablas `blog_posts`, `orders`, `user_documents`, `products` desde Supabase e impórtalas al Postgres de Railway. Los usuarios hay que recrearlos (las contraseñas de Supabase no son exportables); pídeles restablecer contraseña o recréalos.
