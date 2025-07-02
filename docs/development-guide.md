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
│   │   ├── pages/                    # 페이지 컴포넌트
│   │   ├── services/                 # API 호출 서비스
│   │   ├── types/                    # TypeScript 타입 정의
│   │   └── utils/                    # 유틸리티 함수
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
- **컴포넌트명**: PascalCase (예: `PokemonList`)
- **함수명**: camelCase (예: `fetchPokemonData`)
- **변수명**: camelCase (예: `pokemonList`)
- **타입명**: PascalCase (예: `PokemonType`)

### 파일명 컨벤션
- **Java 클래스**: PascalCase (예: `PokemonService.java`)
- **React 컴포넌트**: PascalCase (예: `PokemonCard.tsx`)
- **유틸리티 파일**: camelCase (예: `apiUtils.ts`)

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

## 📊 성능 최적화

### 백엔드 최적화
- **캐싱**: Redis 또는 인메모리 캐시 사용
- **페이징**: 대용량 데이터 페이징 처리
- **인덱스**: 데이터베이스 인덱스 최적화

### 프론트엔드 최적화
- **코드 스플리팅**: React.lazy() 사용
- **이미지 최적화**: WebP 포맷 사용
- **번들 최적화**: Tree shaking 적용

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

## 🐛 문제 해결

### 자주 발생하는 문제들

#### 1. 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :8080
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

#### 2. 데이터베이스 연결 실패
```bash
# PostgreSQL 서비스 상태 확인
brew services list | grep postgresql

# 서비스 재시작
brew services restart postgresql@15
```

#### 3. 의존성 문제
```bash
# Maven 의존성 새로고침
mvn clean install

# npm 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

## 📞 지원

문제가 발생하면 다음 순서로 해결해보세요:
1. **문서 확인**: 이 가이드와 API 문서 참조
2. **로그 확인**: 애플리케이션 로그 분석
3. **커뮤니티**: Stack Overflow, GitHub Issues 검색
4. **팀 지원**: 팀원들과 상의 