# 개발 가이드

## 🚀 개발 환경 설정

### 필수 요구사항
- **Java**: 17 이상
- **Node.js**: 18 이상
- **PostgreSQL**: 15 이상
- **IDE**: IntelliJ IDEA, VS Code, Cursor 등

### 개발 도구 설치
```bash
# Java 17 설치 (macOS)
brew install --cask zulu@17

# Node.js 설치 (macOS)
brew install node

# PostgreSQL 설치 (macOS)
brew install postgresql@15
```

## 📁 프로젝트 구조

```
PokeAPI/
├── backend/                          # Spring Boot 백엔드
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/pokeapi/backend/
│   │   │   │       ├── controller/   # REST API 컨트롤러
│   │   │   │       ├── service/      # 비즈니스 로직
│   │   │   │       ├── repository/   # 데이터 접근 계층
│   │   │   │       ├── entity/       # JPA 엔티티
│   │   │   │       ├── dto/          # 데이터 전송 객체
│   │   │   │       └── config/       # 설정 클래스
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── mapper/           # MyBatis 매퍼
│   │   └── test/                     # 테스트 코드
│   └── pom.xml
├── frontend/                         # React 프론트엔드
│   ├── src/
│   │   ├── components/               # React 컴포넌트
│   │   │   ├── PokemonCard.tsx       # 포켓몬 상세 정보 표시
│   │   │   ├── SearchForm.tsx        # 단일 검색 폼
│   │   │   ├── SearchModeSelector.tsx # 검색 모드 선택
│   │   │   ├── AdvancedSearchForm.tsx # 고급 검색 폼
│   │   │   ├── LoadingSpinner.tsx    # 로딩 상태 표시
│   │   │   ├── ErrorMessage.tsx      # 에러 메시지 표시
│   │   │   ├── PokemonGrid.tsx       # 검색 결과 그리드 (미완성)
│   │   │   ├── StatComparisonChart.tsx # 능력치 비교 차트 (미완성)
│   │   │   └── EvolutionChain.tsx    # 진화 체인 표시 (미완성)
│   │   ├── types/                    # TypeScript 타입 정의
│   │   │   └── Pokemon.ts            # PokemonDTO, StatDTO 등
│   │   ├── App.tsx                   # 메인 애플리케이션 컴포넌트
│   │   ├── main.tsx                  # 애플리케이션 진입점
│   │   └── App.css                   # 스타일시트
│   ├── package.json
│   └── vite.config.ts
├── database/                         # 데이터베이스 스크립트
│   ├── schema.sql                    # 테이블 생성 스크립트
│   └── data.sql                      # 샘플 데이터
└── docs/                             # 프로젝트 문서
    ├── README.md
    ├── dependencies.md
    ├── database-design.md
    ├── api-documentation.md
    └── development-guide.md
```

## 🔧 개발 환경 실행

### 1. 데이터베이스 설정
```bash
# PostgreSQL 서비스 시작
brew services start postgresql@15

# 데이터베이스 생성
createdb pokeapi

# 테이블 생성 (database/schema.sql 실행)
psql -d pokeapi -f database/schema.sql
```

### 2. 백엔드 서버 실행
```bash
cd backend
mvn spring-boot:run
```

### 3. 프론트엔드 서버 실행
```bash
cd frontend
npm run dev
```

## 📝 코딩 컨벤션

### Java 코딩 컨벤션
- **클래스명**: PascalCase (예: `PokemonController`)
- **메서드명**: camelCase (예: `getPokemonById`)
- **변수명**: camelCase (예: `pokemonName`)
- **상수명**: UPPER_SNAKE_CASE (예: `MAX_POKEMON_COUNT`)

### TypeScript 코딩 컨벤션
- **컴포넌트명**: PascalCase (예: `PokemonCard`)
- **함수명**: camelCase (예: `fetchPokemonData`)
- **변수명**: camelCase (예: `pokemonList`)
- **타입명**: PascalCase (예: `PokemonDTO`)
- **Props 인터페이스**: 컴포넌트명 + Props (예: `PokemonCardProps`)

### 파일명 컨벤션
- **Java 클래스**: PascalCase (예: `PokemonService.java`)
- **React 컴포넌트**: PascalCase (예: `PokemonCard.tsx`)
- **TypeScript 타입**: PascalCase (예: `Pokemon.ts`)
- **유틸리티 파일**: camelCase (예: `apiUtils.ts`)

## 🧩 컴포넌트 분리 가이드

