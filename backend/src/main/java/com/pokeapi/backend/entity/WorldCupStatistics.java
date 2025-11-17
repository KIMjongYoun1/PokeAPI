package com.pokeapi.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "world_cup_statistics")
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

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
