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
    // isCurrentMatch?: boolean; // 향후 사용 가능: 매치별 현재 상태 표시용
}

// 브라켓 전체 데이터 타입
interface BracketData {
    rounds: BracketMatch[][];
    // currentRound: number; // 향후 사용 가능: 브라켓 내부 상태 관리용
    totalRounds: number;
}

// Props인터페이서
interface WorldCupBracketProps {
    participants: WorldCupParticipant[];
    currentRound: number;
    // completedMatches: BracketMatch[], // 향후 사용 가능: 완료된 매치 히스토리 표시용
    currentMatch?: BracketMatch,
    onMatchSelect?: (match: BracketMatch) => void;
    isInteractive?: boolean;
}

const WorldCupBracket = ({
    participants,
    currentRound,
    // completedMatches,
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
        for (let round = 2; round <= totalRounds; round++) {
            const roundMatches = createEmptyRound(round, getMatchesInRound(round));
            rounds.push(roundMatches);
        }
        return { rounds, totalRounds };
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
        const totalParticipants = participants.length;
        const divisor = Math.pow(2, round);
        return Math.ceil(totalParticipants / divisor);
    };

    // 여기 라운드수가 고정인가?
    const getRoundName = (round: number): string => {
        const matchCount = getMatchesInRound(round);
        if (matchCount === 1) return '결승';
        if (matchCount === 2) return '준결승';
        if (matchCount === 4) return '8강';
        if (matchCount === 8) return '16강';
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
                                    isCurrentMatch={match.id === currentMatch?.id}
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
        <div className={`bracket-match-card ${match.status} ${isCurrentMatch ? 'current-match' : ''}`}
        onClick={isInteractive ? onClick : undefined} 
        >
            {/** 포켓몬 A */}
            <div className="pokemon-slot">
                {match.pokemonA ? (
                    <PokemonBracketSlot
                        pokemon={match.pokemonA}
                        isWinner={Boolean(match.winner?.id && match.pokemonA?.id && match.winner.id === match.pokemonA.id)}
                    />
                ) : (
                    <div className="empty-slot">대기중</div>
                )}
            </div>
            {/** Vs 표시 */}
            <div className="vs-indicator">VS</div>

            {/** 포켓몬 B */}
            <div className="pokemon-slot">
            {match.pokemonB ? (
                    <PokemonBracketSlot
                        pokemon={match.pokemonB}
                        isWinner={Boolean(match.winner?.id && match.pokemonB?.id && match.winner.id === match.pokemonB.id)}
                    />
                ) : (
                <div className="empty-slot">대기중</div>
                    )}
            </div>

            {/** 매칭 상태 표시 */}
            <div className="match-status">
                {match.status === 'completed' && '완료'}
                {match.status === 'in-progress' && '진행중'}
                {match.status === 'pending' && '대기중'}
            </div>
        </div>

    );
};

// 브라켓용 포켓몬 슬록 컴포넌트
interface PokemonBracketSlotProps {
    pokemon: WorldCupParticipant;
    isWinner: boolean;
}
    const PokemonBracketSlot = ({ pokemon, isWinner = false}: PokemonBracketSlotProps) => {
        return (
            <div className={`pokemon-bracket-slot ${isWinner ? 'winner' : ''}`}>
                <img
                    src={pokemon.spriteUrl}
                    alt={pokemon.koreanName}
                    className={isWinner ? 'winner-sprite' : ''} />
                    <span className="pokemon-name">{pokemon.koreanName}</span>
                    {isWinner && <span className="winner-badge">🏆</span>}
            </div>
        );
    };

    export default WorldCupBracket;
