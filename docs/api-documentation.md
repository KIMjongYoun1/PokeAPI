# API 문서

## 🌐 기본 정보
- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **인증**: 현재 미적용

## 📋 API 목록

### 1. 포켓몬 관련 API

#### 1.1 포켓몬 이름으로 검색 (구현됨)
```
GET /api/pokemon/{name}
```

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| name | String | Y | 검색할 포켓몬 이름 (예: pikachu) |

**응답 예시:**
```json
{
  "id": 1,
  "pokemonId": 25,
  "name": "pikachu",
  "koreanName": "피카츄",
  "baseExperience": 112,
  "height": 4,
  "weight": 60,
  "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "shinySpriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
  "officialArtworkUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/other/official-artwork/25.png",
  "types": ["electric"],
  "koreanTypes": ["전기"],
  "stats": [
    {
      "name": "hp",
      "baseStat": 35,
      "effort": 0
    },
    {
      "name": "attack",
      "baseStat": 55,
      "effort": 0
    },
    {
      "name": "defense",
      "baseStat": 40,
      "effort": 0
    },
    {
      "name": "special-attack",
      "baseStat": 50,
      "effort": 0
    },
    {
      "name": "special-defense",
      "baseStat": 50,
      "effort": 0
    },
    {
      "name": "speed",
      "baseStat": 90,
      "effort": 2
    }
  ],
  "description": "피카츄는 전기 포켓몬입니다.",
  "abilities": ["static", "lightning-rod"]
}
```

#### 1.2 고급 검색 (구현됨)
```
GET /api/pokemon/advanced-search
```

