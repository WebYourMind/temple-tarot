-- Create the addresses table first 
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(255)
);

-- Create teams table without the foreign key constraint on admin_id
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    invite_token VARCHAR(255),
    invite_token_expiry TIMESTAMPTZ,
    admin_id INTEGER, -- Notice admin_id is declared but without REFERENCES
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image TEXT
);

-- Create users table, including team_id with REFERENCES to teams(id)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    email_verified TIMESTAMPTZ,
    image TEXT,
    address_id INTEGER REFERENCES addresses(id),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'user',
    team_id INTEGER REFERENCES teams(id)
);

-- Add the foreign key constraint to teams.admin_id after users table creation
ALTER TABLE teams
ADD CONSTRAINT fk_admin_id
FOREIGN KEY (admin_id) REFERENCES users(id);

-- Create the rest of the tables as before
CREATE TABLE verification_tokens (
    identifier TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    token TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE password_reset_tokens (
    user_id INTEGER REFERENCES users(id) NOT NULL,
    token TEXT NOT NULL PRIMARY KEY,
    expires TIMESTAMPTZ NOT NULL
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'user' or 'assistant'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    explore NUMERIC(5,2),
    "analyze" NUMERIC(5,2),
    design NUMERIC(5,2),
    optimize NUMERIC(5,2),
    "connect" NUMERIC(5,2),
    nurture NUMERIC(5,2),
    energize NUMERIC(5,2),
    achieve NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    scores_id INTEGER NOT NULL REFERENCES scores(id),
    report TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_reports (
    id SERIAL PRIMARY KEY,
    report TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    team_id INTEGER REFERENCES teams(id)
);
