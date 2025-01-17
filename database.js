const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "budget.db");
const db = new sqlite3.Database(dbPath);

// Create the bills table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL
    )
  `);
});

function addBill(name, amount, type) {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO bills (name, amount, type) VALUES (?, ?, ?)",
      [name, amount, type],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

function getBills() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM bills", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function editBill(id, newName, newAmount) {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE bills SET name = ?, amount = ? WHERE id = ?",
      [newName, newAmount, id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

function deleteBill(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM bills WHERE id = ?", [id], function (err) {
      if (err) reject(err);
      else resolve(this.changes);
    });
  });
}

module.exports = { addBill, getBills, editBill, deleteBill };