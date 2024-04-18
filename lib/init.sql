-- Create addresses table first 
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(255)
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
    role VARCHAR(50) DEFAULT 'user'
);

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

CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    user_query TEXT,
    spread_type VARCHAR(255),
    ai_interpretation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE cards_in_readings (
    id SERIAL PRIMARY KEY,
    reading_id INTEGER REFERENCES readings(id),
    card_name VARCHAR(255),
    orientation VARCHAR(50),
    position INTEGER,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
