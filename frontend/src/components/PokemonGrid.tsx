
import type { PokemonDTO } from "../types/Pokemon";

interface PokemonGridProps {
    searchResults: PokemonDTO[];
    onPokemonSelect: (pokemon: PokemonDTO) => void;
}

function PokemonGrid({ searchResults, onPokemonSelect }: PokemonGridProps) {
    // 디버깅: 포켓몬 데이터 확인
    console.log('PokemonGrid received:', searchResults);
    
    if (searchResults.length === 0) {
        return null;
    }

    return (
        <div className="search-results">
            <h2>검색 결과 ({searchResults.length}개)</h2>
            <div className="pokemon-grid">
                {searchResults.map((pokemon, index) => {
                    // 안전한 key 생성
                    const safeKey = pokemon.id || pokemon.pokemonId || pokemon.name || `pokemon-${index}`;
                    console.log(`Pokemon key for ${pokemon.koreanName}:`, safeKey);
                    
                     // 안전한 이름 표시
                    const displayName = pokemon.koreanName || pokemon.name || '이름 없음';
                    return (
                        <div key={safeKey} className="pokemon-grid-item" onClick={() => onPokemonSelect(pokemon)}>
                        <img src={pokemon.spriteUrl || '/placeholder.png'}
                         alt={displayName} 
                         onError={(e) => {
                            e.currentTarget.src = '/placeholder.png';
                         }}/> 
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