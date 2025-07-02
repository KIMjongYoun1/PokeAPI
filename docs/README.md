# PokeAPI 프로젝트

## 📋 프로젝트 개요
- **프로젝트명**: PokeAPI
- **목적**: PokéAPI를 활용한 포켓몬 정보 관리 시스템
- **기술 스택**: Spring Boot + React + PostgreSQL

## 🏗️ 아키텍처
```
PokeAPI/
├── backend/          # Spring Boot 백엔드
├── frontend/         # React 프론트엔드
├── database/         # 데이터베이스 스크립트
└── docs/            # 프로젝트 문서
```

## 🛠️ 기술 스택
### Backend
- **Java**: 17
- **Framework**: Spring Boot 3.2.0
- **Database**: PostgreSQL 15
- **ORM**: Spring Data JPA + MyBatis
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: npm

## 📊 데이터 플로우
1. **PokéAPI** → Spring Boot (데이터 수집)
2. **Spring Boot** → PostgreSQL (데이터 저장)
3. **React** → Spring Boot API (데이터 조회)
4. **사용자** → React (UI 조작)

## 🚀 개발 환경 설정
- **Backend 서버**: localhost:8080
- **Frontend 서버**: localhost:3000
- **Database**: localhost:5432

## 📚 문서 목록
- [의존성 문서](./dependencies.md)
- [데이터베이스 설계서](./database-design.md)
- [API 문서](./api-documentation.md)
- [개발 가이드](./development-guide.md) 