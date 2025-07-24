package com.pokeapi.backend.repository;

import com.pokeapi.backend.entity.PokemonNameMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PokemonNameMappingRepository extends JpaRepository<PokemonNameMapping, Long> {
    
    /**
     * 한글 이름으로 영문 이름 조회
     */
    Optional<PokemonNameMapping> findByKoreanName(String koreanName);
    
    /**
     * 영문 이름으로 한글 이름 조회
     */
    Optional<PokemonNameMapping> findByEnglishName(String englishName);
    
    /**
     * 포켓몬 ID로 매핑 조회
     */
    Optional<PokemonNameMapping> findByPokemonId(Integer pokemonId);
    
    /**
     * 한글 이름 존재 여부 확인
     */
    boolean existsByKoreanName(String koreanName);
    
    /**
     * 영문 이름 존재 여부 확인
     */
    boolean existsByEnglishName(String englishName);
} 