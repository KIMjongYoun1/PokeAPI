package com.pokeapi.backend.dto;

import lombok.Data;

/**
 * 통계 기반 자동 월드컵 생성 요청용 DTO
 * 인기 포켓몬들을 기반으로 자동으로 월드컵을 생성할 때 사용
 */
@Data
public class AutoWorldCupRequestDTO {
    
    private String title;                    // 월드컵 제목
    
    // 조건 설정
    private String generation;               // 세대 (예: "1", "2", "all")
    private String type;                     // 타입 (예: "불꽃", "물", "all")
    private Integer participantCount = 16;   // 참가자 수 (기본값: 16)
    
    // 선택 방법 설정
    private String selectionMethod = "top3_random"; // "top3_random", "top_rank", "top_wins"
    private Boolean includeRandom = true;           // TOP3 외 랜덤 포켓몬 포함 여부
    private Integer randomCount = 13;               // 랜덤으로 추가할 포켓몬 수 (TOP3 제외)
    
    // 통계 기준 설정
    private String sortBy = "averageRank";          // 정렬 기준: "averageRank", "totalWins", "totalTop3"
    private Integer topCount = 3;                   // 상위 몇 개를 고정으로 선택할지
} 