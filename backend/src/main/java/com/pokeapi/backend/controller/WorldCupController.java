package com.pokeapi.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pokeapi.backend.dto.AutoWorldCupRequestDTO;
import com.pokeapi.backend.dto.WorldCupParticipantDTO;
import com.pokeapi.backend.dto.WorldCupRequestDTO;
import com.pokeapi.backend.dto.WorldCupResultDTO;
import com.pokeapi.backend.dto.WorldCupStatisticsDTO;
import com.pokeapi.backend.service.WorldCupService;

@RestController
@RequestMapping("/api/worldcup")
@CrossOrigin(origins = "*")
public class WorldCupController {
    
    @Autowired
    private WorldCupService worldCupService;

    // 참가자 조회
    @PostMapping("/participate")
    public ResponseEntity<?> selectParticipants(@RequestBody WorldCupRequestDTO request) {
        try {
            // 유효성 검사
            if (request == null) {
                return ResponseEntity.badRequest().body("요청 데이터가 없습니다.");
            }

            List<WorldCupParticipantDTO> participants = worldCupService.selectParticipants(request);
            
            return ResponseEntity.ok(participants);
            
        } catch (Exception e) {
            // 자동 생성 시스템에서 발생할 수 있는 오류들
            String errorMessage = "월드컵 생성 중 오류가 발생했습니다.";
            
            if (e.getMessage().contains("database") || e.getMessage().contains("connection")) {
                errorMessage += " 데이터베이스 연결 문제입니다. 잠시 후 다시 시도해주세요.";
            } else if (e.getMessage().contains("not found") || e.getMessage().contains("empty")) {
                errorMessage += " 조건에 맞는 포켓몬을 찾을 수 없습니다.";
            } else {
                errorMessage += " " + e.getMessage();
            }
            
            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }

    // 결과 저장
    @PostMapping("/result")
    public ResponseEntity<?> saveWorldCupResult(@RequestBody WorldCupResultDTO reqResultDTO) {
        try {
            // 유효성 검사 (자동 시스템에서는 기본적인 null 체크만)
            if (reqResultDTO == null) {
                return ResponseEntity.badRequest().body("요청 데이터가 없습니다.");
            }

            WorldCupResultDTO resultDTO = worldCupService.saveWorldCupResult(reqResultDTO);
            
            return ResponseEntity.ok(resultDTO);
            
        } catch (Exception e) {
            // 자동 저장 시스템에서 발생할 수 있는 오류들
            String errorMessage = "월드컵 결과 저장 중 오류가 발생했습니다.";
            
            if (e.getMessage().contains("database") || e.getMessage().contains("connection")) {
                errorMessage += " 데이터베이스 연결 문제입니다. 잠시 후 다시 시도해주세요.";
            } else if (e.getMessage().contains("duplicate") || e.getMessage().contains("unique")) {
                errorMessage += " 이미 저장된 결과입니다.";
            } else {
                errorMessage += " " + e.getMessage();
            }
            
            return ResponseEntity.internalServerError().body(errorMessage);
        }
    }   

    // 특정 결과 조회
    @GetMapping("/result/{tournamentId}")
    public ResponseEntity<?> getWorldCupResult(@PathVariable String tournamentId) {
        try {
            // 유효성 검사
            if (tournamentId == null || tournamentId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("토너먼트 ID는 필수입니다.");
            }

            WorldCupResultDTO result = worldCupService.getWorldCupResult(tournamentId);

            return ResponseEntity.ok(result);
            
        } catch (Exception e) {
            // 조회 시스템에서는 대부분 서버 내부 오류
            return ResponseEntity.internalServerError().body("월드컵 결과 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 최근 결과 목록 조회
    @GetMapping("/results")
    public ResponseEntity<List<WorldCupResultDTO>> getRecentWorldCupResults(){

        List<WorldCupResultDTO> results = worldCupService.getRecentWorldCupResults();

        return ResponseEntity.ok(results);
    }

    // 통계조회 세대별
    @GetMapping("/statistics/generation/{generation}")
    public ResponseEntity<List<WorldCupStatisticsDTO>> getWorldCupStatisticsGenration(@PathVariable Integer generation) {

        List<WorldCupStatisticsDTO> statistics = worldCupService.getPopularPokemonsGeneration(generation);

        return ResponseEntity.ok(statistics);
    }

    // 통계조회 타입별
    @GetMapping("/statistics/type/{type}")
    public ResponseEntity<List<WorldCupStatisticsDTO>> getWorldCupStatisticsType(@PathVariable String type) {

        List<WorldCupStatisticsDTO> statistics = worldCupService.getPopularPokemonsType(type);

        return ResponseEntity.ok(statistics);
    }

    // 통계조회 세대별 타입별
    @GetMapping("/statistics/generation/{generation}/type/{type}")
    public ResponseEntity<List<WorldCupStatisticsDTO>> getWorldCupStatisticsGenerationAndType(@PathVariable Integer generation, @PathVariable String type) {

        List<WorldCupStatisticsDTO> statistics = worldCupService.getPopularPokemonsTypeAndGeneration(generation, type);

        return ResponseEntity.ok(statistics);
    }

    // 자동월드컵 생성
    @PostMapping("/auto-generate")
    public ResponseEntity<List<WorldCupParticipantDTO>> createAutoWorldCup(@RequestBody AutoWorldCupRequestDTO request) {
        
        List<WorldCupParticipantDTO> participants = worldCupService.createAutoWorldCup(request);

        return ResponseEntity.ok(participants);
    }

}
