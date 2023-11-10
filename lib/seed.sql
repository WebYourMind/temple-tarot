CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    email_verified TIMESTAMPTZ,
    image TEXT
);

CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    expires TIMESTAMPTZ NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
 refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    id_token TEXT,
    scope TEXT,
    session_state TEXT,
    token_type TEXT
);

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
    analytical DECIMAL(3,2) CHECK (analytical >= 0 AND analytical <= 1),
    creative DECIMAL(3,2) CHECK (creative >= 0 AND creative <= 1),
    practical DECIMAL(3,2) CHECK (practical >= 0 AND practical <= 1),
    reflective DECIMAL(3,2) CHECK (reflective >= 0 AND reflective <= 1),
    interpersonal DECIMAL(3,2) CHECK (interpersonal >= 0 AND interpersonal <= 1),
    logical DECIMAL(3,2) CHECK (logical >= 0 AND logical <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    report TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- other useful queries for development
DELETE FROM chat_messages;
