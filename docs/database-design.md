# 데이터베이스 설계서

## 🗄️ 테이블 구조

### 1. pokemon 테이블
포켓몬 기본 정보를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | INTEGER | UNIQUE, NOT NULL | PokéAPI의 포켓몬 ID |
| name | VARCHAR(50) | NOT NULL | 포켓몬 이름 |
| korean_name | VARCHAR(50) | | 한글 이름 |
| height | INTEGER | | 키 (cm) |
| weight | INTEGER | | 몸무게 (g) |
| base_experience | INTEGER | | 기본 경험치 |
| sprite_url | VARCHAR(500) | | 기본 이미지 URL |
| shiny_sprite_url | VARCHAR(500) | | 이로치 이미지 URL |
| official_artwork_url | VARCHAR(500) | | 공식 일러스트 URL |
| description | TEXT | | 포켓몬 설명 |
| generation | INTEGER | | 출현 세대 |
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

### 5. pokemon_name_mapping 테이블
포켓몬 이름 매핑 정보를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | INTEGER | UNIQUE, NOT NULL | 포켓몬 ID |
| english_name | VARCHAR(50) | NOT NULL | 영어 이름 |
| korean_name | VARCHAR(50) | NOT NULL | 한글 이름 |

### 6. world_cup_results 테이블 (계획)
이상형 월드컵 결과를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| tournament_id | VARCHAR(255) | UNIQUE, NOT NULL | 토너먼트 고유 ID |
| title | VARCHAR(255) | NOT NULL | 월드컵 제목 |
| tournament_type | VARCHAR(50) | NOT NULL | 'vote' (이상형 투표) |
| conditions | TEXT | NOT NULL | 조건 설정 (JSON) |
| participants | TEXT | NOT NULL | 참가자 목록 (JSON) |
| final_ranking | TEXT | NOT NULL | 최종 순위 (JSON) |
| winner_id | INTEGER | NOT NULL | 우승 포켓몬 ID |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| completed_at | TIMESTAMP | NOT NULL | 완료일시 |

### 7. world_cup_statistics 테이블 (계획)
포켓몬별 이상형 월드컵 통계를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | INTEGER | UNIQUE, NOT NULL | 포켓몬 ID |
| total_participations | INTEGER | DEFAULT 0 | 총 참가 횟수 |
| total_wins | INTEGER | DEFAULT 0 | 총 우승 횟수 |
| total_top3 | INTEGER | DEFAULT 0 | TOP3 진입 횟수 |
| average_rank | DOUBLE PRECISION | DEFAULT 0.0 | 평균 순위 |
| last_updated | TIMESTAMP | NOT NULL | 마지막 업데이트 |

### 8. battle_tournament_results 테이블 (최종 단계 계획)
배틀 토너먼트 결과를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| tournament_id | VARCHAR(255) | UNIQUE, NOT NULL | 배틀 토너먼트 고유 ID |
| title | VARCHAR(255) | NOT NULL | 배틀 토너먼트 제목 |
| tournament_type | VARCHAR(50) | NOT NULL | 'battle' (배틀 토너먼트) |
| conditions | TEXT | NOT NULL | 조건 설정 (JSON) |
| participants | TEXT | NOT NULL | 참가자 목록 (JSON) |
| final_ranking | TEXT | NOT NULL | 최종 순위 (JSON) |
| winner_id | INTEGER | NOT NULL | 우승 포켓몬 ID |
| total_matches | INTEGER | NOT NULL | 총 매치 수 |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |
| completed_at | TIMESTAMP | NOT NULL | 완료일시 |

### 9. battle_results 테이블 (최종 단계 계획)
개별 배틀 결과를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| tournament_id | VARCHAR(255) | NOT NULL | 배틀 토너먼트 ID |
| match_number | INTEGER | NOT NULL | 매치 번호 |
| pokemon1_id | INTEGER | NOT NULL | 첫 번째 포켓몬 ID |
| pokemon2_id | INTEGER | NOT NULL | 두 번째 포켓몬 ID |
| winner_id | INTEGER | NOT NULL | 승자 포켓몬 ID |
| battle_log | TEXT | | 배틀 로그 (JSON) |
| type_advantage | TEXT | | 타입 상성 정보 (JSON) |
| stat_comparison | TEXT | | 스탯 비교 정보 (JSON) |
| created_at | TIMESTAMP | NOT NULL | 생성일시 |

### 10. pokemon_battle_stats 테이블 (최종 단계 계획)
포켓몬별 배틀 통계를 저장하는 테이블

