import { useState, useEffect } from 'react';
import SearchModeSelector from '../components/SearchModeSelector';
import SearchForm from '../components/SearchForm';
import AdvancedSearchForm from '../components/AdvancedSearchForm';
import PokemonGrid from '../components/PokemonGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { PokemonDTO } from '../types/Pokemon';

interface HomePageProps {
  onPokemonSelect: (pokemon: PokemonDTO) => void;
}

interface PokemonListResponse {
  content: PokemonDTO[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  generation: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const HomePage = ({ onPokemonSelect }: HomePageProps) => {
  const [searchResults, setSearchResults] = useState<PokemonDTO[]>([]);
  const [searchName, setSearchName] = useState('pikachu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchMode, setSearchMode] = useState<'single' | 'advanced'>('single');
  
  // 포켓몬 목록 관련 상태
  const [pokemonList, setPokemonList] = useState<PokemonDTO[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  
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

  // 포켓몬 목록 로드
  const loadPokemonList = async (page: number = 0, generation: number = 0) => {
    setListLoading(true);
    setListError(null);

    try {
      // generation이 0이면 전체 포켓몬 조회 (0으로 그대로 전송)
      const response = await fetch(
        `http://localhost:8080/api/pokemon/list?page=${page}&size=50&generation=${generation}`
      );
      
      if (response.ok) {
        const data: PokemonListResponse = await response.json();
        setPokemonList(data.content);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
        setHasNext(data.hasNext);
        setHasPrevious(data.hasPrevious);
        setCurrentGeneration(data.generation);
      } else {
        setListError('포켓몬 목록을 불러올 수 없습니다.');
      }
    } catch (err) {
      setListError('포켓몬 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setListLoading(false);
    }
  };

  // 컴포넌트 마운트 시 포켓몬 목록 로드
  useEffect(() => {
    loadPokemonList();
  }, []);

  // 세대 변경 시 목록 다시 로드
  const handleGenerationChange = (generation: number) => {
    setCurrentGeneration(generation);
    loadPokemonList(0, generation);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    loadPokemonList(page, currentGeneration);
  };

  const searchPokemon = async (name: string) => {
    setLoading(true);
    setError('');
    try {
        const response = await fetch(`http://localhost:8080/api/pokemon/search/korean?keyword=${encodeURIComponent(name)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        setError('포켓몬을 찾을 수 없습니다.');
        setSearchResults([]);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      setSearchResults([]);
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
    loadPokemonList();  // 포켓몬 목록만 로드, 자동 검색 제거
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchPokemon(searchName);
  };

  return (
    <>
      <h1>포켓몬 도감</h1>
      
      {/* 검색 섹션 */}
      <div className="search-section">
        <SearchModeSelector 
          searchMode={searchMode} 
          onModeChange={setSearchMode} 
        />

        {searchMode === 'single' ? (
          <SearchForm
            searchName={searchName}
            onSearchNameChange={setSearchName}
            onSearch={handleSearch}
          />
        ) : (
          <AdvancedSearchForm
            filters={advancedFilters}
            onFiltersChange={setAdvancedFilters}
            onSearch={advancedSearch}
          />
        )}
      </div>

      {/* 검색 결과 */}
      {loading && <LoadingSpinner message="검색 중..." />}
      {error && <ErrorMessage message={error} onRetry={() => searchMode === 'single' ? searchPokemon(searchName) : advancedSearch()} />}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h2>검색 결과</h2>
          <PokemonGrid 
            searchResults={searchResults} 
            onPokemonSelect={onPokemonSelect} 
          />
        </div>
      )}

      {/* 전체 포켓몬 목록 섹션 */}
      <div className="pokemon-list-section">
        <h2>전체 포켓몬 목록</h2>
        
        {/* 세대별 탭 */}
        <div className="generation-tabs">
          <button
            className={`generation-tab ${currentGeneration === 0 ? 'active' : ''}`}
            onClick={() => handleGenerationChange(0)}
          >
            전체
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((gen) => (
            <button
              key={gen}
              className={`generation-tab ${currentGeneration === gen ? 'active' : ''}`}
              onClick={() => handleGenerationChange(gen)}
            >
              {gen}세대
            </button>
          ))}
        </div>

        {/* 포켓몬 목록 */}
        {listLoading && <LoadingSpinner message="포켓몬 목록을 불러오는 중..." />}
        {listError && <ErrorMessage message={listError} onRetry={() => loadPokemonList(currentPage, currentGeneration)} />}
        
        {pokemonList.length > 0 && (
          <>
            <div className="list-info">
              <span>총 {totalElements}마리 (페이지 {currentPage + 1}/{totalPages})</span>
            </div>
            
            <PokemonGrid 
              searchResults={pokemonList} 
              onPokemonSelect={onPokemonSelect}
            />

            {/* 페이징 컨트롤 */}
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevious}
                className="page-btn"
              >
                이전
              </button>
              
              <span className="page-info">
                {currentPage + 1} / {totalPages}
              </span>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="page-btn"
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
