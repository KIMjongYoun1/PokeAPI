package com.pokeapi.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.pokeapi.backend.dto.PokemonDTO;
import com.pokeapi.backend.repository.PokemonRepository;
import java.util.List;
import java.util.Optional;
import com.pokeapi.backend.entity.Pokemon;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// ===== Spring Boot 자동 제공 기능들 =====
// @Service: Spring Bean으로 등록, 비즈니스 로직 담당
// @Autowired: 의존성 자동 주입
// WebClient: HTTP 클라이언트 (WebClientConfig에서 Bean 제공)
// ObjectMapper: JSON 변환 (Spring Boot 자동 설정)
// Logger: SLF4J 로깅 (Spring Boot 기본 로깅)


@Service
public class PokemonService {

    private static final Logger logger = LoggerFactory.getLogger(PokemonService.class);

    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private WebClient webClient;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 포켓몬 이름으로 검색 (DB 우선 조회 → 외부 API 호출 → 캐싱)
     * 
     * @param name 포켓몬 이름
     * @return PokemonDTO 또는 null
     */
    public PokemonDTO searchPokemonName(String name){
        // 1단계: DB에서 캐시된 데이터 조회 (빠른 응답)
        Optional<Pokemon> pokemon = pokemonRepository.findByName(name);
        
        if (pokemon.isPresent()) {
            return convertToDTO(pokemon.get());  // 캐시 히트: DB에서 바로 반환
        }
        
        // 2단계: 캐시 미스 시 외부 API 호출 (실시간 데이터)
        try {
            logger.info("DB에 {} 정보가 없어서 외부 API 호출 시작", name);
            PokemonDTO pokemonDTO = callPokeApi(name);
            if (pokemonDTO != null) {
                // 3단계: 외부 데이터를 DB에 캐싱 (다음 요청을 위한 성능 최적화)
                savePokemon(pokemonDTO);
                logger.info("{} 정보를 외부 API에서 가져와서 DB에 저장 완료", name);
                return pokemonDTO;
            }
        } catch (Exception e) {
            logger.error("외부 API 호출 실패 - 포켓몬: {}, 오류: {}", name, e.getMessage(), e);
        }
        
        // 4단계: 모든 소스에서 데이터를 찾을 수 없는 경우
        logger.warn("포켓몬 '{}'을(를) 찾을 수 없습니다. DB에도 없고 외부 API에서도 가져올 수 없음", name);
        return null;
    }

    /**
     * 전체 포켓몬 목록 조회 (함수형 프로그래밍 스타일)
     * 
     * @return 전체 포켓몬 DTO 리스트
     */
    public List<PokemonDTO> getAllPokemons(){
        List<Pokemon> pokemons = pokemonRepository.findAll();
        // 함수형 프로그래밍: Entity → DTO 변환을 스트림으로 처리
        return pokemons.stream()
            .map(this::convertToDTO)  // 메서드 레퍼런스로 변환 함수 적용
            .collect(Collectors.toList());  // 스트림 결과를 리스트로 수집
    }

    // Private Helper Methods
    
    /**
     * 외부 PokéAPI에서 포켓몬 정보를 가져오는 메서드
     * 
     * @param name 포켓몬 이름 (예: "pikachu", "bulbasaur")
     * @return PokemonDTO 객체 (성공 시) 또는 null (실패 시)
     */
    private PokemonDTO callPokeApi(String name) {
        try {
            // 1단계: API 호출 시작 로그 기록
            logger.info("PokéAPI 호출 시작: {}", name);
            
            // 2단계: WebClient를 사용한 HTTP GET 요청 생성
            // webClient.get() → HTTP GET 요청 빌더 생성
            // .uri() → 요청 URL 설정 (중괄호는 파라미터 자리)
            // .retrieve() → HTTP 응답 처리 준비
            // .bodyToMono(String.class) → 응답을 String 타입으로 받기
            // .block() → 비동기 요청을 동기로 변환 (응답이 올 때까지 기다림)
            String response = webClient.get()
                .uri("https://pokeapi.co/api/v2/pokemon/{name}", name)
                .retrieve()
                .bodyToMono(String.class)
                .block();
            
            // 3단계: 응답이 null이 아닌지 확인 (유효한 응답인지 검증)
            if (response != null) {
                // 4단계: JSON 문자열을 PokemonDTO 객체로 변환
                // objectMapper.readValue() → JSON을 Java 객체로 역직렬화
                // response → PokéAPI에서 받은 JSON 문자열
                // PokemonDTO.class → 변환할 타입
                PokemonDTO pokemonDTO = objectMapper.readValue(response, PokemonDTO.class);
                
                // 5단계: 성공 로그 기록
                logger.info("PokéAPI에서 {} 정보 성공적으로 가져옴", name);
                
                // 6단계: 변환된 PokemonDTO 객체 반환
                return pokemonDTO;
            }
            
        } catch (Exception e) {
            // 7단계: 에러 발생 시 에러 로그 기록
            // logger.error() → 에러 레벨 로그
            // e.getMessage() → 에러 메시지
            // e → 전체 스택 트레이스 (디버깅용)
            logger.error("PokéAPI 호출 실패 - 포켓몬: {}, 오류: {}", name, e.getMessage(), e);
        }
        
        // 8단계: 실패 시 null 반환 (에러 발생 또는 응답이 null인 경우)
        return null;
    }
    /**
     * Entity를 DTO로 변환 (데이터 계층 분리)
     * 
     * @param entity 데이터베이스 엔티티
     * @return API 응답용 DTO
     */
    private PokemonDTO convertToDTO(Pokemon entity){
        PokemonDTO dto = new PokemonDTO();
        dto.setName(entity.getName());
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        // JSON 문자열을 리스트로 역직렬화 (DB 저장 형태 → API 응답 형태)
        dto.setTypes(convertJsonToList(entity.getTypes()));
        dto.setAbilities(convertJsonToList(entity.getAbilities()));
        dto.setStats(convertJsonToStats(entity.getStats()));
        dto.setSpriteUrl(entity.getSpriteUrl());
        dto.setShinySpriteUrl(entity.getShinySpriteUrl());
        return dto;
    }

