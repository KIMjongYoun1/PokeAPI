package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 월드컵 통계 데이터 전송용 DTO
 * 포켓몬별 월드컵 통계를 클라이언트에 전송할 때 사용
 */
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

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Integer getTotalTop3() {
        return totalTop3;
    }

    public void setTotalTop3(Integer totalTop3) {
        this.totalTop3 = totalTop3;
    }

    public Integer getAverageRank() {
        return averageRank;
    }

    public void setAverageRank(Integer averageRank) {
        this.averageRank = averageRank;
    }

    public Integer getWinRate() {
        return winRate;
    }

    public void setWinRate(Integer winRate) {
        this.winRate = winRate;
    }

    public Integer getTop3Rate() {
        return top3Rate;
    }

    public void setTop3Rate(Integer top3Rate) {
        this.top3Rate = top3Rate;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
} 