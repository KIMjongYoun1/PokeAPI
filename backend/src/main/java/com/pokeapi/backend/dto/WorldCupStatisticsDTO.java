package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 월드컵 통계 데이터 전송용 DTO
 * 포켓몬별 월드컵 통계를 클라이언트에 전송할 때 사용
 */
@Data
public class WorldCupStatisticsDTO {
    
    private Long id;
    private Integer pokemonId;
    
    // 포켓몬 기본 정보
    private String pokemonName;
    private String pokemonKoreanName;
    private String spriteUrl;
    private List<String> types;
    private Integer generation;
    
    // 통계 정보
    private Integer totalParticipations;
    private Integer totalWins;
    private Integer totalTop3;
    private Integer averageRank;
    
    // 계산된 통계
    private Integer winRate;       // 승률 (0-100)
    private Integer top3Rate;      // TOP3 진입률 (0-100)
    
    // 마지막 업데이트 시간
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;
} 