    /**
     * DTO를 Entity로 변환 (API 요청 → DB 저장 형태)
     * 
     * @param dto API 요청/응답용 DTO
     * @return 데이터베이스 저장용 엔티티
     */
    private Pokemon convertToEntity(PokemonDTO dto){
        Pokemon pokemon = new Pokemon();
        pokemon.setName(dto.getName());
        pokemon.setHeight(dto.getHeight());
        pokemon.setWeight(dto.getWeight());
        // 리스트를 JSON 문자열로 직렬화 (API 응답 형태 → DB 저장 형태)
        pokemon.setTypes(convertListToJson(dto.getTypes()));
        pokemon.setAbilities(convertListToJson(dto.getAbilities()));
        pokemon.setStats(convertStatsToJson(dto.getStats()));
        pokemon.setSpriteUrl(dto.getSpriteUrl());
        pokemon.setShinySpriteUrl(dto.getShinySpriteUrl());
        return pokemon;
    }

    /**
     * 포켓몬 데이터를 데이터베이스에 저장 (캐싱)
     * 
     * @param dto 저장할 포켓몬 DTO
     * @return 저장된 엔티티 (ID 포함)
     */
    private Pokemon savePokemon(PokemonDTO dto){
        Pokemon pokemon = convertToEntity(dto);  // DTO → Entity 변환
        return pokemonRepository.save(pokemon);  // JPA를 통한 DB 저장
    }

    /**
     * String 리스트를 JSON 문자열로 직렬화 (DB 저장용)
     * 
     * @param list 변환할 String 리스트
     * @return JSON 문자열 또는 "[]" (에러 시)
     */
    private String convertListToJson(List<String> list){
        try {
            return objectMapper.writeValueAsString(list);  // Jackson ObjectMapper 사용
        } catch (Exception e) {
            return "[]";  // 에러 시 빈 배열 JSON 반환
        }
    }
    
    /**
     * JSON 문자열을 String 리스트로 역직렬화 (DB 조회용)
     * 
     * @param json JSON 문자열
     * @return String 리스트 또는 빈 리스트 (에러 시)
     */
    private List<String> convertJsonToList(String json){
        try {
            // 제네릭 타입 정보를 명시적으로 생성 (List<String>)
            return objectMapper.readValue(json, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            return new ArrayList<>();  // 에러 시 빈 리스트 반환
        }
    }
    
    /**
     * StatDTO 리스트를 JSON 문자열로 직렬화
     * 
     * @param stats StatDTO 리스트
     * @return JSON 문자열 또는 "[]" (에러 시)
     */
    private String convertStatsToJson(List<PokemonDTO.StatDTO> stats){
        try {
            return objectMapper.writeValueAsString(stats);
        } catch (Exception e) {
            return "[]";
        }
    }
    
    /**
     * JSON 문자열을 StatDTO 리스트로 역직렬화
     * 
     * @param json JSON 문자열
     * @return StatDTO 리스트 또는 빈 리스트 (에러 시)
     */
    private List<PokemonDTO.StatDTO> convertJsonToStats(String json){
        try {
            // 복잡한 제네릭 타입 (List<StatDTO>) 정보 생성
            return objectMapper.readValue(json, 
                objectMapper.getTypeFactory().constructCollectionType(List.class, PokemonDTO.StatDTO.class));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
    /**
     * 포켓몬 이름으로 스프라이트 URL 생성
     * 
     * @param name 포켓몬 이름
     * @return GitHub 스프라이트 URL 또는 빈 문자열 (에러 시)
     */
    private String generateSpriteUrl(String name){
        try {
            // String.format으로 URL 템플릿에 파라미터 삽입
            return String.format("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/%s.png", name);
        } catch (Exception e) {
            return "";
        }
    }
    
    /**
     * 포켓몬 ID로 샤이니 스프라이트 URL 생성
     * 
     * @param pokemonId 포켓몬 ID
     * @return GitHub 샤이니 스프라이트 URL 또는 빈 문자열 (에러 시)
     */
    private String generateShinySpriteUrl(Integer pokemonId){
        try {
            // %d는 정수형 파라미터, %s는 문자열 파라미터
            return String.format("https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/%d.png", pokemonId);
        } catch (Exception e) {
            return "";
        }
    }




}
