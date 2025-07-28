# 문제 해결 가이드 (Troubleshooting Guide)

## 개요
PokeAPI 백엔드 개발 과정에서 발생했던 주요 문제들과 해결방법을 정리한 문서입니다.

## 1. 데이터베이스 제약조건 문제

### 문제 상황
```
ERROR: null value in column "shiny_sprite_url" of relation "pokemon" violates not-null constraint
ERROR: null value in column "sprite_url" of relation "pokemon" violates not-null constraint
```

### 원인
- 많은 포켓몬들(특히 totem, starter, 특별한 형태들)이 스프라이트가 없어서 null이 됨
- PokeAPI에서 해당 포켓몬들의 스프라이트 URL을 제공하지 않음
- 데이터베이스 스키마에서 해당 컬럼들이 NOT NULL로 설정되어 있음

### 해결방법
```sql
-- 스프라이트 URL 컬럼들을 nullable로 변경
ALTER TABLE pokemon ALTER COLUMN sprite_url DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN shiny_sprite_url DROP NOT NULL;

-- 다른 nullable이어야 할 필드들도 확인
ALTER TABLE pokemon ALTER COLUMN korean_name DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN description DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN generation DROP NOT NULL;
ALTER TABLE pokemon ALTER COLUMN official_artwork_url DROP NOT NULL;
```

### 영향받는 포켓몬들
- **Totem 포켓몬들**: `lurantis-totem`, `salazzle-totem`, `kommo-o-totem` 등
- **Starter 포켓몬들**: `pikachu-starter`, `eevee-starter`
- **특별한 형태들**: `pikachu-world-cap`, `cramorant-gulping`, `cramorant-gorging`
- **레전드 포켓몬 특별 형태들**: `koraidon-limited-build`, `miraidon-low-power-mode` 등

## 2. DNS 해석 문제 (MacOS)

### 문제 상황
```
ERROR i.n.r.d.DnsServerAddressStreamProviders - Unable to load io.netty.resolver.dns.macos.MacOSDnsServerAddressStreamProvider, fallback to system defaults.
```

### 원인
- Netty(네트워크 라이브러리)가 MacOS용 최적화된 DNS 해석 라이브러리를 찾지 못함
- MacOS에서 DNS 해석 성능이 저하될 수 있음

### 해결방법
`backend/pom.xml`에 다음 의존성 추가:
```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-resolver-dns-native-macos</artifactId>
    <classifier>osx-aarch_64</classifier>
</dependency>
```

## 3. API 호출 안정성 문제

### 문제 상황
```
WARN c.p.backend.service.PokemonService - Species API 호출 실패 - 포켓몬: lurantis-totem, 오류: Retries exhausted: 2/2
```

### 원인
- 외부 PokeAPI 호출 시 네트워크 지연, 타임아웃 발생
- 재시도 로직이 부족하여 일시적인 오류로 인한 실패
- 에러 핸들링이 미흡하여 전체 초기화 과정이 중단됨

### 해결방법
1. **WebClient 설정 개선** (`WebClientConfig.java`):
```java
@Bean
public WebClient webClient() {
    return WebClient.builder()
            .baseUrl("https://pokeapi.co/api/v2")
            .filter(errorHandler())
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
            .build();
}

private ExchangeFilterFunction errorHandler() {
    return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
        if (clientResponse.statusCode().is4xxClientError()) {
            return clientResponse.bodyToMono(String.class)
                    .flatMap(body -> Mono.error(new RuntimeException("API 호출 실패 (4xx): " + body)));
        }
        if (clientResponse.statusCode().is5xxServerError()) {
            return clientResponse.bodyToMono(String.class)
                    .flatMap(body -> Mono.error(new RuntimeException("API 호출 실패 (5xx): " + body)));
        }
        return Mono.just(clientResponse);
    });
}
```

2. **타임아웃 및 재시도 로직 추가** (`PokemonService.java`):
```java
// 메인 API 호출
String response = webClient.get()
        .uri("/pokemon/{name}", englishName)
        .retrieve()
        .bodyToMono(String.class)
        .timeout(Duration.ofSeconds(10))  // 10초 타임아웃
        .retryWhen(reactor.util.retry.Retry.backoff(3, Duration.ofSeconds(1)))  // 3번 재시도
        .block();

// Species API 호출
String response = webClient.get()
        .uri("/pokemon-species/{name}", name)
        .retrieve()
        .bodyToMono(String.class)
        .timeout(Duration.ofSeconds(15))  // 15초로 증가
        .retryWhen(reactor.util.retry.Retry.backoff(3, Duration.ofSeconds(2)))  // 3번 재시도, 2초 간격
        .block();
```

## 4. 프론트엔드 컴포넌트 오류

### 4.1 PokemonGrid 컴포넌트 null 값 처리 오류

#### 문제 상황
```
Uncaught TypeError: Cannot read properties of undefined (reading 'toUpperCase')
```

#### 원인
- `pokemon.koreanName`이 `null`인 경우 `toUpperCase()` 메서드 호출 시 오류 발생
- 일부 포켓몬(특히 특수 폼)은 한글 이름이 없어서 `null` 값이 저장됨

