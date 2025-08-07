package com.pokeapi.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "world_cup_statistics")
@Data
public class WorldCupStatistics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pokemon_id", unique = true, nullable = false)
    private Integer pokemonId;

    @Column(name = "total_participations", nullable = false)
    private Integer totalParticipations = 0; // 오타 수정: Participateions → Participations
    
    @Column(name = "total_wins", nullable = false)
    private Integer totalWins = 0;

    @Column(name = "total_top3", nullable = false)
    private Integer totalTop3 = 0;

    @Column(name = "average_rank", nullable = false)
    private Integer averageRank = 0;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
}
