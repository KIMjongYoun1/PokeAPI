import  {useCallback} from 'react';
import type {ChainDTO} from '../types/Evolution';
import PokemonNode from './PokemonNode';

interface EvolutionChainTreeProps {
    chain: ChainDTO;
    currentPokemonName?: string;
}

const EvolutionChainTree = ({chain, currentPokemonName} : EvolutionChainTreeProps) => {
    const renderChain = useCallback((chainNode: ChainDTO, level: number = 0):React.JSX.Element =>{
        const pokemonName = chainNode.species.name;
        const isCurrent = pokemonName === currentPokemonName;

        return (
            <div key={`${pokemonName}-${level}`} className={`evolution-level level-${level}`}>
                <PokemonNode
                    pokemonName={pokemonName}
                    evolutionDetails={chainNode.evolution_details}
                    isCurrent={isCurrent} />

                    {chainNode.evolves_to.length > 0 && (
                        <div className="evolution-errows">
                            {chainNode.evolves_to.map((nextChain, index) => (
                                <div key={`${pokemonName}-${index}`} className="evolution-arrow">
                                    <div className="arrow-icon">→</div>
                                    {renderChain(nextChain, level + 1)}
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        );
    },[currentPokemonName]);

    return (
        <div className="evolution-chain-tree">
            {renderChain(chain)}
        </div>
    );
};

export default EvolutionChainTree;