#### 해결방법
`frontend/src/components/PokemonGrid.tsx` 수정:
```typescript
// 안전한 이름 표시 로직 추가
const displayName = pokemon.koreanName || pokemon.name || '이름 없음';

// null 체크 후 사용
<h3>{displayName.toUpperCase()}</h3>

// 이미지 오류 처리 추가
<img 
    src={pokemon.spriteUrl || 'https://via.placeholder.com/80x80?text=?'} 
    alt={displayName}
    onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/80x80?text=?';
    }}
/>

// 타입 배열 안전성 추가
{pokemon.types && pokemon.types.map((type, typeIndex) => (
    <span key={`${safeKey}-type-${typeIndex}`} className="type-badge small">
        {type}
    </span>
))}
```

### 4.2 HomePage 무한 리로드 문제

#### 문제 상황
- 페이지 로드 시 자동으로 검색이 실행되어 무한 리로드 발생
- 검색 결과가 변경되면서 컴포넌트가 계속 다시 렌더링됨

#### 원인
```typescript
// 문제가 되는 코드
useEffect(() => {
  searchPokemon(searchName);  // searchName이 'pikachu'로 초기화되어 자동 검색
}, []);
```

#### 해결방법
`frontend/src/page/HomePage.tsx` 수정:
```typescript
// 자동 검색 제거, 포켓몬 목록만 로드
useEffect(() => {
  loadPokemonList();  // 포켓몬 목록만 로드, 자동 검색 제거
}, []);

// 부분일치 검색 결과 처리 수정
const searchPokemon = async (name: string) => {
  setLoading(true);
  setError('');
  try {
    const response = await fetch(`http://localhost:8080/api/pokemon/search/korean?keyword=${encodeURIComponent(name)}`);
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);  // 이미 배열이므로 그대로 사용 (기존: setSearchResults([data]))
    } else {
      setError('포켓몬을 찾을 수 없습니다.');
      setSearchResults([]);
    }
  } catch (err) {
    setError('서버 연결에 실패했습니다.');
    setSearchResults([]);
  } finally {
    setLoading(false);
  }
};
```

## 5. 한글 이름 변환 문제

### 문제 상황
- 특별한 형태의 포켓몬들은 한글 이름이 없음
- 1세대 포켓몬 매핑에 없는 이름들
- Species API 호출 실패

### 해결방법
```java
// 에러 처리 개선
String koreanName = getPokemonKoreanName(englishName);
if (koreanName == null || koreanName.isEmpty()) {
    koreanName = englishName; // 영문 이름으로 대체
}
pokemonDTO.setKoreanName(koreanName);
```

## 6. API 호출 간격 최적화

### 문제 상황
- 100ms 대기 시간이 너무 길어서 전체 처리 시간이 오래 걸림
- 일부 요청이 타임아웃됨

### 해결방법
```java
// 대기 시간 최적화
Thread.sleep(50);  // 100ms에서 50ms로 단축
```

## 7. 전체 초기화 성능 개선

### 문제 상황
- 1,302마리 포켓몬 초기화 시 많은 실패 발생
- 처리 시간이 오래 걸림

### 해결방법
1. **데이터베이스 제약조건 완화**
2. **API 호출 안정성 개선**
3. **타임아웃 및 재시도 로직 추가**
4. **Null 값 처리 강화**

### 결과
- **이전**: 1,184개 성공, 118개 실패
- **개선 후**: 더 많은 포켓몬 성공적으로 저장

## 8. 로깅 개선

### 문제 상황
- 에러 로그가 너무 많아서 중요한 정보 파악 어려움
- 디버깅 정보 부족

### 해결방법
```java
// 로그 레벨 조정
logger.debug("Species API 호출 시작: {}", name);  // INFO → DEBUG
logger.warn("Species API 호출 실패 - 포켓몬: {}, 오류: {}", name, e.getMessage());  // ERROR → WARN
```

## 9. 예상되는 추가 문제들

### 9.1 메모리 사용량
- 대량의 포켓몬 데이터 처리 시 메모리 부족 가능성
- **해결방법**: 배치 처리, 메모리 설정 조정

### 9.2 API 호출 제한
- PokeAPI의 rate limiting 정책
- **해결방법**: 호출 간격 조정, 캐싱 강화

### 9.3 데이터 일관성
- API 데이터 변경 시 동기화 문제
- **해결방법**: 주기적 업데이트, 버전 관리

## 10. 모니터링 및 유지보수

### 10.1 로그 모니터링
- 애플리케이션 로그를 주기적으로 확인
- 에러 패턴 분석 및 대응

### 10.2 성능 모니터링
- API 응답 시간 측정
- 데이터베이스 쿼리 성능 분석

### 10.3 데이터 무결성 검증
- 주기적으로 데이터베이스 데이터 검증
- 누락된 데이터 확인 및 복구

## 11. 프론트엔드 디버깅 로그 제거

### 문제 상황
- 개발 중 사용한 console.log가 프로덕션에서 계속 출력됨
- 브라우저 콘솔이 계속 갱신되어 성능 저하

### 해결방법
개발 완료 후 다음 로그들을 제거:
```typescript
// PokemonGrid.tsx에서 제거할 로그들
console.log('PokemonGrid received:', searchResults);
console.log(`Pokemon key for ${displayName}:`, safeKey);

// 다른 컴포넌트에서도 유사한 디버깅 로그들 제거
```

### 권장사항
- 개발 완료 후 모든 `console.log` 제거
- 필요한 경우 환경별 로깅 설정 사용
- 프로덕션 빌드 시 자동으로 로그 제거되도록 설정 