package com.pokeapi.backend.controller;

import com.pokeapi.backend.service.PokemonService;
import com.pokeapi.backend.dto.PokemonDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    @Autowired
    private PokemonService pokemonService;

    @GetMapping("/{name}")
    public ResponseEntity<PokemonDTO> getPokemon(@PathVariable String name) {
        PokemonDTO pokemonDTO = pokemonService.searchPokemonName(name);
        if (pokemonDTO != null) {
            return ResponseEntity.ok(pokemonDTO);
        }

        return ResponseEntity.notFound().build();
    }

}