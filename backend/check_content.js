const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('d:/ElectraHub/database.sqlite');

db.all("SELECT * FROM importers WHERE user_id = 1", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Importers for user 1:', JSON.stringify(rows, null, 2));
  
  db.all("SELECT * FROM users WHERE id = 1", (err, urows) => {
    console.log('User 1:', JSON.stringify(urows, null, 2));
    db.close();
  });
});
