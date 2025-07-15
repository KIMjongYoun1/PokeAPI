-- PokeAPI Sample Data
-- PostgreSQL 15 (새로운 스키마에 맞게 수정)

-- 샘플 포켓몬 데이터 삽입 (JSON 형태로 저장)
INSERT INTO pokemon (
    pokemon_id, name, korean_name, base_experience, height, weight, 
    sprite_url, shiny_sprite_url, official_artwork_url,
    types, korean_types, stats, description, abilities
) VALUES
(25, 'pikachu', '피카츄', 112, 4, 60, 
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/25.png',
 '["electric"]',
 '["전기"]',
 '[{"name":"hp","baseStat":35,"effort":0},{"name":"attack","baseStat":55,"effort":0},{"name":"defense","baseStat":40,"effort":0},{"name":"special-attack","baseStat":50,"effort":0},{"name":"special-defense","baseStat":50,"effort":0},{"name":"speed","baseStat":90,"effort":2}]',
 '피카츄는 전기 포켓몬입니다. 볼을 흔들면 전기를 모읍니다.',
 '["static","lightning-rod"]'),

(1, 'bulbasaur', '이상해씨', 64, 7, 69,
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/1.png',
 '["grass","poison"]',
 '["풀","독"]',
 '[{"name":"hp","baseStat":45,"effort":0},{"name":"attack","baseStat":49,"effort":0},{"name":"defense","baseStat":49,"effort":0},{"name":"special-attack","baseStat":65,"effort":1},{"name":"special-defense","baseStat":65,"effort":0},{"name":"speed","baseStat":45,"effort":0}]',
 '이상해씨는 풀/독 타입 포켓몬입니다. 등에 씨앗이 있습니다.',
 '["overgrow","chlorophyll"]'),

(4, 'charmander', '파이리', 62, 6, 85,
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/4.png',
 '["fire"]',
 '["불꽃"]',
 '[{"name":"hp","baseStat":39,"effort":0},{"name":"attack","baseStat":52,"effort":0},{"name":"defense","baseStat":43,"effort":0},{"name":"special-attack","baseStat":60,"effort":0},{"name":"special-defense","baseStat":50,"effort":0},{"name":"speed","baseStat":65,"effort":1}]',
 '파이리는 불꽃 타입 포켓몬입니다. 꼬리에서 불꽃이 타오릅니다.',
 '["blaze","solar-power"]'),

(7, 'squirtle', '꼬부기', 63, 5, 90,
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png',
 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/7.png',
 '["water"]',
 '["물"]',
 '[{"name":"hp","baseStat":44,"effort":0},{"name":"attack","baseStat":48,"effort":0},{"name":"defense","baseStat":65,"effort":1},{"name":"special-attack","baseStat":50,"effort":0},{"name":"special-defense","baseStat":64,"effort":0},{"name":"speed","baseStat":43,"effort":0}]',
 '꼬부기는 물 타입 포켓몬입니다. 등껍질을 이용해 방어합니다.',
 '["torrent","rain-dish"]')

ON CONFLICT (pokemon_id) DO NOTHING;

-- 기존 정규화된 테이블 샘플 데이터 (참고용으로 유지)
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

-- JSON 데이터 확인
SELECT pokemon_id, name, types, stats, abilities FROM pokemon LIMIT 3; 