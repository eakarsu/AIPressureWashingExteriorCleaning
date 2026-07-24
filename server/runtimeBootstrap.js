const bcrypt = require('bcryptjs');
const pool = require('./db');

async function bootstrapRuntime() {
  if (String(process.env.MIGRATE_ON_START).toLowerCase() !== 'true') return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      role VARCHAR(50) NOT NULL DEFAULT 'admin',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS ai_results (
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      feature VARCHAR(100),
      action VARCHAR(100),
      entity_type VARCHAR(100),
      entity_id INTEGER,
      input_data JSONB,
      output_data JSONB,
      model_used VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  const email = process.env.PROVISION_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password = process.env.PROVISION_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
  const fullName = (process.env.PROVISION_ADMIN_NAME || 'Runtime Administrator').trim();
  if (!email || !password) throw new Error('runtime admin credentials are required');
  const [firstName, ...lastNameParts] = fullName.split(/\s+/);
  const lastName = lastNameParts.join(' ') || 'Administrator';
  const passwordHash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (email, password_hash, first_name, last_name, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO UPDATE
     SET password_hash = EXCLUDED.password_hash, first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name, role = EXCLUDED.role, updated_at = NOW()`,
    [email, passwordHash, firstName, lastName]
  );
}

module.exports = { bootstrapRuntime };
