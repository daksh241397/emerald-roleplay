CREATE DATABASE IF NOT EXISTS emerald_rp;
USE emerald_rp;

CREATE TABLE IF NOT EXISTS whitelist_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  discord_id VARCHAR(255) NOT NULL,
  steam_id VARCHAR(255) NOT NULL,
  age VARCHAR(10) NOT NULL,
  rp_experience TEXT NOT NULL,
  motivation TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 