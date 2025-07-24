# 데이터베이스 설계서

## 🗄️ 테이블 구조

### 1. pokemon 테이블
포켓몬 기본 정보를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | INTEGER | UNIQUE, NOT NULL | PokéAPI의 포켓몬 ID |
| name | VARCHAR(50) | NOT NULL | 포켓몬 이름 |
| height | INTEGER | | 키 (cm) |
| weight | INTEGER | | 몸무게 (g) |
| image_url | VARCHAR(500) | | 기본 이미지 URL |
| shiny_image_url | VARCHAR(500) | | 이로치 이미지 URL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 생성일시 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 수정일시 |

### 2. pokemon_type 테이블
포켓몬의 타입 정보를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | BIGINT | FOREIGN KEY | pokemon 테이블 참조 |
| type_name | VARCHAR(20) | NOT NULL | 타입명 (fire, water 등) |
| slot | INTEGER | NOT NULL | 타입 슬롯 (1, 2) |

### 3. pokemon_stat 테이블
포켓몬의 능력치 정보를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | BIGINT | FOREIGN KEY | pokemon 테이블 참조 |
| stat_name | VARCHAR(20) | NOT NULL | 능력치명 (hp, attack 등) |
| base_stat | INTEGER | NOT NULL | 기본 능력치 |
| effort | INTEGER | DEFAULT 0 | 노력치 |

### 4. pokemon_ability 테이블
포켓몬의 능력(특성) 정보를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | BIGINT | FOREIGN KEY | pokemon 테이블 참조 |
| ability_name | VARCHAR(50) | NOT NULL | 능력명 |
| is_hidden | BOOLEAN | DEFAULT FALSE | 숨겨진 능력 여부 |
| slot | INTEGER | NOT NULL | 능력 슬롯 |

## 🔗 테이블 관계
- **pokemon** (1) ←→ (N) **pokemon_type**
- **pokemon** (1) ←→ (N) **pokemon_stat**
- **pokemon** (1) ←→ (N) **pokemon_ability**

## 📊 ERD (Entity Relationship Diagram)
```
pokemon (1) ──── (N) pokemon_type
    │
    ├─── (N) pokemon_stat
    │
    └─── (N) pokemon_ability
```

## 🗃️ SQL 스크립트

### 테이블 생성 스크립트

```sql
-- pokemon 테이블 생성
CREATE TABLE pokemon (
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
CREATE TABLE pokemon_type (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id BIGINT REFERENCES pokemon(id) ON DELETE CASCADE,
    type_name VARCHAR(20) NOT NULL,
    slot INTEGER NOT NULL
);

-- pokemon_stat 테이블 생성
CREATE TABLE pokemon_stat (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id BIGINT REFERENCES pokemon(id) ON DELETE CASCADE,
    stat_name VARCHAR(20) NOT NULL,
    base_stat INTEGER NOT NULL,
    effort INTEGER DEFAULT 0
);

-- pokemon_ability 테이블 생성
CREATE TABLE pokemon_ability (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id BIGINT REFERENCES pokemon(id) ON DELETE CASCADE,
    ability_name VARCHAR(50) NOT NULL,
    is_hidden BOOLEAN DEFAULT FALSE,
    slot INTEGER NOT NULL
);

-- 인덱스 생성
CREATE INDEX idx_pokemon_name ON pokemon(name);
CREATE INDEX idx_pokemon_type_name ON pokemon_type(type_name);
CREATE INDEX idx_pokemon_stat_name ON pokemon_stat(stat_name);
```

### 샘플 데이터 삽입

```sql
-- 포켓몬 데이터 삽입 예시
INSERT INTO pokemon (pokemon_id, name, height, weight, image_url, shiny_image_url) 
VALUES (25, 'pikachu', 4, 60, 
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png');

-- 타입 데이터 삽입 예시
INSERT INTO pokemon_type (pokemon_id, type_name, slot) 
VALUES (1, 'electric', 1);

-- 능력치 데이터 삽입 예시
INSERT INTO pokemon_stat (pokemon_id, stat_name, base_stat, effort) 
VALUES (1, 'speed', 90, 0);
```

## 📈 성능 최적화

### 인덱스 전략
- **pokemon.name**: 이름 검색 최적화
- **pokemon_type.type_name**: 타입별 검색 최적화
- **pokemon_stat.stat_name**: 능력치별 검색 최적화

### 파티셔닝 전략
- **pokemon_id 기준**: 1000단위로 파티셔닝 고려
- **타입 기준**: 자주 조회되는 타입별 파티셔닝

## 🔍 주요 쿼리 예시

### 포켓몬 목록 조회
```sql
SELECT p.*, 
       array_agg(DISTINCT pt.type_name) as types,
       array_agg(DISTINCT ps.stat_name || ':' || ps.base_stat) as stats
FROM pokemon p
LEFT JOIN pokemon_type pt ON p.id = pt.pokemon_id
LEFT JOIN pokemon_stat ps ON p.id = ps.pokemon_id
GROUP BY p.id
ORDER BY p.pokemon_id;
```

### 타입별 포켓몬 조회
```sql
SELECT p.* 
FROM pokemon p
JOIN pokemon_type pt ON p.id = pt.pokemon_id
WHERE pt.type_name = 'fire';
``` 

## 🗄️ 실제 운영 DB 및 스크립트 적용 주의사항
- Spring Boot 및 모든 SQL/JPA 쿼리는 pokeapi DB에 연결됨 (application.properties 참고)
- database/schema.sql, sample-data.sql 등은 pokeapi DB에 직접 실행해야 실제 데이터와 구조가 일치함
- DB 툴, IDE 등에서 pokeapi DB로 연결해서 확인/적용할 것 

## 🖥️ 프론트엔드 주요 컴포넌트와 DB 구조 활용 예시
- **EvolutionChain, EvolutionChainTree**: pokemon, pokemon_type, pokemon_stat 등 테이블을 활용해 진화 트리 시각화 (구현 완료)
- **StatComparisonChart**: pokemon_stat 테이블을 활용해 능력치 비교 (구현 완료)
- **PokemonGrid, PokemonCard**: pokemon, pokemon_type 등 테이블을 활용해 전체 목록 및 상세 정보 표시 (구현 완료) 