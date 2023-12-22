import Database from "better-sqlite3";

const db = new Database("messages.db");

db.exec(
  `
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userName TEXT,
        message TEXT
    )
    `
);

db.exec(`
  INSERT INTO messages (userName, message) VALUES ( 'john', 'hello')
`);
