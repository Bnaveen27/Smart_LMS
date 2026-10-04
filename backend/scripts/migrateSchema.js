const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lms'
  });

  console.log('Connected to MySQL database.');

  async function addColumnIfNotExists(table, column, definition) {
    const [cols] = await conn.query(`SHOW COLUMNS FROM ${table} LIKE '${column}'`);
    if (cols.length === 0) {
      await conn.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      console.log(`+ Added column ${column} to ${table}`);
    } else {
      console.log(`= Column ${column} already exists in ${table}`);
    }
  }

  await addColumnIfNotExists('enrollments', 'learner_name', 'VARCHAR(100) NULL AFTER course_id');
  await addColumnIfNotExists('enrollments', 'learner_email', 'VARCHAR(100) NULL AFTER learner_name');
  await addColumnIfNotExists('enrollments', 'course_title', 'VARCHAR(200) NULL AFTER learner_email');
  await addColumnIfNotExists('enrollments', 'enrollment_type', "ENUM('ONLINE_PURCHASE', 'OFFLINE_PAYMENT', 'MANUAL_ADMIN', 'FREE_ENROLLMENT') DEFAULT 'ONLINE_PURCHASE' AFTER status");
  await addColumnIfNotExists('enrollments', 'payment_method', "VARCHAR(50) DEFAULT 'RAZORPAY' AFTER enrollment_type");
  await addColumnIfNotExists('enrollments', 'payment_reference', 'VARCHAR(100) NULL AFTER payment_method');
  await addColumnIfNotExists('enrollments', 'payment_amount', 'DECIMAL(10, 2) DEFAULT 0.00 AFTER payment_reference');
  await addColumnIfNotExists('enrollments', 'payment_date', 'DATETIME NULL AFTER payment_amount');
  await addColumnIfNotExists('enrollments', 'payment_proof', 'TEXT NULL AFTER payment_date');
  await addColumnIfNotExists('enrollments', 'enrolled_by_admin', 'VARCHAR(100) NULL AFTER payment_proof');
  await addColumnIfNotExists('enrollments', 'start_date', 'DATETIME NULL AFTER enrolled_by_admin');
  await addColumnIfNotExists('enrollments', 'expiry_date', 'DATETIME NULL AFTER start_date');
  await addColumnIfNotExists('enrollments', 'notes', 'TEXT NULL AFTER expiry_date');

  try {
    await conn.query(`ALTER TABLE enrollments MODIFY COLUMN status ENUM('PENDING_PAYMENT', 'PAYMENT_SUCCESSFUL', 'PENDING_APPROVAL', 'MANUALLY_ENROLLED', 'ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED') DEFAULT 'ACTIVE'`);
    console.log('✓ Updated enrollments status ENUM values');
  } catch (e) {
    console.warn('Status ENUM update note:', e.message);
  }

  try {
    await conn.query(`
      UPDATE enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN courses c ON e.course_id = c.id
      SET 
        e.learner_name = COALESCE(e.learner_name, u.name, 'Learner'),
        e.learner_email = COALESCE(e.learner_email, u.email, 'learner@example.com'),
        e.course_title = COALESCE(e.course_title, c.title, 'Course')
      WHERE e.learner_name IS NULL OR e.course_title IS NULL;
    `);
    console.log('✓ Synchronized learner_name, learner_email, course_title on existing enrollments');
  } catch (e) {
    console.warn('Sync existing records note:', e.message);
  }

  await addColumnIfNotExists('transactions', 'tenant_id', 'VARCHAR(50) NULL AFTER id');
  await addColumnIfNotExists('transactions', 'user_id', 'VARCHAR(50) NULL AFTER tenant_id');
  await addColumnIfNotExists('transactions', 'learner_name', 'VARCHAR(100) NULL AFTER user_id');
  await addColumnIfNotExists('transactions', 'course_id', 'VARCHAR(50) NULL AFTER learner_name');
  await addColumnIfNotExists('transactions', 'course_title', 'VARCHAR(200) NULL AFTER course_id');
  await addColumnIfNotExists('transactions', 'amount', 'DECIMAL(10, 2) DEFAULT 0.00 AFTER course_title');
  await addColumnIfNotExists('transactions', 'currency', "VARCHAR(10) DEFAULT 'INR' AFTER amount");
  await addColumnIfNotExists('transactions', 'gateway', "VARCHAR(50) DEFAULT 'RAZORPAY' AFTER currency");
  await addColumnIfNotExists('transactions', 'payment_method', "VARCHAR(50) DEFAULT 'ONLINE' AFTER gateway");
  await addColumnIfNotExists('transactions', 'transaction_ref', 'VARCHAR(100) NULL AFTER payment_method');
  await addColumnIfNotExists('transactions', 'payment_proof', 'TEXT NULL AFTER transaction_ref');
  await addColumnIfNotExists('transactions', 'invoice_no', 'VARCHAR(50) NULL AFTER payment_proof');
  await addColumnIfNotExists('transactions', 'notes', 'TEXT NULL AFTER invoice_no');
  await addColumnIfNotExists('transactions', 'status', "ENUM('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED', 'CANCELLED') DEFAULT 'SUCCESS' AFTER notes");

  const [cols] = await conn.query('DESCRIBE enrollments');
  console.log('Final Enrollments columns:', cols.map(c => c.Field));

  await conn.end();
  console.log('🎉 Schema migration complete!');
}

migrate().catch(console.error);
