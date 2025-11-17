package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 월드컵 결과 전송용 DTO
 * 월드컵 결과를 클라이언트에 전송할 때 사용
 */
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
    
    // 생성/완료 시간 (ISO-8601 형식 자동 파싱)
    private LocalDateTime createdAt;
    
    private LocalDateTime completedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTournamentId() {
        return tournamentId;
    }

    public void setTournamentId(String tournamentId) {
        this.tournamentId = tournamentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTournamentType() {
        return tournamentType;
    }

    public void setTournamentType(String tournamentType) {
        this.tournamentType = tournamentType;
    }

    public Map<String, Object> getConditions() {
        return conditions;
    }

    public void setConditions(Map<String, Object> conditions) {
        this.conditions = conditions;
    }

    public List<Map<String, Object>> getParticipants() {
        return participants;
    }

    public void setParticipants(List<Map<String, Object>> participants) {
        this.participants = participants;
    }

    public List<Map<String, Object>> getFinalRanking() {
        return finalRanking;
    }

    public void setFinalRanking(List<Map<String, Object>> finalRanking) {
        this.finalRanking = finalRanking;
    }

    public Integer getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(Integer winnerId) {
        this.winnerId = winnerId;
    }

    public String getWinnerName() {
        return winnerName;
    }

    public void setWinnerName(String winnerName) {
        this.winnerName = winnerName;
    }

    public String getWinnerKoreanName() {
        return winnerKoreanName;
    }

    public void setWinnerKoreanName(String winnerKoreanName) {
        this.winnerKoreanName = winnerKoreanName;
    }

    public String getWinnerSpriteUrl() {
        return winnerSpriteUrl;
    }

    public void setWinnerSpriteUrl(String winnerSpriteUrl) {
        this.winnerSpriteUrl = winnerSpriteUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
} 