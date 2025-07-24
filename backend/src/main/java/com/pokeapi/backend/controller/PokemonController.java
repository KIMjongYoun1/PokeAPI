package com.pokeapi.backend.controller;

import com.pokeapi.backend.service.PokemonService;
import com.pokeapi.backend.dto.EvolutionDTO;

import com.pokeapi.backend.dto.PokemonDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private static final Logger logger = LoggerFactory.getLogger(PokemonController.class);
    
    // 포켓몬 이름 유효성 검사를 위한 정규식 (영문자, 숫자, 하이픈만 허용)
    private static final Pattern POKEMON_NAME_PATTERN = Pattern.compile("^[가-힣a-zA-Z0-9-]+$");
    
    // 타입 유효성 검사를 위한 정규식 (영문자만 허용)
    private static final Pattern TYPE_PATTERN = Pattern.compile("^[가-힣a-zA-Z0-9-]+$");

    @Autowired
    private PokemonService pokemonService;



    @GetMapping("/{name}")
    public ResponseEntity<PokemonDTO> getPokemon(@PathVariable String name) {
        try {
            // 1단계: 입력값 유효성 검사
            if (name == null || name.trim().isEmpty()) {
                logger.warn("포켓몬 이름이 비어있습니다.");
                return ResponseEntity.badRequest().build();
            }
            
            if (!POKEMON_NAME_PATTERN.matcher(name.trim()).matches()) {
                logger.warn("잘못된 포켓몬 이름 형식: {}", name);
                return ResponseEntity.badRequest().build();
            }
            
            // 2단계: 서비스 호출
            logger.info("포켓몬 검색 요청: {}", name);
            PokemonDTO pokemonDTO = pokemonService.searchPokemonName(name.trim());
            
            // 3단계: 결과 처리
            if (pokemonDTO != null) {
                logger.info("포켓몬 검색 성공: {}", name);
                return ResponseEntity.ok(pokemonDTO);
            } else {
                logger.warn("포켓몬을 찾을 수 없음: {}", name);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("포켓몬 검색 중 오류 발생: {}, 오류: {}", name, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<PokemonDTO>> getAllPokemons() {
        try {
            logger.info("전체 포켓몬 목록 조회 요청");
            List<PokemonDTO> pokemons = pokemonService.getAllPokemons();
            logger.info("전체 포켓몬 목록 조회 성공: {}개", pokemons.size());
            return ResponseEntity.ok(pokemons);
            
        } catch (Exception e) {
            logger.error("전체 포켓몬 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 전체 포켓몬 목록 조회 (페이징 처리)
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllPokemonsWithPaging(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "1") int generation) {
        
        try {
            logger.info("페이징 포켓몬 목록 조회 요청: page={}, size={}, generation={}", page, size, generation);
            Map<String, Object> response = pokemonService.getPokemonsWithPaging(page, size, generation);
            logger.info("페이징 포켓몬 목록 조회 성공");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("페이징 포켓몬 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 전체 포켓몬 데이터 초기화 (PokeAPI에서 가져와서 DB에 저장)
     */
    @PostMapping("/initialize")
    public ResponseEntity<Map<String, Object>> initializeAllPokemons(
            @RequestParam(defaultValue = "151") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        
        try {
            logger.info("전체 포켓몬 데이터 초기화 시작: limit={}, offset={}", limit, offset);
            Map<String, Object> result = pokemonService.initializeAllPokemonsFromApi(limit, offset);
            logger.info("전체 포켓몬 데이터 초기화 완료");
            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            logger.error("전체 포켓몬 데이터 초기화 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PokemonDTO> searchPokemon(@RequestParam String name) {
        try {
            // 1단계: 입력값 유효성 검사
            if (name == null || name.trim().isEmpty()) {
                logger.warn("검색 파라미터 name이 비어있습니다.");
                return ResponseEntity.badRequest().build();
            }
            
            if (!POKEMON_NAME_PATTERN.matcher(name.trim()).matches()) {
                logger.warn("잘못된 검색 이름 형식: {}", name);
                return ResponseEntity.badRequest().build();
            }
            
            // 2단계: 서비스 호출
            logger.info("포켓몬 검색 요청 (쿼리 파라미터): {}", name);
            PokemonDTO pokemonDTO = pokemonService.searchPokemonName(name.trim());
            
            // 3단계: 결과 처리
            if (pokemonDTO != null) {
                logger.info("포켓몬 검색 성공: {}", name);
                return ResponseEntity.ok(pokemonDTO);
            } else {
                logger.warn("포켓몬을 찾을 수 없음: {}", name);
                return ResponseEntity.notFound().build();
            }
            
        } catch (Exception e) {
            logger.error("포켓몬 검색 중 오류 발생: {}, 오류: {}", name, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/advanced-search")
    public ResponseEntity<List<PokemonDTO>> advancedSearch(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer minHeight,
            @RequestParam(required = false) Integer maxHeight,
            @RequestParam(required = false) Integer minWeight,
            @RequestParam(required = false) Integer maxWeight,
            @RequestParam(required = false) Integer minAttack,
            @RequestParam(required = false) Integer maxAttack,
            @RequestParam(required = false) Integer minDefense,
            @RequestParam(required = false) Integer maxDefense,
            @RequestParam(required = false) Integer minHp,
            @RequestParam(required = false) Integer maxHp,
            @RequestParam(required = false) Integer minSpeed,
            @RequestParam(required = false) Integer maxSpeed) {
        
        try {
            // 1단계: 입력값 유효성 검사
            if (type != null && !type.trim().isEmpty()) {
                if (!TYPE_PATTERN.matcher(type.trim()).matches()) {
                    logger.warn("잘못된 타입 형식: {}", type);
                    return ResponseEntity.badRequest().build();
                }
            }
            
            // 범위 값 유효성 검사 (최소값이 최대값보다 클 수 없음)
            if (minHeight != null && maxHeight != null && minHeight > maxHeight) {
                logger.warn("키 범위가 잘못됨: 최소({}) > 최대({})", minHeight, maxHeight);
                return ResponseEntity.badRequest().build();
            }
            
            if (minWeight != null && maxWeight != null && minWeight > maxWeight) {
                logger.warn("몸무게 범위가 잘못됨: 최소({}) > 최대({})", minWeight, maxWeight);
                return ResponseEntity.badRequest().build();
            }
            
            if (minAttack != null && maxAttack != null && minAttack > maxAttack) {
                logger.warn("공격력 범위가 잘못됨: 최소({}) > 최대({})", minAttack, maxAttack);
                return ResponseEntity.badRequest().build();
            }
            
            if (minDefense != null && maxDefense != null && minDefense > maxDefense) {
                logger.warn("방어력 범위가 잘못됨: 최소({}) > 최대({})", minDefense, maxDefense);
                return ResponseEntity.badRequest().build();
            }
            
            if (minHp != null && maxHp != null && minHp > maxHp) {
                logger.warn("HP 범위가 잘못됨: 최소({}) > 최대({})", minHp, maxHp);
                return ResponseEntity.badRequest().build();
            }
            
            if (minSpeed != null && maxSpeed != null && minSpeed > maxSpeed) {
                logger.warn("속도 범위가 잘못됨: 최소({}) > 최대({})", minSpeed, maxSpeed);
                return ResponseEntity.badRequest().build();
            }
            
            // 음수 값 검사
            if ((minHeight != null && minHeight < 0) || (maxHeight != null && maxHeight < 0) ||
                (minWeight != null && minWeight < 0) || (maxWeight != null && maxWeight < 0) ||
                (minAttack != null && minAttack < 0) || (maxAttack != null && maxAttack < 0) ||
                (minDefense != null && minDefense < 0) || (maxDefense != null && maxDefense < 0) ||
                (minHp != null && minHp < 0) || (maxHp != null && maxHp < 0) ||
                (minSpeed != null && minSpeed < 0) || (maxSpeed != null && maxSpeed < 0)) {
                logger.warn("음수 값이 포함된 검색 조건");
                return ResponseEntity.badRequest().build();
            }
            
            // 2단계: 서비스 호출
            logger.info("고급 검색 요청 - 타입: {}, 키: {}~{}, 몸무게: {}~{}, 공격력: {}~{}, 방어력: {}~{}, HP: {}~{}, 속도: {}~{}", 
                type, minHeight, maxHeight, minWeight, maxWeight, 
                minAttack, maxAttack, minDefense, maxDefense, 
                minHp, maxHp, minSpeed, maxSpeed);
            
            List<PokemonDTO> results = pokemonService.advancedSearch(
                type != null ? type.trim() : null, 
                minHeight, maxHeight, minWeight, maxWeight,
                minAttack, maxAttack, minDefense, maxDefense,
                minHp, maxHp, minSpeed, maxSpeed);
            
            // 3단계: 결과 처리
            logger.info("고급 검색 성공: {}개 결과", results.size());
            return ResponseEntity.ok(results);
            
        } catch (Exception e) {
            logger.error("고급 검색 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
/**
 * 포켓몬 진화 체인
 * 
 * @param name Pokemon Name
 * @return EvolutionChain
 */

 @GetMapping("/{name}/evolution-chain")
 public ResponseEntity<EvolutionDTO> getEvolutionChain(@PathVariable String name) {

    try {
        // 유효성 검사
        if (name ==null || name.trim().isEmpty()) {
            logger.warn("포켓몬 이름이 비어있습니다");
            return ResponseEntity.badRequest().build();

        }

        if (!POKEMON_NAME_PATTERN.matcher(name.trim()).matches()){
            logger.warn("잘못된 포켓몬의 이름 입니다: {}", name);
            return ResponseEntity.badRequest().build();
        }

        // 서비스호출
        logger.info("포켓몬 진화체인 검색 시작: {}", name);
        EvolutionDTO evolutionDTO = pokemonService.getEvolutionChain(name.trim());
        
        // 결과 처리
        if (evolutionDTO != null) {
            logger.info("포켓몬 진화 체인 검색 성공: {}", name);
            return ResponseEntity.ok(evolutionDTO);
        } else {
            logger.warn("포켓몬 진화체인을 찾을 수 없음: {}:", name);
            return ResponseEntity.notFound().build();
        }
    } catch (Exception e) {
        logger.error("포켓몬 진화 체인 조회중 오류발생: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
 }
}