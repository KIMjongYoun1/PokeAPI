package com.pokeapi.backend.dto;

import lombok.Data;

import java.util.List;

/**
 * 월드컵 참가자 정보 전송용 DTO
 * 월드컵에 참가하는 포켓몬 정보를 전송할 때 사용
 */
@Data
public class WorldCupParticipantDTO {
    
    private Integer id;                    // 포켓몬 ID
    private String name;                   // 영어 이름
    private String koreanName;             // 한글 이름
    private List<String> types;            // 타입 목록
    private String spriteUrl;              // 스프라이트 URL
    private String description;            // 설명 (있는 경우만)
    private Integer generation;            // 세대
    
    // 월드컵 진행 중 정보
    private Integer rank;                  // 현재 순위 (월드컵 진행 중)
    private Integer wins;                  // 현재 승리 횟수
    private Integer totalMatches;          // 총 매치 수
    private Double winRate;                // 승률
    
    // 통계 정보 (선택사항)
    private Integer totalParticipations;   // 총 참가 횟수
    private Integer totalWins;             // 총 우승 횟수
    private Double averageRank;            // 평균 순위
} 