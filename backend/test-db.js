const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected successfully:', res.rows[0]);
    
    // Check if suppliers table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'suppliers'
      )
    `);
    console.log('Suppliers table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Count suppliers
      const count = await pool.query('SELECT COUNT(*) FROM suppliers WHERE is_active = true AND is_verified = true');
      console.log('Active verified suppliers count:', count.rows[0].count);
      
      // Get sample data
      const sample = await pool.query('SELECT id, name, is_active, is_verified FROM suppliers LIMIT 5');
      console.log('Sample suppliers:', sample.rows);
    }
    
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await pool.end();
  }
}

testDatabase();
