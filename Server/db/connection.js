const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Absolute path to your SQLite database file
const dbPath = path.join(__dirname, '..', 'Files', 'product_codes.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite3:', err.message);
        return;
    }
    console.log('Connected to SQLite3 database:', dbPath);
});

module.exports = db;
