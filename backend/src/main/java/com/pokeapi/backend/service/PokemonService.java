package com.pokeapi.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.pokeapi.backend.dto.EvolutionDTO;
import com.pokeapi.backend.dto.PokemonDTO;
import com.pokeapi.backend.dto.SpeciesDTO;
import com.pokeapi.backend.dto.PokemonApiResponseDTO;
import com.pokeapi.backend.repository.PokemonRepository;
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
            // 1단계: API 호출 시작 로그 기록
            logger.info("PokéAPI 호출 시작: {}", name);

            // 2단계: WebClient를 사용한 HTTP GET 요청 생성
            String response = webClient.get()
                    .uri("/pokemon/{name}", name)
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
        dto.setName(entity.getName());
        dto.setKoreanName(entity.getKoreanName());
        dto.setHeight(entity.getHeight());
        dto.setWeight(entity.getWeight());
        // JSON 문자열을 리스트로 역직렬화 (DB 저장 형태 → API 응답 형태)
        dto.setTypes(convertJsonToList(entity.getTypes()));
        dto.setKoreanTypes(convertJsonToList(entity.getTypes()));
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
    private Pokemon convertToEntity(PokemonDTO dto) {
        Pokemon pokemon = new Pokemon();
        pokemon.setName(dto.getName());
        pokemon.setKoreanName(dto.getKoreanName());
        pokemon.setHeight(dto.getHeight());
        pokemon.setWeight(dto.getWeight());
        // 리스트를 JSON 문자열로 직렬화 (API 응답 형태 → DB 저장 형태)
        pokemon.setTypes(convertListToJson(dto.getTypes()));
        pokemon.setTypes(convertListToJson(dto.getKoreanTypes()));
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
    private Pokemon savePokemon(PokemonDTO dto) {
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
            // 포켓몬 species 정보 조회하여 진화체인 ID 찾기
            Integer evolutionChainId = getEvolutionChainID(name);

            if (evolutionChainId == null) {
                logger.warn("포켓몬'{}' 의 진화체인 ID를 찾을 수 없습니다", name);
                return null;
            }

            logger.info("진화체인 API 호출 시작: ID {}",name, evolutionChainId);
            EvolutionDTO evolutionChain = callEvolutionChain(evolutionChainId);

            if (evolutionChain != null) {
                logger.info("진회체인 조회 성공 : {} (ID: {})", name, evolutionChainId);
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
}