### 컴포넌트 분리 원칙
1. **단일 책임 원칙**: 하나의 컴포넌트는 하나의 기능만 담당
2. **재사용성**: 여러 곳에서 사용할 수 있도록 설계
3. **Props 기반**: 부모 컴포넌트에서 데이터와 이벤트를 전달받음
4. **상태 관리**: 상태는 최상위 컴포넌트(App.tsx)에서 관리

### 컴포넌트 구조 예시
```typescript
// 컴포넌트 파일 구조
interface ComponentNameProps {
    // Props 타입 정의
    data: SomeType;
    onAction: (param: SomeType) => void;
}

const ComponentName = ({ data, onAction }: ComponentNameProps) => {
    // 컴포넌트 로직
    return (
        <div className="component-name">
            {/* JSX 구조 */}
        </div>
    );
};

export default ComponentName;
```

### ✅ 현재 완성된 컴포넌트들
- **PokemonCard**: 포켓몬 상세 정보 표시
- **SearchForm**: 단일 검색 폼
- **SearchModeSelector**: 검색 모드 선택
- **AdvancedSearchForm**: 고급 검색 폼
- **LoadingSpinner**: 로딩 상태 표시
- **ErrorMessage**: 에러 메시지 표시

### 📄 구현 예정 컴포넌트들
- **PokemonGrid**: 검색 결과 그리드 (빈 파일)
- **StatComparisonChart**: 능력치 비교 차트 (빈 파일)
- **EvolutionChain**: 진화 체인 표시 (빈 파일)

## 🧪 테스트 작성

### 백엔드 테스트
```java
@SpringBootTest
class PokemonServiceTest {
    
    @Autowired
    private PokemonService pokemonService;
    
    @Test
    void testGetPokemonById() {
        // Given
        Long pokemonId = 1L;
        
        // When
        Pokemon pokemon = pokemonService.getPokemonById(pokemonId);
        
        // Then
        assertThat(pokemon).isNotNull();
        assertThat(pokemon.getName()).isEqualTo("bulbasaur");
    }
}
```

### 프론트엔드 테스트
```typescript
import { render, screen } from '@testing-library/react';
import PokemonCard from './PokemonCard';

test('renders pokemon name', () => {
  const pokemon = {
    id: 1,
    name: 'pikachu',
    imageUrl: 'test.jpg'
  };
  
  render(<PokemonCard pokemon={pokemon} />);
  
  expect(screen.getByText('pikachu')).toBeInTheDocument();
});
```

## 🔍 디버깅 가이드

### 백엔드 디버깅
1. **로그 확인**: `application.properties`에서 로그 레벨 설정
2. **SQL 로그**: Hibernate SQL 로그 활성화
3. **API 테스트**: Postman 또는 cURL 사용

### 프론트엔드 디버깅
1. **브라우저 개발자 도구**: Console, Network 탭 확인
2. **React DevTools**: 컴포넌트 상태 확인
3. **API 호출**: Network 탭에서 요청/응답 확인
4. **TypeScript 오류**: IDE에서 타입 오류 확인

## 📊 성능 최적화

### ✅ 현재 적용된 최적화
- **데이터베이스 캐싱**: 외부 API 호출 결과를 DB에 저장
- **조건부 API 호출**: DB에 없을 때만 외부 API 호출
- **스트림 기반 필터링**: 고급 검색에서 메모리 효율적 처리

### 🔄 개선 예정 사항
- **Redis 캐싱**: 자주 조회되는 데이터 캐싱
- **페이징**: 대용량 데이터 처리
- **인덱스 최적화**: 데이터베이스 쿼리 성능 향상
- **코드 스플리팅**: React.lazy() 사용
- **이미지 최적화**: WebP 포맷 사용
- **번들 최적화**: Tree shaking 적용
- **컴포넌트 메모이제이션**: React.memo() 사용

## 🚀 배포 가이드

### 개발 환경
- **Backend**: localhost:8080
- **Frontend**: localhost:3000
- **Database**: localhost:5432

### 프로덕션 환경
- **Backend**: Docker 컨테이너
- **Frontend**: Nginx 정적 파일 서빙
- **Database**: PostgreSQL 클라우드 서비스

## 📚 학습 리소스

### Spring Boot
- [Spring Boot 공식 문서](https://spring.io/projects/spring-boot)
- [Spring Data JPA 가이드](https://spring.io/guides/gs/accessing-data-jpa/)

### React
- [React 공식 문서](https://react.dev/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

### PostgreSQL
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [PostgreSQL 튜토리얼](https://www.postgresqltutorial.com/) 