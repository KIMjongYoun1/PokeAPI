package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 진화조건 생성 DTO
 * 포켓몬 진화하기위한 조건 정보
 * 
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EvolutionDetailDTO {
    
    @JsonProperty("trigger")
    private ApiResourceDTO trigger;

    @JsonProperty("min_level")
    private Integer minLevel;

    @JsonProperty("item")
    private ApiResourceDTO item;

    @JsonProperty("gender")
    private Integer gender;

    @JsonProperty("held_item")
    private ApiResourceDTO heldItem;

    @JsonProperty("known_move")
    private ApiResourceDTO knownMove;

    @JsonProperty("known_move_type")
    private ApiResourceDTO knownMoveType;

    @JsonProperty("location")
    private ApiResourceDTO location;

    @JsonProperty("min_happiness")
    private Integer minhappiness;

    @JsonProperty("min_beauty")
    private Integer minBeauty;

    @JsonProperty("min_affection")
    private Integer minAffection;

   @JsonProperty("needs_overworld_rain")
   private Boolean needsOverworldRain;

   @JsonProperty("party_species")
   private ApiResourceDTO partySpecies;

   @JsonProperty("party_type")
   private ApiResourceDTO partyType;

   @JsonProperty("relative_physical_stats")
   private Integer relativePhysicalStats;

   @JsonProperty("time_of_day")
   private String timeOfDay;

   @JsonProperty("trade_species")
   private ApiResourceDTO tradeSpecies;

   @JsonProperty("turn_upside_down")
   private Boolean turnUpsideDown;
}
