!-- Sparat SQL som till en databas "pernblog" (om den inte redan existerar), med en tabell "blog" (om den inte redan existerar) --!

SELECT 'CREATE DATABASE pernblog' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pernblog')\gexec

CREATE TABLE IF NOT EXISTS blog(
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    description VARCHAR(1600),
    created_date TIMESTAMP,
    edited_date TIMESTAMP
);