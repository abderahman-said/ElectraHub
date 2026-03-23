const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('d:/ElectraHub/database.sqlite');

db.all("PRAGMA table_info(importers);", (err, rows) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(JSON.stringify(rows, null, 2));
  db.close();
});
