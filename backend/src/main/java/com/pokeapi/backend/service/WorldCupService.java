package com.pokeapi.backend.service;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokeapi.backend.dto.WorldCupParticipantDTO;
import com.pokeapi.backend.dto.WorldCupRankingDTO;
import com.pokeapi.backend.dto.WorldCupRequestDTO;
import com.pokeapi.backend.dto.WorldCupResultDTO;
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
    private PokemonService pokemonService;

    @Autowired
    private PokemonRepository pokemonRepository;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * 월드컵 결과 저장
     */
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
                responseDTO.setConditions(objectMapper.readValue(savedEntity.getConditions(), Map.class));
            }

            if (savedEntity.getParticipants() != null) {
                responseDTO.setParticipants(objectMapper.readValue(savedEntity.getParticipants(), List.class));
            }

            if (savedEntity.getFinalRanking() != null) {
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("제이슨 변환 오류", e);
        }

        return responseDTO;
    }

    /**
     * 토너먼트 ID로 월드켭 결과 조회
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
                dto.setConditions(objectMapper.readValue(entity.getConditions(), Map.class));
            }

            if (entity.getParticipants() != null) {
                dto.setParticipants(objectMapper.readValue(entity.getParticipants(), List.class));
            }

            if (entity.getFinalRanking() != null) {
                dto.setFinalRanking(objectMapper.readValue(entity.getFinalRanking(), List.class));
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
                    dto.setConditions(objectMapper.readValue(entity.getConditions(), Map.class));
                }

                if (entity.getParticipants() != null) {
                    dto.setParticipants(objectMapper.readValue(entity.getParticipants(), List.class));
                }

                if (entity.getFinalRanking() != null) {
                    dto.setFinalRanking(objectMapper.readValue(entity.getFinalRanking(), List.class));
                }

            } catch (JsonProcessingException e) {
                throw new RuntimeException("Json 파싱오류", e);
            }
            return dto;
        }).collect(Collectors.toList());
    }
    // ===== 2. 월드컵 참가자 선성 =====

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

    /*
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
            pokemon.getKoreanTypes().contaions(request.getType()))
            .collect(Collectors.toList());
        }
        return candidates:;
    }

    // ===== 3. 통계 업데이트 =====

    /**
     * 월드컵 완료 후 통계 업데이트
     */
    public void updateStatistics(Integer winnerId,List<WorldCupRankingDTO> finalRanking) {

        updatePokemonStatistics(winnerId, 1, finalRanking.size());

        for (int i =0; i < Math.min(3, finalRanking.size()); i++) {
            WorldCupRankingDTO ranking = fianlRanking.get(i);
            updatePokemonStatistics(ranking.getPokemonId(), 1, ranking.getRank(), finalRanking.size());
        }
    }

    /**
     * 개별 포켓몬 통계 업데이트
     */
    private void updatePokemonStatistics(Integer pokemonId, int winCount, int rank, int totalParticipants) {

        WorldCupStatistics statistics = worldCupStatisticsRepository.findByPokemonId(pokemonId)
                       .orElse(createNewStatistics(pokemonId));

        statistics.setTotalParticipations(statistics.getTotalParticipations() + 1);
        statistics.setLastUpdated(LocalDateTime.now());

        if (rank == 1) {
            statistics.setTotalWins(statistics.getTotalWins() +1 );
        }

        if (rank <= 3) {
            statistics.setTotalTop3(statistics.getTotalTop3() + 1);
        }

        int totalRank = statistics.getAverageRank() * (statistics.getTotalParticipations() - 1) + rank;
        statistics.setAverageRank(totalRank / statistics.getTotalParticipations());

        worldCupStatisticsRepository.save(statistics);
        
    }
}
