const db = require('./database');

// Migrate lifts table
db.serialize(() => {
    // Create new lifts table with created_at column
    db.run(`
        CREATE TABLE IF NOT EXISTS lifts_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            lift_type TEXT NOT NULL,
            weight REAL NOT NULL,
            reps INTEGER NOT NULL,
            rpe REAL NOT NULL,
            notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // Copy data from old table to new table
    db.run(`
        INSERT INTO lifts_new (id, user_id, lift_type, weight, reps, rpe, notes, created_at)
        SELECT id, user_id, lift_type, weight, reps, rpe, notes, CURRENT_TIMESTAMP
        FROM lifts
    `, (err) => {
        if (err) {
            console.error('Error copying data to new lifts table:', err);
        } else {
            console.log('Copied data to new lifts table');
            
            // Drop old table
            db.run('DROP TABLE lifts', (err) => {
                if (err) {
                    console.error('Error dropping old lifts table:', err);
                } else {
                    console.log('Dropped old lifts table');
                    
                    // Rename new table to lifts
                    db.run('ALTER TABLE lifts_new RENAME TO lifts', (err) => {
                        if (err) {
                            console.error('Error renaming new lifts table:', err);
                        } else {
                            console.log('Successfully migrated lifts table');
                        }
                    });
                }
            });
        }
    });
});

// Add created_at column to users table if it doesn't exist
db.run(`
    ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP
`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('created_at column already exists in users table');
        } else {
            console.error('Error adding created_at column to users table:', err);
        }
    } else {
        console.log('Added created_at column to users table');
    }
});

// Add date column to one_rep_max table if it doesn't exist
db.run(`
    ALTER TABLE one_rep_max ADD COLUMN date DATETIME DEFAULT CURRENT_TIMESTAMP
`, (err) => {
    if (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('date column already exists in one_rep_max table');
        } else {
            console.error('Error adding date column to one_rep_max table:', err);
        }
    } else {
        console.log('Added date column to one_rep_max table');
    }
}); 