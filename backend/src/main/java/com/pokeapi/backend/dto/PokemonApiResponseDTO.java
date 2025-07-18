package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * PokeAPI Pokemon API 응답 DTO
 * 외부 API에서 받은 포켓몬 정보를 타입 안전하게 처리하기 위한 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
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
    
    /**
     * 스프라이트 정보 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpritesDTO {
        
        @JsonProperty("front_default")
        private String frontDefault;
        
        @JsonProperty("front_shiny")
        private String frontShiny;
    }
    
    /**
     * 타입 엔트리 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypeEntryDTO {
        
        @JsonProperty("slot")
        private Integer slot;
        
        @JsonProperty("type")
        private ApiResourceDTO type;
    }
    
    /**
     * 능력치 엔트리 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatEntryDTO {
        
        @JsonProperty("base_stat")
        private Integer baseStat;
        
        @JsonProperty("effort")
        private Integer effort;
        
        @JsonProperty("stat")
        private ApiResourceDTO stat;
    }
    
    /**
     * 특성 엔트리 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AbilityEntryDTO {
        
        @JsonProperty("ability")
        private ApiResourceDTO ability;
        
        @JsonProperty("is_hidden")
        private Boolean isHidden;
        
        @JsonProperty("slot")
        private Integer slot;
    }
} 