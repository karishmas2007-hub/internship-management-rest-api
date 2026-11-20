const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Create database connection
const db = new sqlite3.Database(
    path.join(__dirname, "internships.db"),
    (err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
        } else {
            console.log("Connected to SQLite database!");
        }
    }
);

// Create internships table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS internships (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            domain TEXT NOT NULL,
            mode TEXT NOT NULL,
            location TEXT NOT NULL,
            skills TEXT NOT NULL,
            openings INTEGER NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error("Table creation failed:", err.message);
        } else {
            console.log("Internships table created successfully!");
        }
    });
});

module.exports = db;