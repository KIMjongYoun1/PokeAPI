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

## ✅ 개발 완료 현황

### Backend (완료)
- ✅ Spring Boot 프로젝트 설정
- ✅ PostgreSQL 데이터베이스 연결
- ✅ Pokemon 엔티티 및 DTO 정의
- ✅ PokemonService (단일 검색, 고급 검색, 외부 API 호출)
- ✅ PokemonController (REST API 엔드포인트)
- ✅ WebClient 설정 (외부 PokéAPI 호출)
- ✅ 데이터베이스 스키마 설계 및 구현

### Frontend (진행 중)
- ✅ React + TypeScript 프로젝트 설정
- ✅ 기본 프로젝트 구조
- ✅ TypeScript 타입 정의 (PokemonDTO, StatDTO 등)
- ✅ API 호출 로직 (단일 검색, 고급 검색)
- ✅ 상태 관리 (로딩, 에러, 검색 결과 등)

#### 컴포넌트 분리 현황
- ✅ **PokemonCard**: 포켓몬 상세 정보 표시 컴포넌트
- ✅ **SearchForm**: 단일 검색 폼 컴포넌트
- ✅ **SearchModeSelector**: 검색 모드 선택 컴포넌트
- ✅ **AdvancedSearchForm**: 고급 검색 폼 컴포넌트
- ✅ **LoadingSpinner**: 로딩 상태 표시 컴포넌트
- ✅ **ErrorMessage**: 에러 메시지 표시 컴포넌트
- 📄 **PokemonGrid**: 검색 결과 그리드 컴포넌트 (미완성)
- 📄 **StatComparisonChart**: 능력치 비교 차트 (미완성)
- 📄 **EvolutionChain**: 진화 체인 표시 (미완성)

### Database (완료)
- ✅ PostgreSQL 데이터베이스 설정
- ✅ pokemon 테이블 스키마
- ✅ pokemon_type, pokemon_stat, pokemon_ability 테이블
- ✅ 샘플 데이터 및 테스트 데이터

## 🎯 주요 기능

### ✅ 현재 구현된 기능
1. **포켓몬 단일 검색**: 이름으로 포켓몬 검색 (`GET /api/pokemon/{name}`)
2. **고급 검색**: 타입, 키, 몸무게, 능력치로 필터링 (`GET /api/pokemon/advanced-search`)
3. **전체 포켓몬 목록**: 모든 포켓몬 조회 (`GET /api/pokemon/all`)
4. **포켓몬 상세 정보**: 이미지, 기본 정보, 타입, 특성, 능력치 표시
5. **검색 결과 목록**: 그리드 형태로 검색 결과 표시
6. **로딩/에러 처리**: 사용자 친화적인 상태 표시

### 📄 구현 예정 기능
1. **능력치 비교**: 두 포켓몬의 능력치 비교 차트
2. **진화 체인**: 포켓몬 진화 과정 시각화
3. **즐겨찾기**: 사용자가 좋아하는 포켓몬 저장
4. **페이지네이션**: 대량 데이터 처리

## 📚 문서 목록
- [의존성 문서](./dependencies.md)
- [데이터베이스 설계서](./database-design.md)
- [API 문서](./api-documentation.md)
- [개발 가이드](./development-guide.md) 