import { useState, useEffect } from 'react';
import type { EvolutionChainsProps } from '../types/Evolution';
import EvolutionChainTree from './EvolutionChainTree';

const EvolutionChain = ({ evolutionData, isLoading, error }: EvolutionChainsProps) => {
    const [currentPokemonName, setCurrentPokemonName] = useState<string>('');

    // URL에서 포켓몬 이름 가져오기 (선택사항)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const pokemonName = urlParams.get('pokemon');
        if (pokemonName) {
            setCurrentPokemonName(pokemonName);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="evolution-chain-container">
                <div className="loading-container">
                    <div className="loading-spinner">로딩 중...</div>
                    <p>진화 체인을 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="evolution-chain-container">
                <div className="error-container">
                    <div className="error-icon">⚠️</div>
                    <h3>오류가 발생했습니다</h3>
                    <p>{error}</p>
                    <button 
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (!evolutionData) {
        return (
            <div className="evolution-chain-container">
                <div className="no-data-container">
                    <div className="no-data-icon">🔍</div>
                    <h3>진화 체인 데이터가 없습니다</h3>
                    <p>포켓몬을 선택해주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="evolution-chain-container">
            <div className="evolution-header">
                <h2>진화 체인</h2>
                {currentPokemonName && (
                    <div className="current-pokemon-info">
                        <span>현재 포켓몬: {currentPokemonName}</span>
                    </div>
                )}
            </div>
            
            <div className="evolution-content">
                <EvolutionChainTree 
                    chain={evolutionData.chain}
                    currentPokemonName={currentPokemonName}
                />
            </div>
            
            <div className="evolution-footer">
                <p className="evolution-tip">
                    💡 포켓몬을 클릭하면 진화 조건을 확인할 수 있습니다.
                </p>
            </div>
        </div>
    );
};

export default EvolutionChain;