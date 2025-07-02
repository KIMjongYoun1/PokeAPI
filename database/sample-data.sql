-- PokeAPI Sample Data
-- PostgreSQL 15

-- 샘플 포켓몬 데이터 삽입
INSERT INTO pokemon (pokemon_id, name, height, weight, image_url, shiny_image_url) VALUES
(25, 'pikachu', 4, 60, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png'),
(1, 'bulbasaur', 7, 69,
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png'),
(4, 'charmander', 6, 85,
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png'),
(7, 'squirtle', 5, 90,
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png')
ON CONFLICT (pokemon_id) DO NOTHING;

-- 샘플 타입 데이터 삽입
INSERT INTO pokemon_type (pokemon_id, type_name, slot) VALUES
(1, 'grass', 1),
(1, 'poison', 2),
(2, 'fire', 1),
(3, 'water', 1),
(4, 'electric', 1)
ON CONFLICT DO NOTHING;

-- 샘플 능력치 데이터 삽입
INSERT INTO pokemon_stat (pokemon_id, stat_name, base_stat, effort) VALUES
(1, 'hp', 45, 0),
(1, 'attack', 49, 0),
(1, 'defense', 49, 0),
(1, 'special-attack', 65, 1),
(1, 'special-defense', 65, 0),
(1, 'speed', 45, 0),
(2, 'hp', 39, 0),
(2, 'attack', 52, 0),
(2, 'defense', 43, 0),
(2, 'special-attack', 60, 0),
(2, 'special-defense', 50, 0),
(2, 'speed', 65, 1),
(3, 'hp', 44, 0),
(3, 'attack', 48, 0),
(3, 'defense', 65, 1),
(3, 'special-attack', 50, 0),
(3, 'special-defense', 64, 0),
(3, 'speed', 43, 0),
(4, 'hp', 35, 0),
(4, 'attack', 55, 0),
(4, 'defense', 40, 0),
(4, 'special-attack', 50, 0),
(4, 'special-defense', 50, 0),
(4, 'speed', 90, 2)
ON CONFLICT DO NOTHING;

-- 샘플 능력 데이터 삽입
INSERT INTO pokemon_ability (pokemon_id, ability_name, is_hidden, slot) VALUES
(1, 'overgrow', false, 1),
(1, 'chlorophyll', true, 3),
(2, 'blaze', false, 1),
(2, 'solar-power', true, 3),
(3, 'torrent', false, 1),
(3, 'rain-dish', true, 3),
(4, 'static', false, 1),
(4, 'lightning-rod', true, 3)
ON CONFLICT DO NOTHING;

-- 데이터 확인 쿼리
SELECT 'Pokemon Count' as info, COUNT(*) as count FROM pokemon
UNION ALL
SELECT 'Type Count', COUNT(*) FROM pokemon_type
UNION ALL
SELECT 'Stat Count', COUNT(*) FROM pokemon_stat
UNION ALL
SELECT 'Ability Count', COUNT(*) FROM pokemon_ability; 