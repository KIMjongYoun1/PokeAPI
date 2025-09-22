import { useState, useEffect, useCallback, useMemo } from 'react';
import type { WorldCupParticipant, WorldCupRequest, WorldCupResult } from '../types/WorldCup';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PokemonMatchCard from './PokemonMatchCard';
import WorldCupBracket from './WorldCupBracket';

// 토너먼트 진행 상태 타입 정의
type TournamentPhase = 'setup' | 'in-progress' | 'completed';

// 현재 매치 정보 타입 인터페이스 (수정: 인ㄴ터페이스 → 인터페이스)
interface CurrentMatch {
    round: number;           // 현재 라운드 번호
    matchNumber: number;     // 해당 라운드 내 매치 번호
    pokemonA: WorldCupParticipant;  // 매치의 첫 번째 포켓몬
    pokemonB: WorldCupParticipant;  // 매치의 두 번째 포켓몬
    matchId: string;         // 매치 고유 식별자
}

// Props 인터페이스
interface WorldCupTournamentProps {
    // 월드컵 설정 정보
    worldCupRequest: WorldCupRequest;

    // 참가자 목록 (배열 형태)
    participants: WorldCupParticipant[];

    // 콜백 함수들
    onTournamentComplete: (result: WorldCupResult) => void;  // 토너먼트 완료 시 호출
    onBackToSetup: () => void;  // 설정 화면으로 돌아가기

    // 선택적 Props
    initialPhase?: TournamentPhase;  // 초기 토너먼트 단계
    autoStart?: boolean;            // 자동 시작 여부
}

