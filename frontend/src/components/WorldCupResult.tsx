import React, { useState, useEffect, useMemo } from 'react';
import type { WorldCupResult as WorldCupResultType, WorldCupParticipant } from '../types/WorldCup';
import WinnerCard from './WinnerCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface WorldCupResultProps {
    result: WorldCupResultType;
    onRestart: () => void;
    onViewHistory: () => void;
    onShare?: (result: WorldCupResultType) => void;
}

interface ResultDisplayData {
    winner: {
        id: number;
        name: string;
        koreanName: string;
        spriteUrl: string;
        types: string[];
    };
    participants: Array<{
        id: number;
        name: string;
        koreanName: string;
        spriteUrl: string;
        rank: number;
    }>;
    tournamentInfo: {
        title: string;
        participantCount: number;
        generation: string;
        type: string;
        completedAt: string;
    };
}

const WorldCupResult = ({ result, onRestart, onViewHistory, onShare }: WorldCupResultProps) => {
    // == 상태관리 ==

    //1. 결과 데이터 파싱 상태
    const [parsedResult, setParsedResult] = useState<ResultDisplayData | null>(null);

    //2. 로딩 상태
    const [isLoading, setIsLoading] = useState(false);

    //3. 에러 상태
    const [error, setError] = useState<string | null>(null);

    //4. 공유 상태
    const [shareUrl, setShareUrl] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);

    //5. 애니메이션 상태
    const [showWinner, setShowWinner] = useState(false);
    const [showRankings, setShowRankings] = useState(false);
    const [showActions, setShowActions] = useState(false);

    // ==== useEffect ====

    //1. 컴포넌트 마운트시 결과 데이터 파싱
    useEffect(() => {
        if (result) {
            try {
                setIsLoading(true);
                setError(null);

                const parsed = parseResultData(result);
                setParsedResult(parsed);

                //애니메이션 순차 실행
                setTimeout(() => setShowWinner(true), 500);
                setTimeout(() => setShowRankings(true), 1000);
                setTimeout(() => setShowActions(true), 1500);
            } catch (err) {
                setError('결과 데이터를 파싱할 수 없습니다.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [result]);

    //2. 공유 URL 생성
    useEffect(() => {
        if (result?.tournamentId) {
            const shareUrl = `${window.location.origin}/worldcup/result/${result.tournamentId}`;
            setShareUrl(shareUrl);
        }
    }, [result]);

    //3. 복사완료 상태 초기화
    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => setIsCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    // 타입 가드 함수 정의
    const isValidParticipant = (obj: any): obj is WorldCupParticipant => {
        return obj &&
            typeof obj.id === 'number' &&
            typeof obj.name === 'string' &&
            typeof obj.koreanName === 'string' &&
            typeof obj.spriteUrl === 'string' &&
            Array.isArray(obj.types);
    };

    const isValidRankingItem = (obj: any): obj is { id: number } => {
        return obj && typeof obj.id === 'number';
    };

    // 수정된 코드
    const parseResultData = (result: WorldCupResultType): ResultDisplayData => {
        try {
            // JSON 문자열을 객체로 파싱
            const conditions = typeof result.conditions === 'string'
                ? JSON.parse(result.conditions)
                : result.conditions || {};

            const participants = typeof result.participants === 'string'
                ? JSON.parse(result.participants)
                : result.participants || [];

            const finalRanking = typeof result.finalRanking === 'string'
                ? JSON.parse(result.finalRanking)
                : result.finalRanking || [];

            // 타입 검증
            if (!Array.isArray(participants)) {
                throw new Error('참가자 데이터가 올바르지 않습니다.');
            }

            if (!Array.isArray(finalRanking)) {
                throw new Error('순위 데이터가 올바르지 않습니다.');
            }

            // 우승자 정보 찾기
            const winnerParticipant = participants.find(p => p.id === result.winnerId);

            return {
                winner: {
                    id: result.winnerId,
                    name: result.winnerName || winnerParticipant?.name || '',
                    koreanName: result.winnerKoreanName || winnerParticipant?.koreanName || '',
                    spriteUrl: result.winnerSpriteUrl || winnerParticipant?.spriteUrl || '',
                    types: winnerParticipant?.types || []
                },
                participants: participants
                    .filter(isValidParticipant)  // 타입 검증
                    .map((p: WorldCupParticipant) => ({
                        id: p.id,
                        name: p.name,
                        koreanName: p.koreanName,
                        spriteUrl: p.spriteUrl,
                        rank: finalRanking
                            .filter(isValidRankingItem)  // 타입 검증
                            .findIndex((r: { id: number }) => r.id === p.id) + 1
                    })),
                tournamentInfo: {
                    title: result.title,
                    participantCount: conditions.participantCount || participants.length,
                    generation: conditions.generation || 'all',
                    type: conditions.type || 'all',
                    completedAt: result.completedAt
                }
            };
        } catch (err) {
            throw new Error('결과 데이터 파싱 실패');
        }
    };

    // ===== 메모제이션된 계산값 들 ====-=

    // 참가자들을 순위별로 정렬 (useMememo로 불필요한 재계산 방지)
    const sortedParticipants = useMemo(() => {
        if (!parsedResult?.participants) return [];

        return [...parsedResult.participants].sort((a, b) => {
            if (a.id === parsedResult.winner.id) return -1;
            if (b.id === parsedResult.winner.id) return 1;

            return (a.rank || 0) - (b.rank || 0);
        });
    }, [parsedResult]);

    // === 이벤트 핸들러들 ====

    // 공유 기능 (Web Share API 또는 클립보드 복사)
    const handleShare = async () => {
        if (navigator.share && onShare) {
            
            // 모바일에서 네이티브 공유 기능 사용
            try {
                await navigator.share({
                    title: `${result.title} 결과`,
                    text: `${parsedResult?.winner.koreanName || parsedResult?.winner.name}이(가) 우승했습니다!`,
                    url: shareUrl
                });
            } catch (err) {
                handleCopyToClipboard();
            }
        } else {
            handleCopyToClipboard();
        }
    };

    // 클립보드 복사 기능
    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
        } catch (err) {
            // Clipboard API 사용실패시 fallback 방법 사용
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy'); //구형브라우저 지원
            document.body.removeChild(textArea);
            setIsCopied(true);
            
        }
    };

    // ==== 로딩 및 에러 상태 처리 ===

    // 로딩 중일 때 스피너 표시
    if (isLoading) {
        return <LoadingSpinner message="결과를 불러오는 중..." />;
    }

    // 에러 발생시 에러메세지 표시
    if (error) {
        return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
    }

    // 파싱 결과가 없을때 에러메세지 표시
    if (!parsedResult) {
        return <ErrorMessage message="결과 데이터가 없습니다" onRetry={onRestart} />;
    }

    // ===== 메인 UI 랜더링 =====

    return (
        <div className="worldcup-result">
            {/**헤더 섹션 */}
            <div className="result-header">
                <h1>🏆 월드컵 결과</h1>
                <p className="tournament-title">{parsedResult.tournamentInfo.title}</p>
                <div className="tournament-info">
                    <span>참가자 : {parsedResult.tournamentInfo.participantCount} 명</span>
                    <span>세대 : {parsedResult.tournamentInfo.generation === 'all' ? '전체' : `${parsedResult.tournamentInfo.generation}세대`}</span>
                    {parsedResult.tournamentInfo.type !== 'all' && (
                        <span>타입: {parsedResult.tournamentInfo.type}</span>
                    )}
                </div>
            </div>

            {/**우승자 섹션 (애니메이션으로 순차 표시) */}
            {showWinner && (
                <div className="winner-section">
                    <h2>👑 우승자</h2>
                    <div className="winner-card-container">
                        <WinnerCard
                            winner={parsedResult.winner}
                        />
                    </div>
                </div>
            )}

            {/** 순위 섹션 (애니메이션으로 순차 표시) */}
            {showRankings && (
                <div className="rankings-section">
                    <h2>🏆 순위</h2>
                    <div className="rankings-list">
                        {sortedParticipants.map((participant, index) => (
                            <div key={participant.id} className={`ranking-item rank-${index + 1}`}>
                                <span className="rank-number">{index +1}</span>
                                <img
                                    src={participant.spriteUrl}
                                    alt={participant.koreanName}
                                    className="rank-pokemon-image" />
                                    <span className="pokemon-name">{participant.koreanName}</span>
                                    {index === 0 && <span className="crown">👑</span>}
                                    {index === 1 && <span className="silver-medal">🥈</span>}
                                    {index === 2 && <span className="bronze-medal">🥉</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/** 엑션 버튼들 (애니메이션으로 순차 표시) */}
            {showActions && (
                <div className="action-buttons">
                    <button onClick={onRestart} className="btn-restart">다시 시작하기</button>
                    <button onClick={onViewHistory} className="btn-history">히스토리</button>
                    {onShare && (
                        <button onClick={handleShare} className="btn-share">
                            {isCopied ? '복사완료' : '공유하기'}
                        </button>
                    )}
                </div>
            )}
        </div>

        
    );

};

export default WorldCupResult;