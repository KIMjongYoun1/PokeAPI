package com.pokeapi.backend.dto;

import java.util.List;

/**
 * 월드컵 순위 정보 전송용 DTO
 * 월드컵의 최종 순위 정보를 전송할 때 사용
 */
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

    // Getters and Setters
    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Integer getPokemonId() {
        return pokemonId;
    }

    public void setPokemonId(Integer pokemonId) {
        this.pokemonId = pokemonId;
    }

    public String getPokemonName() {
        return pokemonName;
    }

    public void setPokemonName(String pokemonName) {
        this.pokemonName = pokemonName;
    }

    public String getPokemonKoreanName() {
        return pokemonKoreanName;
    }

    public void setPokemonKoreanName(String pokemonKoreanName) {
        this.pokemonKoreanName = pokemonKoreanName;
    }

    public String getSpriteUrl() {
        return spriteUrl;
    }

    public void setSpriteUrl(String spriteUrl) {
        this.spriteUrl = spriteUrl;
    }

    public List<String> getTypes() {
        return types;
    }

    public void setTypes(List<String> types) {
        this.types = types;
    }

    public Integer getGeneration() {
        return generation;
    }

    public void setGeneration(Integer generation) {
        this.generation = generation;
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

    public Integer getWinRate() {
        return winRate;
    }

    public void setWinRate(Integer winRate) {
        this.winRate = winRate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getAverageRank() {
        return averageRank;
    }

    public void setAverageRank(Integer averageRank) {
        this.averageRank = averageRank;
    }
} 