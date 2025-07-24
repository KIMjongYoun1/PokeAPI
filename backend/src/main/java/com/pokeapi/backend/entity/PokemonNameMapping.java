package com.pokeapi.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "pokemon_name_mapping", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"korean_name", "english_name"}))
public class PokemonNameMapping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "korean_name", nullable = false, length = 50)
    private String koreanName;
    
    @Column(name = "english_name", nullable = false, length = 50)
    private String englishName;
    
    @Column(name = "pokemon_id", nullable = false)
    private Integer pokemonId;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // 기본 생성자
    public PokemonNameMapping() {}
    
    // 생성자
    public PokemonNameMapping(String koreanName, String englishName, Integer pokemonId) {
        this.koreanName = koreanName;
        this.englishName = englishName;
        this.pokemonId = pokemonId;
    }
    
    // Getter & Setter
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getKoreanName() {
        return koreanName;
    }
    
    public void setKoreanName(String koreanName) {
        this.koreanName = koreanName;
    }
    
    public String getEnglishName() {
        return englishName;
    }
    
    public void setEnglishName(String englishName) {
        this.englishName = englishName;
    }
    
    public Integer getPokemonId() {
        return pokemonId;
    }
    
    public void setPokemonId(Integer pokemonId) {
        this.pokemonId = pokemonId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 