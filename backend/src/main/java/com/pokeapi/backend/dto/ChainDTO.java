package com.pokeapi.backend.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * 진화 체인 DTO
 * 포켓몬 진화 체인 정보
 */
public class ChainDTO {
    
    @JsonProperty("evolution_details")
    private List<EvolutionDetailDTO> evolutionDetails;
   
    @JsonProperty("evolves_to")
    private List<ChainDTO> evolvesTo;
   
    @JsonProperty("is_baby")
    private Boolean isBaby;
   
    @JsonProperty("species")
    private ApiResourceDTO species;
    
    public List<EvolutionDetailDTO> getEvolutionDetails() { return evolutionDetails; }
    public void setEvolutionDetails(List<EvolutionDetailDTO> evolutionDetails) { this.evolutionDetails = evolutionDetails; }
    public List<ChainDTO> getEvolvesTo() { return evolvesTo; }
    public void setEvolvesTo(List<ChainDTO> evolvesTo) { this.evolvesTo = evolvesTo; }
    public Boolean getIsBaby() { return isBaby; }
    public void setIsBaby(Boolean isBaby) { this.isBaby = isBaby; }
    public ApiResourceDTO getSpecies() { return species; }
    public void setSpecies(ApiResourceDTO species) { this.species = species; }
}
