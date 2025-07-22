import {useState} from 'react';
import type { EvolutionDetail } from '../types/Evolution';
import PokemonSprite from './PokemonSprite';
import EvolutionCondition from './EvolutionCondition';

interface PokemonNodeProps {
    pokemonName: string;
    evolutionDetails: EvolutionDetail[];
    isCurrent?: boolean;
}

const PokemonNode = ({pokemonName, evolutionDetails, isCurrent = false} : PokemonNodeProps) =>{
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`pokemon-node ${isCurrent ? 'current' : ''}`}>
            <div className="pokemon-info" onClick={handleToggle}>
                <div className="sprite-container">
                    <PokemonSprite pokemonName={pokemonName} />
                </div>
                <div className="pokemon-name">
                    <h3>{pokemonName}</h3>
                    {isCurrent && <span className="current-badge">현재 </span>}
                </div>
                {evolutionDetails.length > 0 && (
                    <div className="expand-indicator">
                    {isExpanded ? '▼' : '▶'}
                        </div>
                )}
            </div> 
                {isExpanded && evolutionDetails.length > 0 && (
                    <div className="evolution-conditions">
                        <h4>진화 조건</h4>
                        {evolutionDetails.map((detail, index)=> (
                            <EvolutionCondition key={index} evolutionDetail={detail} />
                        ))}
                
                </div>
            )}
        </div>
    );
};

export default PokemonNode;