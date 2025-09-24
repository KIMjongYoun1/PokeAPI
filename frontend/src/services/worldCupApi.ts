import type { 
    WorldCupRequest, 
    WorldCupParticipant, 
    WorldCupResult,
    WorldCupStatistics 
} from '../types/WorldCup';

// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * 월드컵 백엔드 API 연동 서비스
 * 
 * 전체 시스템 아키텍처:
 * 
 * 1. 데이터베이스 구조:
 *    - worldcup_results: 월드컵 결과 저장 테이블
 *    - worldcup_statistics: 월드컵 통계 데이터 테이블
 *    - pokemon: 포켓몬 기본 정보 테이블
 *    - pokemon_name_mapping: 포켓몬 한글 이름 매핑 테이블
 * 
 * 2. 백엔드 API 엔드포인트:
 *    - POST /api/worldcup/participate: 참가자 조회
 *    - POST /api/worldcup/result: 결과 저장
 *    - GET /api/worldcup/result/{tournamentId}: 특정 결과 조회
 *    - GET /api/worldcup/results: 최근 결과 목록 조회
 *    - GET /api/worldcup/statistics/generation/{generation}: 세대별 통계
 *    - GET /api/worldcup/statistics/type/{type}: 타입별 통계
 *    - GET /api/worldcup/statistics/generation/{generation}/type/{type}: 세대+타입별 통계
 * 
 * 3. 데이터 흐름:
 *    설정 → 참가자 조회 → 토너먼트 진행 → 결과 저장 → 히스토리/통계 조회
 */

// 월드컵 API 서비스
export class WorldCupApiService {
    
