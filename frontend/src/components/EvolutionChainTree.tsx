import { useCallback, useState, useEffect } from 'react';
import type { ChainDTO, EvolutionDetail } from '../types/Evolution';
import type { PokemonDTO } from '../types/Pokemon';
import PokemonCard from './PokemonCard';
import EvolutionCondition from './EvolutionCondition';

interface EvolutionChainTreeProps {
    chain: ChainDTO;
    currentPokemonName?: string;
}

const EvolutionChainTree = ({ chain, currentPokemonName }: EvolutionChainTreeProps) => {
    const [pokemonData, setPokemonData] = useState<{ [key: string]: PokemonDTO }>({});
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

    // 모든 포켓몬을 평면화하여 배열로 만드는 함수
    const flattenChain = useCallback((chainNode: ChainDTO): Array<{ name: string, details: EvolutionDetail[], level: number }> => {
        const result: Array<{ name: string, details: EvolutionDetail[], level: number }> = [];

        const traverse = (node: ChainDTO, level: number) => {
            result.push({
                name: node.species.name,
                details: node.evolution_details,
                level: level
            });

            node.evolves_to.forEach(nextNode => {
                traverse(nextNode, level + 1);
            });
        };

        traverse(chainNode, 0);
        return result;
    }, []);

    const allPokemons = flattenChain(chain);

    // 포켓몬 데이터 가져오기
    const fetchPokemonData = async (pokemonName: string) => {
        if (pokemonData[pokemonName] || loading[pokemonName]) return;
        
        setLoading(prev => ({ ...prev, [pokemonName]: true }));
        
        try {
            const response = await fetch(`http://localhost:8080/api/pokemon/${pokemonName}`);
            if (response.ok) {
                const data = await response.json();
                setPokemonData(prev => ({ ...prev, [pokemonName]: data }));
            }
        } catch (error) {
            console.error(`포켓몬 데이터 가져오기 실패: ${pokemonName}`, error);
        } finally {
            setLoading(prev => ({ ...prev, [pokemonName]: false }));
        }
    };

    // 포켓몬 데이터 로드
    useEffect(() => {
        allPokemons.forEach(pokemon => {
            fetchPokemonData(pokemon.name);
        });
    }, [allPokemons]);

    // 진화 조건들을 수집 (모든 진화 단계 포함)
    const evolutionConditions = allPokemons
        .map((pokemon, index) => {
            const nextPokemon = allPokemons[index + 1];
            if (nextPokemon) {
                return {
                    fromPokemon: pokemon.name,
                    toPokemon: nextPokemon.name,
                    details: pokemon.details,
                    stage: `${pokemon.level + 1} → ${nextPokemon.level + 1}`
                };
            }
            return null;
        })
        .filter(condition => condition !== null);

    return (
        <div className="evolution-chain-tree">
            {/* 진화 조건 상세 섹션 */}
            {evolutionConditions.length > 0 && (
                <div className="evolution-conditions-section">
                    <h3>진화 조건 상세</h3>
                    <div className="evolution-conditions-grid">
                        {evolutionConditions.map((condition, index) => (
                            <div key={index} className="evolution-condition-item">
                                <div className="evolution-stage">
                                    <span className="stage-label">진화 단계 {condition.stage}</span>
                                </div>
                                <div className="evolution-pokemon-names">
                                    <span className="from-pokemon">
                                        {pokemonData[condition.fromPokemon]?.koreanName || condition.fromPokemon}
                                    </span>
                                    <span className="evolution-arrow">→</span>
                                    <span className="to-pokemon">
                                        {pokemonData[condition.toPokemon]?.koreanName || condition.toPokemon}
                                    </span>
                                </div>
                                <div className="evolution-details">
                                    {condition.details.length > 0 ? (
                                        condition.details.map((detail, detailIndex) => (
                                            <EvolutionCondition key={detailIndex} evolutionDetail={detail} />
                                        ))
                                    ) : (
                                        <div className="no-condition">자연 진화</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 포켓몬 그리드 섹션 */}
            <div className="evolution-pokemon-grid">
                <h3>진화 체인</h3>
                <div className="pokemon-grid">
                    {allPokemons.map((pokemon, index) => {
                        const pokemonInfo = pokemonData[pokemon.name];
                        const isLoading = loading[pokemon.name];
                        
                        return (
                            <div key={`${pokemon.name}-${index}`} className="pokemon-grid-item evolution-pokemon-item">
                                {isLoading ? (
                                    <div className="pokemon-card loading">
                                        <div className="pokemon-header">
                                            <h2>{pokemon.name.toUpperCase()}</h2>
                                        </div>
                                        <div className="pokemon-sprite">
                                            <div className="loading-spinner">로딩 중...</div>
                                        </div>
                                        <div className="pokemon-info">
                                            <p>진화 단계: {pokemon.level + 1}</p>
                                        </div>
                                    </div>
                                ) : pokemonInfo ? (
                                    <div className="pokemon-card">
                                        <PokemonCard pokemon={pokemonInfo} />
                                        <div className="evolution-stage-info">
                                            <p>진화 단계: {pokemon.level + 1}</p>
                                            {pokemon.name === currentPokemonName && (
                                                <div className="current-badge">현재</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="pokemon-card error">
                                        <div className="pokemon-header">
                                            <h2>{pokemon.name.toUpperCase()}</h2>
                                        </div>
                                        <div className="pokemon-sprite">
                                            <img 
                                                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonId(pokemon.name)}.png`}
                                                alt={pokemon.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = 'https://via.placeholder.com/80x80?text=?';
                                                }}
                                            />
                                        </div>
                                        <div className="pokemon-info">
                                            <p>진화 단계: {pokemon.level + 1}</p>
                                            <p className="error-text">데이터 로드 실패</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// 포켓몬 이름으로 ID를 가져오는 함수 (임시)
const getPokemonId = (name: string): number => {
    // 실제로는 백엔드에서 포켓몬 정보를 가져와야 하지만, 
    // 여기서는 간단한 매핑을 사용
    const pokemonIds: { [key: string]: number } = {
        'squirtle': 7,
        'wartortle': 8,
        'blastoise': 9,
        'charmander': 4,
        'charmeleon': 5,
        'charizard': 6,
        'bulbasaur': 1,
        'ivysaur': 2,
        'venusaur': 3,
        'pichu': 172,
        'pikachu': 25,
        'raichu': 26,
        'caterpie': 10,
        'metapod': 11,
        'butterfree': 12,
        'weedle': 13,
        'kakuna': 14,
        'beedrill': 15,
        'pidgey': 16,
        'pidgeotto': 17,
        'pidgeot': 18,
        'rattata': 19,
        'raticate': 20,
        'spearow': 21,
        'fearow': 22,
        'ekans': 23,
        'arbok': 24,
        // 필요한 포켓몬들을 추가
    };
    return pokemonIds[name.toLowerCase()] || 1;
};

export default EvolutionChainTree;