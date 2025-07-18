package com.pokeapi.backend.dto;

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
public class EvolutionDTO {
    
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("baby_trigger_item")
    private ApiResourceDTO babyTriggerItem;

    @JsonProperty("chain")
    private ChainDTO chain;
}
