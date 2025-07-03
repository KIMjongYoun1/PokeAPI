package com.pokeapi.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PokemonDTO {
    private Long id;
    private Integer pokemonId;
    private String name;
    private Integer baseExperience;
    private Integer height;
    private Integer weight;
    private String spriteUrl;
    private String shinySpriteUrl;
    private String officialArtworkUrl;
    private List<String> types;
    private List<StatDTO> stats;
    private String description;
    private List<String> abilities;

@Data
@NoArgsConstructor
@AllArgsConstructor
public static class StatDTO {
    private String name;
    private Integer baseStat;
    private Integer effort;
}

}


