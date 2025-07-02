# 의존성 문서

## Backend Dependencies

### Spring Boot Starters
| 의존성 | 버전 | 용도 |
|--------|------|------|
| spring-boot-starter-web | 3.2.0 | REST API 서버 |
| spring-boot-starter-data-jpa | 3.2.0 | JPA 데이터 접근 |
| spring-boot-starter-webflux | 3.2.0 | 외부 API 호출 |

### Database
| 의존성 | 버전 | 용도 |
|--------|------|------|
| postgresql | - | PostgreSQL 드라이버 |
| mybatis-spring-boot-starter | 3.0.3 | MyBatis ORM |

### Test
| 의존성 | 버전 | 용도 |
|--------|------|------|
| spring-boot-starter-test | 3.2.0 | 테스트 프레임워크 |

## Frontend Dependencies

### Core
| 의존성 | 버전 | 용도 |
|--------|------|------|
| react | 18.x | UI 라이브러리 |
| react-dom | 18.x | React DOM |
| typescript | 5.x | 타입 안전성 |

### Build Tools
| 의존성 | 버전 | 용도 |
|--------|------|------|
| vite | 5.x | 빌드 도구 |
| @vitejs/plugin-react | 5.x | React 플러그인 |

## 📦 pom.xml 의존성 설정

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- MyBatis -->
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.3</version>
    </dependency>
    
    <!-- PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- WebClient (PokéAPI 호출용) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    
    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## 🔧 package.json 의존성 설정

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
``` 