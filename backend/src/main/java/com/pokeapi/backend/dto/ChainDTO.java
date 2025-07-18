package com.pokeapi.backend.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



/**
 * 진화 체인 DTO
 * 포켓몬 진화 체인 정보
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChainDTO {
    
    @JsonProperty("evolution_details")
    private List<EvolutionDetailDTO> evolutionDetails;
   
    @JsonProperty("evolves_to")
    private List<ChainDTO> evolvesTo;
   
    @JsonProperty("is_baby")
    private Boolean isBaby;
   
    @JsonProperty("species")
    private ApiResourceDTO species;
    
    
}
