package com.pokeapi.backend.dto;

import java.util.List;

/**
 * 월드컵 참가자 정보 전송용 DTO
 * 월드컵에 참가하는 포켓몬 정보를 전송할 때 사용
 */
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

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKoreanName() {
        return koreanName;
    }

    public void setKoreanName(String koreanName) {
        this.koreanName = koreanName;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }

    public String getSpriteUrl() {
        return spriteUrl;
    }

    public void setSpriteUrl(String spriteUrl) {
        this.spriteUrl = spriteUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getGeneration() {
        return generation;
    }

    public void setGeneration(Integer generation) {
        this.generation = generation;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Integer getWins() {
        return wins;
    }

    public void setWins(Integer wins) {
        this.wins = wins;
    }

    public Integer getTotalMatches() {
        return totalMatches;
    }

    public void setTotalMatches(Integer totalMatches) {
        this.totalMatches = totalMatches;
    }

    public Double getWinRate() {
        return winRate;
    }

    public void setWinRate(Double winRate) {
        this.winRate = winRate;
    }

    public Integer getTotalParticipations() {
        return totalParticipations;
    }

    public void setTotalParticipations(Integer totalParticipations) {
        this.totalParticipations = totalParticipations;
    }

    public Integer getTotalWins() {
        return totalWins;
    }

    public void setTotalWins(Integer totalWins) {
        this.totalWins = totalWins;
    }

    public Double getAverageRank() {
        return averageRank;
    }

    public void setAverageRank(Double averageRank) {
        this.averageRank = averageRank;
    }
} 