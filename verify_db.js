const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'backend', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking database at:', dbPath);

db.all("PRAGMA table_info(users)", (err, rows) => {
    if (err) console.error('Error users:', err);
    else console.log('Users columns:', rows.map(r => r.name).join(', '));
    
    db.all("PRAGMA table_info(customers)", (err, rows) => {
        if (err) console.error('Error customers:', err);
        else console.log('Customers columns:', rows.map(r => r.name).join(', '));
        db.close();
    });
});
