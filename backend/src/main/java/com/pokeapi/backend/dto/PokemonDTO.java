package com.pokeapi.backend.dto;

import java.util.List;

// ===== Lombok 자동 생성 기능들 =====
// @Data: @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor 모두 포함
// @NoArgsConstructor: 기본 생성자 자동 생성
// @AllArgsConstructor: 모든 필드 생성자 자동 생성

public class PokemonDTO {
    private Long id;
    private Integer pokemonId;
    private String name;
    private String koreanName;
    private Integer baseExperience;
    private Integer height;
    private Integer weight;
    private String spriteUrl;
    private String shinySpriteUrl;
    private String officialArtworkUrl;
    private List<String> types;
    private List<String> koreanTypes;
    private List<StatDTO> stats;
    private String description;
    private List<String> abilities;
    private Integer generation;

    // Getter 메서드들
    public Long getId() { return id; }
    public Integer getPokemonId() { return pokemonId; }
    public String getName() { return name; }
    public String getKoreanName() { return koreanName; }
    public Integer getBaseExperience() { return baseExperience; }
    public Integer getHeight() { return height; }
    public Integer getWeight() { return weight; }
    public String getSpriteUrl() { return spriteUrl; }
    public String getShinySpriteUrl() { return shinySpriteUrl; }
    public String getOfficialArtworkUrl() { return officialArtworkUrl; }
    public List<String> getTypes() { return types; }
    public List<String> getKoreanTypes() { return koreanTypes; }
    public List<StatDTO> getStats() { return stats; }
    public String getDescription() { return description; }
    public List<String> getAbilities() { return abilities; }
    public Integer getGeneration() { return generation; }
    
    // Setter 메서드들
    public void setId(Long id) { this.id = id; }
    public void setPokemonId(Integer pokemonId) { this.pokemonId = pokemonId; }
    public void setName(String name) { this.name = name; }
    public void setKoreanName(String koreanName) { this.koreanName = koreanName; }
    public void setBaseExperience(Integer baseExperience) { this.baseExperience = baseExperience; }
    public void setHeight(Integer height) { this.height = height; }
    public void setWeight(Integer weight) { this.weight = weight; }
    public void setSpriteUrl(String spriteUrl) { this.spriteUrl = spriteUrl; }
    public void setShinySpriteUrl(String shinySpriteUrl) { this.shinySpriteUrl = shinySpriteUrl; }
    public void setOfficialArtworkUrl(String officialArtworkUrl) { this.officialArtworkUrl = officialArtworkUrl; }
    public void setTypes(List<String> types) { this.types = types; }
    public void setKoreanTypes(List<String> koreanTypes) { this.koreanTypes = koreanTypes; }
    public void setStats(List<StatDTO> stats) { this.stats = stats; }
    public void setDescription(String description) { this.description = description; }
    public void setAbilities(List<String> abilities) { this.abilities = abilities; }
    public void setGeneration(Integer generation) { this.generation = generation; }

public static class StatDTO {
    private String name;
    private Integer baseStat;
    private Integer effort;
    
    // Getter/Setter
    public String getName() { return name; }
    public Integer getBaseStat() { return baseStat; }
    public Integer getEffort() { return effort; }
    
    public void setName(String name) { this.name = name; }
    public void setBaseStat(Integer baseStat) { this.baseStat = baseStat; }
    public void setEffort(Integer effort) { this.effort = effort; }
}

}


