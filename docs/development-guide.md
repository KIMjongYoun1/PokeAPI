# 개발 가이드

## 🚀 프로젝트 개요
- **프로젝트명**: PokeAPI
- **목적**: PokéAPI를 활용한 포켓몬 정보 관리 시스템
- **기술 스택**: Spring Boot + React + PostgreSQL

## 🏗️ 프로젝트 구조

```
PokeAPI/
├── backend/                    # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/pokeapi/backend/
│   │       ├── config/         # 설정 클래스
│   │       ├── controller/     # REST API 컨트롤러
│   │       ├── dto/           # 데이터 전송 객체
│   │       ├── entity/        # JPA 엔티티
│   │       ├── repository/    # 데이터 접근 계층
│   │       ├── service/       # 비즈니스 로직
│   │       └── util/          # 유틸리티 클래스
│   └── src/main/resources/
│       └── application.properties
├── frontend/                   # React 프론트엔드
│   ├── src/
│   │   ├── components/        # 재사용 가능한 컴포넌트
│   │   ├── page/             # 페이지 컴포넌트
│   │   ├── types/            # TypeScript 타입 정의
│   │   └── App.tsx           # 메인 앱 컴포넌트
│   └── package.json
├── database/                  # 데이터베이스 스크립트
│   ├── schema.sql            # 테이블 생성 스크립트
│   └── sample-data.sql       # 샘플 데이터
└── docs/                     # 프로젝트 문서
```

## 🛠️ 개발 환경 설정

### 1. 백엔드 설정

#### 필수 요구사항
- **Java**: 17 이상
- **Maven**: 3.6 이상
- **PostgreSQL**: 15 이상

#### 설치 및 실행
```bash
# 프로젝트 루트 디렉토리에서
cd backend

# 의존성 설치
mvn clean install

# 애플리케이션 실행
mvn spring-boot:run
```

#### 데이터베이스 설정
```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/pokeapi
spring.datasource.username=ryankim
spring.datasource.password=1234
```

### 2. 프론트엔드 설정

#### 필수 요구사항
- **Node.js**: 18 이상
- **npm**: 9 이상

