package com.pokeapi.backend.service;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pokeapi.backend.dto.WorldCupResultDTO;
import com.pokeapi.backend.entity.WorldCupResult;
import com.pokeapi.backend.repository.PokemonRepository;
import com.pokeapi.backend.repository.WorldCupResultRepository;
import com.pokeapi.backend.repository.WorldCupStatisticsRepository;

@Service
public class WordCupService {

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

}
