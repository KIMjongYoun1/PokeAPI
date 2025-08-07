package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 월드컵 결과 전송용 DTO
 * 월드컵 결과를 클라이언트에 전송할 때 사용
 */
@Data
public class WorldCupResultDTO {
    
    private Long id;
    private String tournamentId;
    private String title;
    private String tournamentType;
    
    // JSON 형태로 저장된 조건들
    private Map<String, Object> conditions;
    
    // 참가자 목록 (JSON 형태)
    private List<Map<String, Object>> participants;
    
    // 최종 순위 (JSON 형태)
    private List<Map<String, Object>> finalRanking;
    
    // 우승자 정보
    private Integer winnerId;
    private String winnerName;
    private String winnerKoreanName;
    private String winnerSpriteUrl;
    
    // 생성/완료 시간
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime completedAt;
} 