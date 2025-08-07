package com.pokeapi.backend.dto;

import lombok.Data;

import java.util.List;

/**
 * 월드컵 순위 정보 전송용 DTO
 * 월드컵의 최종 순위 정보를 전송할 때 사용
 */
@Data
public class WorldCupRankingDTO {
    
    private Integer rank;                  // 순위
    private Integer pokemonId;             // 포켓몬 ID
    private String pokemonName;            // 영어 이름
    private String pokemonKoreanName;      // 한글 이름
    private String spriteUrl;              // 스프라이트 URL
    private List<String> types;            // 타입 목록
    private Integer generation;            // 세대
    
    // 월드컵 성과
    private Integer wins;                  // 승리 횟수
    private Integer totalMatches;          // 총 매치 수
    private Integer winRate;               // 승률 (0-100)
    
    // 추가 정보
    private String description;            // 설명 (있는 경우만)
    private Integer totalParticipations;   // 총 참가 횟수 (통계에서)
    private Integer totalWins;             // 총 우승 횟수 (통계에서)
    private Integer averageRank;           // 평균 순위 (통계에서)
} 