#### 설치 및 실행
```bash
# 프로젝트 루트 디렉토리에서
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📋 개발 완료 현황

### ✅ 완료된 기능

#### 백엔드 (완료)
- ✅ Spring Boot 프로젝트 설정
- ✅ PostgreSQL 데이터베이스 연결
- ✅ Pokemon 엔티티 및 DTO 정의
- ✅ PokemonService (단일 검색, 고급 검색, 외부 API 호출)
- ✅ PokemonController (REST API 엔드포인트)
- ✅ WebClient 설정 (외부 PokéAPI 호출)
- ✅ 데이터베이스 스키마 설계 및 구현
- ✅ API 호출 안정성 개선 (타임아웃, 재시도, 에러 핸들링)
- ✅ DNS 해석 최적화 (MacOS 지원)
- ✅ 데이터베이스 제약조건 완화 (null 값 허용)
- ✅ 진화체인 API (포켓몬 진화 정보 조회)
- ✅ 포켓몬 상세 정보 API (스프라이트, 설명 등)
- ✅ **WorldCup 기능 구현 완료**
  - ✅ WorldCupResult, WorldCupStatistics 엔티티
  - ✅ WorldCupResultRepository, WorldCupStatisticsRepository
  - ✅ WorldCupService (CRUD, 참가자 선정, 통계 업데이트, 자동 월드컵 생성)
  - ✅ DTO 클래스들 (WorldCupResultDTO, WorldCupStatisticsDTO, WorldCupRequestDTO 등)
  - ✅ JSON 파싱 유틸리티 메서드들
  - ✅ 10세대 포켓몬 지원 (1302마리)
  - ✅ 타입 안전성 개선 (@SuppressWarnings, 메서드 분리)

#### 프론트엔드 (완료)
- ✅ React + TypeScript 프로젝트 설정
- ✅ 기본 프로젝트 구조
- ✅ TypeScript 타입 정의 (PokemonDTO, StatDTO, EvolutionDTO 등)
- ✅ API 호출 로직 (단일 검색, 고급 검색, 진화체인)
- ✅ 상태 관리 (로딩, 에러, 검색 결과 등)
- ✅ 라우팅 시스템 (React Router DOM)
- ✅ 페이지 컴포넌트 (홈, 상세, 진화, 비교 페이지)
- ✅ 진화체인 시각화 (트리 구조, 조건 표시)
- ✅ 포켓몬 비교 기능 (능력치 차트, 다중 선택)
- ✅ 전체 포켓몬 목록 (세대별, 그리드 형태)
- ✅ 반응형 디자인 (모바일 대응)

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

### 🚧 구현 예정 기능 (월드컵 기능)

#### 1. 월드컵 기본 기능
- 포켓몬 투표 시스템
- 세대별/타입별 조건 설정
- 참가자 수 설정 (8/16/32마리)
- 라운드별 진행 상황 표시

#### 2. 결과 관리 기능
- 월드컵 결과 저장
- 최종 우승자 표시
- 결과 히스토리 조회
- 결과 링크 공유

#### 3. 통계 분석 기능
- 포켓몬별 인기 순위
- 우승 횟수 통계
- 평균 순위 분석
- 인기 포켓몬 월드컵 생성

#### 4. 소셜 기능
- 월드컵 결과 링크 공유
- QR코드 생성
- 실시간 투표 현황 (주기적 업데이트)
- 전체 사용자 인기 순위

#### 5. 간이 배틀 기능 (최종 단계)
- 타입 상성 기반 배틀 시뮬레이션
- 스탯 비교 알고리즘
- 배틀 로그 생성
- 배틀 기반 월드컵
- 포켓몬별 배틀 통계

## 🎯 월드컵 기능 개발 계획

### 📋 추가될 기능들
1. **월드컵 기본 기능**: 포켓몬 투표 시스템, 조건 설정
2. **결과 관리 기능**: 월드컵 결과 저장, 히스토리 조회
3. **통계 분석 기능**: 포켓몬별 인기 순위, 우승 통계
4. **소셜 기능**: 결과 공유, 실시간 통계
5. **간이 배틀 기능**: 타입 상성 기반 배틀 시뮬레이션 (최종 단계)

### 🏗️ 작업 내용
- **백엔드**: 월드컵 관련 Entity, DTO, Repository, Service, Controller
- **프론트엔드**: 월드컵 페이지, 조건 설정 UI, 진행 화면, 결과 표시
- **데이터베이스**: 월드컵 결과, 통계 테이블 (기존 pokemon 테이블과 분리)
- **배틀 시스템**: 타입 상성, 스탯 비교, 배틀 시뮬레이션 (최종 단계)

### 📅 작업 순서
1. **기본 월드컵 기능**: 백엔드 구조 → 프론트엔드 페이지 → 투표 시스템
2. **결과 관리**: 결과 저장 → 결과 표시 → 히스토리
3. **통계 기능**: 통계 계산 → 인기 순위 → 대시보드
4. **소셜 기능**: 링크 공유 → 실시간 통계 → 최적화
5. **간이 배틀 기능**: 배틀 시스템 → 월드컵 통합 → 배틀 통계 (최종 단계)

### 🎯 핵심 특징
- **단일 페이지**: 조건 설정 → 월드컵 진행 → 결과 표시
- **간단한 카드**: 이미지 + 이름 + 타입 + 설명(있는 경우만)
- **조건 제한**: 최대 2개 조건 (세대 + 타입)
- **설명 필터링**: 설명이 없는 포켓몬도 참가 가능 (설명란만 숨김)
- **데이터베이스 분리**: 월드컵 관련 테이블을 기존 pokemon 테이블과 분리
- **배틀 시스템**: 타입 상성 기반 간이 배틀 시뮬레이션 (최종 단계)

## 🔧 개발 가이드라인

### 1. 코드 스타일

#### Java (백엔드)
- **네이밍**: camelCase 사용
- **클래스명**: PascalCase 사용
- **상수**: UPPER_SNAKE_CASE 사용
- **패키지**: 소문자 사용

```java
// 좋은 예시
public class PokemonService {
    private static final String API_BASE_URL = "https://pokeapi.co/api/v2";
    
