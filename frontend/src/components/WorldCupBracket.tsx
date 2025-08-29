import React, { useState, useEffect } from 'react';
import type { WorldCupParticipant } from '../types/WorldCup';

// 브라켓 매치 데이터 타입
interface BracketMatch {
    id: string;
    round: number;
    matchNumber: number;
    pokemonA?: WorldCupParticipant;
    pokemonB?: WorldCupParticipant;
    winner?: WorldCupParticipant;
    status: 'pending' | 'in-progress' | 'completed';
    isCurrentMatch?: boolean;
}

// 브라켓 전체 데이터 타입
interface BracketData {
    rounds: BracketMatch[][];
    currentRound: number;
    totalRounds: number;
}

// Props인터페이서
interface WorldCupBracketProps {
    participants: WorldCupParticipant[];
    currentRound: number;
    completedMatches: BracketMatch[],
    currentMatch: BracketMatch,
    onMatchSelect?: (match: BracketMatch) => void;
    isInteractive?: boolean;
}

const WorldCupBracket = ({
    participants,
    currentRound,
    completedMatches,
    currentMatch,
    onMatchSelect,
    isInteractive = true
}: WorldCupBracketProps) => {
    const [bracketData, setBracketData] = useState<BracketData | null>(null);

    // 브라켓 데이터 생성
    useEffect(() => {
        const data = generateBracket(participants);
        setBracketData(data);
    }, [participants]);

    //브라켓 생성 함수
    const generateBracket = (participants: WorldCupParticipant[]): BracketData => {
        const rounds: BracketMatch[][] = [];
        const totalRounds = Math.ceil(Math.log2(participants.length));

        //1 라운드 생성
        const firstRound = createFirstRound(participants);
        rounds.push(firstRound);

        // 2라운드부터 결승까지 빈 매치 생성
        for (let round = 2; round < totalRounds; round++) {
            const roundMatches = createEmptyRound(round, getMatchesInRound(round));
            rounds.push(roundMatches);
        }
        return { rounds, currentRound: 1, totalRounds };
    };

    //1 라운드 매치 생성
    const createFirstRound = (participants: WorldCupParticipant[]): BracketMatch[] => {
        const matches: BracketMatch[] = [];

        for (let i = 0; i < participants.length; i += 2) {
            const match: BracketMatch = {
                id: `round1-match${Math.floor(i / 2) + 1}`,
                round: 1,
                matchNumber: Math.floor(i / 2) + 1,
                pokemonA: participants[i],
                pokemonB: participants[i + 1],
                status: 'pending',
            };
            matches.push(match);
        }
        return matches;
    };

    const createEmptyRound = (round: number, matchCount: number): BracketMatch[] => {
        const matches: BracketMatch[] = [];

        for (let i = 1; i <= matchCount; i++) {
            const match: BracketMatch = {
                id: `round${round}-match${i}`,
                round,
                matchNumber: i,
                status: 'pending'
            };
            matches.push(match);
        }
        return matches;
    };

    const getMatchesInRound = (round: number): number => {
        return Math.ceil(participants.length / Math.pow(2, round));
    };

    // 여기 라운드수가 고정인가?
    const getRoundName = (round: number): string => {
        const matchCount = getMatchesInRound(round);
        if (matchCount === 1) return '결승';
        if (matchCount === 2) return '준결승';
        if (matchCount === 4) return '8강';
        if (matchCount === 8) return '16';
        return `${round}라운드`;
    };

    if (!bracketData) {
        return <div className="loading">브라켓 로딩중...</div>
    }

    return (
        <div className="worldcup-bracket">
            {/** 브라켓 헤더 */}
            <div className="bracket-header">
                <h2>토너먼트 브라켓</h2>
                <div className="bracket-info">
                    <span>현재 라운드 : {currentRound}</span>
                    <span>총 라운드 : {bracketData.totalRounds}</span>
                </div>
            </div>

            {/**브라켓 컨테이너 */}
            <div className="bracket-container">
                {bracketData.rounds.map((roundMatches, roundIndex) => (
                    <div key={roundIndex} className="bracket-round">
                        <h3>{getRoundName(roundIndex + 1)}</h3>
                        <div className="round-matches">
                            {roundMatches.map((match) => (
                                <BracketMatchCard
                                    key={match.id}
                                    match={match}
                                    isCurrentMatch={match.id === currentMatch.id}
                                    onClick={() => onMatchSelect?.(match)}
                                    isInteractive={isInteractive} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 브라켓 매치카드 컴포넌트
interface BracketMatchCardProps {
    match: BracketMatch;
    isCurrentMatch: boolean;
    onClick: () => void;
    isInteractive: boolean;
}

const BracketMatchCard = ({
    match,
    isCurrentMatch,
    onClick,
    isInteractive
}: BracketMatchCardProps) => {
    return (
        
    )
}
