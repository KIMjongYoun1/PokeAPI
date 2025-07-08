-- PokeAPI Database Schema
-- PostgreSQL 15

-- 데이터베이스 생성 
-- CREATE DATABASE pokeapi;

-- pokemon 테이블 생성
CREATE TABLE IF NOT EXISTS pokemon (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    height INTEGER,
    weight INTEGER,
    image_url VARCHAR(500),
    shiny_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- pokemon_type 테이블 생성
CREATE TABLE IF NOT EXISTS pokemon_type (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id BIGINT REFERENCES pokemon(id) ON DELETE CASCADE,
    type_name VARCHAR(20) NOT NULL,
    slot INTEGER NOT NULL
);

-- pokemon_stat 테이블 생성
CREATE TABLE IF NOT EXISTS pokemon_stat (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id BIGINT REFERENCES pokemon(id) ON DELETE CASCADE,
    stat_name VARCHAR(20) NOT NULL,
    base_stat INTEGER NOT NULL,
    effort INTEGER DEFAULT 0
);

-- pokemon_ability 테이블 생성
CREATE TABLE IF NOT EXISTS pokemon_ability (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id BIGINT REFERENCES pokemon(id) ON DELETE CASCADE,
    ability_name VARCHAR(50) NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    slot INTEGER NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_pokemon_name ON pokemon(name);
CREATE INDEX IF NOT EXISTS idx_pokemon_type_name ON pokemon_type(type_name);
CREATE INDEX IF NOT EXISTS idx_pokemon_stat_name ON pokemon_stat(stat_name);

-- 컬럼추가
ALTER TABLE pokemon ADD COLUMN korean_name VARCHAR(255);
SELECT DATABASE();

-- 테이블 생성 확인
\dt

-- 테이블 구조 확인
\d pokemon
\d pokemon_type
\d pokemon_stat
\d pokemon_ability 

select * from pokemon