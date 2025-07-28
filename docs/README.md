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
- ✅ **API 호출 안정성 개선** (타임아웃, 재시도, 에러 핸들링)
- ✅ **DNS 해석 최적화** (MacOS 지원)
- ✅ **데이터베이스 제약조건 완화** (null 값 허용)

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
7. **전체 포켓몬 초기화**: PokeAPI에서 1,302마리 포켓몬 데이터 동기화 (`POST /api/pokemon/initialize`)
8. **안정적인 API 호출**: 타임아웃, 재시도, 에러 핸들링으로 안정성 확보

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
- [문제 해결 가이드](./troubleshooting.md) - **NEW!** 

## 🗄️ 데이터베이스 설정 및 동기화

### 1. DB 연결 정보 (application.properties)
- DB명: pokeapi
- Host: localhost
- Port: 5432
- User: ryankim
- Password: 1234

```
spring.datasource.url=jdbc:postgresql://localhost:5432/pokeapi
spring.datasource.username=ryankim
spring.datasource.password=1234
```

### 2. SQL 스크립트 적용 방법
- 프로젝트 내 database/schema.sql, sample-data.sql 등은 자동 실행되지 않으므로, pokeapi DB에 직접 실행해야 함
- 예시:
```bash
psql -h localhost -U ryankim -d pokeapi -f database/schema.sql
psql -h localhost -U ryankim -d pokeapi -f database/sample-data.sql
```
- VS Code 등 IDE에서 PostgreSQL 확장으로 pokeapi DB에 연결 후 SQL 파일 실행 가능

### 3. DB 동기화 주의사항
- application.properties의 DB 설정과 SQL 스크립트 실행 대상 DB가 반드시 pokeapi로 일치해야 함
- DBeaver, DataGrip 등 DB 툴에서도 pokeapi DB로 연결해야 실제 데이터 확인 가능

### 4. 데이터베이스 제약조건 설정
- 포켓몬 데이터 초기화 전에 다음 SQL을 실행하여 null 값 허용 설정:
```sql
ALTER TABLE pokemon ALTER COLUMN sprite_url DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN shiny_sprite_url DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN korean_name DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN description DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN generation DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN official_artwork_url DROP NOT NULL;
``` 

## 🖥️ 프론트엔드 컴포넌트 전체 목록 및 역할 (모두 구현 완료)

- **AdvancedSearchForm**: 고급 검색 조건 입력 폼 (구현 완료)
- **ErrorMessage**: 에러 메시지 및 재시도 버튼 표시 (구현 완료)
- **EvolutionChain**: 포켓몬 진화 체인 전체 시각화 (구현 완료)
- **EvolutionChainTree**: 진화 트리 구조 재귀 렌더링 (구현 완료)
- **EvolutionCondition**: 진화 조건 텍스트 변환 및 표시 (구현 완료)
- **LoadingSpinner**: 로딩 상태 표시 (구현 완료)
- **PokemonCard**: 포켓몬 상세 정보 카드 (구현 완료)
- **PokemonGrid**: 전체 포켓몬 목록 그리드 (구현 완료)
- **PokemonNode**: 진화 트리 내 포켓몬 노드 (구현 완료)
- **PokemonSprite**: 포켓몬 이름으로 스프라이트 이미지 fetch 및 표시 (구현 완료)
- **SearchForm**: 단일 검색 입력 폼 (구현 완료)
- **SearchModeSelector**: 단일/고급 검색 모드 전환 버튼 (구현 완료)
- **StatComparisonChart**: 포켓몬 능력치 비교 차트 (구현 완료)

### UI/UX 특징
- 모든 컴포넌트는 props 기반으로 재사용성 높게 설계 (구현 완료)
- 로딩/에러/데이터 없음 등 상태별 UI 처리 (구현 완료)
- 클릭/선택 등 사용자 상호작용 지원 (구현 완료)
- 진화 트리, 능력치 차트 등 시각화 컴포넌트 포함 (구현 완료)

### 구현된 주요 기능
- 전체 포켓몬 목록(이름+사진+타입) 그리드로 표시 (구현 완료)
- 포켓몬 클릭 시 상세 정보(카드)로 전환 (구현 완료)
- 단일/고급 검색, 검색 결과 그리드 표시 (구현 완료)
- 상세 정보: 이름, 번호, 이미지(일반/샤이니/공식), 타입, 특성, 능력치 등 (구현 완료)
- 진화 트리, 능력치 비교 등 부가 기능도 모두 구현 완료 

### 추가 구현 컴포넌트 (모두 구현 완료)
- **EvolutionChainTree**: 진화 트리 구조를 재귀적으로 시각화 (구현 완료)
- **EvolutionCondition**: 진화 조건을 텍스트로 변환해 표시 (구현 완료)
- **PokemonNode**: 진화 트리 내 각 포켓몬 노드(이름, 스프라이트, 진화조건, 현재 포켓몬 강조) (구현 완료)
- **PokemonSprite**: 포켓몬 이름으로 스프라이트 이미지를 fetch 및 표시 (구현 완료) 