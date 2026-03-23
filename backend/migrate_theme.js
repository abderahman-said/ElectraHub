const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('d:/ElectraHub/database.sqlite');

db.serialize(() => {
  db.run("ALTER TABLE importers ADD COLUMN theme_color TEXT DEFAULT '#1d4ed8'", (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('Column theme_color already exists.');
      } else {
        console.error('Error adding theme_color:', err.message);
      }
    } else {
      console.log('Column theme_color added successfully.');
    }
  });
});

db.close();
