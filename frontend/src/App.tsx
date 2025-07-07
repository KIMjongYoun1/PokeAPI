import { useState, useEffect } from 'react'
import './App.css'

interface StatDTO {
  name: string;
  baseStat: number;
  effort: number;
}

interface PokemonDTO {
  id: number;
  pokemonId: number;
  name: string;
  baseExperience: number;
  height: number;
  weight: number;
  spriteUrl: string;
  shinySpriteUrl: string;
  officialArtworkUrl: string;
  types: string[];
  stats: StatDTO[];
  description: string;
  abilities: string[];
}

function App() {
  const [pokemon, setPokemon] = useState<PokemonDTO | null>(null);
  const [searchResults, setSearchResults] = useState<PokemonDTO[]>([]);
  const [searchName, setSearchName] = useState('pikachu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState<'single' | 'advanced'>('single');
  
  // 고급 검색 상태
  const [advancedFilters, setAdvancedFilters] = useState({
    type: '',
    minHeight: '',
    maxHeight: '',
    minWeight: '',
    maxWeight: '',
    minAttack: '',
    maxAttack: '',
    minDefense: '',
    maxDefense: '',
    minHp: '',
    maxHp: '',
    minSpeed: '',
    maxSpeed: ''
  });

  const searchPokemon = async (name: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8080/api/pokemon/${name}`);
      if (response.ok) {
        const data = await response.json();
        setPokemon(data);
        setSearchResults([]);
      } else {
        setError('포켓몬을 찾을 수 없습니다.');
        setPokemon(null);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      setPokemon(null);
    } finally {
      setLoading(false);
    }
  };

  const advancedSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.entries(advancedFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await fetch(`http://localhost:8080/api/pokemon/advanced-search?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setPokemon(null);
      } else {
        setError('검색에 실패했습니다.');
        setSearchResults([]);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchPokemon(searchName);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPokemon(searchName);
  };

  return (
    <div className="pokemon-app">
      <h1>포켓몬 도감</h1>
      
      {/* 검색 모드 선택 */}
      <div className="search-mode-selector">
        <button 
          className={`mode-button ${searchMode === 'single' ? 'active' : ''}`}
          onClick={() => setSearchMode('single')}
        >
          단일 검색
        </button>
        <button 
          className={`mode-button ${searchMode === 'advanced' ? 'active' : ''}`}
          onClick={() => setSearchMode('advanced')}
        >
          고급 검색
        </button>
      </div>

      {/* 단일 검색 폼 */}
      {searchMode === 'single' && (
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="포켓몬 이름을 입력하세요 (예: pikachu)"
            className="search-input"
          />
          <button type="submit" className="search-button">
            검색
          </button>
        </form>
      )}

      {/* 고급 검색 폼 */}
      {searchMode === 'advanced' && (
        <div className="advanced-search-form">
          <div className="filter-section">
            <h3>타입</h3>
            <input
              type="text"
              value={advancedFilters.type}
              onChange={(e) => setAdvancedFilters({...advancedFilters, type: e.target.value})}
              placeholder="타입 (예: Electric, Fire)"
              className="filter-input"
            />
          </div>

          <div className="filter-section">
            <h3>키 (cm)</h3>
            <div className="range-inputs">
              <input
                type="number"
                value={advancedFilters.minHeight}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minHeight: e.target.value})}
                placeholder="최소"
                className="filter-input"
              />
              <span>~</span>
              <input
                type="number"
                value={advancedFilters.maxHeight}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxHeight: e.target.value})}
                placeholder="최대"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>몸무게 (g)</h3>
            <div className="range-inputs">
              <input
                type="number"
                value={advancedFilters.minWeight}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minWeight: e.target.value})}
                placeholder="최소"
                className="filter-input"
              />
              <span>~</span>
              <input
                type="number"
                value={advancedFilters.maxWeight}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxWeight: e.target.value})}
                placeholder="최대"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>공격력</h3>
            <div className="range-inputs">
              <input
                type="number"
                value={advancedFilters.minAttack}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minAttack: e.target.value})}
                placeholder="최소"
                className="filter-input"
              />
              <span>~</span>
              <input
                type="number"
                value={advancedFilters.maxAttack}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxAttack: e.target.value})}
                placeholder="최대"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>방어력</h3>
            <div className="range-inputs">
              <input
                type="number"
                value={advancedFilters.minDefense}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minDefense: e.target.value})}
                placeholder="최소"
                className="filter-input"
              />
              <span>~</span>
              <input
                type="number"
                value={advancedFilters.maxDefense}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxDefense: e.target.value})}
                placeholder="최대"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>HP</h3>
            <div className="range-inputs">
              <input
                type="number"
                value={advancedFilters.minHp}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minHp: e.target.value})}
                placeholder="최소"
                className="filter-input"
              />
              <span>~</span>
              <input
                type="number"
                value={advancedFilters.maxHp}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxHp: e.target.value})}
                placeholder="최대"
                className="filter-input"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>속도</h3>
            <div className="range-inputs">
              <input
                type="number"
                value={advancedFilters.minSpeed}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minSpeed: e.target.value})}
                placeholder="최소"
                className="filter-input"
              />
              <span>~</span>
              <input
                type="number"
                value={advancedFilters.maxSpeed}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxSpeed: e.target.value})}
                placeholder="최대"
                className="filter-input"
              />
            </div>
          </div>

          <button onClick={advancedSearch} className="search-button">
            고급 검색
          </button>
        </div>
      )}

      {/* 로딩 상태 */}
      {loading && <div className="loading">로딩 중...</div>}

      {/* 에러 메시지 */}
      {error && <div className="error">{error}</div>}

      {/* 포켓몬 정보 */}
      {pokemon && (
        <div className="pokemon-card">
          <div className="pokemon-header">
            <h2>{pokemon.name.toUpperCase()}</h2>
            <div className="pokemon-id">#{pokemon.pokemonId}</div>
          </div>

          {/* 이미지 섹션 */}
          <div className="pokemon-images">
            <div className="image-container">
              <img src={pokemon.spriteUrl} alt={`${pokemon.name} sprite`} />
              <p>일반 스프라이트</p>
            </div>
            <div className="image-container">
              <img src={pokemon.shinySpriteUrl} alt={`${pokemon.name} shiny sprite`} />
              <p>샤이니 스프라이트</p>
            </div>
            {pokemon.officialArtworkUrl && (
              <div className="image-container">
                <img src={pokemon.officialArtworkUrl} alt={`${pokemon.name} official artwork`} />
                <p>공식 일러스트</p>
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="pokemon-info">
            <div className="info-section">
              <h3>기본 정보</h3>
              <p><strong>키:</strong> {pokemon.height / 10}m</p>
              <p><strong>몸무게:</strong> {pokemon.weight / 10}kg</p>
              <p><strong>기본 경험치:</strong> {pokemon.baseExperience}</p>
            </div>

            {/* 타입 */}
            <div className="info-section">
              <h3>타입</h3>
              <div className="types">
                {pokemon.types.map((type, index) => (
                  <span key={index} className="type-badge">{type}</span>
                ))}
              </div>
            </div>

            {/* 특성 */}
            <div className="info-section">
              <h3>특성</h3>
              <div className="abilities">
                {pokemon.abilities.map((ability, index) => (
                  <span key={index} className="ability-badge">{ability}</span>
                ))}
              </div>
            </div>

            {/* 능력치 */}
            <div className="info-section">
              <h3>능력치</h3>
              <div className="stats">
                {pokemon.stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <span className="stat-name">{stat.name.toUpperCase()}</span>
                    <div className="stat-bar">
                      <div 
                        className="stat-fill" 
                        style={{ width: `${(stat.baseStat / 255) * 100}%` }}
                      ></div>
                    </div>
                    <span className="stat-value">{stat.baseStat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 검색 결과 목록 */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>검색 결과 ({searchResults.length}개)</h2>
          <div className="pokemon-grid">
            {searchResults.map((pokemon) => (
              <div key={pokemon.id} className="pokemon-grid-item" onClick={() => setPokemon(pokemon)}>
                <img src={pokemon.spriteUrl} alt={pokemon.name} />
                <h3>{pokemon.name.toUpperCase()}</h3>
                <p>#{pokemon.pokemonId}</p>
                <div className="types">
                  {pokemon.types.map((type, index) => (
                    <span key={index} className="type-badge small">{type}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