#### 1.3 전체 포켓몬 초기화 (구현됨)
```
POST /api/pokemon/initialize
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| limit | Integer | N | 가져올 포켓몬 수 (기본값: 1302) |
| offset | Integer | N | 시작 위치 (기본값: 0) |

**응답 예시:**
```json
{
  "successCount": 1185,
  "errorCount": 117,
  "errors": [
    "포켓몬 venusaur 상세 정보를 가져올 수 없습니다.",
    "포켓몬 charmander 상세 정보를 가져올 수 없습니다."
  ],
  "message": "초기화 완료: 성공 1185개, 실패 117개"
}
```

#### 1.4 진화체인 조회 (구현됨) - **NEW!**
```
GET /api/pokemon/{name}/evolution
```

**경로 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| name | String | Y | 진화체인을 조회할 포켓몬 이름 |

**응답 예시:**
```json
{
  "chain": {
    "species": {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
    },
    "evolution_details": [],
    "evolves_to": [
      {
        "species": {
          "name": "ivysaur",
          "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
        },
        "evolution_details": [
          {
            "min_level": 16,
            "trigger": {
              "name": "level-up",
              "url": "https://pokeapi.co/api/v2/evolution-trigger/1/"
            }
          }
        ],
        "evolves_to": [
          {
            "species": {
              "name": "venusaur",
              "url": "https://pokeapi.co/api/v2/pokemon-species/3/"
            },
            "evolution_details": [
              {
                "min_level": 32,
                "trigger": {
                  "name": "level-up",
                  "url": "https://pokeapi.co/api/v2/evolution-trigger/1/"
                }
              }
            ],
            "evolves_to": []
          }
        ]
      }
    ]
  }
}
```

### 2. 이상형 월드컵 관련 API (계획)

#### 2.1 이상형 월드컵 참가자 선정 (계획)
```
POST /api/worldcup/participants
```

**요청 본문:**
```json
{
  "generation": "1",
  "type": "fire",
  "participantCount": 16
}
```

**응답 예시:**
```json
[
  {
    "id": 4,
    "name": "charmander",
    "koreanName": "파이리",
    "types": ["fire"],
    "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    "description": "태어날 때부터 등에 불꽃이 있어, 몸과 함께 자라면서 발달한다."
  }
]
```

#### 2.2 이상형 월드컵 결과 저장 (계획)
```
POST /api/worldcup/results
```

**요청 본문:**
```json
{
  "tournamentId": "worldcup-12345",
  "title": "1세대 불꽃 타입 이상형 월드컵",
  "tournamentType": "vote", // 이상형 투표
  "conditions": {
    "generation": "1",
    "type": "fire",
    "participantCount": 16
  },
  "participants": [...],
  "finalRanking": [...],
  "winner": {
    "id": 6,
    "name": "charizard",
    "koreanName": "리자몽"
  }
}
```

#### 2.3 이상형 월드컵 결과 조회 (계획)
```
GET /api/worldcup/results/{tournamentId}
```

#### 2.4 이상형 월드컵 인기 포켓몬 통계 (계획)
```
GET /api/worldcup/statistics/popular
```

**응답 예시:**
```json
[
  {
    "pokemonId": 25,
    "pokemonName": "피카츄",
    "totalParticipations": 150,
    "totalWins": 45,
    "totalTop3": 89,
    "averageRank": 2.1,
    "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
  }
]
```

#### 2.5 최근 이상형 월드컵 결과 (계획)
```
GET /api/worldcup/results/recent
```

### 3. 배틀 토너먼트 관련 API (최종 단계 계획)

#### 3.1 배틀 토너먼트 참가자 선정 (최종 단계)
```
POST /api/battle/participants
```

**요청 본문:**
```json
{
  "generation": "1",
  "type": "fire",
  "participantCount": 16
}
```

#### 3.2 배틀 토너먼트 결과 저장 (최종 단계)
```
POST /api/battle/tournament/results
```

**요청 본문:**
```json
{
  "tournamentId": "battle-12345",
  "title": "1세대 불꽃 타입 배틀 토너먼트",
  "tournamentType": "battle", // 배틀 토너먼트
  "conditions": {
    "generation": "1",
    "type": "fire",
    "participantCount": 16
  },
  "participants": [...],
  "finalRanking": [...],
  "winner": {
    "id": 6,
    "name": "charizard",
    "koreanName": "리자몽"
  },
  "totalMatches": 15
}
```

#### 3.3 포켓몬 간 배틀 시뮬레이션 (최종 단계)
```
POST /api/battle/simulate
```

**요청 본문:**
```json
{
  "pokemon1Id": 25,
  "pokemon2Id": 4,
  "battleType": "simple" // "simple", "detailed"
}
```

**응답 예시:**
```json
{
  "winner": {
    "id": 25,
    "name": "pikachu",
    "koreanName": "피카츄"
  },
  "loser": {
    "id": 4,
    "name": "charmander",
    "koreanName": "파이리"
  },
  "typeAdvantage": {
    "pokemon1Advantage": 1.0,
    "pokemon2Advantage": 0.5,
    "advantageReason": "전기 타입이 불꽃 타입에 효과적"
  },
  "statComparison": {
    "pokemon1Total": 320,
    "pokemon2Total": 309,
    "statBreakdown": {...}
  },
  "battleLog": [
    "피카츄가 전기 공격을 사용했습니다!",
    "파이리가 효과를 받았습니다!",
    "피카츄가 승리했습니다!"
  ]
}
```

#### 3.4 배틀 토너먼트 결과 조회 (최종 단계)
```
GET /api/battle/tournament/results/{tournamentId}
```

#### 3.5 배틀 통계 조회 (최종 단계)
```
GET /api/battle/statistics/{pokemonId}
```

**응답 예시:**
```json
{
  "pokemonId": 25,
  "pokemonName": "피카츄",
  "totalBattles": 150,
  "wins": 120,
  "losses": 30,
  "winRate": 0.8,
  "averageBattleScore": 85.5,
  "strongAgainst": ["water", "flying"],
  "weakAgainst": ["ground", "grass"]
}
```

## 🔧 에러 응답 형식

### 일반적인 에러 응답
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "포켓몬을 찾을 수 없습니다: pikachu",
  "path": "/api/pokemon/pikachu"
}
```

### 검증 에러 응답
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "검증 실패",
  "errors": [
    "이름은 필수입니다",
    "이름은 2-50자 사이여야 합니다"
  ]
}
```

## 📊 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 성공 |
| 201 | 생성됨 |
| 400 | 잘못된 요청 |
| 404 | 찾을 수 없음 |
| 500 | 서버 내부 오류 |

## 🚀 사용 예시

### cURL 예시
```bash
# 포켓몬 검색
curl -X GET "http://localhost:8080/api/pokemon/pikachu"

# 고급 검색
curl -X GET "http://localhost:8080/api/pokemon/advanced-search?type=fire&minHeight=50"

# 진화체인 조회
curl -X GET "http://localhost:8080/api/pokemon/bulbasaur/evolution"

# 포켓몬 초기화
curl -X POST "http://localhost:8080/api/pokemon/initialize?limit=100"
```

### JavaScript 예시
```javascript
// 포켓몬 검색
const response = await fetch('/api/pokemon/pikachu');
const pokemon = await response.json();

// 진화체인 조회
const evolutionResponse = await fetch('/api/pokemon/bulbasaur/evolution');
const evolution = await evolutionResponse.json();
``` 