    public PokemonDTO getPokemonByName(String pokemonName) {
        // 구현
    }
}
```

#### TypeScript (프론트엔드)
- **변수/함수**: camelCase 사용
- **컴포넌트**: PascalCase 사용
- **인터페이스**: PascalCase 사용

```typescript
// 좋은 예시
interface PokemonData {
    id: number;
    name: string;
    types: string[];
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
    const handleClick = () => {
        // 구현
    };
    
    return (
        <div className="pokemon-card">
            {/* JSX */}
        </div>
    );
};
```

### 2. 컴포넌트 설계 원칙

#### 재사용성
- Props 기반으로 설계
- 단일 책임 원칙 준수
- 명확한 인터페이스 정의

#### 상태 관리
- useState로 로컬 상태 관리
- useEffect로 사이드 이펙트 처리
- 컴포넌트 간 상태 공유 최소화

### 3. API 설계 원칙

#### RESTful API
- HTTP 메서드 적절히 사용
- 일관된 URL 구조
- 적절한 HTTP 상태 코드 반환

#### 에러 처리
- 일관된 에러 응답 형식
- 적절한 로깅
- 사용자 친화적인 에러 메시지

## 🧪 테스트 가이드

### 1. 백엔드 테스트

#### 단위 테스트
```java
@SpringBootTest
class PokemonServiceTest {
    
    @Autowired
    private PokemonService pokemonService;
    
    @Test
    void testGetPokemonByName() {
        // 테스트 구현
    }
}
```

#### 통합 테스트
```java
@WebMvcTest(PokemonController.class)
class PokemonControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    void testGetPokemon() throws Exception {
        // 테스트 구현
    }
}
```

## 📝 최근 개발 변경사항 (2025년 1월)

### WorldCup 기능 구현 완료

#### 주요 변경사항
1. **데이터 타입 최적화**
   - `average_rank`: `Double` → `Integer` (정확성 및 성능 향상)
   - 통계 계산에서 소수점 제거로 안정성 개선

2. **JSON 파싱 방식 개선**
   - `@SuppressWarnings("unchecked")` 어노테이션 추가
   - 메서드 분리로 타입 안전성 향상
   - `parseConditions()`, `parseParticipants()`, `parseFinalRanking()`, `parseTypes()` 유틸리티 메서드

3. **포켓몬 세대 업데이트**
   - 10세대 포켓몬 지원 (1026-1302번, 총 1302마리)
   - `getGenerationStartId()`, `getGenerationEndId()` 메서드 업데이트

4. **코드 품질 개선**
   - 불필요한 `@Autowired` 제거 (`PokemonService`)
   - 메서드 시그니처 통일 및 오타 수정
   - `@Transactional` 어노테이션 추가

#### 구현된 기능
- **WorldCupService**: CRUD, 참가자 선정, 통계 업데이트, 자동 월드컵 생성
- **Repository**: 세대별/타입별 조회, 통계 기반 정렬
- **DTO**: 데이터 전송 객체들 (WorldCupResultDTO, WorldCupStatisticsDTO 등)
- **Entity**: 데이터베이스 매핑 객체들
        // 테스트 구현
    }
}
```

### 2. 프론트엔드 테스트

#### 컴포넌트 테스트
```typescript
import { render, screen } from '@testing-library/react';
import PokemonCard from './PokemonCard';

test('renders pokemon name', () => {
    const pokemon = { name: 'pikachu', types: ['electric'] };
    render(<PokemonCard pokemon={pokemon} />);
    
    expect(screen.getByText('pikachu')).toBeInTheDocument();
});
```

## 🚀 배포 가이드

### 1. 백엔드 배포

#### JAR 파일 생성
```bash
cd backend
mvn clean package
```

#### 실행
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

### 2. 프론트엔드 배포

#### 빌드
```bash
cd frontend
npm run build
```

#### 정적 파일 서빙
- Nginx, Apache 등 웹 서버 사용
- CDN 활용 고려

## 📚 참고 자료

### 공식 문서
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### API 문서
- [PokéAPI Documentation](https://pokeapi.co/docs/v2)
- [Spring Boot WebClient](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)

### 개발 도구
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) - Java IDE
- [VS Code](https://code.visualstudio.com/) - TypeScript/React IDE
- [DBeaver](https://dbeaver.io/) - 데이터베이스 관리 도구