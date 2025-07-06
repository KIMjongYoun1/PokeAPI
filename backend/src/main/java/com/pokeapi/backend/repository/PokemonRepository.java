package com.pokeapi.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import com.pokeapi.backend.entity.Pokemon;


@Repository
public interface PokemonRepository extends JpaRepository<Pokemon, Long> {
    
    // ===== JpaRepository에서 자동 제공되는 기본 메서드들 =====
    // List<Pokemon> findAll();                    // 전체 조회
    // Optional<Pokemon> findById(Long id);        // ID로 조회
    // Pokemon save(Pokemon entity);               // 저장
    // void deleteById(Long id);                   // 삭제
    // long count();                               // 개수 조회
    // boolean existsById(Long id);                // 존재 여부 확인
    
    // ===== 커스텀 메서드들 =====
    // PokeAPI ID로 검색
    Optional<Pokemon> findByPokemonId(Integer pokemonId);
    
    // 이름으로 검색
    Optional<Pokemon> findByName(String name);
    
    // PokeAPI ID 존재 여부 확인
    boolean existsByPokemonId(Integer pokemonId);

}
