import type { PokemonDTO } from '../types/Pokemon';
import type { EvolutionDTO } from '../types/Evolution';
import EvolutionChainTree from './EvolutionChainTree';

interface EvolutionChainDetailProps {
    pokemon: PokemonDTO;
    evolutionChain: EvolutionDTO;
    onBack: () => void;
}

const EvolutionChainDetail = ({
    pokemon,
    evolutionChain,
    onBack
}: EvolutionChainDetailProps) => {
    const handleBackClick = (): void => {
        onBack();
    };

    return (
        <div className="evolution-chain-section">
            <div className="selected-pokemon-header">
                <button className="back-button" onClick={handleBackClick}>
                     검색 결과로 돌아가기
                </button>
                <h2>{pokemon.koreanName || pokemon.name} 의 진화체인</h2>
            </div>
            <EvolutionChainTree chain={evolutionChain.chain}
            currentPokemonName={pokemon.name} />
        </div>
    );
};

export default EvolutionChainDetail;