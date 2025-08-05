package com.pokeapi.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.Data;

@Entity
@Table(name = "world_cup_results")
@Data
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
}
