-- Create users table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create lifts table
CREATE TABLE lifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lift_type TEXT NOT NULL CHECK (lift_type IN ('bench', 'squat', 'deadlift')),
    weight DECIMAL(5,2) NOT NULL,
    reps INTEGER NOT NULL,
    rpe DECIMAL(3,1) NOT NULL CHECK (rpe >= 1 AND rpe <= 10),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create one_rep_max table
CREATE TABLE one_rep_max (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    lift_type TEXT NOT NULL CHECK (lift_type IN ('bench', 'squat', 'deadlift')),
    projected_1rm DECIMAL(5,2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better query performance
CREATE INDEX idx_lifts_user_id ON lifts(user_id);
CREATE INDEX idx_lifts_date ON lifts(date);
CREATE INDEX idx_one_rep_max_user_id ON one_rep_max(user_id);
CREATE INDEX idx_one_rep_max_date ON one_rep_max(date); 