| 컬럼명 | 데이터타입 | 제약조건 | 설명 |
|--------|------------|----------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 내부 ID |
| pokemon_id | INTEGER | UNIQUE, NOT NULL | 포켓몬 ID |
| total_battles | INTEGER | DEFAULT 0 | 총 배틀 횟수 |
| wins | INTEGER | DEFAULT 0 | 승리 횟수 |
| losses | INTEGER | DEFAULT 0 | 패배 횟수 |
| win_rate | DOUBLE PRECISION | DEFAULT 0.0 | 승률 |
| average_battle_score | DOUBLE PRECISION | DEFAULT 0.0 | 평균 배틀 점수 |
| last_updated | TIMESTAMP | NOT NULL | 마지막 업데이트 |

## 🔗 테이블 관계
- **pokemon** (1) ←→ (N) **pokemon_type**
- **pokemon** (1) ←→ (N) **pokemon_stat**
- **pokemon** (1) ←→ (N) **pokemon_ability**
- **pokemon** (1) ←→ (1) **pokemon_name_mapping**
- **pokemon** (1) ←→ (N) **world_cup_results** (winner_id) - 이상형 월드컵
- **pokemon** (1) ←→ (1) **world_cup_statistics** - 이상형 월드컵 통계
- **pokemon** (1) ←→ (N) **battle_tournament_results** (winner_id) - 배틀 토너먼트
- **pokemon** (1) ←→ (N) **battle_results** (pokemon1_id, pokemon2_id, winner_id) - 개별 배틀
- **pokemon** (1) ←→ (1) **pokemon_battle_stats** - 배틀 통계

## 📊 ERD (Entity Relationship Diagram)
```
pokemon (1) ──── (N) pokemon_type
    │
    ├─── (N) pokemon_stat
    │
    ├─── (N) pokemon_ability
    │
    ├─── (1) pokemon_name_mapping
    │
    ├─── (N) world_cup_results (winner) - 이상형 월드컵
    │
    ├─── (1) world_cup_statistics - 이상형 월드컵 통계
    │
    ├─── (N) battle_tournament_results (winner) - 배틀 토너먼트
    │
    ├─── (N) battle_results (pokemon1, pokemon2, winner) - 개별 배틀
    │
    └─── (1) pokemon_battle_stats - 배틀 통계
```

## 🗃️ SQL 스크립트

### 기존 테이블 생성 스크립트

```sql
-- pokemon 테이블 생성
CREATE TABLE pokemon (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id INTEGER UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    korean_name VARCHAR(50),
    height INTEGER,
    weight INTEGER,
    base_experience INTEGER,
    sprite_url VARCHAR(500),
    shiny_sprite_url VARCHAR(500),
    official_artwork_url VARCHAR(500),
    description TEXT,
    generation INTEGER,
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

-- pokemon_name_mapping 테이블 생성
CREATE TABLE pokemon_name_mapping (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id INTEGER UNIQUE NOT NULL,
    english_name VARCHAR(50) NOT NULL,
    korean_name VARCHAR(50) NOT NULL
);
```

### 월드컵 관련 테이블 생성 스크립트 (계획)

```sql
-- 이상형 월드컵 결과 테이블 생성
CREATE TABLE world_cup_results (
    id BIGSERIAL PRIMARY KEY,
    tournament_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tournament_type VARCHAR(50) NOT NULL DEFAULT 'vote', -- 'vote' (이상형 투표)
    conditions TEXT NOT NULL, -- JSON 형태로 저장
    participants TEXT NOT NULL, -- JSON 형태로 저장
    final_ranking TEXT NOT NULL, -- JSON 형태로 저장
    winner_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NOT NULL
);

-- 이상형 월드컵 통계 테이블 생성
CREATE TABLE world_cup_statistics (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id INTEGER UNIQUE NOT NULL,
    total_participations INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    total_top3 INTEGER DEFAULT 0,
    average_rank DOUBLE PRECISION DEFAULT 0.0,
    last_updated TIMESTAMP NOT NULL
);

-- 이상형 월드컵 관련 인덱스 생성
CREATE INDEX idx_world_cup_results_created_at ON world_cup_results(created_at);
CREATE INDEX idx_world_cup_results_winner_id ON world_cup_results(winner_id);
CREATE INDEX idx_world_cup_results_tournament_type ON world_cup_results(tournament_type);
CREATE INDEX idx_world_cup_statistics_average_rank ON world_cup_statistics(average_rank);
CREATE INDEX idx_world_cup_statistics_total_wins ON world_cup_statistics(total_wins);
```

### 배틀 관련 테이블 생성 스크립트 (최종 단계 계획)

