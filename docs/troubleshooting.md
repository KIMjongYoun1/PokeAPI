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
- 기본 시스템 DNS 해석으로 fallback되어 성능 저하 발생

### 해결방법
`pom.xml`에 MacOS용 DNS 라이브러리 의존성 추가:

```xml
<!-- MacOS DNS 해결을 위한 의존성 -->
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-resolver-dns-native-macos</artifactId>
    <classifier>osx-aarch_64</classifier>
</dependency>
```

### 효과
- MacOS용 최적화된 DNS 라이브러리 사용
- DNS 해석 속도 향상
- API 호출 안정성 개선

## 3. API 호출 안정성 문제

### 문제 상황
```
WARN c.p.backend.service.PokemonService - Species API 호출 실패 - 포켓몬: lurantis-totem, 오류: Retries exhausted: 2/2
```

### 원인
1. **타임아웃 없음**: API 호출이 무한 대기할 수 있음
2. **재시도 로직 없음**: 일시적 네트워크 문제로 바로 실패
3. **에러 처리 부족**: 4xx, 5xx HTTP 에러 처리 안함

### 해결방법

#### 3.1 WebClient 설정 개선
```java
@Configuration
public class WebClientConfig {
    
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
}
```

#### 3.2 API 호출 메서드 개선
```java
// 타임아웃 및 재시도 추가
String response = webClient.get()
    .uri("/pokemon/{name}", englishName)
    .retrieve()
    .bodyToMono(String.class)
    .timeout(Duration.ofSeconds(10))  // 10초 타임아웃
    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1)))  // 3번 재시도
    .block();
```

#### 3.3 Null 체크 강화
```java
// null 체크 및 기본값 설정
pokemonDTO.setBaseExperience(pokemonData.getBaseExperience() != null ? pokemonData.getBaseExperience() : 0);
pokemonDTO.setSpriteUrl(pokemonData.getSprites() != null ? pokemonData.getSprites().getFrontDefault() : null);
pokemonDTO.setShinySpriteUrl(pokemonData.getSprites() != null ? pokemonData.getSprites().getFrontShiny() : null);
```

## 4. 한글 이름 변환 실패

### 문제 상황
```
WARN c.p.backend.service.PokemonService - 한글 이름 변환 실패, 원본 반환: lurantis-totem
```

### 원인
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

## 5. API 호출 간격 최적화

### 문제 상황
- 100ms 대기 시간이 너무 길어서 전체 처리 시간이 오래 걸림
- 일부 요청이 타임아웃됨

### 해결방법
```java
// 대기 시간 최적화
Thread.sleep(50);  // 100ms에서 50ms로 단축
```

## 6. 전체 초기화 성능 개선

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

## 7. 로깅 개선

### 문제 상황
- 에러 로그가 너무 많아서 중요한 정보 파악 어려움
- 디버깅 정보 부족

### 해결방법
```java
// 로그 레벨 조정
logger.debug("Species API 호출 시작: {}", name);  // INFO → DEBUG
logger.warn("Species API 호출 실패 - 포켓몬: {}, 오류: {}", name, e.getMessage());  // ERROR → WARN
```

## 8. 예상되는 추가 문제들

### 8.1 메모리 사용량
- 대량의 포켓몬 데이터 처리 시 메모리 부족 가능성
- **해결방법**: 배치 처리, 메모리 설정 조정

### 8.2 API 호출 제한
- PokeAPI의 rate limiting 정책
- **해결방법**: 호출 간격 조정, 캐싱 강화

### 8.3 데이터 일관성
- API 데이터 변경 시 동기화 문제
- **해결방법**: 주기적 업데이트, 버전 관리

## 9. 모니터링 및 유지보수

### 9.1 로그 모니터링
- API 호출 실패율 추적
- 응답 시간 모니터링
- 에러 패턴 분석

### 9.2 성능 지표
- 초기화 성공률
- API 호출 평균 응답 시간
- 데이터베이스 저장 성능

### 9.3 정기 점검
- 주기적인 전체 포켓몬 데이터 동기화
- API 호출 안정성 확인
- 데이터베이스 제약조건 검토

## 10. 결론

이러한 문제들을 해결함으로써:
- **안정성**: API 호출 실패율 대폭 감소
- **성능**: 응답 시간 일정화 및 최적화
- **유지보수성**: 로깅 개선으로 디버깅 용이성 향상
- **확장성**: 대량 데이터 처리 능력 향상

앞으로도 지속적인 모니터링과 개선을 통해 더욱 안정적인 시스템을 구축할 수 있습니다. 