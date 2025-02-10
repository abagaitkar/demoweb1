const db = require('./connection');

// Create a "users" table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `);

    console.log('Users table created or already exists.');

    // Insert sample data
    db.run(`
        INSERT INTO users (name, email)
        VALUES
        ('Alice', 'alice@example.com'),
        ('Bob', 'bob@example.com')
    `, (err) => {
        if (err) {
            console.log('Sample data already exists.');
        } else {
            console.log('Sample data inserted.');
        }
    });
});

db.close();
