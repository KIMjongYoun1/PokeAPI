import { useState } from 'react';
import StatComparisonChart from '../components/StatComparisonChart';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PokemonCard from '../components/PokemonCard'; // 추가
import type { PokemonDTO } from '../types/Pokemon';

const ComparisonPage = () => {
  const [pokemons, setPokemons] = useState<PokemonDTO[]>([]);
  const [searchName, setSearchName] = useState('');
  const [error, setError] = useState('');

  const [searchResults, setSearchResults] = useState<PokemonDTO[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const MAX_COMPARISON_COUNT = 6;

  const searchPokemon = async (keyword: string) => {
    if (!keyword.trim()) {
        setSearchResults([]);
        return;
    }

    setSearchLoading(true);
    setSearchError('');

    try {
        const response = await fetch(`http://localhost:8080/api/pokemon/search/korean?keyword=${encodeURIComponent(keyword)}`);
        if (response.ok) {
            const data = await response.json();
            setSearchResults(data);
        } else {
            setSearchError('검색에 실패했습니다');
            setSearchResults([]);
        }
    } catch (err) {
        setSearchError('서버 연결에 실패했습니다.');
        setSearchResults([]);
        
    } finally {
        setSearchLoading(false);
    }
  };

  const addPokemon = (pokemon: PokemonDTO) => {
    if (pokemons.length >= MAX_COMPARISON_COUNT) {
        setError(`최대 ${MAX_COMPARISON_COUNT}개의 포켓몬만 비교할 수 있습니다.`);
        return;
    }
    
    if (pokemons.find(p => p.name === pokemon.name)) {
      setError('이미 추가된 포켓몬입니다.');
      return;
    }

    setPokemons(prev => [...prev, pokemon]);
    setError('');
  };

  const removePokemon = (name: string) => {
    setPokemons(prev => prev.filter(p => p.name !== name));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      searchPokemon(searchName);
    }
  };

  return (
    <div className="comparison-page">
      <h1>포켓몬 능력치 비교</h1>
      
      <div className="search-section">
        <h3>포켓몬 검색</h3>
        <SearchForm
          searchName={searchName}
          onSearchNameChange={setSearchName}
          onSearch={handleSearch}
        />
        
        {searchLoading && <LoadingSpinner message="검색 중..." />}
        {searchError && <ErrorMessage message={searchError} onRetry={() => setSearchError('')} />}
            
            {/**검색결과 */}
            {searchResults.length > 0 && (
                <div className="search-results">
                    <h4>검색 결과 ({searchResults.length}개)</h4>
                    <div className="search-results-grid">
                        {searchResults.map((pokemon) => (
                            <div key={pokemon.name} className="search-result-item">
                                <PokemonCard pokemon={pokemon} />
                                <button 
                                onClick={() => addPokemon(pokemon)}
                                disabled={pokemons.length >= MAX_COMPARISON_COUNT}
                                className="add-button"> 추가</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      

      {pokemons.length > 0 && (
        <div className="comparison-section">
          
            <h3>비교 대상 ({pokemons.length}/{MAX_COMPARISON_COUNT})</h3>
            <div className="comparison-pokemons">
            {pokemons.map((pokemon) => (
              <div key={pokemon.name} className="comparison-pokemon">
                <PokemonCard pokemon={pokemon} />
                <button onClick={() => removePokemon(pokemon.name)}
                    className="remove-button">제거</button>
              </div>
            ))}
          </div>
          
          <StatComparisonChart 
            pokemons={pokemons}
            maxStat={255}
            showValues={true}
            showPercentage={false}
            height={400}
            width="100%"
          />
        </div>
      )}

      {/**에러메세지 */}
      {error && <ErrorMessage message={error} onRetry={() => setError('')} />}
    </div>
  );
};

export default ComparisonPage;
