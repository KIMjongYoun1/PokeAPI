package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/** 
 * 포켓몬 종 정보 DTO
 * PokeAPI Species API 응답을 위한 타입 안전한 클래스
 */
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
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<NameEntryDTO> getNames() { return names; }
    public void setNames(List<NameEntryDTO> names) { this.names = names; }
    public List<FlavorTextEntryDTO> getFlavorTextEntries() { return flavorTextEntries; }
    public void setFlavorTextEntries(List<FlavorTextEntryDTO> flavorTextEntries) { this.flavorTextEntries = flavorTextEntries; }
    public ApiResourceDTO getEvolutionChain() { return evolutionChain; }
    public void setEvolutionChain(ApiResourceDTO evolutionChain) { this.evolutionChain = evolutionChain; }

    /**
     * 포켓몬 이름 엔트리 DTO
     * 다국어 이름 정보를 담는 내부 클래스
     */
    public static class NameEntryDTO {
        
        @JsonProperty("name")
        private String name;
        
        @JsonProperty("language")
        private LanguageDTO language;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public LanguageDTO getLanguage() { return language; }
        public void setLanguage(LanguageDTO language) { this.language = language; }
    }
    
    /**
     * 언어 정보 DTO
     */
    public static class LanguageDTO {
    
    @JsonProperty("name")
    private String name;

    @JsonProperty("url")
    private String url;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    /**
     * 포켓몬 설명 엔트리 DTO
     * flavor_text_entries를 위한 내부 클래스
     */
    public static class FlavorTextEntryDTO {
        
        @JsonProperty("flavor_text")
        private String flavorText;
        
        @JsonProperty("language")
        private LanguageDTO language;
        
        @JsonProperty("version")
        private ApiResourceDTO version;

        public String getFlavorText() { return flavorText; }
        public void setFlavorText(String flavorText) { this.flavorText = flavorText; }
        public LanguageDTO getLanguage() { return language; }
        public void setLanguage(LanguageDTO language) { this.language = language; }
        public ApiResourceDTO getVersion() { return version; }
        public void setVersion(ApiResourceDTO version) { this.version = version; }
}
} 