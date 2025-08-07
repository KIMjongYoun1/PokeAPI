package com.pokeapi.backend.repository;

import com.pokeapi.backend.entity.WorldCupResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorldCupResultRepository extends JpaRepository<WorldCupResult, Long> {
    
    // 토너먼트 ID로 조회
    Optional<WorldCupResult> findByTournamentId(String tournamentId);

    // 최근 월드컵 결과 조회 (최신순)
    List<WorldCupResult> findAllByOrderByCreatedAtDesc();

    // 최근 N개 월드컵 결과 조회
    List<WorldCupResult> findTop10ByOrderByCreatedAtDesc();

    // 특정 기간 내 월드컵 결과 조회 (오타 수정: Betwwen → Between)
    List<WorldCupResult> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime startDate, LocalDateTime endDate);

    // 우승자 ID로 월드컵 결과 조회
    List<WorldCupResult> findByWinnerIdOrderByCreatedAtDesc(Integer winnerId);
    
    // 토너먼트 타입별 조회
    List<WorldCupResult> findByTournamentTypeOrderByCreatedAtDesc(String tournamentType);

    // 제목으로 검색
    List<WorldCupResult> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);

    // 토너먼트 ID 존재 여부 확인
    boolean existsByTournamentId(String tournamentId);

    // 타입별 월드컵 결과 조회 (conditions에서 타입 추출) - 오타 수정: LIDE → LIKE, CreatedAtdDesc → CreatedAtDesc
    @Query("SELECT wr FROM WorldCupResult wr " +
           "WHERE wr.conditions LIKE %:type% " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupResult> findByTypeOrderByCreatedAtDesc(@Param("type") String type);

    // 세대별 월드컵 결과 조회 (conditions에서 세대 추출)
    @Query("SELECT wr FROM WorldCupResult wr " +
           "WHERE wr.conditions LIKE %:generation% " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupResult> findByGenerationOrderByCreatedAtDesc(@Param("generation") String generation);
    
    // 세대별 + 타입별 월드컵 결과 조회
    @Query("SELECT wr FROM WorldCupResult wr " +
           "WHERE wr.conditions LIKE %:generation% " +
           "AND wr.conditions LIKE %:type% " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupResult> findByGenerationAndTypeOrderByCreatedAtDesc(
        @Param("generation") String generation, 
        @Param("type") String type);

    // 타입별 + 기간별 월드컵 결과 조회 (메서드명 수정: findByTypeAndDateOrderByCreatedAtDesc → findByTypeAndPeriodOrderByCreatedAtDesc)
    @Query("SELECT wr FROM WorldCupResult wr " +
           "WHERE wr.conditions LIKE %:type% " +
           "AND wr.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupResult> findByTypeAndPeriodOrderByCreatedAtDesc(
        @Param("type") String type, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
        
    // 세대별 + 기간별 월드컵 결과 조회
    @Query("SELECT wr FROM WorldCupResult wr " +
           "WHERE wr.conditions LIKE %:generation% " +
           "AND wr.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupResult> findByGenerationAndPeriodOrderByCreatedAtDesc(
        @Param("generation") String generation, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
        
    // 세대별 + 타입별 + 기간별 월드컵 결과 조회
    @Query("SELECT wr FROM WorldCupResult wr " +
           "WHERE wr.conditions LIKE %:generation% " +
           "AND wr.conditions LIKE %:type% " +
           "AND wr.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY wr.createdAt DESC")
    List<WorldCupResult> findByGenerationAndTypeAndPeriodOrderByCreatedAtDesc(
        @Param("generation") String generation, 
        @Param("type") String type,
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate);
}
