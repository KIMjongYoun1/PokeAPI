package com.pokeapi.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "world_cup_results")
public class WorldCupResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tournament_id", unique = true, nullable = false)
    private String tournamentId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "tournament_type", nullable = false)
    private String tournamentType = "vote";

    @Column(name = "conditions", nullable = false, columnDefinition = "TEXT")
    private String conditions;

    @Column(name = "participants", nullable = false, columnDefinition = "TEXT")
    private String participants;

    @Column(name = "final_ranking", nullable = false, columnDefinition = "TEXT")
    private String finalRanking;

    @Column(name = "winner_id", nullable = false)
    private Integer winnerId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "completed_at", nullable = false)
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

    public String getConditions() {
        return conditions;
    }

    public void setConditions(String conditions) {
        this.conditions = conditions;
    }

    public String getParticipants() {
        return participants;
    }

    public void setParticipants(String participants) {
        this.participants = participants;
    }

    public String getFinalRanking() {
        return finalRanking;
    }

    public void setFinalRanking(String finalRanking) {
        this.finalRanking = finalRanking;
    }

    public Integer getWinnerId() {
        return winnerId;
    }

    public void setWinnerId(Integer winnerId) {
        this.winnerId = winnerId;
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
