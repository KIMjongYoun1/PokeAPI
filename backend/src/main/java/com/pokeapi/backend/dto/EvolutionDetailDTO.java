package com.pokeapi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 진화조건 생성 DTO
 * 포켓몬 진화하기위한 조건 정보
 * 
 */

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
    private Integer minHappiness;

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

    public ApiResourceDTO getTrigger() { return trigger; }
    public void setTrigger(ApiResourceDTO trigger) { this.trigger = trigger; }
    public Integer getMinLevel() { return minLevel; }
    public void setMinLevel(Integer minLevel) { this.minLevel = minLevel; }
    public ApiResourceDTO getItem() { return item; }
    public void setItem(ApiResourceDTO item) { this.item = item; }
    public Integer getGender() { return gender; }
    public void setGender(Integer gender) { this.gender = gender; }
    public ApiResourceDTO getHeldItem() { return heldItem; }
    public void setHeldItem(ApiResourceDTO heldItem) { this.heldItem = heldItem; }
    public ApiResourceDTO getKnownMove() { return knownMove; }
    public void setKnownMove(ApiResourceDTO knownMove) { this.knownMove = knownMove; }
    public ApiResourceDTO getKnownMoveType() { return knownMoveType; }
    public void setKnownMoveType(ApiResourceDTO knownMoveType) { this.knownMoveType = knownMoveType; }
    public ApiResourceDTO getLocation() { return location; }
    public void setLocation(ApiResourceDTO location) { this.location = location; }
    public Integer getMinHappiness() { return minHappiness; }
    public void setMinHappiness(Integer minHappiness) { this.minHappiness = minHappiness; }
    public Integer getMinBeauty() { return minBeauty; }
    public void setMinBeauty(Integer minBeauty) { this.minBeauty = minBeauty; }
    public Integer getMinAffection() { return minAffection; }
    public void setMinAffection(Integer minAffection) { this.minAffection = minAffection; }
    public Boolean getNeedsOverworldRain() { return needsOverworldRain; }
    public void setNeedsOverworldRain(Boolean needsOverworldRain) { this.needsOverworldRain = needsOverworldRain; }
    public ApiResourceDTO getPartySpecies() { return partySpecies; }
    public void setPartySpecies(ApiResourceDTO partySpecies) { this.partySpecies = partySpecies; }
    public ApiResourceDTO getPartyType() { return partyType; }
    public void setPartyType(ApiResourceDTO partyType) { this.partyType = partyType; }
    public Integer getRelativePhysicalStats() { return relativePhysicalStats; }
    public void setRelativePhysicalStats(Integer relativePhysicalStats) { this.relativePhysicalStats = relativePhysicalStats; }
    public String getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(String timeOfDay) { this.timeOfDay = timeOfDay; }
    public ApiResourceDTO getTradeSpecies() { return tradeSpecies; }
    public void setTradeSpecies(ApiResourceDTO tradeSpecies) { this.tradeSpecies = tradeSpecies; }
    public Boolean getTurnUpsideDown() { return turnUpsideDown; }
    public void setTurnUpsideDown(Boolean turnUpsideDown) { this.turnUpsideDown = turnUpsideDown; }
}
