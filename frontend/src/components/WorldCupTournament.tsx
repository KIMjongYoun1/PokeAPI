import { useState, useEffect, useCallback, useMemo } from 'react';
import type { WorldCupParticipant, WorldCupRequest, WorldCupResult } from '../types/WorldCup';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PokemonMatchCard from './PokemonMatchCard';
import WorldCupBracket from './WorldCupBracket';

// 토너먼트 진행 상태 타입 정의
type TournamentPhase = 'setup' | 'in-progress' | 'completed';

// 현재 매치 정보 타입 인ㄴ터페이스
interface CurrentMatch {
    round: number;
    matchNumber: number;
    pokemonA: WorldCupParticipant;
    pokemonB: WorldCupParticipant;
    matchId: string;
}

// Props 인터페이스
interface WorldCupTournamentProps {
    //월드컵 설정 정보
    worldCupRequest: WorldCupRequest;

    // 참가자 목록
    participants: WorldCupParticipant[];

    // 콜백 함수들
    onTournamentComplete: (result: WorldCupResult) => void;
    onBackToSetup: () => void;

    // 선택 Props
    initialPhase?: TournamentPhase;
    autoStart?: boolean;
}

const WorldCupTournament = ({
    worldCupRequest,
    participants,
    onTournamentComplete,
    onBackToSetup,
    initialPhase = 'setup',
    autoStart = false
}: WorldCupTournamentProps) => {
    
    //======= 상태관리 =====

    //1. 토너먼트 진행 상태
    const [phase, setPhase] = useState<TournamentPhase>(initialPhase);
    const [currentRound, setCurrentRound] = useState(1);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    
    //2. 매치 결과 관리
    const [matchResults, setMatchResults] = useState<Map<string, number>>(new Map());
    const [currentMatch, setCurrentMatch] = useState<CurrentMatch | null>(null);

    //3. 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //4. 애니메이션 상태
    const [isAnimating, setIsAnimating] = useState(false);
    const [showWinner, setShowWinner] = useState(false);

    //=== 계산된 값들(useMemo) ====

    // 전체 라운드 수 계산(참여자수에따라 다름)
    const totalRounds = useMemo(() => {
        // 배열인지 확인
        if (!Array.isArray(participants) || participants.length === 0){
             return 0; }
        // 2의 거듭제곱인지 확인(토너먼트는 2N명)
        const count = participants.length;
        return Math.log2(count);
    },[participants])

    // Current Round create
    const currentRoundMatches = useMemo(() => {
        if (phase === 'setup') return [];

        // participants 배열 확ㄷ인
        if (!Array.isArray(participants) || participants.length === 0) return [];

        // First Round create
        if (currentRound === 1) {
            const matches: CurrentMatch[] =[];
            for (let i = 0; i <participants.length; i += 2) {
                if (participants[i + 1]) {
                    matches.push({
                        round: 1,
                        matchNumber: Math.floor(i / 2) + 1,
                        pokemonA: participants[i],
                        pokemonB: participants[i + 1],
                        matchId: `round-1-match${Math.floor(i / 2) + 1}`
                    });
                }
            }
            return matches;
        }

        // 이후 라운드: 이전라운드 승자로 매치 생성
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
                })
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
        for (const [matchId, winnerId] of matchResults){
            if (matchId.startsWith(`round-${previousRound}-`)){
                const winner = participants.find(p => p.id === winnerId);
                if (winner) winners.push(winner);
            }
        }
        return winners.sort((a, b) => a.id - b.id);
        
    },  [currentRound, matchResults, participants]);

    const getCurrentMatch = useCallback((): CurrentMatch | null => {
        if(currentRoundMatches.length === 0) return null;
        return currentRoundMatches[currentMatchIndex] || null;
    }, [currentRoundMatches, currentMatchIndex]);

}