import { useState, useEffect, useCallback } from 'react';
import type { WorldCupRequest, WorldCupParticipant, WorldCupResult as WorldCupResultType } from '../types/WorldCup'; // 수정: 타입 별칭 추가
import WorldCupSetup from '../components/WorldCupSetup';
import WorldCupTournament from '../components/WorldCupTournament';
import WorldCupResult from '../components/WorldCupResult'; // 수정: WorldCupResult 컴포넌트 import 추가
import WorldCupHistory from '../components/WorldCupHistory';
import WorldCupStatistics from '../components/WorldCupStatistics';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { WorldCupApiService } from '../services/worldCupApi'; // 수정: API 서비스 import 추가

/**
 * 월드컵 페이지 - 백엔드 API 연동 메인 컴포넌트
 * 
 * 백엔드 API 연동 흐름:
 * 
 * 1. 설정 단계 (Setup):
 *    - 사용자가 월드컵 조건 입력 (세대, 타입, 참가자 수 등)
 *    - handleTournamentStart() → WorldCupApiService.selectParticipants()
 *    - POST /api/worldcup/participate로 조건 전송
 *    - 백엔드에서 조건에 맞는 포켓몬들 조회 및 랜덤 선택
 * 
 * 2. 토너먼트 단계 (Tournament):
 *    - 선택된 참가자들로 토너먼트 진행
 *    - 사용자가 각 라운드에서 우승자 선택
 *    - 최종 우승자 결정
 * 
 * 3. 결과 저장 (Result):
 *    - handleTournamentComplete() → WorldCupApiService.saveWorldCupResult()
 *    - POST /api/worldcup/result로 결과 전송
 *    - 데이터베이스에 월드컵 결과 저장
 * 
 * 4. 히스토리 조회 (History):
 *    - WorldCupApiService.getRecentWorldCupResults()
 *    - GET /api/worldcup/results로 최근 결과 목록 조회
 *    - 저장된 월드컵 결과들을 히스토리로 표시
 * 
 * 5. 통계 조회 (Statistics):
 *    - 필터에 따라 다른 API 호출
 *    - 세대별/타입별 월드컵 통계 데이터 조회
 *    - 차트와 카드로 통계 시각화
 */

// 월드컵 페이지 뷰 타입 정의
type WorldCupView = 'setup' | 'tournament' | 'result' | 'history' | 'statistics';

// 월드컵 페이지 props (필요시 확장 가능)
interface WorldCupPageProps {

    // 초기 뷰 설정 (선택 사항)
    initialView?: WorldCupView;

    // 외부에서 토너먼트 결과를 받아올 경우 (선택사항)
    externalResult?: WorldCupResultType; // 수정: WorldCupResult → WorldCupResultType

    // 페이지 전환 콜백 (선택 사항)
    onViewChange?: (view: WorldCupView) => void;
}

