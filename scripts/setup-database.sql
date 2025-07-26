-- GreenScore Database Schema
-- Run this script to set up the database structure

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    wallet_address VARCHAR(42),
    green_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Homes table
CREATE TABLE homes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    location VARCHAR(100),
    home_type ENUM('apartment', 'house', 'condo') DEFAULT 'house',
    square_footage INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appliances table
CREATE TABLE appliances (
    id VARCHAR(36) PRIMARY KEY,
    home_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    wattage INTEGER NOT NULL,
    hours_per_day DECIMAL(4,2) DEFAULT 4.0,
    days_per_week INTEGER DEFAULT 7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (home_id) REFERENCES homes(id) ON DELETE CASCADE
);

-- Electricity bills table
CREATE TABLE electricity_bills (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_cid VARCHAR(255), -- IPFS Content ID
    upload_date DATE NOT NULL,
    billing_period VARCHAR(20),
    total_usage DECIMAL(10,2), -- kWh
    total_cost DECIMAL(10,2), -- USD
    status ENUM('processing', 'completed', 'error') DEFAULT 'processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Green tokens table
CREATE TABLE green_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(255) NOT NULL,
    tokens_awarded DECIMAL(10,2) NOT NULL,
    metadata JSON,
    transaction_hash VARCHAR(66), -- Blockchain transaction hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Energy analysis table
CREATE TABLE energy_analysis (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    analysis_date DATE NOT NULL,
    total_daily_usage DECIMAL(10,2) NOT NULL, -- kWh
    carbon_footprint DECIMAL(10,2) NOT NULL, -- kg CO2
    efficiency_score INTEGER NOT NULL, -- 0-100
    analysis_data JSON, -- Detailed analysis results
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AI tips table
CREATE TABLE ai_tips (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category VARCHAR(100) NOT NULL,
    tip_text TEXT NOT NULL,
    impact_description VARCHAR(255),
    tokens_reward INTEGER DEFAULT 0,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
    u.id,
    u.name,
    u.green_score,
    COALESCE(SUM(gt.tokens_awarded), 0) as total_tokens,
    COUNT(DISTINCT ea.id) as analysis_count,
    ROW_NUMBER() OVER (ORDER BY u.green_score DESC) as rank
FROM users u
LEFT JOIN green_tokens gt ON u.id = gt.user_id
LEFT JOIN energy_analysis ea ON u.id = ea.user_id
GROUP BY u.id, u.name, u.green_score
ORDER BY u.green_score DESC;

-- Insert sample data
INSERT INTO users (id, email, password_hash, name, wallet_address, green_score) VALUES
('user-1', 'demo@greenscore.com', '$2b$10$hash', 'Demo User', '0x742d35Cc6634C0532925a3b8D404d3aABe09e444', 1250),
('user-2', 'ecowarrior@example.com', '$2b$10$hash', 'EcoWarrior2024', '0x123...', 2850),
('user-3', 'greenguru@example.com', '$2b$10$hash', 'GreenGuru', '0x456...', 2720);

-- Insert sample home data
INSERT INTO homes (id, user_id, location, home_type, square_footage) VALUES
('home-1', 'user-1', 'California, US', 'house', 1800);

-- Insert sample appliances
INSERT INTO appliances (id, home_id, name, type, wattage, hours_per_day, days_per_week) VALUES
('app-1', 'home-1', 'Living Room AC', 'ac', 3500, 8.0, 7),
('app-2', 'home-1', 'Main Refrigerator', 'refrigerator', 150, 24.0, 7),
('app-3', 'home-1', 'Washing Machine', 'washing_machine', 2000, 1.5, 3);
