import React, { useState, useEffect } from 'react';
import type { WorldCupResult as WorldCupResultType, WorldCupParticipant } from '../types/WorldCup';
import PokemonCard from './PokemonCard';
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
        generation: number;
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

}