const WorldCupPage = ({
    initialView = 'setup',
    externalResult,
    onViewChange
}: WorldCupPageProps) => {

    // === 상태관리 ===

    //1. 현재 뷰 상태
    const [currentView, setCurrentView] = useState<WorldCupView>(initialView);

    //2. 월드컵 설정 및 데이터
    const [worldCupRequest, setWorldCupRequest] = useState<WorldCupRequest | null>(null);
    const [participants, setParticipants] = useState<WorldCupParticipant[]>([]); // 수정: participant → participants (변수명 통일)
    const [tournamentResult, setTournamentResult] = useState<WorldCupResultType | null>(null); // 수정: WorldCupResult → WorldCupResultType

    // 3. 로딩및 에러처리
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 4. 네비게이션 상태
    const [viewHistory, setViewHistory] = useState<WorldCupView[]>(['setup']);

    // === 유틸리티 함수들 ===
    const changeView = useCallback((newView: WorldCupView, addToHistory: boolean = true) => {
        console.log(`뷰 변경 : ${currentView} -> ${newView}`);

        setCurrentView(newView);

        //   VIew 히스토리에 추가 (뒤로가기 기능)
        if (addToHistory) {
            setViewHistory(prev => [...prev, newView]);
        }

        // 외부 콜백 호출
        onViewChange?.(newView);

        //에러 상태 초기화
        setError(null);
    }, [currentView, onViewChange]);

    // 뒤로가기 함수
    const goBack = useCallback(() => {
        if (viewHistory.length > 1) {
            const previousView = viewHistory[viewHistory.length - 2];
            setViewHistory(prev => prev.slice(0, -1));
            changeView(previousView, false);
        }
    }, [viewHistory, changeView]);

    // ==== 이벤트 핸들러들 ====

    /**
     * 토너먼트 시작 핸들러
     * 
     * 백엔드 API 동작 방식:
     * 1. 사용자가 월드컵 설정을 완료하면 WorldCupRequest 객체 생성
     * 2. WorldCupApiService.selectParticipants() 호출
     * 3. POST /api/worldcup/participate로 설정 정보 전송
     * 4. 백엔드에서 조건에 맞는 포켓몬들을 데이터베이스에서 조회
     * 5. 세대, 타입, 참가자 수 등에 따라 필터링 및 랜덤 선택
     * 6. 선택된 포켓몬들을 WorldCupParticipant 배열로 반환
     * 7. 참가자 목록을 상태에 저장하고 토너먼트 뷰로 전환
     */
    const handleTournamentStart = useCallback(async (request: WorldCupRequest) => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('토너먼트 시작: ', request);

            setWorldCupRequest(request);
            
            // 백엔드 API에서 참가자 목록 가져오기
            console.log('참가자 목록 조회 시작...');
            const selectedParticipants = await WorldCupApiService.selectParticipants(request);
            console.log('참가자 목록 조회 완료:', selectedParticipants.length, '명');
            
            setParticipants(selectedParticipants);

            changeView('tournament');

        } catch (err) {
            console.error('토너먼트 시작 실패 : ', err);
            setError(err instanceof Error ? err.message : '토너먼트 시작 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [changeView]); // 수정: 백엔드 API 연동으로 참가자 목록 가져오기


    /**
     * 토너먼트 완료 핸들러
     * 
     * 백엔드 API 동작 방식:
     * 1. 사용자가 토너먼트를 완료하면 WorldCupResult 객체 생성
     * 2. WorldCupApiService.saveWorldCupResult() 호출
     * 3. POST /api/worldcup/result로 결과 정보 전송
     * 4. 백엔드에서 WorldCupResult 엔티티로 변환
     * 5. 데이터베이스의 worldcup_results 테이블에 저장
     * 6. 참가자 정보와 최종 순위도 함께 저장
     * 7. 저장된 결과를 WorldCupResultDTO로 변환하여 반환
     * 8. 결과 뷰로 전환하여 우승자와 순위 표시
     */
    const handleTournamentComplete = useCallback(async (result: WorldCupResultType) => { // 수정: WorldCupResult → WorldCupResultType
        try {
            setIsLoading(true);
            setError(null);

            console.log('토너먼트 완료: ', result);

            setTournamentResult(result);

            // 백엔드에 결과 저장
            console.log('월드컵 결과 저장 시작...');
            const savedResult = await WorldCupApiService.saveWorldCupResult(result);
            console.log('월드컵 결과 저장 완료:', savedResult.tournamentId);
            
            // 저장된 결과로 업데이트
            setTournamentResult(savedResult);

            changeView('result');

        } catch (err) {
            console.error('토너먼트 완료 실패: ', err);
            setError(err instanceof Error ? err.message : '토너먼트 완료 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [changeView]); // 수정: 백엔드 API 연동으로 결과 저장


    // 새 토너먼트 시작 핸들러
    const handleNewTournament = useCallback(() => {
        console.log('새 토너먼트 시작');

        setWorldCupRequest(null);
        setParticipants([]);
        setTournamentResult(null);
        setViewHistory(['setup']);

        changeView('setup');
    }, [changeView]);

    // 히스토리 뷰 핸들러

    const handleHistoryView = useCallback(() => {
        console.log('히스토리 뷰 진입');
        changeView('history');
    }, [changeView]);

    // 통계뷰 핸들러 (현재 미사용)
    // const handleViewStatistics = useCallback(() => {
    //     console.log('통계 뷰로 이동');
    //     changeView('statistics');
    // }, [changeView]); // 수정: handleViewHistory → handleViewStatistics (함수명 통일)

    // 설정으로 돌아가기 핸들러
    const handleBackToSetup = useCallback(() => {
        console.log('설정 화면으로 돌아가기');
        changeView('setup');
    }, [changeView]);

    // 메인으로 돌아가기 핸들러 (현재 미사용)
    // const handleBackToMain = useCallback(() => {
    //     console.log('메인 화면으로 돌아가기');
    //     changeView('setup'); // 수정: 'main' → 'setup' (존재하지 않는 뷰 수정)
    // }, [changeView]);

    // ==== useEffect ====

    // 외부 결과가 있을경우 처리
    useEffect(() => {
        if (externalResult) {
            setTournamentResult(externalResult);
            changeView('result');
        }
    }, [externalResult, changeView]);

    // === 랜더링 ===
    if (isLoading) {
        return <LoadingSpinner message="월드컵을 준비하는 중" />;
    }

    if (error) {
        return (
            <div className="worldcup-page-error">
                <ErrorMessage
                    message={error}
                    onRetry={() => setError(null)} />
                <div className="error-actions">
                    <button
                        onClick={goBack}
                        className="btn-back">이전으로</button>
                    <button
                        onClick={handleNewTournament}
                        className="btn-new-tournament">새 토너먼트</button>
                </div>
            </div>
        );
    }

    // 네비게이션 바
    const renderNavigation = () => {
        return (
            <nav className="worldcup-navigation">
                <div className="nav-brand">
                    <h1>포켓몬 이상형 월드컵</h1>
                </div>

                <div className="nav-links">
                    <button
                        onClick={() => changeView('setup')}
                        className={`nav-link ${currentView === 'setup' ? 'active' : ''}`}>설정</button>
                    <button
                        onClick={() => changeView('history')}
                        className={`nav-link ${currentView === 'history' ? 'active' : ''}`}>히스토리</button>
                    <button
                        onClick={() => changeView('statistics')}
                        className={`nav-link ${currentView === 'statistics' ? 'active' : ''}`}>통계</button>
                </div>

                <div className="nav-actions">
                    {viewHistory.length > 1 && (
                        <button
                            onClick={goBack}
                            className="btn-back"> 뒤로가기 </button>
                    )}
                    <button
                        onClick={handleNewTournament}
                        className="btn-new-tournament">새 토너먼트</button>
                </div>
            </nav>
        );
    };

    // 현재 뷰 랜더링
    const renderCurrentView = () => {
        switch (currentView) {
            case 'setup':
                return (
                    <WorldCupSetup
                        onStart={handleTournamentStart}
                        isLoading={isLoading}
                        error={error || undefined} // 수정: null을 undefined로 변환
                    />
                );
            case 'tournament':
                if (!worldCupRequest || !participants.length) { // 수정: !participant → !participants.length (배열 길이 체크)
                    return (
                        <div className="tournament-error">
                            <ErrorMessage message="토너먼트 설정이 완료되지 않았습니다." />
                            <button onClick={handleBackToSetup}>설정으로 돌아가기</button>
                        </div>
                    );
                }
                return (
                    <WorldCupTournament
                        worldCupRequest={worldCupRequest}
                        participants={participants} // 수정: participant → participants (변수명 통일)
                        onTournamentComplete={handleTournamentComplete}
                        onBackToSetup={handleBackToSetup}
                        autoStart={true}
                    />
                );
            case 'result':
                if (!tournamentResult) {
                    return (
                        <div className="result-error">
                            <ErrorMessage message="토너먼트 결과가 없습니다." />
                            <button onClick={handleNewTournament}>설정으로 돌아가기</button>
                        </div>

                    );

                }
                return (
                    <WorldCupResult
                        result={tournamentResult} // 수정: WorldCupResult 컴포넌트 import로 오류 해결
                        onRestart={handleNewTournament} // 수정: onNewTournament → onRestart (올바른 prop명)
                        onViewHistory={handleHistoryView} // 수정: handleViewHistory → handleHistoryView (올바른 함수명)
                    />
                );

            case 'history':
                return (
                    <WorldCupHistory
                        onSelectResult={(result: WorldCupResultType) => { // 수정: WorldCupResult → WorldCupResultType
                            console.log('히스토리에서 결과 선택:', result);
                            setTournamentResult(result);
                            changeView('result');
                        }} // 수정: WorldCupHistory의 올바른 props 사용
                        isCompactMode={false}
                        maxItems={20}
                    />
                );
            case 'statistics':
                return (
                    <WorldCupStatistics
                        isCompactMode={false} // 수정: WorldCupStatistics의 올바른 props 사용
                        maxItems={10}
                    />
                );

            default:
                return (
                    <div className="view-error">
                        <ErrorMessage message="잘못된 뷰입니다." />
                        <button onClick={handleNewTournament}>메인으로 돌아가기</button>
                    </div>
                );
        }

    };

    // 메인 렌더링
    return (
        <div className="worldcup-page">
            {/* 네비게이션 바 */}
            {renderNavigation()}
            
            {/* 메인 컨텐츠 */}
            <main className="worldcup-main">
                <div className="worldcup-container">
                    {renderCurrentView()}
                </div>
            </main>
            
            {/* 푸터 */}
            <footer className="worldcup-footer">
                <p>🏆 포켓몬 이상형 월드컵 - 당신의 최애 포켓몬을 찾아보세요!</p>
            </footer>
        </div>
    );
};

export default WorldCupPage; // 수정: export 문 추가