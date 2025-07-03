package com.pokeapi.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.pokeapi.backend.entity.Pokemon;


@Repository
public interface PokemonRepository extends JpaRepository<Pokemon, Long> {
    
    //이름으로 검색
    Optional<Pokemon> findByPokemonId(Integer pokemonId);
    // PokeAPI ID로 검색
    Optional<Pokemon> findByName(String name);
    //이름으로 존재 여부 확인
    boolean existsByPokemonId(Integer pokemonId);

}
