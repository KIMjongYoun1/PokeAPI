import { useState, useEffect } from 'react';
import StatComparisonChart from '../components/StatComparisonChart';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { PokemonDTO } from '../types/Pokemon';

const ComparisonPage = () => {
  const [pokemons, setPokemons] = useState<PokemonDTO[]>([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPokemon = async (name: string) => {
    if (pokemons.find(p => p.name === name)) {
      setError('이미 추가된 포켓몬입니다.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // 백엔드에서 한글/영문 이름 모두 처리 가능
      const response = await fetch(`http://localhost:8080/api/pokemon/${name}`);
      if (response.ok) {
        const data = await response.json();
        setPokemons(prev => [...prev, data]);
        setSearchName('');
      } else {
        setError('포켓몬을 찾을 수 없습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const removePokemon = (name: string) => {
    setPokemons(prev => prev.filter(p => p.name !== name));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchName.trim()) {
      addPokemon(searchName.trim());
    }
  };

  return (
    <div className="comparison-page">
      <h1>포켓몬 능력치 비교</h1>
      
      <div className="comparison-controls">
        <SearchForm
          searchName={searchName}
          onSearchNameChange={setSearchName}
          onSearch={handleSearch}
        />
        
        {loading && <LoadingSpinner message="포켓몬 추가 중..." />}
        {error && <ErrorMessage message={error} onRetry={() => setError('')} />}
      </div>

      {pokemons.length > 0 && (
        <div className="comparison-section">
          <div className="pokemon-list">
            <h3>비교 대상 ({pokemons.length}개)</h3>
            {pokemons.map((pokemon) => (
              <div key={pokemon.name} className="pokemon-item">
                <span>{pokemon.name}</span>
                <button onClick={() => removePokemon(pokemon.name)}>제거</button>
              </div>
            ))}
          </div>
          
          <StatComparisonChart 
            pokemons={pokemons}
            maxStat={255}
            showValues={true}
            showPercentage={false}
            height={400}
            width={800}
          />
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
