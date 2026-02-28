const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 1337;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database setup
const db = new sqlite3.Database('./pam.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    employee_id TEXT UNIQUE,
    department TEXT,
    position TEXT,
    access_level TEXT DEFAULT 'basic',
    status TEXT DEFAULT 'pending',
    password TEXT NOT NULL,
    last_login DATETIME,
    login_attempts INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    image_url TEXT,
    parent_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
  )`);

  // Products table
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    sku TEXT UNIQUE NOT NULL,
    barcode TEXT,
    price DECIMAL(10,2) NOT NULL,
    wholesale_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    min_order_quantity INTEGER DEFAULT 1,
    max_order_quantity INTEGER,
    stock_quantity INTEGER DEFAULT 0,
    unit TEXT DEFAULT 'piece',
    weight DECIMAL(8,3),
    dimensions TEXT,
    images TEXT,
    specifications TEXT,
    tags TEXT,
    category_id INTEGER,
    supplier_id INTEGER,
    user_id INTEGER,
    brand TEXT,
    model TEXT,
    color TEXT,
    size TEXT,
    weight_unit TEXT,
    warranty TEXT,
    material TEXT,
    features TEXT,
    moq INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Add user_id column if it doesn't exist
  db.run(`ALTER TABLE products ADD COLUMN user_id INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding user_id column:', err);
    }
  });

  // Add additional columns for home appliances
  const additionalColumns = [
    'brand TEXT',
    'model TEXT',
    'color TEXT',
    'size TEXT',
    'weight_unit TEXT',
    'warranty TEXT',
    'material TEXT',
    'features TEXT',
    'moq INTEGER DEFAULT 1',
    'origin TEXT',
    'packaging TEXT'
  ];

  additionalColumns.forEach(column => {
    db.run(`ALTER TABLE products ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${column}:`, err);
      }
    });
  });

  // Suppliers table
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

  // Customers table
  db.run(`CREATE TABLE IF NOT EXISTS customers (
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
    company_name TEXT,
    company_name_ar TEXT,
    tax_id TEXT,
    commercial_register TEXT,
    customer_type TEXT DEFAULT 'retail',
    credit_limit DECIMAL(10,2),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Orders table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    customer_id INTEGER,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    notes TEXT,
    shipping_address TEXT,
    billing_address TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
  )`);

  // Order items table
  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);

  // Roles table
  db.run(`CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    level TEXT NOT NULL,
    is_system BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Permissions table
  db.run(`CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    is_system BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User roles junction table
  db.run(`CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER,
    role_id INTEGER,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
  )`);

  // User permissions junction table
  db.run(`CREATE TABLE IF NOT EXISTS user_permissions (
    user_id INTEGER,
    permission_id INTEGER,
    PRIMARY KEY (user_id, permission_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
  )`);

  // Sessions table
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    ip_address TEXT,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT 1,
    expires_at DATETIME,
    last_activity DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Audit logs table
  db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    resource TEXT,
    resource_id TEXT,
    details TEXT,
    ip_address TEXT,
    user_agent TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'success',
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  // Insert default data
  insertDefaultData();
});

