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
- **Framework**: React 19.1.0
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: npm
- **Routing**: React Router DOM
- **Charts**: Recharts

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
- ✅ **진화체인 API** (포켓몬 진화 정보 조회)
- ✅ **포켓몬 상세 정보 API** (스프라이트, 설명 등)

### Frontend (완료)
- ✅ React + TypeScript 프로젝트 설정
- ✅ 기본 프로젝트 구조
- ✅ TypeScript 타입 정의 (PokemonDTO, StatDTO, EvolutionDTO 등)
- ✅ API 호출 로직 (단일 검색, 고급 검색, 진화체인)
- ✅ 상태 관리 (로딩, 에러, 검색 결과 등)
- ✅ **라우팅 시스템** (React Router DOM)
- ✅ **페이지 컴포넌트** (홈, 상세, 진화, 비교 페이지)
- ✅ **진화체인 시각화** (트리 구조, 조건 표시)
- ✅ **포켓몬 비교 기능** (능력치 차트, 다중 선택)
- ✅ **전체 포켓몬 목록** (세대별, 그리드 형태)
- ✅ **반응형 디자인** (모바일 대응)

#### 컴포넌트 분리 현황 (모두 완료)
- ✅ **PokemonCard**: 포켓몬 상세 정보 표시 컴포넌트
- ✅ **SearchForm**: 단일 검색 폼 컴포넌트
- ✅ **SearchModeSelector**: 검색 모드 선택 컴포넌트
- ✅ **AdvancedSearchForm**: 고급 검색 폼 컴포넌트
- ✅ **LoadingSpinner**: 로딩 상태 표시 컴포넌트
- ✅ **ErrorMessage**: 에러 메시지 표시 컴포넌트
- ✅ **PokemonGrid**: 검색 결과 그리드 컴포넌트
- ✅ **StatComparisonChart**: 능력치 비교 차트
- ✅ **EvolutionChain**: 진화 체인 표시
- ✅ **EvolutionChainTree**: 진화 트리 구조 재귀 렌더링
- ✅ **EvolutionCondition**: 진화 조건 텍스트 변환
- ✅ **PokemonNode**: 진화 트리 내 포켓몬 노드
- ✅ **PokemonSprite**: 포켓몬 스프라이트 표시

### Database (완료)
- ✅ PostgreSQL 데이터베이스 설정
- ✅ pokemon 테이블 스키마
- ✅ pokemon_type, pokemon_stat, pokemon_ability 테이블
- ✅ pokemon_name_mapping 테이블 (한글명 매핑)
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
9. **진화체인 조회**: 포켓몬의 진화 과정 시각화 (`GET /api/pokemon/{name}/evolution`)
10. **포켓몬 비교**: 다중 포켓몬 능력치 비교 및 차트 표시
11. **세대별 포켓몬 목록**: 1-9세대별 포켓몬 필터링
12. **반응형 UI**: 모바일/데스크톱 대응

### ✅ 구현 완료 기능 (월드컵 기능)
1. **이상형 월드컵**: 투표 기반 포켓몬 선호도 조사 ✅
2. **조건 설정**: 세대별/타입별 월드컵 조건 설정 ✅
3. **결과 저장**: 이상형 월드컵 결과 데이터베이스 저장 ✅
4. **통계 분석**: 포켓몬별 인기 순위 및 통계 ✅
5. **자동 월드컵 생성**: 통계 기반 자동 참가자 선정 ✅
6. **10세대 포켓몬 지원**: 1302마리 포켓몬 지원 ✅
7. **타입 안전성 개선**: JSON 파싱 및 메서드 분리 ✅

### 🚧 구현 예정 기능 (배틀 기능)
1. **배틀 토너먼트**: 타입 상성 기반 배틀 시뮬레이션
2. **배틀 통계**: 포켓몬별 배틀 성과 분석
3. **실시간 배틀**: 실시간 배틀 진행 및 결과

## 📚 문서 목록
- [의존성 문서](./dependencies.md)
- [데이터베이스 설계서](./database-design.md)
- [API 문서](./api-documentation.md)
- [개발 가이드](./development-guide.md)
- [문제 해결 가이드](./troubleshooting.md)

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

## 🎮 월드컵 기능 계획

### 📋 추가될 기능들
1. **이상형 월드컵 기본 기능**: 포켓몬 투표 시스템, 조건 설정
2. **이상형 월드컵 결과 관리**: 월드컵 결과 저장, 히스토리 조회
3. **이상형 월드컵 통계 분석**: 포켓몬별 인기 순위, 우승 통계
4. **소셜 기능**: 결과 공유, 실시간 통계
5. **배틀 토너먼트 기능**: 타입 상성 기반 배틀 시뮬레이션 (최종 단계)

### 🏗️ 작업 내용
- **백엔드**: 이상형 월드컵 관련 Entity, DTO, Repository, Service, Controller
- **프론트엔드**: 이상형 월드컵 페이지, 조건 설정 UI, 진행 화면, 결과 표시
- **데이터베이스**: 이상형 월드컵 결과, 통계 테이블 (기존 pokemon 테이블과 분리)
- **배틀 시스템**: 배틀 토너먼트 관련 테이블 및 API (최종 단계)

### 📅 작업 순서
1. **이상형 월드컵 기본 기능**: 백엔드 구조 → 프론트엔드 페이지 → 투표 시스템
2. **이상형 월드컵 결과 관리**: 결과 저장 → 결과 표시 → 히스토리
3. **이상형 월드컵 통계 기능**: 통계 계산 → 인기 순위 → 대시보드
4. **소셜 기능**: 링크 공유 → 실시간 통계 → 최적화
5. **배틀 토너먼트 기능**: 배틀 시스템 → 배틀 토너먼트 → 배틀 통계 (최종 단계)

### 🎯 핵심 특징
- **단일 페이지**: 조건 설정 → 월드컵 진행 → 결과 표시
- **간단한 카드**: 이미지 + 이름 + 타입 + 설명(있는 경우만)
- **조건 제한**: 최대 2개 조건 (세대 + 타입)
- **설명 필터링**: 설명이 없는 포켓몬도 참가 가능 (설명란만 숨김)
- **데이터베이스 분리**: 이상형 월드컵과 배틀 토너먼트 테이블을 기존 pokemon 테이블과 분리
- **배틀 시스템**: 타입 상성 기반 배틀 토너먼트 (최종 단계) 