```sql
-- 배틀 토너먼트 결과 테이블 생성
CREATE TABLE battle_tournament_results (
    id BIGSERIAL PRIMARY KEY,
    tournament_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    tournament_type VARCHAR(50) NOT NULL DEFAULT 'battle', -- 'battle' (배틀 토너먼트)
    conditions TEXT NOT NULL, -- JSON 형태로 저장
    participants TEXT NOT NULL, -- JSON 형태로 저장
    final_ranking TEXT NOT NULL, -- JSON 형태로 저장
    winner_id INTEGER NOT NULL,
    total_matches INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NOT NULL
);

-- 개별 배틀 결과 테이블 생성
CREATE TABLE battle_results (
    id BIGSERIAL PRIMARY KEY,
    tournament_id VARCHAR(255) NOT NULL,
    match_number INTEGER NOT NULL,
    pokemon1_id INTEGER NOT NULL,
    pokemon2_id INTEGER NOT NULL,
    winner_id INTEGER NOT NULL,
    battle_log TEXT, -- JSON 형태로 저장
    type_advantage TEXT, -- JSON 형태로 저장
    stat_comparison TEXT, -- JSON 형태로 저장
    created_at TIMESTAMP NOT NULL
);

-- 포켓몬 배틀 통계 테이블 생성
CREATE TABLE pokemon_battle_stats (
    id BIGSERIAL PRIMARY KEY,
    pokemon_id INTEGER UNIQUE NOT NULL,
    total_battles INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    win_rate DOUBLE PRECISION DEFAULT 0.0,
    average_battle_score DOUBLE PRECISION DEFAULT 0.0,
    last_updated TIMESTAMP NOT NULL
);

-- 배틀 관련 인덱스 생성
CREATE INDEX idx_battle_tournament_results_created_at ON battle_tournament_results(created_at);
CREATE INDEX idx_battle_tournament_results_winner_id ON battle_tournament_results(winner_id);
CREATE INDEX idx_battle_tournament_results_tournament_type ON battle_tournament_results(tournament_type);
CREATE INDEX idx_battle_results_tournament_id ON battle_results(tournament_id);
CREATE INDEX idx_battle_results_winner_id ON battle_results(winner_id);
CREATE INDEX idx_battle_results_created_at ON battle_results(created_at);
CREATE INDEX idx_pokemon_battle_stats_win_rate ON pokemon_battle_stats(win_rate);
CREATE INDEX idx_pokemon_battle_stats_average_score ON pokemon_battle_stats(average_battle_score);
```

## 📈 데이터 모델 예시

### 월드컵 결과 JSON 구조
```json
{
  "conditions": {
    "generation": "1",
    "type": "fire",
    "participantCount": 16
  },
  "participants": [
    {
      "id": 4,
      "name": "charmander",
      "koreanName": "파이리",
      "types": ["fire"],
      "spriteUrl": "..."
    }
  ],
  "finalRanking": [
    {
      "id": 6,
      "name": "charizard",
      "koreanName": "리자몽",
      "rank": 1
    }
  ]
}
```

### 배틀 결과 JSON 구조 (최종 단계)
```json
{
  "battleLog": [
    "피카츄가 전기 공격을 사용했습니다!",
    "파이리가 효과를 받았습니다!",
    "피카츄가 승리했습니다!"
  ],
  "typeAdvantage": {
    "pokemon1Advantage": 1.0,
    "pokemon2Advantage": 0.5,
    "advantageReason": "전기 타입이 불꽃 타입에 효과적"
  },
  "statComparison": {
    "pokemon1Total": 320,
    "pokemon2Total": 309,
    "statBreakdown": {
      "hp": {"pokemon1": 35, "pokemon2": 39},
      "attack": {"pokemon1": 55, "pokemon2": 52},
      "defense": {"pokemon1": 40, "pokemon2": 43}
    }
  }
}
```

## 🔧 데이터베이스 최적화

### 인덱스 전략
- **pokemon_id**: 포켓몬 ID 기반 조회 최적화
- **name**: 이름 기반 검색 최적화
- **generation**: 세대별 필터링 최적화
- **type_name**: 타입별 필터링 최적화
- **created_at**: 시간순 정렬 최적화
- **tournament_type**: 토너먼트 타입별 필터링 최적화
- **win_rate**: 승률 기반 정렬 최적화 (배틀 통계)

### 제약조건
- **UNIQUE 제약**: pokemon_id, tournament_id, pokemon_name_mapping.pokemon_id
- **FOREIGN KEY**: 참조 무결성 보장
- **NOT NULL**: 필수 데이터 보장
- **DEFAULT 값**: 기본값 설정으로 데이터 일관성 유지

### 데이터베이스 분리 전략
- **기존 테이블 보존**: pokemon, pokemon_type, pokemon_stat, pokemon_ability, pokemon_name_mapping
- **새로운 기능 분리**: 월드컵, 배틀 관련 테이블을 독립적으로 관리
- **성능 최적화**: 각 기능별로 최적화된 인덱스 및 쿼리 설계
- **확장성**: 새로운 기능 추가 시 기존 테이블에 영향 없이 개발 가능 