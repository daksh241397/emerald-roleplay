-- -----------------------------------------------------
-- Forum System Database Schema (Consolidated)
-- -----------------------------------------------------

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EMERALDEX idx_username (username),
    EMERALDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
    user_id BIGINT PRIMARY KEY,
    remember_me BOOLEAN DEFAULT FALSE,
    theme VARCHAR(20) DEFAULT 'dark',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
    id VARCHAR(50) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    character_name VARCHAR(100) NOT NULL,
    discord_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    EMERALDEX idx_user_id (user_id),
    EMERALDEX idx_discord_id (discord_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User permissions
CREATE TABLE IF NOT EXISTS user_permissions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    can_create_thread BOOLEAN DEFAULT TRUE,
    can_create_post BOOLEAN DEFAULT TRUE,
    can_edit_own BOOLEAN DEFAULT TRUE,
    can_delete_own BOOLEAN DEFAULT FALSE,
    can_pin_thread BOOLEAN DEFAULT FALSE,
    can_lock_thread BOOLEAN DEFAULT FALSE,
    can_moderate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Forum threads
CREATE TABLE IF NOT EXISTS forum_threads (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending_review', 'approved', 'on_consideration', 'rejected') DEFAULT 'pending_review',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    EMERALDEX idx_category_pinned (category_id, is_pinned),
    EMERALDEX idx_user (user_id),
    EMERALDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    thread_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES forum_threads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    EMERALDEX idx_thread (thread_id),
    EMERALDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Forum categories
CREATE TABLE IF NOT EXISTS forum_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_id BIGINT NULL,
    category_type ENUM('main', 'sub', 'section') NOT NULL DEFAULT 'main',
    status ENUM('active', 'archived', 'hidden') NOT NULL DEFAULT 'active',
    order_position INT NOT NULL DEFAULT 0,
    is_new BOOLEAN DEFAULT FALSE,
    thread_count INT NOT NULL DEFAULT 0,
    post_count INT NOT NULL DEFAULT 0,
    last_thread_id BIGINT NULL,
    last_post_id BIGINT NULL,
    last_post_at TIMESTAMP NULL,
    last_post_user_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    EMERALDEX idx_order (order_position),
    EMERALDEX idx_parent (parent_id),
    EMERALDEX idx_type (category_type),
    EMERALDEX idx_status (status),
    EMERALDEX idx_hierarchy (parent_id, order_position),
    FOREIGN KEY (parent_id) REFERENCES forum_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (last_thread_id) REFERENCES forum_threads(id) ON DELETE SET NULL,
    FOREIGN KEY (last_post_id) REFERENCES forum_posts(id) ON DELETE SET NULL,
    FOREIGN KEY (last_post_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    activity TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    EMERALDEX idx_user_id (user_id),
    EMERALDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Data Seeding for Forum Categories
-- -----------------------------------------------------

-- Main Categories
INSERT IGNORE INTO forum_categories (name, description, parent_id, category_type, order_position) VALUES
('Server Rules', 'Official server rules and guidelines', NULL, 'main', 1),
('Complaints', 'Report issues and concerns', NULL, 'main', 2),
('Applications', 'Apply for staff and leadership positions', NULL, 'main', 3),
('State Organizations', 'Official state and government organizations', NULL, 'main', 4),
('The Ghetto', 'Gang and criminal organization discussions', NULL, 'main', 5),
('Private Organizations', 'Private business and organization discussions', NULL, 'main', 6),
('Role Play Biographies', 'Character biographies and stories', NULL, 'main', 7),
('Global Events', 'Server-wide events and announcements', NULL, 'main', 8);

-- Sub Categories (Dynamic Insert via Join)
INSERT INTO forum_categories (name, description, parent_id, category_type, order_position)
SELECT 
    sub.name,
    sub.description,
    p.id as parent_id,
    'sub' as category_type,
    sub.order_position
FROM (
    -- Complaints sub-categories
    SELECT 'Player Complaints' as name, 'Report issues with other players' as description,
           'Complaints' as parent_name, 1 as order_position
    UNION ALL
    SELECT 'Staff Complaints', 'Report issues with administrators and assistants',
           'Complaints', 2
    -- Applications sub-categories
    UNION ALL
    SELECT 'Admin Applications', 'Apply for administrator position',
           'Applications', 1
    UNION ALL
    SELECT 'Leader Applications', 'Apply for leadership positions',
           'Applications', 2
) sub
JOIN forum_categories p ON p.name = sub.parent_name;
