package com.pokeapi.backend.service;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokeapi.backend.dto.AutoWorldCupRequestDTO;
import com.pokeapi.backend.dto.WorldCupParticipantDTO;
import com.pokeapi.backend.dto.WorldCupRankingDTO;
import com.pokeapi.backend.dto.WorldCupRequestDTO;
import com.pokeapi.backend.dto.WorldCupResultDTO;
import com.pokeapi.backend.dto.WorldCupStatisticsDTO;
import com.pokeapi.backend.entity.Pokemon;
import com.pokeapi.backend.entity.WorldCupResult;
import com.pokeapi.backend.entity.WorldCupStatistics;
import com.pokeapi.backend.repository.PokemonRepository;
import com.pokeapi.backend.repository.WorldCupResultRepository;
import com.pokeapi.backend.repository.WorldCupStatisticsRepository;

@Service
public class WorldCupService {

    @Autowired
    private WorldCupResultRepository worldCupResultRepository;

    @Autowired
    private WorldCupStatisticsRepository worldCupStatisticsRepository;



    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 월드컵 결과 저장
     */
    @Transactional
    public WorldCupResultDTO saveWorldCupResult(WorldCupResultDTO resultsDTO) {
        WorldCupResult entity = new WorldCupResult();
        entity.setTournamentId(resultsDTO.getTournamentId());
        entity.setTitle(resultsDTO.getTitle());
        entity.setTournamentType(resultsDTO.getTournamentType());
        entity.setWinnerId(resultsDTO.getWinnerId());
        entity.setCreatedAt(resultsDTO.getCreatedAt());
        entity.setCompletedAt(resultsDTO.getCompletedAt());

        try {

            if (resultsDTO.getConditions() != null) {
                entity.setConditions(objectMapper.writeValueAsString(resultsDTO.getConditions()));
            }

            if (resultsDTO.getParticipants() != null) {
                entity.setParticipants(objectMapper.writeValueAsString(resultsDTO.getParticipants()));
            }

            if (resultsDTO.getFinalRanking() != null) {
                entity.setFinalRanking(objectMapper.writeValueAsString(resultsDTO.getFinalRanking()));
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException("제이슨 변환 오류", e);
        }

        WorldCupResult savedEntity = worldCupResultRepository.save(entity);

        WorldCupResultDTO responseDTO = new WorldCupResultDTO();
        responseDTO.setId(savedEntity.getId());
        responseDTO.setTournamentId(savedEntity.getTournamentId());
        responseDTO.setTitle(savedEntity.getTitle());
        responseDTO.setTournamentType(savedEntity.getTournamentType());
        responseDTO.setWinnerId(savedEntity.getWinnerId());
        responseDTO.setCreatedAt(savedEntity.getCreatedAt());
        responseDTO.setCompletedAt(savedEntity.getCompletedAt());

        try {
            if (savedEntity.getConditions() != null) {
                responseDTO.setConditions(parseConditions(savedEntity.getConditions()));
            }

            if (savedEntity.getParticipants() != null) {
                responseDTO.setParticipants(parseParticipants(savedEntity.getParticipants()));
            }

            if (savedEntity.getFinalRanking() != null) {
                responseDTO.setFinalRanking(parseFinalRanking(savedEntity.getFinalRanking()));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("제이슨 변환 오류", e);
        }

        return responseDTO;
    }

    /**
     * 토너먼트 ID로 월드컵 결과 조회
     * 
     */
    public WorldCupResultDTO getWorldCupResult(String tournamentId) {
        WorldCupResult entity = worldCupResultRepository.findByTournamentId(tournamentId)
                .orElseThrow(() -> new RuntimeException("월드컵 결과를 찾을 수 없습니다."));

        // 임시로 디티오 직접 생성후 반환
        WorldCupResultDTO dto = new WorldCupResultDTO();
        dto.setId(entity.getId());
        dto.setTournamentId(entity.getTournamentId());
        dto.setTitle(entity.getTitle());
        dto.setTournamentType(entity.getTournamentType());
        dto.setWinnerId(entity.getWinnerId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setCompletedAt(entity.getCompletedAt());

        try {
            if (entity.getConditions() != null) {
                dto.setConditions(parseConditions(entity.getConditions()));
            }

            if (entity.getParticipants() != null) {
                dto.setParticipants(parseParticipants(entity.getParticipants()));
            }

            if (entity.getFinalRanking() != null) {
                dto.setFinalRanking(parseFinalRanking(entity.getFinalRanking()));
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("제이슨 파싱 오류", e);
        }

        return dto;
    }

    /**
     * 최근 월드컵 결과 조회
     */
    public List<WorldCupResultDTO> getRecentWorldCupResults() {

        List<WorldCupResult> entities = worldCupResultRepository.findTop10ByOrderByCreatedAtDesc();

        return entities.stream().map(entity -> {
            WorldCupResultDTO dto = new WorldCupResultDTO();
            dto.setId(entity.getId());
            dto.setTournamentId(entity.getTournamentId());
            dto.setTitle(entity.getTitle());
            dto.setTournamentType(entity.getTournamentType());
            dto.setWinnerId(entity.getWinnerId());
            dto.setCreatedAt(entity.getCreatedAt());
            dto.setCompletedAt(entity.getCompletedAt());

            // Json 파싱 - 데이터 매핑이라고 생각함
            try {
                if (entity.getConditions() != null) {
                    dto.setConditions(parseConditions(entity.getConditions()));
                }

                if (entity.getParticipants() != null) {
                    dto.setParticipants(parseParticipants(entity.getParticipants()));
                }

                if (entity.getFinalRanking() != null) {
                    dto.setFinalRanking(parseFinalRanking(entity.getFinalRanking()));
                }

            } catch (JsonProcessingException e) {
                throw new RuntimeException("Json 파싱오류", e);
            }
            return dto;
        }).collect(Collectors.toList());
    }
    // ===== 2. 월드컵 참가자 선정 =====

    /**
     * 조건에 맞는월드컵 참가자 선정
     * 세대별, 타입별 등
     */
    public List<WorldCupParticipantDTO> selectParticipants(WorldCupRequestDTO request) {

        List<Pokemon> candidates = findCandidatesByConditions(request);

        // 참가자 수에 맞게 랜덤 선택
        Collections.shuffle(candidates);
        List<Pokemon> selected = candidates.stream()
                .limit(request.getParticipantCount())
                .collect(Collectors.toList());

        return selected.stream()
                .map(this::convertToParticipantDTO)
                .collect(Collectors.toList());
    }

    /**
     * 조건에 맞는 포켓몬 후보 조회
     * 
     */

    private List<Pokemon> findCandidatesByConditions(WorldCupRequestDTO request) {

        List<Pokemon> candidates = new ArrayList<>();

        if (request.getGeneration() != null & !request.getGeneration().equals("all")) {

            Integer generation = Integer.parseInt(request.getGeneration());
            candidates = pokemonRepository.findByPokemonIdBetween(
                    getGenerationStartId(generation),
                    getGenerationEndId(generation));
            
        } else {
            candidates = pokemonRepository.findAll();
        }

        if (request.getType() != null && !request.getType().equals("all")) {
            candidates = candidates.stream()
            .filter(pokemon -> pokemon.getKoreanTypes() != null &&
            pokemon.getKoreanTypes().contains(request.getType()))
            .collect(Collectors.toList());
        }
        return candidates;
    }

    // ===== 3. 통계 업데이트 =====

    /**
     * 월드컵 완료 후 통계 업데이트
     */
    @Transactional
    public void updateStatistics(Integer winnerId, List<WorldCupRankingDTO> finalRanking) {

        updatePokemonStatistics(winnerId, 1);

        for (int i = 0; i < Math.min(3, finalRanking.size()); i++) {
            WorldCupRankingDTO ranking = finalRanking.get(i);
            updatePokemonStatistics(ranking.getPokemonId(), ranking.getRank());
        }
    }

    /**
     * 개별 포켓몬 통계 업데이트
     */
    private void updatePokemonStatistics(Integer pokemonId, int rank) {

        WorldCupStatistics statistics = worldCupStatisticsRepository.findByPokemonId(pokemonId)
                .orElse(createNewStatistics(pokemonId));

        statistics.setTotalParticipations(statistics.getTotalParticipations() + 1);
        statistics.setLastUpdated(LocalDateTime.now());

        if (rank == 1) {
            statistics.setTotalWins(statistics.getTotalWins() + 1);
        }

        if (rank <= 3) {
            statistics.setTotalTop3(statistics.getTotalTop3() + 1);
        }

        int totalRank = statistics.getAverageRank() * (statistics.getTotalParticipations() - 1) + rank;
        statistics.setAverageRank(totalRank / statistics.getTotalParticipations());

        worldCupStatisticsRepository.save(statistics);

    }

    /**
     * 새로운 통계 엔티티 생성
     */
    private WorldCupStatistics createNewStatistics(Integer pokemonId) {

        WorldCupStatistics statistics = new WorldCupStatistics();
        statistics.setPokemonId(pokemonId);
        statistics.setTotalParticipations(0);
        statistics.setTotalWins(0);
        statistics.setTotalTop3(0);
        statistics.setAverageRank(0);
        statistics.setLastUpdated(LocalDateTime.now());

        return statistics;
    }

    /**
     * 세대별 인기 포켓몬 조회
     */
    public List<WorldCupStatisticsDTO> getPopularPokemons(Integer generation) {

        List<WorldCupStatistics> statistics = worldCupStatisticsRepository
                .findTopByGenerationOrderByRankAndWins(generation);

        return statistics.stream().map(this::convertToStatisticsDTO)
                .collect(Collectors.toList());
    }

    /**
     * 타입별 인기 포켓몬 조회
     */
    public List<WorldCupStatisticsDTO> getPopularPokemons(String type) {

        List<WorldCupStatistics> statistics = worldCupStatisticsRepository
                .findTopByTypeOrderByRankAndWins(type);

        return statistics.stream().map(this::convertToStatisticsDTO)
                .collect(Collectors.toList());
    }

    /**
     * 세대별 + 타입별 인기 포켓몬 조회
     */
    public List<WorldCupStatisticsDTO> getPopularPokemons(Integer generation, String type) {

        List<WorldCupStatistics> statistics = worldCupStatisticsRepository
                .findTopByGenerationAndTypeOrderByRankAndWins(generation, type);

        return statistics.stream().map(this::convertToStatisticsDTO)
                .collect(Collectors.toList());
    }

    /**
     * 통계 기반 자동 월드컵 생성
     */
    public List<WorldCupParticipantDTO> createAutoWorldCup(AutoWorldCupRequestDTO request) {

        List<WorldCupStatistics> topPokemons = getTopPokemonsByRequest(request);
        List<WorldCupParticipantDTO> participants = new ArrayList<>();

        int topCount = Math.min(request.getTopCount(), topPokemons.size());

        // top 포켓몬 추가
        for (int i = 0; i < topCount; i++) {
            WorldCupStatistics stats = topPokemons.get(i);
            Pokemon pokemon = pokemonRepository.findByPokemonId(stats.getPokemonId())
                    .orElseThrow(() -> new RuntimeException("포켓몬을 찾을 수 없습니다: " + stats.getPokemonId()));
            participants.add(convertToParticipantDTO(pokemon));
        }

        // 랜덤 포켓몬 추가
        if (request.getIncludeRandom() && participants.size() < request.getParticipantCount()) {

            List<Pokemon> randomPokemons = getRandomPokemons(request, topPokemons);

            int remainingCount = request.getParticipantCount() - participants.size();

            for (int i = 0; i < Math.min(remainingCount, randomPokemons.size()); i++) {
                participants.add(convertToParticipantDTO(randomPokemons.get(i)));
            }
        }

        return participants;

    }

    /**
     * 요청에 따른 Top 포켓몬들 조회
     */
    private List<WorldCupStatistics> getTopPokemonsByRequest(AutoWorldCupRequestDTO request) {

        if (request.getGeneration() != null && request.getType() != null) {
            return worldCupStatisticsRepository.findTopByGenerationAndTypeOrderByRankAndWins(
                    Integer.parseInt(request.getGeneration()), request.getType());

        } else if (request.getGeneration() != null) {
            return worldCupStatisticsRepository.findTopByGenerationOrderByRankAndWins(
                Integer.parseInt(request.getGeneration()));
            
        } else if (request.getType() != null) {
            return worldCupStatisticsRepository.findTopByTypeOrderByRankAndWins(
                request.getType());
            
        } else {
            return worldCupStatisticsRepository.findTop10ByOrderByAverageRankAsc();
        }
    }

    /**
     * 랜덤 포켓모들 조회 (TOP 포켓몬 제외)
     */
    private List<Pokemon> getRandomPokemons(AutoWorldCupRequestDTO request, List<WorldCupStatistics> topPokemons) {

        Set<Integer> topPokemonIds = topPokemons.stream()
            .map(WorldCupStatistics::getPokemonId)
            .collect(Collectors.toSet());

        List<Pokemon> allPokemons = pokemonRepository.findAll();
        List<Pokemon> availablePokemons = allPokemons.stream()
            .filter(pokemon -> !topPokemonIds.contains(pokemon.getPokemonId()))
            .collect(Collectors.toList());

        
            Collections.shuffle(availablePokemons);
            return availablePokemons.stream()
                   .limit(request.getRandomCount())
                   .collect(Collectors.toList());
    }

    /**
     * ======= Convert 매서드임 중요 없으면안됨 ========
     */
    private WorldCupParticipantDTO convertToParticipantDTO(Pokemon pokemon) {
        
        WorldCupParticipantDTO dto = new WorldCupParticipantDTO();
        dto.setId(pokemon.getPokemonId());
        dto.setName(pokemon.getName());
        dto.setKoreanName(pokemon.getKoreanName());
        dto.setSpriteUrl(pokemon.getSpriteUrl());
        dto.setDescription(pokemon.getDescription());
        dto.setGeneration(pokemon.getGeneration());

        // 타입정보 파싱
        if (pokemon.getKoreanTypes() != null) {
            try {
                dto.setTypes(parseTypes(pokemon.getKoreanTypes()));
            } catch (JsonProcessingException e) {
                dto.setTypes(new ArrayList<>());
            }
        }
        
        return dto;
    }

    /**
     * WorldCupStatistics Entity -> DTO 변환
     */
    private WorldCupStatisticsDTO convertToStatisticsDTO(WorldCupStatistics statistics) {

        WorldCupStatisticsDTO dto = new WorldCupStatisticsDTO();
        dto.setId(statistics.getId());
        dto.setPokemonId(statistics.getPokemonId());
        dto.setTotalParticipations(statistics.getTotalParticipations());
        dto.setTotalWins(statistics.getTotalWins());
        dto.setTotalTop3(statistics.getTotalTop3());
        dto.setAverageRank(statistics.getAverageRank());
        dto.setLastUpdated(statistics.getLastUpdated());

        // 포켓몬 정보 추가
        Pokemon pokemon = pokemonRepository.findByPokemonId(statistics.getPokemonId()).orElse(null);
        if (pokemon != null) {
            dto.setPokemonName(pokemon.getName());
            dto.setPokemonKoreanName(pokemon.getKoreanName());
            dto.setSpriteUrl(pokemon.getSpriteUrl());
            dto.setGeneration(pokemon.getGeneration());

            // 타입정보 파싱
            if (pokemon.getKoreanTypes() != null) {
                try {
                    dto.setTypes(parseTypes(pokemon.getKoreanTypes()));
                } catch (Exception e) {
                    dto.setTypes(new ArrayList<>());
                }
            }
        }

        // 계산된 통계
        if (statistics.getTotalParticipations() > 0 ) {
            dto.setWinRate((statistics.getTotalWins() * 100) / statistics.getTotalParticipations());
            dto.setTop3Rate((statistics.getTotalTop3() * 100) / statistics.getTotalParticipations());
        } else {
            dto.setWinRate(0);
            dto.setTop3Rate(0);
        }

        return dto;
    }

    /**
     * 유틸리티 메서드들 필수!
     */

    /**
     * JSON 파싱 유틸리티 메서드들
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> parseConditions(String json) throws JsonProcessingException {
        return objectMapper.readValue(json, Map.class);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseParticipants(String json) throws JsonProcessingException {
        return objectMapper.readValue(json, List.class);
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseFinalRanking(String json) throws JsonProcessingException {
        return objectMapper.readValue(json, List.class);
    }

    @SuppressWarnings("unchecked")
    private List<String> parseTypes(String json) throws JsonProcessingException {
        return objectMapper.readValue(json, List.class);
    }

    private Integer getGenerationStartId(Integer generation) {
        
        switch (generation) {
            case 1: return 1;
            case 2: return 152;
            case 3: return 252;
            case 4: return 387;
            case 5: return 494;
            case 6: return 650;
            case 7: return 722;
            case 8: return 810;
            case 9: return 906;
            case 10: return 1026; // 10세대 시작 ID
            default: return 1;
        }
    }
    
    private Integer getGenerationEndId(Integer generation) {
        switch (generation) {
            case 1: return 151;
            case 2: return 251;
            case 3: return 386;
            case 4: return 493;
            case 5: return 649;
            case 6: return 721;
            case 7: return 809;
            case 8: return 905;
            case 9: return 1025;
            case 10: return 1302; // 10세대 추가 (1026-1302)
            default: return 1302; // 전체 포켓몬 수로 변경
        }
    }
}

