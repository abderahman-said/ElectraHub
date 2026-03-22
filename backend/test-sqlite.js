const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create suppliers table and insert sample data
db.serialize(() => {
  // Create suppliers table
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    address_ar TEXT,
    city TEXT,
    city_ar TEXT,
    country TEXT,
    country_ar TEXT,
    tax_id TEXT,
    commercial_register TEXT,
    rating DECIMAL(3,2) DEFAULT 0,
    is_verified BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample suppliers
  const suppliers = [
    ['Tech Supplier', 'مورد التقنية', 'contact@techsupplier.com', '+201234567890', '123 Tech St, Cairo', '١٢٣ شارع التكنولوجيا، القاهرة', 'Cairo', 'القاهرة', 'Egypt', 'مصر', '123456789', 'CR12345', 4.5, 1, 1],
    ['Home Goods Co', 'شركة السلع المنزلية', 'info@homegoods.com', '+201987654321', '456 Home Ave, Alexandria', '٤٥٦ شارع المنزل، الإسكندرية', 'Alexandria', 'الإسكندرية', 'Egypt', 'مصر', '987654321', 'CR67890', 4.2, 1, 1]
  ];

  suppliers.forEach(supplier => {
    db.run('INSERT OR IGNORE INTO suppliers (name, name_ar, email, phone, address, address_ar, city, city_ar, country, country_ar, tax_id, commercial_register, rating, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', supplier);
  });

  // Test query
  db.all('SELECT id, name, name_ar, city, city_ar, country, country_ar, rating, is_verified FROM suppliers WHERE is_active = 1 AND is_verified = 1 ORDER BY rating DESC, name ASC', (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Suppliers:', rows);
    }
    db.close();
  });
});
