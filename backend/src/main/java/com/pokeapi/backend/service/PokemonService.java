package com.pokeapi.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pokeapi.backend.dto.EvolutionDTO;
import com.pokeapi.backend.dto.PokemonDTO;
import com.pokeapi.backend.dto.SpeciesDTO;
import com.pokeapi.backend.dto.PokemonApiResponseDTO;
import com.pokeapi.backend.repository.PokemonRepository;
import com.pokeapi.backend.repository.PokemonNameMappingRepository;
import com.pokeapi.backend.entity.PokemonNameMapping;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.pokeapi.backend.entity.Pokemon;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.Set;
import java.util.HashMap;
import jakarta.annotation.PostConstruct;

    

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

    @Autowired
    private PokemonNameMappingRepository pokemonNameMappingRepository;

 

    /**
     * 포켓몬 이름으로 검색 (DB 우선 조회 → 외부 API 호출 → 캐싱)
     * 
     * @param name 포켓몬 이름
     * @return PokemonDTO 또는 null
     */
    public PokemonDTO searchPokemonName(String name) {
        // 1단계: DB에서 캐시된 데이터 조회 (빠른 응답)
        Optional<Pokemon> pokemon = pokemonRepository.findByNameOrKoreanName(name, name);

        if (pokemon.isPresent()) {
            return convertToDTO(pokemon.get()); // 캐시 히트: DB에서 바로 반환
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
    public List<PokemonDTO> getAllPokemons() {
        List<Pokemon> pokemons = pokemonRepository.findAll();
        // 함수형 프로그래밍: Entity → DTO 변환을 스트림으로 처리
        return pokemons.stream()
                .map(this::convertToDTO) // 메서드 레퍼런스로 변환 함수 적용
                .collect(Collectors.toList()); // 스트림 결과를 리스트로 수집
    }

    /**
     * 페이징 처리가 포함된 포켓몬 목록 조회
     * 
     * @param page 페이지 번호 (0부터 시작)
     * @param size 페이지당 항목 수
     * @param generation 세대 번호 (1-9)
     * @return 페이징 정보와 포켓몬 목록
     */
    public Map<String, Object> getPokemonsWithPaging(int page, int size, int generation) {
        try {
            // 세대별 포켓몬 ID 범위 정의
            Map<Integer, int[]> generationRanges = new HashMap<>();
            generationRanges.put(1, new int[]{1, 151});      // 1세대: 1-151
            generationRanges.put(2, new int[]{152, 251});    // 2세대: 152-251
            generationRanges.put(3, new int[]{252, 386});    // 3세대: 252-386
            generationRanges.put(4, new int[]{387, 493});    // 4세대: 387-493
            generationRanges.put(5, new int[]{494, 649});    // 5세대: 494-649
            generationRanges.put(6, new int[]{650, 721});    // 6세대: 650-721
            generationRanges.put(7, new int[]{722, 809});    // 7세대: 722-809
            generationRanges.put(8, new int[]{810, 898});    // 8세대: 810-898
            generationRanges.put(9, new int[]{899, 1010});   // 9세대: 899-1010

            int[] range = generationRanges.getOrDefault(generation, new int[]{1, 151});
            int startId = range[0];
            int endId = range[1];

            // 해당 세대의 포켓몬만 조회
            List<Pokemon> pokemons = pokemonRepository.findByPokemonIdBetween(startId, endId);
            
            // 페이징 처리
            int totalSize = pokemons.size();
            int totalPages = (int) Math.ceil((double) totalSize / size);
            int startIndex = page * size;
            int endIndex = Math.min(startIndex + size, totalSize);
            
            List<PokemonDTO> pagedPokemons = pokemons.subList(startIndex, endIndex)
                    .stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());

            // 응답 데이터 구성
            Map<String, Object> response = new HashMap<>();
            response.put("content", pagedPokemons);
            response.put("page", page);
            response.put("size", size);
            response.put("totalElements", totalSize);
            response.put("totalPages", totalPages);
            response.put("generation", generation);
            response.put("hasNext", page < totalPages - 1);
            response.put("hasPrevious", page > 0);

            logger.info("페이징 포켓몬 조회 완료: 세대={}, 페이지={}, 크기={}, 총={}개", 
                    generation, page, size, totalSize);

            return response;

        } catch (Exception e) {
            logger.error("페이징 포켓몬 조회 실패: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 고급 검색 기능 - 다양한 조건으로 포켓몬 검색
     * 
     * @param type       타입 (예: "Electric", "Fire")
     * @param minHeight  최소 키 (cm)
     * @param maxHeight  최대 키 (cm)
     * @param minWeight  최소 몸무게 (g)
     * @param maxWeight  최대 몸무게 (g)
     * @param minAttack  최소 공격력
     * @param maxAttack  최대 공격력
     * @param minDefense 최소 방어력
     * @param maxDefense 최대 방어력
     * @param minHp      최소 HP
     * @param maxHp      최대 HP
     * @param minSpeed   최소 속도
     * @param maxSpeed   최대 속도
     * @return 조건에 맞는 포켓몬 리스트
     */
    public List<PokemonDTO> advancedSearch(
            String type, Integer minHeight, Integer maxHeight,
            Integer minWeight, Integer maxWeight,
            Integer minAttack, Integer maxAttack,
            Integer minDefense, Integer maxDefense,
            Integer minHp, Integer maxHp,
            Integer minSpeed, Integer maxSpeed) {

        // 1단계: DB에서 모든 포켓몬 조회
        List<Pokemon> allPokemons = pokemonRepository.findAll();

        // 2단계: 스트림을 사용한 필터링 (함수형 프로그래밍)
        return allPokemons.stream()
                .map(this::convertToDTO) // Entity → DTO 변환
                .filter(pokemon -> filterByType(pokemon, type)) // 타입 필터
                .filter(pokemon -> filterByHeight(pokemon, minHeight, maxHeight)) // 키 필터
                .filter(pokemon -> filterByWeight(pokemon, minWeight, maxWeight)) // 몸무게 필터
                .filter(pokemon -> filterByStats(pokemon, minAttack, maxAttack, minDefense, maxDefense, minHp, maxHp,
                        minSpeed, maxSpeed)) // 능력치 필터
                .collect(Collectors.toList()); // 결과 수집
    }

    // Private Helper Methods for Advanced Search
    private boolean filterByType(PokemonDTO pokemon, String type) {
        if (type == null || type.trim().isEmpty())
            return true;
        return pokemon.getTypes() != null &&
                pokemon.getTypes().stream()
                        .anyMatch(t -> t.equalsIgnoreCase(type.trim()));
    }

    private boolean filterByHeight(PokemonDTO pokemon, Integer minHeight, Integer maxHeight) {
        if (minHeight != null && pokemon.getHeight() < minHeight)
            return false;
        if (maxHeight != null && pokemon.getHeight() > maxHeight)
            return false;
        return true;
    }

    private boolean filterByWeight(PokemonDTO pokemon, Integer minWeight, Integer maxWeight) {
        if (minWeight != null && pokemon.getWeight() < minWeight)
            return false;
        if (maxWeight != null && pokemon.getWeight() > maxWeight)
            return false;
        return true;
    }

    private boolean filterByStats(PokemonDTO pokemon,
            Integer minAttack, Integer maxAttack,
            Integer minDefense, Integer maxDefense,
            Integer minHp, Integer maxHp,
            Integer minSpeed, Integer maxSpeed) {

        if (pokemon.getStats() == null)
            return true;

        // 능력치 맵 생성 (이름 → 수치)
        Map<String, Integer> statsMap = pokemon.getStats().stream()
                .collect(Collectors.toMap(
                        stat -> stat.getName().toLowerCase(),
                        PokemonDTO.StatDTO::getBaseStat));

        // 각 능력치별 필터링
        if (minAttack != null && statsMap.get("attack") != null && statsMap.get("attack") < minAttack)
            return false;
        if (maxAttack != null && statsMap.get("attack") != null && statsMap.get("attack") > maxAttack)
            return false;

        if (minDefense != null && statsMap.get("defense") != null && statsMap.get("defense") < minDefense)
            return false;
        if (maxDefense != null && statsMap.get("defense") != null && statsMap.get("defense") > maxDefense)
            return false;

        if (minHp != null && statsMap.get("hp") != null && statsMap.get("hp") < minHp)
            return false;
        if (maxHp != null && statsMap.get("hp") != null && statsMap.get("hp") > maxHp)
            return false;

        if (minSpeed != null && statsMap.get("speed") != null && statsMap.get("speed") < minSpeed)
            return false;
        if (maxSpeed != null && statsMap.get("speed") != null && statsMap.get("speed") > maxSpeed)
            return false;

        return true;
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
            // 1단계: 한글 이름을 영문 이름으로 변환
            String englishName = convertKoreanToEnglish(name);
            logger.info("PokéAPI 호출 시작: {} -> {}", name, englishName);

            // 2단계: WebClient를 사용한 HTTP GET 요청 생성 (영문 이름 사용)
            String response = webClient.get()
                    .uri("/pokemon/{name}", englishName)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // 3단계: 응답이 null이 아닌지 확인 (유효한 응답인지 검증)
            if (response != null) {
                // 4단계: JSON 문자열을 타입 안전한 DTO로 변환
                PokemonApiResponseDTO pokemonData = objectMapper.readValue(response, PokemonApiResponseDTO.class);
                PokemonDTO pokemonDTO = new PokemonDTO();

                // 기본정보 매핑
                pokemonDTO.setPokemonId(pokemonData.getId());
                pokemonDTO.setName(pokemonData.getName());
                pokemonDTO.setBaseExperience(pokemonData.getBaseExperience());
                pokemonDTO.setHeight(pokemonData.getHeight());
                pokemonDTO.setWeight(pokemonData.getWeight());

                // 스프라이트Url 매핑
                if (pokemonData.getSprites() != null) {
                    pokemonDTO.setSpriteUrl(pokemonData.getSprites().getFrontDefault());
                    pokemonDTO.setShinySpriteUrl(pokemonData.getSprites().getFrontShiny());
                }

                // 타입 매핑
                List<String> typeNames = new ArrayList<>();
                if (pokemonData.getTypes() != null) {
                    for (PokemonApiResponseDTO.TypeEntryDTO type : pokemonData.getTypes()) {
                        if (type.getType() != null) {
                            typeNames.add(type.getType().getName());
                        }
                    }
                }
                pokemonDTO.setTypes(typeNames);

                // 능력치 정보 매핑
                List<PokemonDTO.StatDTO> statDTOs = new ArrayList<>();
                if (pokemonData.getStats() != null) {
                    for (PokemonApiResponseDTO.StatEntryDTO stat : pokemonData.getStats()) {
                        PokemonDTO.StatDTO statDTO = new PokemonDTO.StatDTO();
                        statDTO.setBaseStat(stat.getBaseStat());
                        statDTO.setEffort(stat.getEffort());

                        if (stat.getStat() != null) {
                            statDTO.setName(stat.getStat().getName());
                        }

                        statDTOs.add(statDTO);
                    }
                }
                pokemonDTO.setStats(statDTOs);

                // 특성정보 매핑
                List<String> abilityNames = new ArrayList<>();
                if (pokemonData.getAbilities() != null) {
                    for (PokemonApiResponseDTO.AbilityEntryDTO ability : pokemonData.getAbilities()) {
                        if (ability.getAbility() != null) {
                            abilityNames.add(ability.getAbility().getName());
                        }
                    }
                }
                pokemonDTO.setAbilities(abilityNames);

                // 한글 이름과 설명 가져오기
                String koreanName = getPokemonKoreanName(name);
                pokemonDTO.setKoreanName(koreanName);
                String description = getPokemonDescription(name);
                pokemonDTO.setDescription(description);
                
                // 5단계: 성공 로그 기록
                logger.info("PokéAPI에서 {} 정보 성공적으로 가져옴", name);
                // 디버깅용: DTO 값 확인
                logger.debug("[callPokeApi] PokemonDTO 생성 결과: baseExp={}, height={}, weight={}, name={}",
                    pokemonDTO.getBaseExperience(), pokemonDTO.getHeight(), pokemonDTO.getWeight(), pokemonDTO.getName());
                // 6단계: 변환된 PokemonDTO 객체 반환
                return pokemonDTO;
            }

        } catch (Exception e) {
            // 7단계: 에러 발생 시 에러 로그 기록
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
    private PokemonDTO convertToDTO(Pokemon entity) {
        PokemonDTO dto = new PokemonDTO();
        dto.setPokemonId(entity.getPokemonId());
        dto.setName(entity.getName());
        dto.setKoreanName(entity.getKoreanName());
        dto.setBaseExperience(entity.getBaseExperience()); // 추가
        dto.setPokemonId(entity.getPokemonId());           // 추가
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        dto.setTypes(convertJsonToList(entity.getTypes()));
        // dto.setKoreanTypes(convertJsonToList(entity.getKoreanTypes())); // 수정
        dto.setAbilities(convertJsonToList(entity.getAbilities()));
        dto.setStats(convertJsonToStats(entity.getStats()));
        dto.setSpriteUrl(entity.getSpriteUrl());
        dto.setShinySpriteUrl(entity.getShinySpriteUrl());
        dto.setOfficialArtworkUrl(entity.getOfficialArtworkUrl()); // 추가
        dto.setDescription(entity.getDescription());               // 추가
        return dto;
    }

    /**
     * DTO를 Entity로 변환 (API 요청 → DB 저장 형태)
     * 
     * @param dto API 요청/응답용 DTO
     * @return 데이터베이스 저장용 엔티티
     */
    private Pokemon convertToEntity(PokemonDTO dto) {
        Pokemon pokemon = new Pokemon();
        pokemon.setPokemonId(dto.getPokemonId());
        pokemon.setName(dto.getName());
        pokemon.setKoreanName(dto.getKoreanName());
        pokemon.setBaseExperience(dto.getBaseExperience()); // 이 줄이 반드시 필요!
        pokemon.setHeight(dto.getHeight());
        pokemon.setWeight(dto.getWeight());
        pokemon.setTypes(convertListToJson(dto.getTypes()));
        // pokemon.setKoreanTypes(convertListToJson(dto.getKoreanTypes()));
        pokemon.setAbilities(convertListToJson(dto.getAbilities()));
        pokemon.setStats(convertStatsToJson(dto.getStats()));
        pokemon.setSpriteUrl(dto.getSpriteUrl());
        pokemon.setShinySpriteUrl(dto.getShinySpriteUrl());
        pokemon.setOfficialArtworkUrl(dto.getOfficialArtworkUrl());
        pokemon.setDescription(dto.getDescription());
       
        // 디버깅용: Entity 값 확인
        logger.debug("[convertToEntity] Entity 값: baseExp={}, height={}, weight={}, name={}",
            dto.getBaseExperience(), dto.getHeight(), dto.getWeight(), dto.getName());
        return pokemon;
    }

    /**
     * 포켓몬 데이터를 데이터베이스에 저장 (캐싱)
     * 
     * @param dto 저장할 포켓몬 DTO
     * @return 저장된 엔티티 (ID 포함)
     */
    private Pokemon savePokemon(PokemonDTO dto) {
        // 디버깅용: DB 저장 전 DTO 값 확인
        logger.debug("[savePokemon] DB 저장 전 DTO 값: baseExp={}, height={}, weight={}, name={}",
            dto.getBaseExperience(), dto.getHeight(), dto.getWeight(), dto.getName());
        Pokemon pokemon = convertToEntity(dto); // DTO → Entity 변환
        return pokemonRepository.save(pokemon); // JPA를 통한 DB 저장
    }

    /**
     * String 리스트를 JSON 문자열로 직렬화 (DB 저장용)
     * 
     * @param list 변환할 String 리스트
     * @return JSON 문자열 또는 "[]" (에러 시)
     */
    private String convertListToJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list); // Jackson ObjectMapper 사용
        } catch (Exception e) {
            return "[]"; // 에러 시 빈 배열 JSON 반환
        }
    }

    /**
     * JSON 문자열을 String 리스트로 역직렬화 (DB 조회용)
     * 
     * @param json JSON 문자열
     * @return String 리스트 또는 빈 리스트 (에러 시)
     */
    private List<String> convertJsonToList(String json) {
        try {
            // 제네릭 타입 정보를 명시적으로 생성 (List<String>)
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
        } catch (Exception e) {
            return new ArrayList<>(); // 에러 시 빈 리스트 반환
        }
    }

    /**
     * StatDTO 리스트를 JSON 문자열로 직렬화
     * 
     * @param stats StatDTO 리스트
     * @return JSON 문자열 또는 "[]" (에러 시)
     */
    private String convertStatsToJson(List<PokemonDTO.StatDTO> stats) {
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
    private List<PokemonDTO.StatDTO> convertJsonToStats(String json) {
        try {
            // 복잡한 제네릭 타입 (List<StatDTO>) 정보 생성
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, PokemonDTO.StatDTO.class));
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    /**
     * PokeAPI에서 포켓몬 설명을 가져오는 메서드
     * 
     * @param name 포켓몬 이름(예: "pikacu", "bulbasaur")
     * @return 포켓몬 설명 (한국어) 또는 빈 문자열(실패시)
     */
    private String getPokemonDescription(String name) {
        try {
            logger.info("Species API 호출 시작: {}", name);

            // 1단계 Species API 호출
            String response = webClient.get()
                    .uri("/pokemon-species/{name}", name)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // 2단계: 응답이 null이 아닌지 확인
            if (response != null) {
                SpeciesDTO speciesData = objectMapper.readValue(response, SpeciesDTO.class);

                // 3단계 flavor_text_entries 추출
                if (speciesData.getFlavorTextEntries() != null) {
                    String koDescription = null;
                    String enDescription = null;

                    for (SpeciesDTO.FlavorTextEntryDTO flavorText : speciesData.getFlavorTextEntries()) {
                        if (flavorText.getLanguage() != null) {
                            String languageName = flavorText.getLanguage().getName();
                            String text = flavorText.getFlavorText();

                            if ("ko".equals(languageName)) {
                                koDescription = text;
                                break;
                            } else if ("en".equals(languageName) && enDescription == null) {
                                enDescription = text;
                            }
                        }
                    }

                    if (koDescription != null) {
                        logger.info("Species API에서 {} 한국어 설명 가져옴 성공", name);
                        return koDescription;
                    } else if (enDescription != null) {
                        logger.info("Species API에서 {} 영어 설명 가져옴 성공", name);
                        return enDescription;
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Species API 호출 실패 - 포켓몬: {}, 오류: {}", name, e.getMessage(), e);
        }
        return "";
    }

    /**
     * Species API에서 포켓몬 한글 이름만 가져오는 메서드
     * 
     */

    private String getPokemonKoreanName(String name) {
        try {
            String speciesResponse = webClient.get()
                    .uri("/pokemon-species/{name}", name)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (speciesResponse != null) {
                SpeciesDTO speciesData = objectMapper.readValue(speciesResponse, SpeciesDTO.class);

                // 한글이름 추출
                if (speciesData.getNames() != null) {
                    for (SpeciesDTO.NameEntryDTO nameEntry : speciesData.getNames()) {
                        if (nameEntry.getLanguage() != null && "ko".equals(nameEntry.getLanguage().getName())) {
                            return nameEntry.getName();
                            }
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Species API 호출 실패 - 포켓몬: {}, 오류: {}", name, e.getMessage(), e);
        }
        return "";
    }

    /*
     * 타입별 포켓몬 조회
     * 
     * @param type 타입
     * 
     * @return 타입별 포켓몬 리스트
     */
   
    public List<PokemonDTO> getPokemonByType(String type) {
        if (type == null || type.trim().isEmpty()) {
            logger.warn("타입 검색 파라미터가 비었습니다.");
            return new ArrayList<>();
        }
        try {
            String searchType = type.trim();
            if (isEnglishType(searchType)) {
                searchType = convertEnglishTypeToKorean(searchType);
            }
            List<Pokemon> pokemons = pokemonRepository.findByKoreanTypeContaining(searchType);
            List<PokemonDTO> result = pokemons.stream()
                            .map(this::convertToDTO)
                            .collect(Collectors.toList());
            logger.info("타입별 포켓몬 조회 결과 : {} 건", result.size());
            return result;
        } catch (Exception e) {
            logger.error("타입별 포켓몬 조회 실패 : {}", e.getMessage(), e);
            return new ArrayList<>();
            
        }
    }
    /**
 * 영문 타입인지 확인
 */
private boolean isEnglishType(String type) {
    Set<String> englishTypes = Set.of(
        "normal", "fire", "water", "electric", "grass", "ice", "fighting",
        "poison", "ground", "flying", "psychic", "bug", "rock", "ghost",
        "dragon", "dark", "steel", "fairy"
    );
    return englishTypes.contains(type.toLowerCase());
}


    /**
     * 한글 포켓몬 이름을 영문 이름으로 동적 변환 (DB 캐싱 + 외부 API)
     */
    private String convertKoreanToEnglish(String koreanName) {
        try {
            // 1단계: DB 캐시에서 먼저 조회
            Optional<PokemonNameMapping> cachedMapping = pokemonNameMappingRepository.findByKoreanName(koreanName);
            if (cachedMapping.isPresent()) {
                logger.info("DB 캐시에서 한글 이름 변환 성공: {} -> {}", koreanName, cachedMapping.get().getEnglishName());
                return cachedMapping.get().getEnglishName();
            }

            // 2단계: 캐시에 없으면 외부 API로 동적 검색
            logger.info("DB 캐시에 없어서 외부 API로 한글 이름 변환 시작: {}", koreanName);
            String englishName = searchEnglishNameFromApi(koreanName);
            
            if (englishName != null && !englishName.equals(koreanName)) {
                // 3단계: 찾은 매핑을 DB에 캐싱
                saveNameMapping(koreanName, englishName);
                logger.info("외부 API에서 한글 이름 변환 성공 및 캐싱: {} -> {}", koreanName, englishName);
                return englishName;
            }
            
        } catch (Exception e) {
            logger.error("한글 이름 변환 실패: {}, 오류: {}", koreanName, e.getMessage(), e);
        }
        
        // 4단계: 변환 실패시 원본 반환
        logger.warn("한글 이름 변환 실패, 원본 반환: {}", koreanName);
        return koreanName;
    }

    /**
     * 외부 API를 통해 한글 이름으로 영문 이름 검색 (1세대 포켓몬만)
     */
    private String searchEnglishNameFromApi(String koreanName) {
        // 1세대 포켓몬 한글-영문 매핑 (임시로 하드코딩)
        Map<String, String> firstGenMapping = new HashMap<>();
        firstGenMapping.put("꼬부기", "squirtle");
        firstGenMapping.put("피카츄", "pikachu");
        firstGenMapping.put("파이리", "charmander");
        firstGenMapping.put("이상해씨", "bulbasaur");
        firstGenMapping.put("라이츄", "raichu");
        firstGenMapping.put("구구", "rattata");
        firstGenMapping.put("레트라", "raticate");
        firstGenMapping.put("아보", "ekans");
        firstGenMapping.put("아보크", "arbok");
        firstGenMapping.put("모래두지", "sandshrew");
        firstGenMapping.put("고지", "sandslash");
        firstGenMapping.put("니드런♀", "nidoran-f");
        firstGenMapping.put("니드리나", "nidorina");
        firstGenMapping.put("니드퀸", "nidoqueen");
        firstGenMapping.put("니드런♂", "nidoran-m");
        firstGenMapping.put("니드리노", "nidorino");
        firstGenMapping.put("니드킹", "nidoking");
        firstGenMapping.put("삐", "clefairy");
        firstGenMapping.put("픽시", "clefable");
        firstGenMapping.put("주뱃", "zubat");
        firstGenMapping.put("골뱃", "golbat");
        firstGenMapping.put("뚜벅쵸", "oddish");
        firstGenMapping.put("냄새꼬", "gloom");
        firstGenMapping.put("라플레시아", "vileplume");
        firstGenMapping.put("파라스", "paras");
        firstGenMapping.put("파라섹트", "parasect");
        firstGenMapping.put("콘팡", "venonat");
        firstGenMapping.put("도나리", "venomoth");
        firstGenMapping.put("디그다", "diglett");
        firstGenMapping.put("닥트리오", "dugtrio");
        firstGenMapping.put("나옹", "meowth");
        firstGenMapping.put("페르시온", "persian");
        firstGenMapping.put("고라파덕", "psyduck");
        firstGenMapping.put("골덕", "golduck");
        firstGenMapping.put("망키", "mankey");
        firstGenMapping.put("성원숭이", "primeape");
        firstGenMapping.put("가디", "growlithe");
        firstGenMapping.put("윈디", "arcanine");
        firstGenMapping.put("발챙이", "poliwag");
        firstGenMapping.put("슈륙챙이", "poliwhirl");
        firstGenMapping.put("강챙이", "poliwrath");
        firstGenMapping.put("케이시", "abra");
        firstGenMapping.put("윤겔라", "kadabra");
        firstGenMapping.put("후딘", "alakazam");
        firstGenMapping.put("근육몬", "machop");
        firstGenMapping.put("근육통", "machoke");
        firstGenMapping.put("괴력몬", "machamp");
        firstGenMapping.put("캐이시", "bellsprout");
        firstGenMapping.put("우츠동", "weepinbell");
        firstGenMapping.put("우츠보트", "victreebel");
        firstGenMapping.put("딱충이", "tentacool");
        firstGenMapping.put("슬리프", "tentacruel");
        firstGenMapping.put("구렁이", "geodude");
        firstGenMapping.put("데구리", "graveler");
        firstGenMapping.put("딱구리", "golem");
        firstGenMapping.put("포니타", "ponyta");
        firstGenMapping.put("날쌩마", "rapidash");
        firstGenMapping.put("야돈", "slowpoke");
        firstGenMapping.put("야도란", "slowbro");
        firstGenMapping.put("코일", "magnemite");
        firstGenMapping.put("레어코일", "magneton");
        firstGenMapping.put("파오리", "farfetchd");
        firstGenMapping.put("두두", "doduo");
        firstGenMapping.put("두트리오", "dodrio");
        firstGenMapping.put("쥬쥬", "seel");
        firstGenMapping.put("쥬레곤", "dewgong");
        firstGenMapping.put("질뻐기", "grimer");
        firstGenMapping.put("셀러", "shellder");
        firstGenMapping.put("파르셀", "cloyster");
        firstGenMapping.put("고오스", "gastly");
        firstGenMapping.put("고우스트", "haunter");
        firstGenMapping.put("팬텀", "gengar");
        firstGenMapping.put("롱스톤", "onix");
        firstGenMapping.put("슬리프", "drowzee");
        firstGenMapping.put("슬리퍼", "hypno");
        firstGenMapping.put("크랩", "krabby");
        firstGenMapping.put("킹크랩", "kingler");
        firstGenMapping.put("찌리리공", "voltorb");
        firstGenMapping.put("붐볼", "electrode");
        firstGenMapping.put("아라리", "exeggcute");
        firstGenMapping.put("나시", "exeggutor");
        firstGenMapping.put("탕구리", "cubone");
        firstGenMapping.put("텅구리", "marowak");
        firstGenMapping.put("시라소몬", "hitmonlee");
        firstGenMapping.put("홍수몬", "hitmonchan");
        firstGenMapping.put("내루미", "lickitung");
        firstGenMapping.put("또가스", "koffing");
        firstGenMapping.put("또도가스", "weezing");
        firstGenMapping.put("뿔카노", "rhyhorn");
        firstGenMapping.put("코뿌리", "rhydon");
        firstGenMapping.put("럭키", "chansey");
        firstGenMapping.put("덩구리", "tangela");
        firstGenMapping.put("캥카", "kangaskhan");
        firstGenMapping.put("쏘드라", "horsea");
        firstGenMapping.put("시드라", "seadra");
        firstGenMapping.put("콘치", "goldeen");
        firstGenMapping.put("왕콘치", "seaking");
        firstGenMapping.put("별가사리", "staryu");
        firstGenMapping.put("아쿠스타", "starmie");
        firstGenMapping.put("마임맨", "mr-mime");
        firstGenMapping.put("스라크", "scyther");
        firstGenMapping.put("루주라", "jynx");
        firstGenMapping.put("에레브", "electabuzz");
        firstGenMapping.put("마그마", "magmar");
        firstGenMapping.put("쁘사이저", "pinsir");
        firstGenMapping.put("켄타로스", "tauros");
        firstGenMapping.put("잉어킹", "magikarp");
        firstGenMapping.put("갸라도스", "gyarados");
        firstGenMapping.put("라프라스", "lapras");
        firstGenMapping.put("메타몽", "ditto");
        firstGenMapping.put("이브이", "eevee");
        firstGenMapping.put("샤미드", "vaporeon");
        firstGenMapping.put("쥬피썬더", "jolteon");
        firstGenMapping.put("부스터", "flareon");
        firstGenMapping.put("폴리곤", "porygon");
        firstGenMapping.put("암나이트", "omanyte");
        firstGenMapping.put("암스타", "omastar");
        firstGenMapping.put("투구", "kabuto");
        firstGenMapping.put("투구푸스", "kabutops");
        firstGenMapping.put("프테라", "aerodactyl");
        firstGenMapping.put("잠만보", "snorlax");
        firstGenMapping.put("프리져", "articuno");
        firstGenMapping.put("썬더", "zapdos");
        firstGenMapping.put("파이어", "moltres");
        firstGenMapping.put("미뇽", "dratini");
        firstGenMapping.put("신뇽", "dragonair");
        firstGenMapping.put("망나뇽", "dragonite");
        firstGenMapping.put("뮤츠", "mewtwo");
        firstGenMapping.put("뮤", "mew");

        return firstGenMapping.get(koreanName);
    }

    /**
     * 이름 매핑을 DB에 저장 (캐싱)
     */
    private void saveNameMapping(String koreanName, String englishName) {
        try {
            // 포켓몬 ID 가져오기
            Integer pokemonId = getPokemonIdFromName(englishName);
            
            if (pokemonId != null) {
                PokemonNameMapping mapping = new PokemonNameMapping(koreanName, englishName, pokemonId);
                pokemonNameMappingRepository.save(mapping);
                logger.info("이름 매핑 캐싱 완료: {} -> {} (ID: {})", koreanName, englishName, pokemonId);
            }
        } catch (Exception e) {
            logger.error("이름 매핑 저장 실패: {} -> {}, 오류: {}", koreanName, englishName, e.getMessage());
        }
    }

    /**
     * 영문 이름으로 포켓몬 ID 가져오기
     */
    private Integer getPokemonIdFromName(String englishName) {
        try {
            String response = webClient.get()
                    .uri("/pokemon/{name}", englishName)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (response != null) {
                logger.debug("Pokemon API 응답: {}", response.substring(0, Math.min(200, response.length())));
                JsonNode root = objectMapper.readTree(response);
                JsonNode idNode = root.get("id");
                if (idNode != null) {
                    return idNode.asInt();
                }
            }
        } catch (Exception e) {
            logger.error("포켓몬 ID 조회 실패: {}, 오류: {}", englishName, e.getMessage(), e);
        }
        return null;
    }

    /**
     * 전체 포켓몬 목록을 DB에 미리 저장 (초기화용)
     */
    @PostConstruct
    public void initializePokemonData() {
        try {
            // 이미 데이터가 있으면 스킵
            if (pokemonNameMappingRepository.count() > 0) {
                logger.info("이미 포켓몬 데이터가 초기화되어 있습니다. 스킵합니다.");
                return;
            }

            logger.info("포켓몬 데이터 초기화 시작...");
            
            // 1세대 포켓몬 151마리 데이터 저장
            Map<String, String> firstGenMapping = new HashMap<>();
            firstGenMapping.put("꼬부기", "squirtle");
            firstGenMapping.put("피카츄", "pikachu");
            firstGenMapping.put("파이리", "charmander");
            firstGenMapping.put("이상해씨", "bulbasaur");
            firstGenMapping.put("라이츄", "raichu");
            firstGenMapping.put("구구", "rattata");
            firstGenMapping.put("레트라", "raticate");
            firstGenMapping.put("아보", "ekans");
            firstGenMapping.put("아보크", "arbok");
            firstGenMapping.put("모래두지", "sandshrew");
            firstGenMapping.put("고지", "sandslash");
            firstGenMapping.put("니드런♀", "nidoran-f");
            firstGenMapping.put("니드리나", "nidorina");
            firstGenMapping.put("니드퀸", "nidoqueen");
            firstGenMapping.put("니드런♂", "nidoran-m");
            firstGenMapping.put("니드리노", "nidorino");
            firstGenMapping.put("니드킹", "nidoking");
            firstGenMapping.put("삐", "clefairy");
            firstGenMapping.put("픽시", "clefable");
            firstGenMapping.put("주뱃", "zubat");
            firstGenMapping.put("골뱃", "golbat");
            firstGenMapping.put("뚜벅쵸", "oddish");
            firstGenMapping.put("냄새꼬", "gloom");
            firstGenMapping.put("라플레시아", "vileplume");
            firstGenMapping.put("파라스", "paras");
            firstGenMapping.put("파라섹트", "parasect");
            firstGenMapping.put("콘팡", "venonat");
            firstGenMapping.put("도나리", "venomoth");
            firstGenMapping.put("디그다", "diglett");
            firstGenMapping.put("닥트리오", "dugtrio");
            firstGenMapping.put("나옹", "meowth");
            firstGenMapping.put("페르시온", "persian");
            firstGenMapping.put("고라파덕", "psyduck");
            firstGenMapping.put("골덕", "golduck");
            firstGenMapping.put("망키", "mankey");
            firstGenMapping.put("성원숭이", "primeape");
            firstGenMapping.put("가디", "growlithe");
            firstGenMapping.put("윈디", "arcanine");
            firstGenMapping.put("발챙이", "poliwag");
            firstGenMapping.put("슈륙챙이", "poliwhirl");
            firstGenMapping.put("강챙이", "poliwrath");
            firstGenMapping.put("케이시", "abra");
            firstGenMapping.put("윤겔라", "kadabra");
            firstGenMapping.put("후딘", "alakazam");
            firstGenMapping.put("근육몬", "machop");
            firstGenMapping.put("근육통", "machoke");
            firstGenMapping.put("괴력몬", "machamp");
            firstGenMapping.put("캐이시", "bellsprout");
            firstGenMapping.put("우츠동", "weepinbell");
            firstGenMapping.put("우츠보트", "victreebel");
            firstGenMapping.put("딱충이", "tentacool");
            firstGenMapping.put("슬리프", "tentacruel");
            firstGenMapping.put("구렁이", "geodude");
            firstGenMapping.put("데구리", "graveler");
            firstGenMapping.put("딱구리", "golem");
            firstGenMapping.put("포니타", "ponyta");
            firstGenMapping.put("날쌩마", "rapidash");
            firstGenMapping.put("야돈", "slowpoke");
            firstGenMapping.put("야도란", "slowbro");
            firstGenMapping.put("코일", "magnemite");
            firstGenMapping.put("레어코일", "magneton");
            firstGenMapping.put("파오리", "farfetchd");
            firstGenMapping.put("두두", "doduo");
            firstGenMapping.put("두트리오", "dodrio");
            firstGenMapping.put("쥬쥬", "seel");
            firstGenMapping.put("쥬레곤", "dewgong");
            firstGenMapping.put("질뻐기", "grimer");
            firstGenMapping.put("셀러", "shellder");
            firstGenMapping.put("파르셀", "cloyster");
            firstGenMapping.put("고오스", "gastly");
            firstGenMapping.put("고우스트", "haunter");
            firstGenMapping.put("팬텀", "gengar");
            firstGenMapping.put("롱스톤", "onix");
            firstGenMapping.put("슬리프", "drowzee");
            firstGenMapping.put("슬리퍼", "hypno");
            firstGenMapping.put("크랩", "krabby");
            firstGenMapping.put("킹크랩", "kingler");
            firstGenMapping.put("찌리리공", "voltorb");
            firstGenMapping.put("붐볼", "electrode");
            firstGenMapping.put("아라리", "exeggcute");
            firstGenMapping.put("나시", "exeggutor");
            firstGenMapping.put("탕구리", "cubone");
            firstGenMapping.put("텅구리", "marowak");
            firstGenMapping.put("시라소몬", "hitmonlee");
            firstGenMapping.put("홍수몬", "hitmonchan");
            firstGenMapping.put("내루미", "lickitung");
            firstGenMapping.put("또가스", "koffing");
            firstGenMapping.put("또도가스", "weezing");
            firstGenMapping.put("뿔카노", "rhyhorn");
            firstGenMapping.put("코뿌리", "rhydon");
            firstGenMapping.put("럭키", "chansey");
            firstGenMapping.put("덩구리", "tangela");
            firstGenMapping.put("캥카", "kangaskhan");
            firstGenMapping.put("쏘드라", "horsea");
            firstGenMapping.put("시드라", "seadra");
            firstGenMapping.put("콘치", "goldeen");
            firstGenMapping.put("왕콘치", "seaking");
            firstGenMapping.put("별가사리", "staryu");
            firstGenMapping.put("아쿠스타", "starmie");
            firstGenMapping.put("마임맨", "mr-mime");
            firstGenMapping.put("스라크", "scyther");
            firstGenMapping.put("루주라", "jynx");
            firstGenMapping.put("에레브", "electabuzz");
            firstGenMapping.put("마그마", "magmar");
            firstGenMapping.put("쁘사이저", "pinsir");
            firstGenMapping.put("켄타로스", "tauros");
            firstGenMapping.put("잉어킹", "magikarp");
            firstGenMapping.put("갸라도스", "gyarados");
            firstGenMapping.put("라프라스", "lapras");
            firstGenMapping.put("메타몽", "ditto");
            firstGenMapping.put("이브이", "eevee");
            firstGenMapping.put("샤미드", "vaporeon");
            firstGenMapping.put("쥬피썬더", "jolteon");
            firstGenMapping.put("부스터", "flareon");
            firstGenMapping.put("폴리곤", "porygon");
            firstGenMapping.put("암나이트", "omanyte");
            firstGenMapping.put("암스타", "omastar");
            firstGenMapping.put("투구", "kabuto");
            firstGenMapping.put("투구푸스", "kabutops");
            firstGenMapping.put("프테라", "aerodactyl");
            firstGenMapping.put("잠만보", "snorlax");
            firstGenMapping.put("프리져", "articuno");
            firstGenMapping.put("썬더", "zapdos");
            firstGenMapping.put("파이어", "moltres");
            firstGenMapping.put("미뇽", "dratini");
            firstGenMapping.put("신뇽", "dragonair");
            firstGenMapping.put("망나뇽", "dragonite");
            firstGenMapping.put("뮤츠", "mewtwo");
            firstGenMapping.put("뮤", "mew");

            // DB에 저장
            for (Map.Entry<String, String> entry : firstGenMapping.entrySet()) {
                String koreanName = entry.getKey();
                String englishName = entry.getValue();
                
                // 포켓몬 ID 가져오기
                Integer pokemonId = getPokemonIdFromName(englishName);
                if (pokemonId != null) {
                    PokemonNameMapping mapping = new PokemonNameMapping(koreanName, englishName, pokemonId);
                    pokemonNameMappingRepository.save(mapping);
                    logger.debug("포켓몬 매핑 저장: {} -> {} (ID: {})", koreanName, englishName, pokemonId);
                }
            }
            
            logger.info("포켓몬 데이터 초기화 완료: {} 마리", pokemonNameMappingRepository.count());
            
        } catch (Exception e) {
            logger.error("포켓몬 데이터 초기화 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 영문 타입을 한글 타입으로 변환
     */
    private String convertEnglishTypeToKorean(String englishType) {
        Map<String, String> typeMapping = new HashMap<>();
        typeMapping.put("normal", "노말");
        typeMapping.put("fire", "불꽃");
        typeMapping.put("water", "물");
        typeMapping.put("electric", "전기");
        typeMapping.put("grass", "풀");
        typeMapping.put("ice", "얼음");
        typeMapping.put("fighting", "격투");
        typeMapping.put("poison", "독");
        typeMapping.put("ground", "땅");
        typeMapping.put("flying", "비행");
        typeMapping.put("psychic", "에스퍼");
        typeMapping.put("bug", "벌레");
        typeMapping.put("rock", "바위");
        typeMapping.put("ghost", "고스트");
        typeMapping.put("dragon", "드래곤");
        typeMapping.put("dark", "악");
        typeMapping.put("steel", "강철");
        typeMapping.put("fairy", "페어리");

        return typeMapping.getOrDefault(englishType, englishType);
    }

    /**
     * 포켓몬 진화 체인 조회
     * 
     * @param name 포켓몬 이름
     * @return 진화 체인 정보
     */
    public EvolutionDTO getEvolutionChain(String name) {
        
        try {
            // 한글 이름을 영문으로 변환
            String englishName = convertKoreanToEnglish(name);
            logger.info("진화체인 조회: 한글명 '{}' -> 영문명 '{}'", name, englishName);
            
            // 포켓몬 species 정보 조회하여 진화체인 ID 찾기
            Integer evolutionChainId = getEvolutionChainID(englishName);

            if (evolutionChainId == null) {
                logger.warn("포켓몬'{}' 의 진화체인 ID를 찾을 수 없습니다", name);
                return null;
            }

            logger.info("진화체인 API 호출 시작: {} (ID: {})", englishName, evolutionChainId);
            EvolutionDTO evolutionChain = callEvolutionChain(evolutionChainId);

            if (evolutionChain != null) {
                logger.info("진화체인 조회 성공 : {} (ID: {})", englishName, evolutionChainId);
                return evolutionChain;
            } else {
                logger.warn("진화체인 API에서 데이터를 가져올 수 없음 : ID {}", evolutionChainId);
                return null;
            }
        } catch (Exception e) {
            logger.error("진화 체인 조회중 오류 발생 - 포켓몬: {}, 오류: {}", name, e.getMessage(), e);
            return null;
        }
    }

    /*
     * 진화 체인 API 호출
     * 
     * @param evolutionChainId 진화체인 ID
     * @return 진화체인 DTO 또는 null
    */

    private EvolutionDTO callEvolutionChain(Integer evolutionChainId) {
       
        try {
           // API호출
            String response = webClient.get()
            .uri("/evolution-chain/{id}", evolutionChainId)
            .retrieve()
            .bodyToMono(String.class)
            .block();

            if (response != null) {
                // Json DTO 변환
                EvolutionDTO evolutionChain = objectMapper.readValue(response, EvolutionDTO.class);
                logger.info("진화체인 API 응답 파싱 성공: ID {}", evolutionChainId);
                return evolutionChain;
            }

            return null;
        } catch (Exception e) {
           logger.error("진화체인 API 호출 중 오류 발생 - ID: {}", evolutionChainId, e.getMessage(), e);
           return null;
        }
    }

    /**
     * 진화 체인 ID 조회
     * 
     * @param name 포켓몬 이름
     * @return 진화 체인 ID
     */
   private Integer getEvolutionChainID(String name){

    try {
        // api 호출
        String response = webClient.get()
        .uri("/pokemon-species/{name}", name)
        .retrieve()
        .bodyToMono(String.class)
        .block();

        if (response != null) {
            SpeciesDTO speciesData = objectMapper.readValue(response, SpeciesDTO.class);
            
            if (speciesData.getEvolutionChain() != null) {
                String evolutionChainUrl = speciesData.getEvolutionChain().getUrl();
                String[] urlParts = evolutionChainUrl.split("/");
                return Integer.parseInt(urlParts[urlParts.length -1]);
            }
        }
        return null;
   } catch (Exception e) {
    logger.error("진화체인 ID 조회중 오류 발생 - 포켓몬: {}, 오류: {}", name, e.getMessage(), e);
    return null;
   }
    }

    /**
     * PokeAPI에서 전체 포켓몬 데이터를 가져와서 DB에 초기화
     * 
     * @param limit 가져올 포켓몬 수
     * @param offset 시작 위치
     * @return 초기화 결과
     */
    public Map<String, Object> initializeAllPokemonsFromApi(int limit, int offset) {
        Map<String, Object> result = new HashMap<>();
        int successCount = 0;
        int errorCount = 0;
        List<String> errors = new ArrayList<>();
        
        try {
            logger.info("PokeAPI에서 전체 포켓몬 목록 가져오기 시작: limit={}, offset={}", limit, offset);
            
            // 1단계: PokeAPI에서 포켓몬 목록 가져오기
            String listResponse = webClient.get()
                    .uri("/pokemon?limit={limit}&offset={offset}", limit, offset)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            
            if (listResponse == null) {
                throw new RuntimeException("PokeAPI 목록 응답이 null입니다.");
            }
            
            // 2단계: JSON 파싱
            JsonNode listData;
            try {
                listData = objectMapper.readTree(listResponse);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("PokeAPI 응답 JSON 파싱 실패: " + e.getMessage(), e);
            }
            JsonNode results = listData.get("results");
            
            if (results == null || !results.isArray()) {
                throw new RuntimeException("PokeAPI 응답에 results 배열이 없습니다.");
            }
            
            logger.info("총 {}마리의 포켓몬을 처리합니다.", results.size());
            
            // 3단계: 각 포켓몬의 상세 정보를 순차적으로 가져오기
            for (JsonNode pokemon : results) {
                String pokemonName = pokemon.get("name").asText();
                
                try {
                    logger.debug("포켓몬 처리 중: {}", pokemonName);
                    
                    // 이미 DB에 있는지 확인
                    Optional<Pokemon> existingPokemon = pokemonRepository.findByName(pokemonName);
                    if (existingPokemon.isPresent()) {
                        logger.debug("포켓몬 {}은 이미 DB에 존재합니다. 스킵합니다.", pokemonName);
                        successCount++;
                        continue;
                    }
                    
                    // PokeAPI에서 상세 정보 가져오기
                    PokemonDTO pokemonDTO = callPokeApi(pokemonName);
                    if (pokemonDTO != null) {
                        // DB에 저장
                        savePokemon(pokemonDTO);
                        successCount++;
                        logger.debug("포켓몬 {} 처리 완료", pokemonName);
                    } else {
                        errorCount++;
                        String errorMsg = "포켓몬 " + pokemonName + " 상세 정보를 가져올 수 없습니다.";
                        errors.add(errorMsg);
                        logger.warn(errorMsg);
                    }
                    
                    // API 호출 제한을 위한 짧은 대기
                    Thread.sleep(100);
                    
                } catch (Exception e) {
                    errorCount++;
                    String errorMsg = "포켓몬 " + pokemonName + " 처리 중 오류: " + e.getMessage();
                    errors.add(errorMsg);
                    logger.error(errorMsg, e);
                }
            }
            
            logger.info("전체 포켓몬 초기화 완료: 성공={}, 실패={}", successCount, errorCount);
            
        } catch (Exception e) {
            logger.error("전체 포켓몬 초기화 중 오류 발생: {}", e.getMessage(), e);
            throw e;
        }
        
        // 결과 반환
        result.put("successCount", successCount);
        result.put("errorCount", errorCount);
        result.put("errors", errors);
        result.put("message", String.format("초기화 완료: 성공 %d개, 실패 %d개", successCount, errorCount));
        
        return result;
    }
}