const WorldCupTournament = ({
    worldCupRequest,
    participants,
    onTournamentComplete,
    onBackToSetup,
    initialPhase = 'setup',
    autoStart = false
}: WorldCupTournamentProps) => {
    
    // ======= 상태관리 =====

    // 1. 토너먼트 진행 상태
    const [phase, setPhase] = useState<TournamentPhase>(initialPhase);
    const [currentRound, setCurrentRound] = useState(1);  // 현재 진행 중인 라운드
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);  // 현재 라운드 내 매치 인덱스
    
    // 2. 매치 결과 관리
    const [matchResults, setMatchResults] = useState<Map<string, number>>(new Map());  // 매치별 승자 ID 저장
    const [currentMatch, setCurrentMatch] = useState<CurrentMatch | null>(null);  // 현재 진행 중인 매치

    // 3. 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);  // 로딩 상태
    const [error, setError] = useState<string | null>(null);  // 에러 메시지

    // 4. 애니메이션 상태
    const [isAnimating, setIsAnimating] = useState(false);  // 애니메이션 진행 여부
    const [showWinner, setShowWinner] = useState(false);    // 승자 표시 여부

    // === 계산된 값들(useMemo) ====

    // 전체 라운드 수 계산 (참여자 수에 따라 다름)
    const totalRounds = useMemo(() => {
        // 배열인지 확인
        if (!Array.isArray(participants) || participants.length === 0) {
            return 0;
        }
        // 2의 거듭제곱인지 확인 (토너먼트는 2^n명이어야 함)
        const count = participants.length;
        return Math.log2(count);  // 예: 16명 → 4라운드, 8명 → 3라운드
    }, [participants]);

    // 현재 라운드의 매치들 생성
    const currentRoundMatches = useMemo(() => {
        if (phase === 'setup') return [];

        // participants 배열 확인 (수정: 확ㄷ인 → 확인)
        if (!Array.isArray(participants) || participants.length === 0) return [];

        // 첫 번째 라운드: 참가자들을 2명씩 매치
        if (currentRound === 1) {
            const matches: CurrentMatch[] = [];
            for (let i = 0; i < participants.length; i += 2) {
                if (participants[i + 1]) {  // 홀수 참가자 처리
                    matches.push({
                        round: 1,
                        matchNumber: Math.floor(i / 2) + 1,  // 매치 번호 계산
                        pokemonA: participants[i],
                        pokemonB: participants[i + 1],
                        matchId: `round-1-match-${Math.floor(i / 2) + 1}`  // 매치 ID 생성
                    });
                }
            }
            return matches;
        }

        // 이후 라운드: 이전 라운드 승자들로 매치 생성
        const previousWinners = getPreviousRoundWinners();
        const matches: CurrentMatch[] = [];

        for (let i = 0; i < previousWinners.length; i += 2) {
            if (previousWinners[i + 1]) {
                matches.push({
                    round: currentRound,
                    matchNumber: Math.floor(i / 2) + 1,
                    pokemonA: previousWinners[i],
                    pokemonB: previousWinners[i + 1],
                    matchId: `round-${currentRound}-match-${Math.floor(i / 2) + 1}`
                });
            }
        }
        return matches;
    }, [participants, currentRound, phase, matchResults]);

    // ==== 유틸리티 함수들 ====
    
    // 이전 라운드 승자들 가져오기
    const getPreviousRoundWinners = useCallback((): WorldCupParticipant[] => {
        const previousRound = currentRound - 1;
        const winners: WorldCupParticipant[] = [];

        // 이전 라운드의 모든 매치 결과에서 승자 찾기
        for (const [matchId, winnerId] of matchResults) {
            if (matchId.startsWith(`round-${previousRound}-`)) {
                const winner = participants.find(p => p.id === winnerId);
                if (winner) winners.push(winner);
            }
        }
        return winners.sort((a, b) => a.id - b.id);  // ID 순으로 정렬하여 일관성 유지
    }, [currentRound, matchResults, participants]);

    // 현재 매치 가져오기
    const getCurrentMatch = useCallback((): CurrentMatch | null => {
        if (currentRoundMatches.length === 0) return null;
        return currentRoundMatches[currentMatchIndex] || null;
    }, [currentRoundMatches, currentMatchIndex]);

    // 토너먼트 완료 여부 확인 (현재 미사용이지만 향후 확장 가능)
    // const isTournamentComplete = useMemo(() => {
    //     return currentRound > totalRounds || 
    //            (currentRound === totalRounds && currentMatchIndex >= currentRoundMatches.length);
    // }, [currentRound, totalRounds, currentMatchIndex, currentRoundMatches.length]);

    // ==== 이벤트 핸들러들 ====
    
    // 토너먼트 시작
    const handleStartTournament = useCallback(() => {
        setPhase('in-progress');      // 진행 단계로 변경
        setCurrentRound(1);           // 첫 번째 라운드로 설정
        setCurrentMatchIndex(0);      // 첫 번째 매치로 설정
        setMatchResults(new Map());   // 매치 결과 초기화
        setError(null);               // 에러 상태 초기화
    }, []);

    // 매치 승자 선택 (수정: 함수명 통일)
    const handleMatchSelect = useCallback((winnerId: number) => {
        if (!currentMatch || isAnimating) return;  // 매치가 없거나 애니메이션 중이면 무시
        
        setIsAnimating(true);         // 애니메이션 시작
        setShowWinner(true);          // 승자 표시 (수정: isShowWinner → setShowWinner)

        // 매치 결과 저장
        setMatchResults(prev => {
            const newResults = new Map(prev);
            newResults.set(currentMatch.matchId, winnerId);  // 승자 ID 저장
            return newResults;
        });

        // 2초 후 다음 매치로 이동
        setTimeout(() => {
            setShowWinner(false);     // 승자 표시 해제
            setIsAnimating(false);    // 애니메이션 종료
            moveToNextMatch();        // 다음 매치로 이동
        }, 2000);
    }, [currentMatch, isAnimating]);

    // 다음 매치로 이동
    const moveToNextMatch = useCallback(() => {
        if (currentMatchIndex + 1 < currentRoundMatches.length) {
            // 같은 라운드의 다음 매치
            setCurrentMatchIndex(prev => prev + 1);
        } else {
            // 다음 라운드로 이동
            if (currentRound < totalRounds) {
                setCurrentRound(prev => prev + 1);
                setCurrentMatchIndex(0);  // 수정: setCurrentMatchIndex(-) → setCurrentMatchIndex(0)
            } else {
                // 토너먼트 완료
                handleTournamentComplete();
            }
        }
    }, [currentMatchIndex, currentRoundMatches.length, currentRound, totalRounds]);

    // 토너먼트 완료 처리
    const handleTournamentComplete = useCallback(() => {
        try {
            setIsLoading(true);
            setPhase('completed');

            // 최종 우승자 찾기
            const finalWinner = getPreviousRoundWinners()[0];

            if (!finalWinner) {
                throw new Error('최종 우승자를 찾을 수 없습니다.');
            }

            // 최종 순위 생성 (수정: getFinalRanking → generateFinalRanking)
            const finalRanking = generateFinalRanking();

            // 월드컵 결과 생성
            const result: WorldCupResult = {
                tournamentId: generateTournamentId(),
                title: worldCupRequest.title,
                tournamentType: worldCupRequest.tournamentType || 'vote',  // 필수 필드 추가
                
                winnerId: finalWinner.id,
                winnerName: finalWinner.name,
                winnerKoreanName: finalWinner.koreanName,
                winnerSpriteUrl: finalWinner.spriteUrl,
                participants: participants,
                finalRanking: finalRanking,
                conditions: {
                    participantCount: participants.length,  // 수정: participants → participantCount
                    generation: worldCupRequest.generation,
                    type: worldCupRequest.type,
                },
                createdAt: new Date().toISOString(),
                completedAt: new Date().toISOString(),
            };

            // 부모 컴포넌트에 결과 전달
            onTournamentComplete(result);

        } catch (err) {
            console.error('토너먼트 완료 처리 중 오류 발생:', err);
            setError(err instanceof Error ? err.message : '토너먼트 완료 처리 중 오류가 발생했습니다.');
            
        } finally {
            setIsLoading(false);
        }
    }, [getPreviousRoundWinners, participants, worldCupRequest, onTournamentComplete]);


    // 최종 순위 생성
    const generateFinalRanking = useCallback(() => {
        const ranking: { id: number; rank: number }[] = [];

        // 우승자 1위
        const winner = getPreviousRoundWinners()[0];
        if (winner) {
            ranking.push({ id: winner.id, rank: 1 });
        }

        // 나머지 참가자들 순위 부여 (수정: participants → participant)
        participants.forEach((participant, index) => {
            if (participant.id !== winner?.id) {
                ranking.push({ id: participant.id, rank: index + 2 });
            }
        });

        return ranking;  // 수정: return generateFinalRanking → return ranking (재귀 호출 오류 수정)
    }, [getPreviousRoundWinners, participants]);

    // 토너먼트 ID 생성
    const generateTournamentId = useCallback(() => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        return `tournament_${timestamp}_${random}`;  // 수정: }} → } (불필요한 중괄호 제거)
    }, []);

    // ==== useEffect ====

    // 컴포넌트 마운트 시 자동 시작
    useEffect(() => {
        if (autoStart && phase === 'setup') {
            handleStartTournament();
        }
    }, [autoStart, phase, handleStartTournament]);

    // 현재 매치 업데이트
    useEffect(() => {
        const match = getCurrentMatch();
        setCurrentMatch(match);
    }, [getCurrentMatch]);

    // === 렌더링 ===
    // 로딩 상태
    if (isLoading) {
        return <LoadingSpinner message="토너먼트 결과를 처리중입니다..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={() => setError(null)} />;
    }

    // 설정 단계
    if (phase === 'setup') {
        const participantCount = Array.isArray(participants) ? participants.length : 0;

        return (
            <div className="tournament-setup">
                <div className="setup-header">
                    <h2>{worldCupRequest.title}</h2>
                    <p>토너먼트를 시작할 준비가 되었습니다!</p>
                </div>

                <div className="setup-info">
                    <div className="info-card">
                        <h3>참가자 정보</h3>
                        <p>{participantCount}명의 참가자가 월드컵에 참가했습니다.</p>
                        <p>총 {totalRounds}라운드에 걸쳐 경기가 진행됩니다.</p>
                    </div>

                    <div className="info-card">
                        <h3>토너먼트 조건</h3>
                        <p>세대: {worldCupRequest.generation || '전체'}</p>
                        <p>타입: {worldCupRequest.type || '전체'}</p>
                    </div>
                </div>

                <div className="setup-actions">
                    <button onClick={handleStartTournament}
                    className="btn-start-tournament">
                        토너먼트 시작
                    </button>
                    <button onClick={onBackToSetup}
                    className="btn-back-to-setup">
                        설정으로 돌아가기
                    </button>
                </div>
            </div>
        );
    }

    // 토너먼트 완료 단계 (수정: 공백 오류)
    if (phase === 'completed') {  // 수정: ' completed' → 'completed'
        return (
            <div className="tournament-completed">
                <div className="completed-header">
                    <h2>토너먼트 완료!</h2>
                    <p>모든 대결이 끝났습니다.</p>  {/* 수정: 끝낫습니다 → 끝났습니다 */}
                </div>

                <div className="completed-actions">
                    <button onClick={() => onTournamentComplete({} as WorldCupResult)}
                    className="btn-view-results">
                        결과 확인하기!
                    </button>
                </div>
            </div>
        );
    }

    //토너먼트 진행중
    return (
        <div className="tournament-in-progress">
            {/** 진행 상황 표시 */}
            <div className="tournament-progress">
                <div className="progress-header">
                    <h2>{worldCupRequest.title}</h2>
                    <div className="progress-info">
                        <span className="current-round">라운드 {currentRound}/{totalRounds}</span>
                        <span className="current-match">매치 {currentMatchIndex + 1}/{currentRoundMatches.length}</span>
                    </div>
                </div>

                {/** 진행률 바 */}
                <div className="progress-bar">
                    <div className="progress-fill"
                    style={{
                        width: `${((currentRound - 1) * 100 + (currentMatchIndex / currentRoundMatches.length) * 100) / totalRounds}%`
                    }}></div>
                </div>
            </div>

            {/* 현재 매치 */}
            {currentMatch && (
                <div className="current-match-container">
                    <PokemonMatchCard
                    pokemonA={currentMatch.pokemonA}
                    pokemonB={currentMatch.pokemonB}
                    onSelect={handleMatchSelect}
                    isSelecting={!isAnimating}
                    round={currentMatch.round}
                    matchNumber={currentMatch.matchNumber}
                    isCompleted={showWinner}
                    winnerId={showWinner ? matchResults.get(currentMatch.matchId) : undefined}
                    />
                </div>
            )}

            {/* 브라킷 보기 (선택사항) */}
            <div className="bracket-container">
                <h3>토너먼트 브라킷!</h3>
                <WorldCupBracket
                participants={participants}
                currentRound={currentRound}
                currentMatch={currentMatch ? {
                    id: currentMatch.matchId,
                    round: currentMatch.round,
                    matchNumber: currentMatch.matchNumber,
                    pokemonA: currentMatch.pokemonA,
                    pokemonB: currentMatch.pokemonB,
                    status: showWinner ? 'completed' : 'in-progress',
                } : undefined}
                isInteractive={false}  // 브라킷은 읽기 전용
                />
            </div>

            {/* 토너먼트 중단 버튼 */}
            <div className="tournament-actions">
                <button onClick={onBackToSetup}
                className="btn-stop-tournament"
                    disabled={isAnimating} >  {/* 애니메이션 중에는 비활성화 */}
                        토너먼트 중단
                    </button>
            </div>
        </div>
    );
};

export default WorldCupTournament;