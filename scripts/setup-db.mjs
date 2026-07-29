// Aplica el schema y (opcional) crea/actualiza el usuario admin.
// Uso:
//   DATABASE_URL=... node scripts/setup-db.mjs
//   DATABASE_URL=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/setup-db.mjs
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pg from 'pg'
import bcrypt from 'bcryptjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

if (!process.env.DATABASE_URL) {
  console.error('✗ Falta DATABASE_URL')
  process.exit(1)
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

async function main() {
  const schema = readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8')
  console.log('→ Aplicando schema...')
  await pool.query(schema)
  console.log('✓ Schema aplicado')

  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  if (email && password) {
    const hash = bcrypt.hashSync(password, 10)
    await pool.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, 'Admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [email.toLowerCase().trim(), hash],
    )
    console.log(`✓ Usuario admin listo: ${email}`)
  } else {
    console.log('ℹ Sin ADMIN_EMAIL/ADMIN_PASSWORD: no se creó usuario admin')
  }
}

main()
  .then(() => pool.end())
  .catch(err => {
    console.error('✗ Error:', err.message)
    pool.end()
    process.exit(1)
  })
