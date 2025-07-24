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

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| type | String | N | 포켓몬 타입 (예: Electric, Fire) |
| minHeight | Integer | N | 최소 키 (cm) |
| maxHeight | Integer | N | 최대 키 (cm) |
| minWeight | Integer | N | 최소 몸무게 (g) |
| maxWeight | Integer | N | 최대 몸무게 (g) |
| minAttack | Integer | N | 최소 공격력 |
| maxAttack | Integer | N | 최대 공격력 |
| minDefense | Integer | N | 최소 방어력 |
| maxDefense | Integer | N | 최대 방어력 |
| minHp | Integer | N | 최소 HP |
| maxHp | Integer | N | 최대 HP |
| minSpeed | Integer | N | 최소 속도 |
| maxSpeed | Integer | N | 최대 속도 |

**응답 예시:**
```json
[
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
    "stats": [...],
    "description": "피카츄는 전기 포켓몬입니다.",
    "abilities": ["static", "lightning-rod"]
  }
]
```

#### 1.3 전체 포켓몬 목록 조회 (구현됨)
```
GET /api/pokemon/all
```

**응답 예시:**
```json
[
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
    "stats": [...],
    "description": "피카츄는 전기 포켓몬입니다.",
    "abilities": ["static", "lightning-rod"]
}
]
```

#### 1.4 포켓몬 검색 (쿼리 파라미터) (구현됨)
```
GET /api/pokemon/search?name={name}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| name | String | Y | 검색할 포켓몬 이름 |

**응답 예시:** (1.1과 동일한 PokemonDTO 구조)

### 2. 구현 예정 API

#### 2.1 포켓몬 상세 조회 (ID 기반)
```
GET /api/pokemon/{id}
```

#### 2.2 타입별 포켓몬 조회
```
GET /api/pokemon/type/{typeName}
```

#### 2.3 데이터 동기화
```
POST /api/pokemon/sync
```

## 🔧 에러 응답

### 400 Bad Request
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "잘못된 요청입니다.",
  "path": "/api/pokemon"
}
```

### 404 Not Found
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "포켓몬을 찾을 수 없습니다.",
  "path": "/api/pokemon/9999"
}
```

### 500 Internal Server Error
```json
{
  "timestamp": "2024-01-01T12:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "서버 내부 오류가 발생했습니다.",
  "path": "/api/pokemon"
}
```

## 📊 상태 코드

| 상태 코드 | 설명 |
|-----------|------|
| 200 | 성공 |
| 201 | 생성됨 |
| 400 | 잘못된 요청 |
| 404 | 리소스를 찾을 수 없음 |
| 500 | 서버 내부 오류 |

## 🔍 API 테스트

### cURL 예시

#### 포켓몬 이름으로 검색
```bash
curl -X GET "http://localhost:8080/api/pokemon/pikachu" \
  -H "Content-Type: application/json"
```

#### 고급 검색
```bash
curl -X GET "http://localhost:8080/api/pokemon/advanced-search?type=Electric&minHeight=1&maxHeight=10" \
  -H "Content-Type: application/json"
```

#### 전체 포켓몬 목록
```bash
curl -X GET "http://localhost:8080/api/pokemon/all" \
  -H "Content-Type: application/json"
```

#### 쿼리 파라미터로 검색
```bash
curl -X GET "http://localhost:8080/api/pokemon/search?name=pikachu" \
  -H "Content-Type: application/json"
```

## 📝 구현 현황

### ✅ 현재 구현 완료
- 포켓몬 이름으로 검색 (`GET /api/pokemon/{name}`)
- 고급 검색 (`GET /api/pokemon/advanced-search`)
- 전체 포켓몬 목록 조회 (`GET /api/pokemon/all`)
- 쿼리 파라미터 검색 (`GET /api/pokemon/search?name={name}`)

### 📄 구현 예정 기능
- 포켓몬 ID로 상세 조회
- 타입별 포켓몬 조회
- 데이터 동기화 API
- 페이지네이션 지원

## 🚀 성능 최적화

### ✅ 현재 적용된 최적화
- **데이터베이스 캐싱**: 외부 API 호출 결과를 DB에 저장
- **조건부 API 호출**: DB에 없을 때만 외부 API 호출
- **스트림 기반 필터링**: 고급 검색에서 메모리 효율적 처리
- **입력값 유효성 검사**: 정규식을 통한 입력 검증

### 🔄 개선 예정 사항
- **Redis 캐싱**: 자주 조회되는 데이터 캐싱
- **페이징**: 대용량 데이터 처리
- **인덱스 최적화**: 데이터베이스 쿼리 성능 향상 

## 🖥️ 프론트엔드 주요 컴포넌트와 API 연동 예시
- **EvolutionChain, EvolutionChainTree**: /api/pokemon/{name}/evolution-chain API를 활용해 진화 트리 시각화 (구현 완료)
- **StatComparisonChart**: /api/pokemon/advanced-search 등으로 여러 포켓몬의 능력치 비교 (구현 완료)
- **PokemonGrid, PokemonCard**: /api/pokemon/all, /api/pokemon/{name} 등으로 전체 목록 및 상세 정보 표시 (구현 완료) 