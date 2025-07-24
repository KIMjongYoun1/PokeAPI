-- PokeAPI Database Schema
-- PostgreSQL 15

-- 데이터베이스 생성 
-- CREATE DATABASE pokeapi;

-- 포켓몬 테이블
CREATE TABLE IF NOT EXISTS pokemon (
    id SERIAL PRIMARY KEY,
    pokemon_id INTEGER NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    korean_name VARCHAR(50),
    base_experience INTEGER NOT NULL,
    height INTEGER NOT NULL,
    weight INTEGER NOT NULL,
    sprite_url TEXT,
    shiny_sprite_url TEXT,
    official_artwork_url TEXT,
    types TEXT, -- JSON 형태로 저장
    korean_types TEXT, -- JSON 형태로 저장
    stats TEXT, -- JSON 형태로 저장
    description TEXT,
    abilities TEXT, -- JSON 형태로 저장
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 포켓몬 이름 매핑 테이블 (한글-영문 변환 캐싱용)
CREATE TABLE IF NOT EXISTS pokemon_name_mapping (
    id SERIAL PRIMARY KEY,
    korean_name VARCHAR(50) NOT NULL,
    english_name VARCHAR(50) NOT NULL,
    pokemon_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(korean_name, english_name)
);

-- 기존 정규화된 테이블들 (참고용으로 유지, 실제 사용하지 않음)
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
CREATE INDEX IF NOT EXISTS idx_pokemon_korean_name ON pokemon(korean_name);
CREATE INDEX IF NOT EXISTS idx_pokemon_name_mapping_korean ON pokemon_name_mapping(korean_name);
CREATE INDEX IF NOT EXISTS idx_pokemon_name_mapping_english ON pokemon_name_mapping(english_name);
CREATE INDEX IF NOT EXISTS idx_pokemon_name_mapping_pokemon_id ON pokemon_name_mapping(pokemon_id);

-- 기존 정규화된 테이블 인덱스 (참고용)
CREATE INDEX IF NOT EXISTS idx_pokemon_type_name ON pokemon_type(type_name);
CREATE INDEX IF NOT EXISTS idx_pokemon_stat_name ON pokemon_stat(stat_name);

-- 테이블 생성 확인
\dt

-- 테이블 구조 확인
\d pokemon
\d pokemon_type
\d pokemon_stat
\d pokemon_ability 

-- 샘플 데이터 확인
SELECT * FROM pokemon;

-- 컬럼명 변경
ALTER TABLE pokemon RENAME COLUMN image_url TO sprite_url;
ALTER TABLE pokemon RENAME COLUMN shiny_image_url TO shiny_sprite_url;

-- 새 컬럼 추가
ALTER TABLE pokemon ADD COLUMN korean_name VARCHAR(255);
ALTER TABLE pokemon ADD COLUMN base_experience INTEGER;
ALTER TABLE pokemon ADD COLUMN official_artwork_url VARCHAR(500);
ALTER TABLE pokemon ADD COLUMN types TEXT;
ALTER TABLE pokemon ADD COLUMN korean_types TEXT;
ALTER TABLE pokemon ADD COLUMN stats TEXT;
ALTER TABLE pokemon ADD COLUMN description TEXT;
ALTER TABLE pokemon ADD COLUMN abilities TEXT;
ALTER TABLE pokemon RENAME COLUMN image_url TO sprite_url;
ALTER TABLE pokemon RENAME COLUMN shiny_image_url TO shiny_sprite_url;

  ALTER TABLE pokemon ALTER COLUMN pokemon_id DROP NOT NULL;
  ALTER TABLE pokemon ALTER COLUMN name DROP NOT NULL;

   ALTER TABLE pokemon ALTER COLUMN base_experience DROP NOT NULL;
  SELECT
    column_name,
    is_nullable
FROM
    information_schema.columns
WHERE
    table_name = 'pokemon';

SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'pokemon' AND column_name = 'base_experience';

SELECT pg_get_tabledef('pokemon'::regclass);
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'pokemon';

SELECT * FROM pokemon WHERE name = 'pidgeot';