// Insert default roles, permissions, and admin user
function insertDefaultData() {
  // Default roles
  const roles = [
    ['Super Admin', 'Full system access', 'super_admin', 1],
    ['Admin', 'Administrative access', 'admin', 1],
    ['Manager', 'Manager level access', 'advanced', 1],
    ['Operator', 'Basic operational access', 'intermediate', 1],
    ['Viewer', 'Read-only access', 'basic', 1]
  ];

  roles.forEach(role => {
    db.run('INSERT OR IGNORE INTO roles (name, description, level, is_system) VALUES (?, ?, ?, ?)', role);
  });

  // Default permissions
  const permissions = [
    ['create_users', 'Create new users', 'users', 'create', 1],
    ['read_users', 'View users', 'users', 'read', 1],
    ['update_users', 'Update users', 'users', 'update', 1],
    ['delete_users', 'Delete users', 'users', 'delete', 1],
    ['create_roles', 'Create new roles', 'roles', 'create', 1],
    ['read_roles', 'View roles', 'roles', 'read', 1],
    ['update_roles', 'Update roles', 'roles', 'update', 1],
    ['delete_roles', 'Delete roles', 'roles', 'delete', 1],
    ['create_products', 'Create new products', 'products', 'create', 1],
    ['read_products', 'View products', 'products', 'read', 0],
    ['update_products', 'Update products', 'products', 'update', 1],
    ['delete_products', 'Delete products', 'products', 'delete', 1],
    ['create_categories', 'Create new categories', 'categories', 'create', 1],
    ['read_categories', 'View categories', 'categories', 'read', 0],
    ['update_categories', 'Update categories', 'categories', 'update', 1],
    ['delete_categories', 'Delete categories', 'categories', 'delete', 1],
    ['create_suppliers', 'Create new suppliers', 'suppliers', 'create', 1],
    ['read_suppliers', 'View suppliers', 'suppliers', 'read', 0],
    ['update_suppliers', 'Update suppliers', 'suppliers', 'update', 1],
    ['delete_suppliers', 'Delete suppliers', 'suppliers', 'delete', 1],
    ['create_customers', 'Create new customers', 'customers', 'create', 1],
    ['read_customers', 'View customers', 'customers', 'read', 0],
    ['update_customers', 'Update customers', 'customers', 'update', 1],
    ['delete_customers', 'Delete customers', 'customers', 'delete', 1],
    ['create_orders', 'Create new orders', 'orders', 'create', 1],
    ['read_orders', 'View orders', 'orders', 'read', 1],
    ['update_orders', 'Update orders', 'orders', 'update', 1],
    ['delete_orders', 'Delete orders', 'orders', 'delete', 1],
    ['read_sessions', 'View active sessions', 'sessions', 'read', 1],
    ['delete_sessions', 'Revoke sessions', 'sessions', 'delete', 1],
    ['read_audit_logs', 'View audit logs', 'audit_logs', 'read', 1]
  ];

  permissions.forEach(permission => {
    db.run('INSERT OR IGNORE INTO permissions (name, description, resource, action, is_system) VALUES (?, ?, ?, ?, ?)', permission);
  });

  // Create default admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.run('INSERT OR IGNORE INTO users (username, email, full_name, employee_id, department, position, access_level, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ['admin', 'admin@belgomla.com', 'System Administrator', 'ADMIN001', 'IT', 'System Administrator', 'super_admin', 'active', adminPassword]);

  // Insert sample categories
  const categories = [
    ['Electronics', 'إلكترونيات', 'Electronic devices and accessories', 'أجهزة إلكترونية وملحقاتها', null, 1, 1],
    ['Home Appliances', 'أجهزة منزلية', 'Home and kitchen appliances', 'أجهزة منزلية ومطبخ', null, 2, 1],
    ['Furniture', 'أثاث', 'Home and office furniture', 'أثاث منزلي ومكتبي', null, 3, 1],
    ['Lighting', 'إضاءة', 'Lighting fixtures and bulbs', 'مصابيح ومصادر الإضاءة', null, 4, 1]
  ];

  categories.forEach(category => {
    db.run('INSERT OR IGNORE INTO categories (name, name_ar, description, description_ar, parent_id, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)', category);
  });

  // Insert sample suppliers
  const suppliers = [
    ['Tech Supplier', 'مورد التقنية', 'contact@techsupplier.com', '+201234567890', '123 Tech St, Cairo', '١٢٣ شارع التكنولوجيا، القاهرة', 'Cairo', 'القاهرة', 'Egypt', 'مصر', '123456789', 'CR12345', 4.5, 1, 1],
    ['Home Goods Co', 'شركة السلع المنزلية', 'info@homegoods.com', '+201987654321', '456 Home Ave, Alexandria', '٤٥٦ شارع المنزل، الإسكندرية', 'Alexandria', 'الإسكندرية', 'Egypt', 'مصر', '987654321', 'CR67890', 4.2, 1, 1]
  ];

  suppliers.forEach(supplier => {
    db.run('INSERT OR IGNORE INTO suppliers (name, name_ar, email, phone, address, address_ar, city, city_ar, country, country_ar, tax_id, commercial_register, rating, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', supplier);
  });

  // Insert sample products
  setTimeout(() => {
    const products = [
      ['Laptop Pro 15"', 'لابتوب برو ١٥ بوصة', 'High-performance laptop for professionals', 'لابتوب عالي الأداء للمحترفين', 'LP001', '1234567890123', 15000, 12000, 10000, 1, 100, 50, 'piece', 2.5, '15x10x1', '["/images/laptop1.jpg", "/images/laptop2.jpg"]', '{"cpu": "Intel i7", "ram": "16GB", "storage": "512GB SSD"}', '["laptop", "computer", "professional"]', 1, 1, 1, 1],
      ['Smart TV 55"', 'تلفزيون ذكي ٥٥ بوصة', '4K Smart TV with streaming capabilities', 'تلفزيون ذكي 4K مع قدرات البث', 'TV001', '2345678901234', 8000, 6500, 5000, 1, 50, 30, 'piece', 15.0, '55x30x5', '["/images/tv1.jpg", "/images/tv2.jpg"]', '{"screen": "55 inch 4K", "smart": "Yes", "wifi": "Yes"}', '["tv", "smart", "4k"]', 2, 1, 1, 1],
      ['Office Chair', 'كرسي مكتب', 'Ergonomic office chair with lumbar support', 'كرسي مكتب مريح مع دعم قطني', 'CH001', '3456789012345', 1500, 1200, 800, 1, 200, 100, 'piece', 12.0, '60x60x100', '["/images/chair1.jpg", "/images/chair2.jpg"]', '{"material": "Mesh", "adjustable": "Yes", "color": "Black"}', '["chair", "office", "ergonomic"]', 3, 2, 1, 0],
      ['LED Desk Lamp', 'مكتب LED', 'Modern LED desk lamp with adjustable brightness', 'مكتب LED حديث مع سطوع قابل للتعديل', 'LA001', '4567890123456', 300, 250, 150, 1, 500, 200, 'piece', 1.5, '20x15x40', '["/images/lamp1.jpg", "/images/lamp2.jpg"]', '{"power": "10W", "adjustable": "Yes", "color_temp": "3000K-6000K"}', '["lamp", "LED", "desk"]', 4, 2, 1, 1]
    ];

    products.forEach(product => {
      db.run('INSERT OR IGNORE INTO products (name, name_ar, description, description_ar, sku, barcode, price, wholesale_price, cost_price, min_order_quantity, max_order_quantity, stock_quantity, unit, weight, dimensions, images, specifications, tags, category_id, supplier_id, is_active, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', product);
    });
  }, 1000);
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check permissions
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      // Super admin has access to everything
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT access_level FROM users WHERE id = ?', [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (user && user.access_level === 'super_admin') {
        return next();
      }

      // Check user permissions
      const hasPermission = await new Promise((resolve, reject) => {
        db.all(`
          SELECT p.* FROM permissions p
          JOIN user_permissions up ON p.id = up.permission_id
          WHERE up.user_id = ? AND p.resource = ? AND p.action = ?
          UNION
          SELECT p.* FROM permissions p
          JOIN roles r ON p.id = r.id
          JOIN user_roles ur ON r.id = ur.role_id
          WHERE ur.user_id = ? AND p.resource = ? AND p.action = ?
        `, [userId, resource, action, userId, resource, action], (err, rows) => {
          if (err) reject(err);
          else resolve(rows.length > 0);
        });
      });

      if (hasPermission) {
        next();
      } else {
        res.status(403).json({ error: 'Insufficient permissions' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

// Helper function to log audit events
const logAudit = (action, resource, resourceId, details, ipAddress, userAgent, userId, status = 'success') => {
  db.run('INSERT INTO audit_logs (action, resource, resource_id, details, ip_address, user_agent, user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [action, resource, resourceId, JSON.stringify(details), ipAddress, userAgent, userId, status], (err) => {
      if (err) {
        console.error('Failed to log audit event:', err);
      }
    });
};

// Routes

// Authentication
app.post('/api/auth/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  console.log('Login request received:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  console.log('Attempting login for:', username);

  try {
    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      // logAudit('LOGIN_FAILED', 'auth', null, { username, reason: 'User not found' }, ipAddress, userAgent, null, 'failure');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'active' && user.status !== 'pending') {
      // logAudit('LOGIN_FAILED', 'auth', user.id, { username, reason: 'User not active', status: user.status }, ipAddress, userAgent, user.id, 'failure');
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      // Increment login attempts
      db.run('UPDATE users SET login_attempts = login_attempts + 1 WHERE id = ?', [user.id]);
      // logAudit('LOGIN_FAILED', 'auth', user.id, { username, reason: 'Invalid password' }, ipAddress, userAgent, user.id, 'failure');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts and update last login
    db.run('UPDATE users SET login_attempts = 0, last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, access_level: user.access_level },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create session (temporarily disabled for debugging)
    // const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // db.run('INSERT INTO sessions (token, user_id, ip_address, user_agent, expires_at, last_activity) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
    //   [token, user.id, ipAddress, userAgent, expiresAt]);

    // Temporarily disable audit logging for debugging
    // logAudit('LOGIN_SUCCESS', 'auth', user.id, { username }, ipAddress, userAgent, user.id);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  db.run('UPDATE sessions SET is_active = 0 WHERE token = ?', [token]);
  logAudit('LOGOUT', 'auth', req.user.id, {}, req.ip, req.get('User-Agent'), req.user.id);

  res.json({ message: 'Logged out successfully' });
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(`
        SELECT u.id, u.username, u.email, u.full_name, u.employee_id, u.department, u.position, u.access_level, u.status, u.last_login,
               i.company_name, i.whatsapp, i.contact_email, i.category, i.description, i.website, i.address, i.city, i.country,
               i.logo_url, i.established_year, i.business_license, i.tax_id, i.is_verified, i.products_count
        FROM users u
        LEFT JOIN importers i ON u.id = i.user_id
        WHERE u.id = ?
      `, [req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user products count if importer
    if (user.access_level === 'importer') {
      const productsCount = await new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM products WHERE user_id = ? AND is_active = 1', [req.user.id], (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        });
      });

      user.products_count = productsCount;
    }

    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Users CRUD
app.get('/api/users', authenticateToken, checkPermission('users', 'read'), async (req, res) => {
  try {
    const users = await new Promise((resolve, reject) => {
      db.all('SELECT id, username, email, full_name, employee_id, department, position, access_level, status, last_login, login_attempts, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', authenticateToken, checkPermission('users', 'create'), [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, full_name, employee_id, department, position, access_level, status, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const result = await new Promise((resolve, reject) => {
      db.run('INSERT INTO users (username, email, full_name, employee_id, department, position, access_level, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [username, email, full_name, employee_id, department, position, access_level || 'basic', status || 'pending', hashedPassword], function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        });
    });

    logAudit('CREATE_USER', 'users', result.id.toString(), { username, email, full_name }, req.ip, req.get('User-Agent'), req.user.id);

    res.status(201).json({ message: 'User created successfully', userId: result.id });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});

app.delete('/api/users/:id', authenticateToken, checkPermission('users', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is trying to delete themselves
    if (existingUser.id === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    // Check if user has related products
    const hasProducts = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products WHERE user_id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count > 0);
      });
    });

    if (hasProducts) {
      return res.status(400).json({ error: 'لا يمكن حذف التاجر لأنه يمتلك منتجات بالموقع' });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve();
      });
    });

    logAudit('DELETE_USER', 'users', id, { username: existingUser.username, email: existingUser.email }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Roles CRUD
app.get('/api/roles', authenticateToken, checkPermission('roles', 'read'), async (req, res) => {
  try {
    const roles = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM roles ORDER BY level DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Permissions CRUD
app.get('/api/permissions', authenticateToken, checkPermission('permissions', 'read'), async (req, res) => {
  try {
    const permissions = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM permissions ORDER BY resource, action', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
});

// Audit logs
app.get('/api/audit-logs', authenticateToken, checkPermission('audit_logs', 'read'), async (req, res) => {
  try {
    const logs = await new Promise((resolve, reject) => {
      db.all(`
        SELECT al.*, u.username 
        FROM audit_logs al 
        LEFT JOIN users u ON al.user_id = u.id 
        ORDER BY al.timestamp DESC 
        LIMIT 100
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Sessions
app.get('/api/sessions', authenticateToken, checkPermission('sessions', 'read'), async (req, res) => {
  try {
    const sessions = await new Promise((resolve, reject) => {
      db.all(`
        SELECT s.*, u.username 
        FROM sessions s 
        LEFT JOIN users u ON s.user_id = u.id 
        WHERE s.is_active = 1 
        ORDER BY s.last_activity DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, search, min_price, max_price, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT p.*, c.name as category_name, c.name_ar as category_name_ar, s.name as supplier_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE p.is_active = 1
    `;

    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND p.is_featured = 1';
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.name_ar LIKE ? OR p.description LIKE ? OR p.description_ar LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (min_price) {
      query += ' AND p.wholesale_price >= ?';
      params.push(min_price);
    }

    if (max_price) {
      query += ' AND p.wholesale_price <= ?';
      params.push(max_price);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const products = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      tags: product.tags ? JSON.parse(product.tags) : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await new Promise((resolve, reject) => {
      db.get(`
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar, s.name as supplier_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN suppliers s ON p.supplier_id = s.id
        WHERE p.id = ? AND p.is_active = 1
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Parse JSON fields
    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      tags: product.tags ? JSON.parse(product.tags) : []
    };

    res.json(formattedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', authenticateToken, checkPermission('products', 'create'), [
  body('name').notEmpty().withMessage('Product name is required'),
  body('name_ar').notEmpty().withMessage('Arabic product name is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('price').isNumeric().withMessage('Price must be numeric'),
  body('wholesale_price').isNumeric().withMessage('Wholesale price must be numeric')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name, name_ar, description, description_ar, sku, barcode,
      price, wholesale_price, cost_price, min_order_quantity,
      max_order_quantity, stock_quantity, unit, weight, dimensions,
      images, specifications, tags, category_id, supplier_id
    } = req.body;

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO products (
          name, name_ar, description, description_ar, sku, barcode,
          price, wholesale_price, cost_price, min_order_quantity,
          max_order_quantity, stock_quantity, unit, weight, dimensions,
          images, specifications, tags, category_id, supplier_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, name_ar, description, description_ar, sku, barcode,
        price, wholesale_price, cost_price, min_order_quantity,
        max_order_quantity, stock_quantity, unit, weight, dimensions,
        JSON.stringify(images || []), JSON.stringify(specifications || {}),
        JSON.stringify(tags || []), category_id, supplier_id
      ], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    logAudit('CREATE_PRODUCT', 'products', result.id.toString(), { name, sku }, req.ip, req.get('User-Agent'), req.user.id);

    res.status(201).json({ message: 'Product created successfully', productId: result.id });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
});

app.put('/api/products/:id', authenticateToken, checkPermission('products', 'update'), [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('name_ar').optional().notEmpty().withMessage('Arabic product name cannot be empty'),
  body('sku').optional().notEmpty().withMessage('SKU cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be numeric'),
  body('wholesale_price').optional().isNumeric().withMessage('Wholesale price must be numeric')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const {
      name, name_ar, description, description_ar, sku, barcode,
      price, wholesale_price, cost_price, min_order_quantity,
      max_order_quantity, stock_quantity, unit, weight, dimensions,
      images, specifications, tags, category_id, supplier_id, is_active, is_featured
    } = req.body;

    // Check if product exists
    const existingProduct = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name); }
      if (name_ar !== undefined) { updates.push('name_ar = ?'); values.push(name_ar); }
      if (description !== undefined) { updates.push('description = ?'); values.push(description); }
      if (description_ar !== undefined) { updates.push('description_ar = ?'); values.push(description_ar); }
      if (sku !== undefined) { updates.push('sku = ?'); values.push(sku); }
      if (barcode !== undefined) { updates.push('barcode = ?'); values.push(barcode); }
      if (price !== undefined) { updates.push('price = ?'); values.push(price); }
      if (wholesale_price !== undefined) { updates.push('wholesale_price = ?'); values.push(wholesale_price); }
      if (cost_price !== undefined) { updates.push('cost_price = ?'); values.push(cost_price); }
      if (min_order_quantity !== undefined) { updates.push('min_order_quantity = ?'); values.push(min_order_quantity); }
      if (max_order_quantity !== undefined) { updates.push('max_order_quantity = ?'); values.push(max_order_quantity); }
      if (stock_quantity !== undefined) { updates.push('stock_quantity = ?'); values.push(stock_quantity); }
      if (unit !== undefined) { updates.push('unit = ?'); values.push(unit); }
      if (weight !== undefined) { updates.push('weight = ?'); values.push(weight); }
      if (dimensions !== undefined) { updates.push('dimensions = ?'); values.push(dimensions); }
      if (images !== undefined) { updates.push('images = ?'); values.push(JSON.stringify(images)); }
      if (specifications !== undefined) { updates.push('specifications = ?'); values.push(JSON.stringify(specifications)); }
      if (tags !== undefined) { updates.push('tags = ?'); values.push(JSON.stringify(tags)); }
      if (category_id !== undefined) { updates.push('category_id = ?'); values.push(category_id); }
      if (supplier_id !== undefined) { updates.push('supplier_id = ?'); values.push(supplier_id); }
      if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }
      if (is_featured !== undefined) { updates.push('is_featured = ?'); values.push(is_featured); }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updates.length === 1) {
        resolve({ changes: 0 });
        return;
      }

      db.run(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(400).json({ error: 'No changes made' });
    }

    logAudit('UPDATE_PRODUCT', 'products', id, { name, sku }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
});

app.delete('/api/products/:id', authenticateToken, checkPermission('products', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await new Promise((resolve, reject) => {
      db.get('SELECT name, sku FROM products WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    logAudit('DELETE_PRODUCT', 'products', id, { name: existingProduct.name, sku: existingProduct.sku }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, 
               (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as product_count
        FROM categories c 
        WHERE c.is_active = 1 
        ORDER BY c.sort_order ASC, c.name ASC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const category = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ? AND is_active = 1', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

app.post('/api/categories', authenticateToken, checkPermission('categories', 'create'), [
  body('name').notEmpty().withMessage('Category name is required'),
  body('name_ar').notEmpty().withMessage('Arabic category name is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, name_ar, description, description_ar, image_url, parent_id, sort_order } = req.body;

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO categories (name, name_ar, description, description_ar, image_url, parent_id, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [name, name_ar, description, description_ar, image_url, parent_id, sort_order || 0], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    logAudit('CREATE_CATEGORY', 'categories', result.id.toString(), { name, name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.status(201).json({ message: 'Category created successfully', categoryId: result.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', authenticateToken, checkPermission('categories', 'update'), [
  body('name').optional().notEmpty().withMessage('Category name cannot be empty'),
  body('name_ar').optional().notEmpty().withMessage('Arabic category name cannot be empty')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, name_ar, description, description_ar, image_url, parent_id, sort_order, is_active } = req.body;

    // Check if category exists
    const existingCategory = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name); }
      if (name_ar !== undefined) { updates.push('name_ar = ?'); values.push(name_ar); }
      if (description !== undefined) { updates.push('description = ?'); values.push(description); }
      if (description_ar !== undefined) { updates.push('description_ar = ?'); values.push(description_ar); }
      if (image_url !== undefined) { updates.push('image_url = ?'); values.push(image_url); }
      if (parent_id !== undefined) { updates.push('parent_id = ?'); values.push(parent_id); }
      if (sort_order !== undefined) { updates.push('sort_order = ?'); values.push(sort_order); }
      if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updates.length === 1) {
        resolve({ changes: 0 });
        return;
      }

      db.run(`UPDATE categories SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(400).json({ error: 'No changes made' });
    }

    logAudit('UPDATE_CATEGORY', 'categories', id, { name, name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', authenticateToken, checkPermission('categories', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await new Promise((resolve, reject) => {
      db.get('SELECT name, name_ar FROM categories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has products
    const productCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (productCount > 0) {
      return res.status(400).json({ error: 'Cannot delete category with existing products' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM categories WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    logAudit('DELETE_CATEGORY', 'categories', id, { name: existingCategory.name, name_ar: existingCategory.name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Suppliers API
app.get('/api/suppliers', authenticateToken, checkPermission('suppliers', 'read'), async (req, res) => {
  try {
    const suppliers = await new Promise((resolve, reject) => {
      db.all(`
        SELECT s.*, 
               (SELECT COUNT(*) FROM products WHERE supplier_id = s.id AND is_active = 1) as product_count
        FROM suppliers s 
        WHERE s.is_active = 1 
        ORDER BY s.name ASC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Public supplier info (without authentication)
app.get('/api/public/suppliers', async (req, res) => {
  try {
    const suppliers = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, name_ar, city, city_ar, country, country_ar, rating, is_verified
        FROM suppliers 
        WHERE is_active = 1 AND is_verified = 1 
        ORDER BY rating DESC, name ASC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

app.post('/api/suppliers', authenticateToken, checkPermission('suppliers', 'create'), [
  body('name').notEmpty().withMessage('Supplier name is required'),
  body('name_ar').notEmpty().withMessage('Arabic supplier name is required'),
  body('email').isEmail().optional().withMessage('Invalid email format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name, name_ar, email, phone, address, address_ar,
      city, city_ar, country, country_ar, tax_id,
      commercial_register, rating, is_verified
    } = req.body;

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO suppliers (
          name, name_ar, email, phone, address, address_ar,
          city, city_ar, country, country_ar, tax_id,
          commercial_register, rating, is_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, name_ar, email, phone, address, address_ar,
        city, city_ar, country, country_ar, tax_id,
        commercial_register, rating || 0, is_verified || 0
      ], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    logAudit('CREATE_SUPPLIER', 'suppliers', result.id.toString(), { name, name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.status(201).json({ message: 'Supplier created successfully', supplierId: result.id });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create supplier' });
    }
  }
});

app.get('/api/suppliers/:id', authenticateToken, checkPermission('suppliers', 'read'), async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await new Promise((resolve, reject) => {
      db.get(`
        SELECT s.*, 
               (SELECT COUNT(*) FROM products WHERE supplier_id = s.id AND is_active = 1) as product_count
        FROM suppliers s 
        WHERE s.id = ? AND s.is_active = 1
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

app.put('/api/suppliers/:id', authenticateToken, checkPermission('suppliers', 'update'), [
  body('name').optional().notEmpty().withMessage('Supplier name cannot be empty'),
  body('name_ar').optional().notEmpty().withMessage('Arabic supplier name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const {
      name, name_ar, email, phone, address, address_ar,
      city, city_ar, country, country_ar, tax_id,
      commercial_register, rating, is_verified, is_active
    } = req.body;

    // Check if supplier exists
    const existingSupplier = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM suppliers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name); }
      if (name_ar !== undefined) { updates.push('name_ar = ?'); values.push(name_ar); }
      if (email !== undefined) { updates.push('email = ?'); values.push(email); }
      if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
      if (address !== undefined) { updates.push('address = ?'); values.push(address); }
      if (address_ar !== undefined) { updates.push('address_ar = ?'); values.push(address_ar); }
      if (city !== undefined) { updates.push('city = ?'); values.push(city); }
      if (city_ar !== undefined) { updates.push('city_ar = ?'); values.push(city_ar); }
      if (country !== undefined) { updates.push('country = ?'); values.push(country); }
      if (country_ar !== undefined) { updates.push('country_ar = ?'); values.push(country_ar); }
      if (tax_id !== undefined) { updates.push('tax_id = ?'); values.push(tax_id); }
      if (commercial_register !== undefined) { updates.push('commercial_register = ?'); values.push(commercial_register); }
      if (rating !== undefined) { updates.push('rating = ?'); values.push(rating); }
      if (is_verified !== undefined) { updates.push('is_verified = ?'); values.push(is_verified); }
      if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updates.length === 1) {
        resolve({ changes: 0 });
        return;
      }

      db.run(`UPDATE suppliers SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(400).json({ error: 'No changes made' });
    }

    logAudit('UPDATE_SUPPLIER', 'suppliers', id, { name, name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update supplier' });
    }
  }
});

app.delete('/api/suppliers/:id', authenticateToken, checkPermission('suppliers', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if supplier exists
    const existingSupplier = await new Promise((resolve, reject) => {
      db.get('SELECT name, name_ar FROM suppliers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    // Check if supplier has products
    const productCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products WHERE supplier_id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (productCount > 0) {
      return res.status(400).json({ error: 'Cannot delete supplier with existing products' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM suppliers WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    logAudit('DELETE_SUPPLIER', 'suppliers', id, { name: existingSupplier.name, name_ar: existingSupplier.name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

// Orders API
app.get('/api/orders', authenticateToken, checkPermission('orders', 'read'), async (req, res) => {
  try {
    const { status, customer_id, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT o.*, c.name as customer_name, u.username as created_by_username
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN users u ON o.created_by = u.id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += ' AND o.status = ?';
      params.push(status);
    }

    if (customer_id) {
      query += ' AND o.customer_id = ?';
      params.push(customer_id);
    }

    query += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const orders = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders', authenticateToken, checkPermission('orders', 'create'), [
  body('customer_id').notEmpty().withMessage('Customer ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.product_id').notEmpty().withMessage('Product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customer_id, items, notes, shipping_address, billing_address, payment_method } = req.body;

    // Generate order number
    const order_number = 'ORD' + Date.now();

    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      const product = await new Promise((resolve, reject) => {
        db.get('SELECT wholesale_price FROM products WHERE id = ? AND is_active = 1', [item.product_id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!product) {
        return res.status(400).json({ error: `Product with ID ${item.product_id} not found` });
      }

      total_amount += product.wholesale_price * item.quantity;
    }

    // Create order
    const orderResult = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO orders (
          order_number, customer_id, total_amount, notes, 
          shipping_address, billing_address, payment_method, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [order_number, customer_id, total_amount, notes, shipping_address, billing_address, payment_method, req.user.id], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    // Create order items
    for (const item of items) {
      const product = await new Promise((resolve, reject) => {
        db.get('SELECT wholesale_price FROM products WHERE id = ?', [item.product_id], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      const unit_price = product.wholesale_price;
      const total_price = unit_price * item.quantity;

      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
          VALUES (?, ?, ?, ?, ?)
        `, [orderResult.id, item.product_id, item.quantity, unit_price, total_price], function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        });
      });
    }

    logAudit('CREATE_ORDER', 'orders', orderResult.id.toString(), { order_number, total_amount }, req.ip, req.get('User-Agent'), req.user.id);

    res.status(201).json({ message: 'Order created successfully', orderId: orderResult.id, order_number });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.get('/api/orders/:id', authenticateToken, checkPermission('orders', 'read'), async (req, res) => {
  try {
    const { id } = req.params;

    const order = await new Promise((resolve, reject) => {
      db.get(`
        SELECT o.*, c.name as customer_name, c.email as customer_email, u.username as created_by_username
        FROM orders o
        LEFT JOIN customers c ON o.customer_id = c.id
        LEFT JOIN users u ON o.created_by = u.id
        WHERE o.id = ?
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Get order items
    const orderItems = await new Promise((resolve, reject) => {
      db.all(`
        SELECT oi.*, p.name, p.name_ar, p.sku
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [id], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({ ...order, items: orderItems });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

app.put('/api/orders/:id', authenticateToken, checkPermission('orders', 'update'), [
  body('status').optional().isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('payment_status').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { status, payment_status, notes, shipping_address, billing_address } = req.body;

    // Check if order exists
    const existingOrder = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const updates = [];
      const values = [];

      if (status !== undefined) { updates.push('status = ?'); values.push(status); }
      if (payment_status !== undefined) { updates.push('payment_status = ?'); values.push(payment_status); }
      if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
      if (shipping_address !== undefined) { updates.push('shipping_address = ?'); values.push(shipping_address); }
      if (billing_address !== undefined) { updates.push('billing_address = ?'); values.push(billing_address); }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updates.length === 1) {
        resolve({ changes: 0 });
        return;
      }

      db.run(`UPDATE orders SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(400).json({ error: 'No changes made' });
    }

    logAudit('UPDATE_ORDER', 'orders', id, { status, payment_status }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

app.delete('/api/orders/:id', authenticateToken, checkPermission('orders', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if order exists
    const existingOrder = await new Promise((resolve, reject) => {
      db.get('SELECT order_number, total_amount FROM orders WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete order items first
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM order_items WHERE order_id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    // Delete order
    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM orders WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    logAudit('DELETE_ORDER', 'orders', id, { order_number: existingOrder.order_number, total_amount: existingOrder.total_amount }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Customers API
app.get('/api/customers', authenticateToken, checkPermission('customers', 'read'), async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT c.*, 
             (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as order_count
      FROM customers c 
      WHERE c.is_active = 1
    `;

    const params = [];

    if (search) {
      query += ' AND (c.name LIKE ? OR c.name_ar LIKE ? OR c.email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY c.created_at DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const customers = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/api/customers/:id', authenticateToken, checkPermission('customers', 'read'), async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await new Promise((resolve, reject) => {
      db.get(`
        SELECT c.*, 
               (SELECT COUNT(*) FROM orders WHERE customer_id = c.id) as order_count
        FROM customers c 
        WHERE c.id = ? AND c.is_active = 1
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

app.post('/api/customers', authenticateToken, checkPermission('customers', 'create'), [
  body('name').notEmpty().withMessage('Customer name is required'),
  body('name_ar').notEmpty().withMessage('Arabic customer name is required'),
  body('email').isEmail().optional().withMessage('Invalid email format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      name, name_ar, email, phone, address, address_ar,
      city, city_ar, country, country_ar, company_name,
      company_name_ar, tax_id, commercial_register, customer_type, credit_limit
    } = req.body;

    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO customers (
          name, name_ar, email, phone, address, address_ar,
          city, city_ar, country, country_ar, company_name,
          company_name_ar, tax_id, commercial_register, customer_type, credit_limit
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, name_ar, email, phone, address, address_ar,
        city, city_ar, country, country_ar, company_name,
        company_name_ar, tax_id, commercial_register, customer_type || 'retail', credit_limit
      ], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    logAudit('CREATE_CUSTOMER', 'customers', result.id.toString(), { name, name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.status(201).json({ message: 'Customer created successfully', customerId: result.id });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  }
});

app.put('/api/customers/:id', authenticateToken, checkPermission('customers', 'update'), [
  body('name').optional().notEmpty().withMessage('Customer name cannot be empty'),
  body('name_ar').optional().notEmpty().withMessage('Arabic customer name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const {
      name, name_ar, email, phone, address, address_ar,
      city, city_ar, country, country_ar, company_name,
      company_name_ar, tax_id, commercial_register, customer_type, credit_limit, is_active
    } = req.body;

    // Check if customer exists
    const existingCustomer = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const result = await new Promise((resolve, reject) => {
      const updates = [];
      const values = [];

      if (name !== undefined) { updates.push('name = ?'); values.push(name); }
      if (name_ar !== undefined) { updates.push('name_ar = ?'); values.push(name_ar); }
      if (email !== undefined) { updates.push('email = ?'); values.push(email); }
      if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
      if (address !== undefined) { updates.push('address = ?'); values.push(address); }
      if (address_ar !== undefined) { updates.push('address_ar = ?'); values.push(address_ar); }
      if (city !== undefined) { updates.push('city = ?'); values.push(city); }
      if (city_ar !== undefined) { updates.push('city_ar = ?'); values.push(city_ar); }
      if (country !== undefined) { updates.push('country = ?'); values.push(country); }
      if (country_ar !== undefined) { updates.push('country_ar = ?'); values.push(country_ar); }
      if (company_name !== undefined) { updates.push('company_name = ?'); values.push(company_name); }
      if (company_name_ar !== undefined) { updates.push('company_name_ar = ?'); values.push(company_name_ar); }
      if (tax_id !== undefined) { updates.push('tax_id = ?'); values.push(tax_id); }
      if (commercial_register !== undefined) { updates.push('commercial_register = ?'); values.push(commercial_register); }
      if (customer_type !== undefined) { updates.push('customer_type = ?'); values.push(customer_type); }
      if (credit_limit !== undefined) { updates.push('credit_limit = ?'); values.push(credit_limit); }
      if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      if (updates.length === 1) {
        resolve({ changes: 0 });
        return;
      }

      db.run(`UPDATE customers SET ${updates.join(', ')} WHERE id = ?`, values, function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(400).json({ error: 'No changes made' });
    }

    logAudit('UPDATE_CUSTOMER', 'customers', id, { name, name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update customer' });
    }
  }
});

app.delete('/api/customers/:id', authenticateToken, checkPermission('customers', 'delete'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const existingCustomer = await new Promise((resolve, reject) => {
      db.get('SELECT name, name_ar FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!existingCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Check if customer has orders
    const orderCount = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders WHERE customer_id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    if (orderCount > 0) {
      return res.status(400).json({ error: 'Cannot delete customer with existing orders' });
    }

    const result = await new Promise((resolve, reject) => {
      db.run('DELETE FROM customers WHERE id = ?', [id], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    logAudit('DELETE_CUSTOMER', 'customers', id, { name: existingCustomer.name, name_ar: existingCustomer.name_ar }, req.ip, req.get('User-Agent'), req.user.id);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Cycle/Carousel API
app.get('/api/cycle/featured-products', async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1 AND (p.is_featured = 1 OR p.stock_quantity > 20)
        ORDER BY p.created_at DESC
        LIMIT 8
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

app.get('/api/cycle/promotions', async (req, res) => {
  try {
    // Mock promotions data - in real app this would come from database
    const promotions = [
      {
        id: 1,
        title: 'تخفيضات الصيف الكبرى',
        description: 'خصومات تصل إلى 50% على الأجهزة المنزلية',
        discount: 50,
        image_url: '/promotions/summer-sale.jpg',
        start_date: '2026-06-01',
        end_date: '2026-08-31',
        is_active: 1
      },
      {
        id: 2,
        title: 'عروف الإلكترونيات الحصرية',
        description: 'أفضل الأسعار على اللابتوبات والتلفزيونات',
        discount: 30,
        image_url: '/promotions/electronics.jpg',
        start_date: '2026-07-01',
        end_date: '2026-07-31',
        is_active: 1
      },
      {
        id: 3,
        title: 'تخفيضات الأثاث المكتبي',
        description: 'تجهيز مكتبك بأسعار مميزة',
        discount: 25,
        image_url: '/promotions/furniture.jpg',
        start_date: '2026-07-15',
        end_date: '2026-08-15',
        is_active: 1
      }
    ];

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

app.get('/api/cycle/categories', async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all(`
        SELECT c.*, 
               (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as product_count
        FROM categories c 
        WHERE c.is_active = 1 
        ORDER BY c.sort_order ASC, c.name ASC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/cycle/banners', async (req, res) => {
  try {
    // Mock banner data - in real app this would come from database
    const banners = [
      {
        id: 1,
        title: 'شحن مجاني للطلبات فوق 1000 جنيه',
        subtitle: 'توصيل سريع لجميع أنحاء مصر',
        image_url: '/banners/free-shipping.jpg',
        link: '/products',
        is_active: 1
      },
      {
        id: 2,
        title: 'ضمان الجودة 100%',
        subtitle: 'منتجات أصلية مع ضمان لمدة سنة',
        image_url: '/banners/quality-guarantee.jpg',
        link: '/about',
        is_active: 1
      },
      {
        id: 3,
        title: 'دعم فني على مدار الساعة',
        subtitle: 'فريق متخصص لمساعدتك في أي وقت',
        image_url: '/banners/24-7-support.jpg',
        link: '/contact',
        is_active: 1
      }
    ];

    res.json(banners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// Trust Badges API
app.get('/api/trust-badges', async (req, res) => {
  try {
    const badges = [
      {
        id: 1,
        title: 'أسعار الجملة المباشرة',
        description: 'وفر تكاليف الوسطاء واحصل على أفضل أسعار المصنع والمستوردين مباشرة لحساب مؤسستك.',
        icon: 'trending-up',
        color: 'brand',
        is_active: 1,
        sort_order: 1
      },
      {
        id: 2,
        title: 'موردون موثقون',
        description: 'نحن نضمن جودة الموردين من خلال فحص دقيق للتراخيص والسجلات التجارية والقدرة الإنتاجية.',
        icon: 'award',
        color: 'yellow-600',
        is_active: 1,
        sort_order: 2
      },
      {
        id: 3,
        title: 'دعم لوجستي متكامل',
        description: 'نظام متقدم لتتبع الشحنات وإدارة الطلبات الكبيرة لضمان وصول بضاعتك في الموعد المحدد.',
        icon: 'shopping-bag',
        color: 'brand',
        is_active: 1,
        sort_order: 3
      }
    ];

    res.json(badges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trust badges' });
  }
});

// Register API
app.post('/api/auth/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('full_name').notEmpty().withMessage('Full name is required')
], async (req, res) => {
  console.log('Register request received:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, full_name } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.get('User-Agent');

  console.log('Attempting registration for:', email);

  try {
    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create user
    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO users (username, email, password, full_name, access_level, status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [username, email, hashedPassword, full_name, 'basic', 'pending'], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    console.log('User created successfully:', result.id);

    // Temporarily disable audit logging
    // logAudit('USER_REGISTER', 'auth', result.id.toString(), { username, email }, ipAddress, userAgent, result.id);

    res.status(201).json({
      message: 'Registration successful! Please wait for account activation.',
      userId: result.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Dashboard Overview API
app.get('/api/dashboard/overview', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Run all queries simultaneously
    const [productsResult, ordersResult, revenueResult] = await Promise.all([
      // Total Products (Active belonging to user)
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM products WHERE user_id = ? AND is_active = 1', [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
      // Active Orders (Not delivered, cancelled, returned - where user's products are ordered)
      new Promise((resolve, reject) => {
        db.get(`
          SELECT COUNT(DISTINCT o.id) as count 
          FROM orders o 
          JOIN order_items oi ON o.id = oi.order_id 
          JOIN products p ON oi.product_id = p.id 
          WHERE p.user_id = ? AND o.status NOT IN ('delivered', 'cancelled', 'returned')
        `, [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      }),
      // Total Revenue (From all non-cancelled orders of user's products)
      new Promise((resolve, reject) => {
        db.get(`
          SELECT SUM(oi.total_price) as total 
          FROM order_items oi 
          JOIN orders o ON oi.order_id = o.id 
          JOIN products p ON oi.product_id = p.id 
          WHERE p.user_id = ? AND o.status != 'cancelled'
        `, [userId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      })
    ]);

    res.json({
      totalProducts: productsResult?.count || 0,
      activeOrders: ordersResult?.count || 0,
      totalRevenue: revenueResult?.total || 0,
      profileViews: 0 // Currently not tracked in DB
    });

  } catch (error) {
    console.error('Failed to fetch dashboard overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview data' });
  }
});

// Dashboard Products API
app.get('/api/dashboard/products', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const products = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.user_id = ? AND p.is_active = 1
        ORDER BY p.created_at DESC
      `, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const formattedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Failed to fetch dashboard products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/dashboard/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const product = await new Promise((resolve, reject) => {
      db.get(`
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.user_id = ? AND p.is_active = 1
      `, [id, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formattedProduct = {
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/dashboard/products', authenticateToken, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('image').optional().custom((value) => {
    if (!value) return true;

    // Check if it's a data URL (base64)
    if (typeof value === 'string' && value.startsWith('data:image/')) {
      // Remove data:image/ prefix and get the base64 part
      const base64Data = value.split(',')[1];
      if (!base64Data) return false;

      // Calculate size in bytes
      const sizeInBytes = Math.floor(base64Data.length * 0.75);
      const sizeInMB = sizeInBytes / (1024 * 1024);

      // Limit to 2MB
      if (sizeInMB > 2) {
        throw new Error('Image size must be less than 2MB');
      }
    }

    return true;
  }).withMessage('Image must be less than 2MB')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const productData = req.body;

    // Find category ID
    const category = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM categories WHERE name = ? OR name_ar = ?', [productData.category, productData.category], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const result = await new Promise((resolve, reject) => {
      const sku = 'PRD-' + Date.now() + Math.floor(Math.random() * 1000);
      db.run(`
        INSERT INTO products (
          name, name_ar, sku, price, wholesale_price, description, category_id, user_id, 
          images, moq, brand, model, color, size, weight, warranty, material, 
          features, origin, packaging, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        productData.name,
        productData.name,
        sku,
        productData.price,
        productData.price,
        productData.desc || '',
        category?.id || null,
        userId,
        JSON.stringify(productData.image ? [productData.image] : []),
        productData.moq || 1,
        productData.brand || '',
        productData.model || '',
        productData.color || '',
        productData.size || '',
        productData.weight || '',
        productData.warranty || '',
        productData.material || '',
        productData.features || '',
        productData.origin || '',
        productData.packaging || ''
      ], function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    res.status(201).json({
      message: 'Product created successfully',
      productId: result.id
    });
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/dashboard/products/:id', authenticateToken, [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const userId = req.user.id;
    const productData = req.body;

    // Find category ID
    const category = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM categories WHERE name = ? OR name_ar = ?', [productData.category, productData.category], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const result = await new Promise((resolve, reject) => {
      db.run(`
        UPDATE products SET 
          name = ?, name_ar = ?, price = ?, wholesale_price = ?, description = ?, category_id = ?, 
          images = ?, moq = ?, brand = ?, model = ?, color = ?, 
          size = ?, weight = ?, warranty = ?, material = ?, features = ?,
          origin = ?, packaging = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
      `, [
        productData.name,
        productData.name,
        productData.price,
        productData.price,
        productData.desc || '',
        category?.id || null,
        JSON.stringify(productData.image ? [productData.image] : []),
        productData.moq || 1,
        productData.brand || '',
        productData.model || '',
        productData.color || '',
        productData.size || '',
        productData.weight || '',
        productData.warranty || '',
        productData.material || '',
        productData.features || '',
        productData.origin || '',
        productData.packaging || '',
        id,
        userId
      ], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Failed to update product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/dashboard/products/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await new Promise((resolve, reject) => {
      db.run('UPDATE products SET is_active = 0 WHERE id = ? AND user_id = ?', [id, userId], function (err) {
        if (err) reject(err);
        else resolve({ changes: this.changes });
      });
    });

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PAM Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/api/health`);
  console.log(`🔑 Default admin credentials: admin / admin123`);
});

module.exports = app;
