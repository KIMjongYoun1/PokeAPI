package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * PokeAPI Pokemon API 응답 DTO
 * 외부 API에서 받은 포켓몬 정보를 타입 안전하게 처리하기 위한 클래스
 */
public class PokemonApiResponseDTO {
    
    @JsonProperty("id")
    private Integer id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("base_experience")
    private Integer baseExperience;
    
    @JsonProperty("height")
    private Integer height;
    
    @JsonProperty("weight")
    private Integer weight;
    
    @JsonProperty("sprites")
    private SpritesDTO sprites;
    
    @JsonProperty("types")
    private List<TypeEntryDTO> types;
    
    @JsonProperty("stats")
    private List<StatEntryDTO> stats;
    
    @JsonProperty("abilities")
    private List<AbilityEntryDTO> abilities;
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getBaseExperience() { return baseExperience; }
    public void setBaseExperience(Integer baseExperience) { this.baseExperience = baseExperience; }
    public Integer getHeight() { return height; }
    public void setHeight(Integer height) { this.height = height; }
    public Integer getWeight() { return weight; }
    public void setWeight(Integer weight) { this.weight = weight; }
    public SpritesDTO getSprites() { return sprites; }
    public void setSprites(SpritesDTO sprites) { this.sprites = sprites; }
    public List<TypeEntryDTO> getTypes() { return types; }
    public void setTypes(List<TypeEntryDTO> types) { this.types = types; }
    public List<StatEntryDTO> getStats() { return stats; }
    public void setStats(List<StatEntryDTO> stats) { this.stats = stats; }
    public List<AbilityEntryDTO> getAbilities() { return abilities; }
    public void setAbilities(List<AbilityEntryDTO> abilities) { this.abilities = abilities; }

    /**
     * 스프라이트 정보 DTO
     */
    public static class SpritesDTO {
        
        @JsonProperty("front_default")
        private String frontDefault;
        
        @JsonProperty("front_shiny")
        private String frontShiny;

        public String getFrontDefault() { return frontDefault; }
        public void setFrontDefault(String frontDefault) { this.frontDefault = frontDefault; }
        public String getFrontShiny() { return frontShiny; }
        public void setFrontShiny(String frontShiny) { this.frontShiny = frontShiny; }
    }
    
    /**
     * 타입 엔트리 DTO
     */
    public static class TypeEntryDTO {
        
        @JsonProperty("slot")
        private Integer slot;
        
        @JsonProperty("type")
        private ApiResourceDTO type;

        public Integer getSlot() { return slot; }
        public void setSlot(Integer slot) { this.slot = slot; }
        public ApiResourceDTO getType() { return type; }
        public void setType(ApiResourceDTO type) { this.type = type; }
    }
    
    /**
     * 능력치 엔트리 DTO
     */
    public static class StatEntryDTO {
        
        @JsonProperty("base_stat")
        private Integer baseStat;
        
        @JsonProperty("effort")
        private Integer effort;
        
        @JsonProperty("stat")
        private ApiResourceDTO stat;

        public Integer getBaseStat() { return baseStat; }
        public void setBaseStat(Integer baseStat) { this.baseStat = baseStat; }
        public Integer getEffort() { return effort; }
        public void setEffort(Integer effort) { this.effort = effort; }
        public ApiResourceDTO getStat() { return stat; }
        public void setStat(ApiResourceDTO stat) { this.stat = stat; }
    }
    
    /**
     * 특성 엔트리 DTO
     */
    public static class AbilityEntryDTO {
        
        @JsonProperty("ability")
        private ApiResourceDTO ability;
        
        @JsonProperty("is_hidden")
        private Boolean isHidden;
        
        @JsonProperty("slot")
        private Integer slot;

        public ApiResourceDTO getAbility() { return ability; }
        public void setAbility(ApiResourceDTO ability) { this.ability = ability; }
        public Boolean getIsHidden() { return isHidden; }
        public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }
        public Integer getSlot() { return slot; }
        public void setSlot(Integer slot) { this.slot = slot; }
    }
} 