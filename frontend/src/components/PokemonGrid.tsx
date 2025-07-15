
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
                {searchResults.map((pokemon) => (
                    <div key={pokemon.id} className="pokemon-grid-item" onClick={() => onPokemonSelect(pokemon)}>
                        <img src={pokemon.spriteUrl} alt={pokemon.name} />
                        <h3>{pokemon.name.toUpperCase()}</h3>
                        <p>#{pokemon.pokemonId}</p>
                        <div className="types">
                            {pokemon.types.map((type, index) => (
                                <span key={index} className="type-badge small">
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PokemonGrid;