
import type { PokemonDTO } from "../types/Pokemon";

interface PokemonGridProps {
    searchResults: PokemonDTO[];
    onPokemonSelect: (pokemon: PokemonDTO) => void;
}

function PokemonGrid({ searchResults, onPokemonSelect }: PokemonGridProps) {
    if (searchResults.length === 0) {
        return null;
    }

    return (
        <div className="search-results">
            <h2>검색 결과 ({searchResults.length}개)</h2>
            <div className="pokemon-grid">
                {searchResults.map((pokemon, index) => {
                    const safeKey = pokemon.id || pokemon.pokemonId || pokemon.name || `pokemon-${index}`;
                    
                    const displayName = pokemon.koreanName || pokemon.name || '이름 없음';
                    
                    return (
                        <div key={safeKey} className="pokemon-grid-item" onClick={() => onPokemonSelect(pokemon)}>
                            <img 
                                src={pokemon.spriteUrl || 'https://via.placeholder.com/80x80?text=?'} 
                                alt={displayName}
                                onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/80x80?text=?';
                                }}
                            />
                            <h3>{displayName.toUpperCase()}</h3>
                            <p>#{pokemon.pokemonId}</p>
                            <div className="types">
                                {pokemon.types && pokemon.types.map((type, typeIndex) => (
                                    <span key={`${safeKey}-type-${typeIndex}`} className="type-badge small">
                                        {type}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PokemonGrid;