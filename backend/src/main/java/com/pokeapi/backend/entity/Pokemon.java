package com.pokeapi.backend.entity;

import jakarta.persistence.*;
import java.util.Date;

// ===== JPA 자동 제공 기능들 =====
// @Entity: JPA 엔티티로 등록
// @Table: 데이터베이스 테이블 매핑
// @Id: 기본키 지정
// @GeneratedValue: 자동 증가 (IDENTITY 전략)
// @Column: 컬럼 매핑 및 제약조건
// @Temporal: 날짜/시간 타입 매핑
// @PrePersist: 저장 전 자동 실행
// @PreUpdate: 수정 전 자동 실행

// ===== Lombok 자동 생성 기능들 =====
// @Getter: 모든 필드의 getter 메서드 자동 생성
// @Setter: 모든 필드의 setter 메서드 자동 생성
// @ToString: toString() 메서드 자동 생성 (exclude로 제외 가능)
// @EqualsAndHashCode: equals(), hashCode() 메서드 자동 생성
// @NoArgsConstructor: 기본 생성자 자동 생성
// @AllArgsConstructor: 모든 필드 생성자 자동 생성


@Entity
@Table(name = "pokemon")
public class Pokemon {
    

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pokemon_id", unique = true, nullable = false)
    private Integer pokemonId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "base_experience", nullable = false)
    private Integer baseExperience;

    @Column(name = "height")
    private Integer height;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "sprite_url", nullable = false)
    private String spriteUrl;

    @Column(name = "shiny_sprite_url", nullable = false)
    private String shinySpriteUrl;

    @Column(name = "official_artwork_url")
    private String officialArtworkUrl;

    @Column(name = "types", columnDefinition = "TEXT")
    private String types;

    @Column(name = "stats", columnDefinition = "TEXT")
    private String stats;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "abilities", columnDefinition = "TEXT")
    private String abilities;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = new Date();
        updatedAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Date();
    }
    
    // Getter 메서드들
    public Long getId() { return id; }
    public Integer getPokemonId() { return pokemonId; }
    public String getName() { return name; }
    public Integer getBaseExperience() { return baseExperience; }
    public Integer getHeight() { return height; }
    public Integer getWeight() { return weight; }
    public String getSpriteUrl() { return spriteUrl; }
    public String getShinySpriteUrl() { return shinySpriteUrl; }
    public String getOfficialArtworkUrl() { return officialArtworkUrl; }
    public String getTypes() { return types; }
    public String getStats() { return stats; }
    public String getDescription() { return description; }
    public String getAbilities() { return abilities; }
    public Date getCreatedAt() { return createdAt; }
    public Date getUpdatedAt() { return updatedAt; }
    
    // Setter 메서드들
    public void setId(Long id) { this.id = id; }
    public void setPokemonId(Integer pokemonId) { this.pokemonId = pokemonId; }
    public void setName(String name) { this.name = name; }
    public void setBaseExperience(Integer baseExperience) { this.baseExperience = baseExperience; }
    public void setHeight(Integer height) { this.height = height; }
    public void setWeight(Integer weight) { this.weight = weight; }
    public void setSpriteUrl(String spriteUrl) { this.spriteUrl = spriteUrl; }
    public void setShinySpriteUrl(String shinySpriteUrl) { this.shinySpriteUrl = shinySpriteUrl; }
    public void setOfficialArtworkUrl(String officialArtworkUrl) { this.officialArtworkUrl = officialArtworkUrl; }
    public void setTypes(String types) { this.types = types; }
    public void setStats(String stats) { this.stats = stats; }
    public void setDescription(String description) { this.description = description; }
    public void setAbilities(String abilities) { this.abilities = abilities; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
    
}
