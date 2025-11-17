package com.pokeapi.backend.dto;

/**
 * 통계 기반 자동 월드컵 생성 요청용 DTO
 * 인기 포켓몬들을 기반으로 자동으로 월드컵을 생성할 때 사용
 */
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

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGeneration() {
        return generation;
    }

    public void setGeneration(String generation) {
        this.generation = generation;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getParticipantCount() {
        return participantCount;
    }

    public void setParticipantCount(Integer participantCount) {
        this.participantCount = participantCount;
    }

    public String getSelectionMethod() {
        return selectionMethod;
    }

    public void setSelectionMethod(String selectionMethod) {
        this.selectionMethod = selectionMethod;
    }

    public Boolean getIncludeRandom() {
        return includeRandom;
    }

    public void setIncludeRandom(Boolean includeRandom) {
        this.includeRandom = includeRandom;
    }

    public Integer getRandomCount() {
        return randomCount;
    }

    public void setRandomCount(Integer randomCount) {
        this.randomCount = randomCount;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public Integer getTopCount() {
        return topCount;
    }

    public void setTopCount(Integer topCount) {
        this.topCount = topCount;
    }
} 