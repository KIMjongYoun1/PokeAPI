package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

/**
 * 포켓몬 종 정보 DTO
 * PokeAPI Species API 응답을 위한 타입 안전한 클래스
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SpeciesDTO {
    
    @JsonProperty("id")
    private Integer id;
    
    @JsonProperty("name")
    private String name;
    
    @JsonProperty("names")
    private List<NameEntryDTO> names;
    
    @JsonProperty("flavor_text_entries")
    private List<FlavorTextEntryDTO> flavorTextEntries;
    
    @JsonProperty("evolution_chain")
    private ApiResourceDTO evolutionChain;
    
    /**
     * 포켓몬 이름 엔트리 DTO
     * 다국어 이름 정보를 담는 내부 클래스
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NameEntryDTO {
        
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("language")
        private LanguageDTO language;
    }
    
    /**
     * 언어 정보 DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LanguageDTO {
        
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("url")
        private String url;
    }
    
    /**
     * 포켓몬 설명 엔트리 DTO
     * flavor_text_entries를 위한 내부 클래스
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FlavorTextEntryDTO {
        
        @JsonProperty("flavor_text")
        private String flavorText;
        
        @JsonProperty("language")
        private LanguageDTO language;
        
        @JsonProperty("version")
        private ApiResourceDTO version;
    }
} 