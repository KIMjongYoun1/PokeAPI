package com.pokeapi.backend.repository;

import com.pokeapi.backend.entity.WorldCupStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorldCupStatisticsRepository extends JpaRepository<WorldCupStatistics, Long> {
    
    // 포켓몬 ID로 통계 조회
    Optional<WorldCupStatistics> findByPokemonId(Integer pokemonId);

    // 포켓몬 ID로 통계 존재 여부 확인
    boolean existsByPokemonId(Integer pokemonId);

    // 평균 순위 기준 상위 N개 조회
    List<WorldCupStatistics> findTop10ByOrderByAverageRankAsc();

    // 총 우승 횟수 기준 상위 N개 조회
    List<WorldCupStatistics> findTop10ByOrderByTotalWinsDesc();

    // 총 참가 횟수 기준 상위 N개 조회 (오타 수정: Participateions → Participations)
    List<WorldCupStatistics> findTop10ByOrderByTotalParticipationsDesc();

    // TOP3 진입 횟수 기준 상위 N개 조회
    List<WorldCupStatistics> findTop10ByOrderByTotalTop3Desc();

    // 세대별 TOP 포켓몬 조회 (Pokemon 엔티티와 조인)
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN Pokemon p ON w.pokemonId = p.pokemonId " + 
           "WHERE p.generation = :generation " + 
           "ORDER BY w.averageRank ASC, w.totalWins DESC")
    List<WorldCupStatistics> findTopByGenerationOrderByRankAndWins(@Param("generation") Integer generation);
        
    // 타입별 TOP 포켓몬 조회 (koreanTypes 필드에서 LIKE 검색) - 오타 수정: LIDE → LIKE
    @Query("SELECT w FROM WorldCupStatistics w " + 
           "JOIN Pokemon p ON w.pokemonId = p.pokemonId " +
           "WHERE p.koreanTypes LIKE %:typeName% " +
           "ORDER BY w.averageRank ASC, w.totalWins DESC")
    List<WorldCupStatistics> findTopByTypeOrderByRankAndWins(@Param("typeName") String typeName);
    
    // 세대별 + 타입별 TOP 포켓몬 조회 - 오타 수정: LIKE %:typeName → LIKE %:typeName%
    @Query("SELECT w FROM WorldCupStatistics w " + 
           "JOIN Pokemon p ON w.pokemonId = p.pokemonId " +
           "WHERE p.generation = :generation AND p.koreanTypes LIKE %:typeName% " +
           "ORDER BY w.averageRank ASC, w.totalWins DESC")
    List<WorldCupStatistics> findTopByGenerationAndTypeOrderByRankAndWins(
        @Param("generation") Integer generation, 
        @Param("typeName") String typeName);
    
    // 참가 횟수가 있는 포켓몬들만 조회 (오타 수정: Participateions → Participations)
    List<WorldCupStatistics> findByTotalParticipationsGreaterThanOrderByAverageRankAsc(Integer minParticipations);
    
    // 우승 횟수가 있는 포켓몬들만 조회
    List<WorldCupStatistics> findByTotalWinsGreaterThanOrderByTotalWinsDesc(Integer minWins);
    
    // ===== 우승자 기준 조회 (WorldCupResult와 조인) =====
    
    // 타입별 우승자들 조회 (WorldCupResult와 조인)
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN WorldCupResult wr ON w.pokemonId = wr.winnerId " +
           "WHERE wr.conditions LIKE %:type% " +
           "ORDER BY w.totalWins DESC, w.averageRank ASC")
    List<WorldCupStatistics> findTypeWinners(@Param("type") String type);
    
    // 세대별 우승자들 조회 (WorldCupResult와 조인)
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN WorldCupResult wr ON w.pokemonId = wr.winnerId " +
           "WHERE wr.conditions LIKE %:generation% " +
           "ORDER BY w.totalWins DESC, w.averageRank ASC")
    List<WorldCupStatistics> findGenerationWinners(@Param("generation") String generation);
    
    // 세대별 + 타입별 우승자 조회
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN WorldCupResult wr ON w.pokemonId = wr.winnerId " +
           "WHERE wr.conditions LIKE %:generation% " +
           "AND wr.conditions LIKE %:type% " +
           "ORDER BY w.totalWins DESC, w.averageRank ASC")
    List<WorldCupStatistics> findGenerationAndTypeWinners(
        @Param("generation") String generation, 
        @Param("type") String type);
    
    // 타입별 + 기간별 우승자 조회
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN WorldCupResult wr ON w.pokemonId = wr.winnerId " +
           "WHERE wr.conditions LIKE %:type% " +
           "AND wr.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupStatistics> findTypeWinnersByPeriod(
        @Param("type") String type, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
    
    // 세대별 + 기간별 우승자 조회
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN WorldCupResult wr ON w.pokemonId = wr.winnerId " +
           "WHERE wr.conditions LIKE %:generation% " +
           "AND wr.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupStatistics> findGenerationWinnersByPeriod(
        @Param("generation") String generation, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
    
    // 세대별 + 타입별 + 기간별 우승자 조회
    @Query("SELECT w FROM WorldCupStatistics w " +
           "JOIN WorldCupResult wr ON w.pokemonId = wr.winnerId " +
           "WHERE wr.conditions LIKE %:generation% " +
           "AND wr.conditions LIKE %:type% " +
           "AND wr.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupStatistics> findGenerationAndTypeWinnersByPeriod(
        @Param("generation") String generation, 
        @Param("type") String type,
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
}
