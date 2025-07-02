# API 문서

## 🌐 기본 정보
- **Base URL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **인증**: 현재 미적용

## 📋 API 목록

### 1. 포켓몬 관련 API

#### 1.1 포켓몬 목록 조회
```
GET /api/pokemon
```

**요청 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| page | Integer | N | 페이지 번호 (기본값: 0) |
| size | Integer | N | 페이지 크기 (기본값: 20) |
| type | String | N | 타입 필터링 |
| search | String | N | 이름 검색 |

**응답 예시:**
```json
{
  "content": [
    {
      "id": 1,
      "pokemonId": 25,
      "name": "pikachu",
      "height": 4,
      "weight": 60,
      "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
      "shinyImageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
      "types": ["electric"],
      "stats": {
        "hp": 35,
        "attack": 55,
        "defense": 40,
        "special-attack": 50,
        "special-defense": 50,
        "speed": 90
      }
    }
  ],
  "totalElements": 1000,
  "totalPages": 50,
  "currentPage": 0,
  "size": 20
}
```

#### 1.2 포켓몬 상세 조회
```
GET /api/pokemon/{id}
```

**경로 파라미터:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| id | Integer | 포켓몬 ID |

**응답 예시:**
```json
{
  "id": 1,
  "pokemonId": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60,
  "imageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
  "shinyImageUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png",
  "types": [
    {
      "name": "electric",
      "slot": 1
    }
  ],
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
    }
  ],
  "abilities": [
    {
      "name": "static",
      "isHidden": false,
      "slot": 1
    },
    {
      "name": "lightning-rod",
      "isHidden": true,
      "slot": 3
    }
  ]
}
```

#### 1.3 포켓몬 이름으로 검색
```
GET /api/pokemon/search?name={name}
```

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| name | String | Y | 검색할 포켓몬 이름 |

### 2. 타입 관련 API

#### 2.1 타입별 포켓몬 조회
```
GET /api/pokemon/type/{typeName}
```

**경로 파라미터:**
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| typeName | String | 타입명 (fire, water, electric 등) |

### 3. 데이터 동기화 API

#### 3.1 PokéAPI에서 데이터 동기화
```
POST /api/pokemon/sync
```

**요청 바디:**
```json
{
  "startId": 1,
  "endId": 151
}
```

**응답 예시:**
```json
{
  "message": "동기화가 완료되었습니다.",
  "syncedCount": 151,
  "duration": "2분 30초"
}
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

### Postman Collection
```json
{
  "info": {
    "name": "PokeAPI",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "포켓몬 목록 조회",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/pokemon"
      }
    },
    {
      "name": "포켓몬 상세 조회",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/pokemon/25"
      }
    }
  ]
}
```

### cURL 예시
```bash
# 포켓몬 목록 조회
curl -X GET "http://localhost:8080/api/pokemon"

# 포켓몬 상세 조회
curl -X GET "http://localhost:8080/api/pokemon/25"

# 포켓몬 검색
curl -X GET "http://localhost:8080/api/pokemon/search?name=pikachu"
``` 