    /**
     * 참가자 조회 API
     * 
     * 백엔드 동작 방식:
     * 1. POST /api/worldcup/participate 엔드포인트 호출
     * 2. WorldCupRequestDTO를 JSON으로 전송
     * 3. 백엔드에서 조건에 맞는 포켓몬들을 데이터베이스에서 조회
     * 4. 세대, 타입, 참가자 수 등의 조건에 따라 필터링
     * 5. 랜덤하게 선택된 포켓몬들을 WorldCupParticipantDTO 배열로 반환
     * 
     * @param request 월드컵 설정 정보 (세대, 타입, 참가자 수 등)
     * @returns 선택된 포켓몬 참가자 목록
     */
    static async selectParticipants(request: WorldCupRequest): Promise<WorldCupParticipant[]> {
        try {
            console.log('참가자 조회 API 호출:', request);
            
            const response = await fetch(`${API_BASE_URL}/worldcup/participate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const participants: WorldCupParticipant[] = await response.json();
            console.log('참가자 조회 성공:', participants.length, '명');
            
            return participants;
        } catch (error) {
            console.error('참가자 조회 실패:', error);
            throw new Error(`참가자 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    /**
     * 월드컵 결과 저장 API
     * 
     * 백엔드 동작 방식:
     * 1. POST /api/worldcup/result 엔드포인트 호출
     * 2. WorldCupResultDTO를 JSON으로 전송
     * 3. 백엔드에서 WorldCupResult 엔티티로 변환
     * 4. 데이터베이스의 worldcup_results 테이블에 저장
     * 5. 참가자 정보와 최종 순위도 함께 저장
     * 6. 저장된 결과를 WorldCupResultDTO로 변환하여 반환
     * 
     * @param result 완료된 월드컵 결과 정보
     * @returns 저장된 월드컵 결과 (DB ID 포함)
     */
    static async saveWorldCupResult(result: WorldCupResult): Promise<WorldCupResult> {
        try {
            console.log('월드컵 결과 저장 API 호출:', result);
            
            const response = await fetch(`${API_BASE_URL}/worldcup/result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(result),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const savedResult: WorldCupResult = await response.json();
            console.log('월드컵 결과 저장 성공:', savedResult.tournamentId);
            
            return savedResult;
        } catch (error) {
            console.error('월드컵 결과 저장 실패:', error);
            throw new Error(`월드컵 결과 저장 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    /**
     * 특정 월드컵 결과 조회 API
     * 
     * 백엔드 동작 방식:
     * 1. GET /api/worldcup/result/{tournamentId} 엔드포인트 호출
     * 2. URL 경로에서 tournamentId 추출
     * 3. 데이터베이스에서 해당 토너먼트 ID로 결과 조회
     * 4. WorldCupResult 엔티티를 WorldCupResultDTO로 변환
     * 5. 참가자 정보와 순위 정보도 함께 반환
     * 
     * @param tournamentId 조회할 토너먼트 ID
     * @returns 월드컵 결과 정보
     */
    static async getWorldCupResult(tournamentId: string): Promise<WorldCupResult> {
        try {
            console.log('월드컵 결과 조회 API 호출:', tournamentId);
            
            const response = await fetch(`${API_BASE_URL}/worldcup/result/${tournamentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: WorldCupResult = await response.json();
            console.log('월드컵 결과 조회 성공:', result.tournamentId);
            
            return result;
        } catch (error) {
            console.error('월드컵 결과 조회 실패:', error);
            throw new Error(`월드컵 결과 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    /**
     * 최근 월드컵 결과 목록 조회 API
     * 
     * 백엔드 동작 방식:
     * 1. GET /api/worldcup/results 엔드포인트 호출
     * 2. 데이터베이스에서 최근 월드컵 결과들을 조회
     * 3. 완료일 기준으로 내림차순 정렬
     * 4. WorldCupResult 엔티티들을 WorldCupResultDTO 배열로 변환
     * 5. 각 결과에 포함된 참가자와 우승자 정보도 함께 반환
     * 
     * @returns 최근 월드컵 결과 목록 (최신순)
     */
    static async getRecentWorldCupResults(): Promise<WorldCupResult[]> {
        try {
            console.log('최근 월드컵 결과 목록 조회 API 호출');
            
            const response = await fetch(`${API_BASE_URL}/worldcup/results`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const results: WorldCupResult[] = await response.json();
            console.log('최근 월드컵 결과 목록 조회 성공:', results.length, '개');
            
            return results;
        } catch (error) {
            console.error('최근 월드컵 결과 목록 조회 실패:', error);
            throw new Error(`최근 월드컵 결과 목록 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    /**
     * 세대별 월드컵 통계 조회 API
     * 
     * 백엔드 동작 방식:
     * 1. GET /api/worldcup/statistics/generation/{generation} 엔드포인트 호출
     * 2. URL 경로에서 세대 번호 추출
     * 3. 데이터베이스에서 해당 세대의 월드컵 결과들 조회
     * 4. 우승자별, 참가자별 통계 계산
     * 5. WorldCupStatistics 엔티티를 WorldCupStatisticsDTO로 변환
     * 6. 세대별 인기 포켓몬 순위와 통계 정보 반환
     * 
     * @param generation 조회할 세대 번호 (0 = 전체 세대)
     * @returns 세대별 월드컵 통계 데이터
     */
    static async getWorldCupStatisticsByGeneration(generation: number): Promise<WorldCupStatistics[]> {
        try {
            console.log('세대별 월드컵 통계 조회 API 호출:', generation);
            
            const response = await fetch(`${API_BASE_URL}/worldcup/statistics/generation/${generation}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const statistics: WorldCupStatistics[] = await response.json();
            console.log('세대별 월드컵 통계 조회 성공:', statistics.length, '개');
            
            return statistics;
        } catch (error) {
            console.error('세대별 월드컵 통계 조회 실패:', error);
            throw new Error(`세대별 월드컵 통계 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    /**
     * 타입별 월드컵 통계 조회 API
     * 
     * 백엔드 동작 방식:
     * 1. GET /api/worldcup/statistics/type/{type} 엔드포인트 호출
     * 2. URL 경로에서 포켓몬 타입 추출
     * 3. 데이터베이스에서 해당 타입의 월드컵 결과들 조회
     * 4. 타입별 우승자와 참가자 통계 계산
     * 5. WorldCupStatistics 엔티티를 WorldCupStatisticsDTO로 변환
     * 6. 타입별 인기 포켓몬 순위와 통계 정보 반환
     * 
     * @param type 조회할 포켓몬 타입 (예: fire, water, electric 등)
     * @returns 타입별 월드컵 통계 데이터
     */
    static async getWorldCupStatisticsByType(type: string): Promise<WorldCupStatistics[]> {
        try {
            console.log('타입별 월드컵 통계 조회 API 호출:', type);
            
            const response = await fetch(`${API_BASE_URL}/worldcup/statistics/type/${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const statistics: WorldCupStatistics[] = await response.json();
            console.log('타입별 월드컵 통계 조회 성공:', statistics.length, '개');
            
            return statistics;
        } catch (error) {
            console.error('타입별 월드컵 통계 조회 실패:', error);
            throw new Error(`타입별 월드컵 통계 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }

    /**
     * 세대별 + 타입별 월드컵 통계 조회 API
     * 
     * 백엔드 동작 방식:
     * 1. GET /api/worldcup/statistics/generation/{generation}/type/{type} 엔드포인트 호출
     * 2. URL 경로에서 세대 번호와 타입 추출
     * 3. 데이터베이스에서 해당 세대와 타입 조건을 만족하는 월드컵 결과들 조회
     * 4. 세대+타입별 우승자와 참가자 통계 계산
     * 5. WorldCupStatistics 엔티티를 WorldCupStatisticsDTO로 변환
     * 6. 세대+타입별 인기 포켓몬 순위와 통계 정보 반환
     * 
     * @param generation 조회할 세대 번호
     * @param type 조회할 포켓몬 타입
     * @returns 세대별+타입별 월드컵 통계 데이터
     */
    static async getWorldCupStatisticsByGenerationAndType(generation: number, type: string): Promise<WorldCupStatistics[]> {
        try {
            console.log('세대별+타입별 월드컵 통계 조회 API 호출:', generation, type);
            
            const response = await fetch(`${API_BASE_URL}/worldcup/statistics/generation/${generation}/type/${type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const statistics: WorldCupStatistics[] = await response.json();
            console.log('세대별+타입별 월드컵 통계 조회 성공:', statistics.length, '개');
            
            return statistics;
        } catch (error) {
            console.error('세대별+타입별 월드컵 통계 조회 실패:', error);
            throw new Error(`세대별+타입별 월드컵 통계 조회 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
        }
    }
}

// 편의를 위한 개별 함수들 export
export const {
    selectParticipants,
    saveWorldCupResult,
    getWorldCupResult,
    getRecentWorldCupResults,
    getWorldCupStatisticsByGeneration,
    getWorldCupStatisticsByType,
    getWorldCupStatisticsByGenerationAndType
} = WorldCupApiService;