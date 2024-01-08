CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    email_verified TIMESTAMPTZ,
    image TEXT,
    address_id INTEGER REFERENCES addresses(id),
    phone VARCHAR(20)
    role VARCHAR(50) DEFAULT 'user';
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    postal_code VARCHAR(20),
    country VARCHAR(255)
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

CREATE TABLE thinking_style_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    explorer DECIMAL(3,2) CHECK (explorer >= 0 AND explorer <= 1),
    planner DECIMAL(3,2) CHECK (planner >= 0 AND planner <= 1),
    energizer DECIMAL(3,2) CHECK (energizer >= 0 AND energizer <= 1),
    connector DECIMAL(3,2) CHECK (connector >= 0 AND connector <= 1),
    expert DECIMAL(3,2) CHECK (expert >= 0 AND expert <= 1),
    optimizer DECIMAL(3,2) CHECK (optimizer >= 0 AND optimizer <= 1),
    producer DECIMAL(3,2) CHECK (producer >= 0 AND producer <= 1),
    coach DECIMAL(3,2) CHECK (coach >= 0 AND coach <= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    scores_id INTEGER NOT NULL REFERENCES scores(id),
    ts_scores_id INTEGER NOT NULL REFERENCES thinking_style_scores(id),
    report TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    invite_token VARCHAR(255),
    invite_token_expiry TIMESTAMPTZ,
    admin_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image TEXT
);

CREATE SEQUENCE team_report_id_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO MAXVALUE
    CACHE 1;

 create table team_reports
 (
     id integer default nextval('team_report_id_seq'::regclass) not null
         constraint table_name_pk
             primary key,
     report     text,
     created_at timestamp with time zone default CURRENT_TIMESTAMP,
     team_id    integer
         constraint table_name_teams_id_fk
             references teams
 );

-- other useful queries for development


DELETE FROM scores;
DROP TABLE scores CASCADE;
