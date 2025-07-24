package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * 진화 체인 DTO
 * 포켓몬 진화 체인 정보
 */
public class EvolutionDTO {
    
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("baby_trigger_item")
    private ApiResourceDTO babyTriggerItem;

    @JsonProperty("chain")
    private ChainDTO chain;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public ApiResourceDTO getBabyTriggerItem() { return babyTriggerItem; }
    public void setBabyTriggerItem(ApiResourceDTO babyTriggerItem) { this.babyTriggerItem = babyTriggerItem; }
    public ChainDTO getChain() { return chain; }
    public void setChain(ChainDTO chain) { this.chain = chain; }
}
