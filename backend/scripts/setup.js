const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_NAME = process.env.DB_NAME || 'lms';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

async function runSetup() {
  console.log('==============================================');
  console.log('  🚀 Starting Smart LMS Database Setup Wizard ');
  console.log('==============================================');
  console.log(`Target Host: ${DB_HOST}:${DB_PORT}`);
  console.log(`Target DB:   ${DB_NAME}`);
  console.log(`DB User:     ${DB_USER}`);
  console.log('----------------------------------------------');

  try {
    // 1. Connect to MySQL server (without selecting DB)
    console.log('[1/4] Connecting to MySQL server...');
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });

    // 2. Create database explicitly
    console.log(`[2/4] Creating database '${DB_NAME}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.end();
    console.log(`✓ Database '${DB_NAME}' successfully created/verified.`);

    // 3. Synchronize all tables using Sequelize ORM
    console.log('[3/4] Initializing ORM models and synchronizing all tables...');
    const { syncAllTables } = require('../services/schemaProvisioner');
    const { seedRolesAndPermissions } = require('../services/roleService');

    await syncAllTables();
    console.log('✓ All database tables successfully generated.');

    // 4. Seed system roles, permissions, and superadmin accounts
    console.log('[4/4] Seeding default roles, permissions, and system entities...');
    await seedRolesAndPermissions();
    console.log('✓ System roles and permissions configured.');

    console.log('==============================================');
    console.log('  ✅ Database setup completed successfully!   ');
    console.log('  You can now start the server with:         ');
    console.log('  npm start (or node server.js)              ');
    console.log('==============================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:');
    console.error(error);
    process.exit(1);
  }
}

runSetup();
