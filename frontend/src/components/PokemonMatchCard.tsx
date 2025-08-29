import React, { useState } from 'react';
import type { WorldCupParticipant } from '../types/WorldCup';

interface PokemonMatchCardProps {
    pokemonA: WorldCupParticipant;
    pokemonB: WorldCupParticipant;
    onSelect: (winnerId: number) => void;
    isSelecting?: boolean;
    selectedPokemonId?: number;
    round?: number;
    matchNumber?: number;
    isCompleted?: boolean;
    winnerId?: number;
}

const PokemonMatchCard = ({
    pokemonA,
    pokemonB,
    onSelect,
    isSelecting = true,
    selectedPokemonId,
    round = 1,
    matchNumber = 1,
    isCompleted = false,
    winnerId
}: PokemonMatchCardProps) => {
    const [hoveredPokemon, setHoveredPokemon] = useState<number | null>(null);

    // 포켓몬 선택 핸들러
    const handlePokemonSelect = (pokemonId: number) => {
        if (isSelecting && !isCompleted) {
            onSelect(pokemonId);
        }
    };

    // 포켓몬 카드 렌더링 함수
    const renderPokemonCard = (pokemon: WorldCupParticipant, isLeft: boolean) => {
        const isSelected = selectedPokemonId === pokemon.id;
        const isWinner = winnerId === pokemon.id;
        const isHovered = hoveredPokemon === pokemon.id;
        const isLoser = isCompleted && winnerId && winnerId !== pokemon.id;

        return (
            <div
                className={`pokemon-card ${isLeft ? 'left' : 'right'} ${
                    isSelected ? 'selected' : ''} ${isWinner ? 'winner' : ''} ${
                    isLoser ? 'loser' : ''} ${isHovered ? 'hovered' : ''} ${
                    isSelecting && !isCompleted ? 'clickable' : ''}`}
                onClick={() => handlePokemonSelect(pokemon.id)}
                onMouseEnter={() => setHoveredPokemon(pokemon.id)}
                onMouseLeave={() => setHoveredPokemon(null)}
            >
                {/* 포켓몬 이미지 */}
                <div className="pokemon-image">
                    <img 
                        src={pokemon.spriteUrl}
                        alt={pokemon.koreanName}
                        className={isLoser ? 'grayed-out' : ''} 
                    />
                    {isWinner && (
                        <div className="winner-badge">
                            <span>🏆</span>
                        </div>
                    )}
                </div>

                {/* 포켓몬 정보 */}
                <div className="pokemon-info">
                    <h3 className="pokemon-name">
                        {pokemon.koreanName}
                    </h3>
                    <p className="pokemon-english-name">
                        {pokemon.name}
                    </p>
                    
                    {/* 타입 표시 - 백엔드에서 받은 한글 타입 사용 */}
                    <div className="pokemon-types">
                        {pokemon.types.map((type, index) => (
                            <span 
                                key={index} 
                                className={`type-badge type-${type}`}
                            >
                                {/* 백엔드에서 이미 한글 타입으로 변환해서 제공 */}
                                {getTypeKoreanName(type)}
                            </span>
                        ))}
                    </div>

                    {/* 세대 정보 */}
                    <p className="pokemon-generation">
                        {pokemon.generation}세대
                    </p>

                    {/* 선택 상태 표시 */}
                    {isSelected && !isCompleted && (
                        <div className="selection-indicator">
                            <span>✓ 선택됨</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // 타입 한글명 변환 함수 (백엔드와 동일한 매핑)
    const getTypeKoreanName = (type: string): string => {
        const typeMap: Record<string, string> = {
            normal: '노말',
            fire: '불꽃',
            water: '물',
            electric: '전기',
            grass: '풀',
            ice: '얼음',
            fighting: '격투',
            poison: '독',
            ground: '땅',
            flying: '비행',
            psychic: '에스퍼',
            bug: '벌레',
            rock: '바위',
            ghost: '고스트',
            dragon: '드래곤',
            dark: '악',
            steel: '강철',
            fairy: '페어리'
        };
        return typeMap[type] || type;
    };

    return (
        <div className="pokemon-match-card">
            {/* 라운드 및 매치 정보 */}
            <div className="match-header">
                <div className="match-info">
                    <span className="round-info">{round}라운드</span>
                    <span className="match-number">매치 {matchNumber}</span>
                </div>
                {isCompleted && (
                    <div className="match-status completed">
                        대결 완료
                    </div>
                )}
            </div>

            {/* 대결 카드 컨테이너 */}
            <div className="match-container">
                {/* 왼쪽 포켓몬 */}
                {renderPokemonCard(pokemonA, true)}

                {/* VS 표시 */}
                <div className="vs-section">
                    <div className="vs-text">VS</div>
                    {isSelecting && !isCompleted && (
                        <div className="selection-hint">
                            선택해주세요!
                        </div>
                    )}
                    {isCompleted && winnerId && (
                        <div className="winner-announcement">
                            {winnerId === pokemonA.id ? pokemonA.koreanName : pokemonB.koreanName} 승리!
                        </div>
                    )}
                </div>

                {/* 오른쪽 포켓몬 */}
                {renderPokemonCard(pokemonB, false)}
            </div>

            {/* 대결 진행 상태 */}
            <div className="match-footer">
                {isSelecting && !isCompleted && (
                    <p className="instruction">
                        더 마음에 드는 포켓몬을 클릭해주세요
                    </p>
                )}
                {isCompleted && (
                    <p className="result">
                        다음 라운드로 진행됩니다
                    </p>
                )}
            </div>
        </div>
    );
};

export default PokemonMatchCard;