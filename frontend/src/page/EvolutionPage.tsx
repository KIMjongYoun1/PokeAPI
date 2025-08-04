import { useState, useEffect } from 'react';
import EvolutionChainSearch from '../components/EvolutionChainSearch';
import EvolutionChainResults from '../components/EvolutionChainResults';
import EvolutionChainDetail from '../components/EvolutionChainDetail';
import EvolutionChainGuide from '../components/EvolutionChainGuide';
import type { PokemonDTO } from '../types/Pokemon';
import type { EvolutionDTO } from '../types/Evolution';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EvolutionPage = () => {
    const [keyword, setKeyword] = useState('');
    const [selectedPokemon, setSelectedPokemon] = useState<PokemonDTO | null>(null);
    const [searchResults, setSearchResults] = useState<PokemonDTO[]>([]);
    const [evolutionChain, setEvolutionChain] = useState<EvolutionDTO | null>(null);
    const [currentView, setCurrentView] = useState<'guide' | 'results' | 'detail'>('guide');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    //   const fetchEvolutionChain = async (name: string) => {
    //     setLoading(true);
    //     setError('');

    //     try {
    //       const response = await fetch(`http://localhost:8080/api/pokemon/${name}/evolution-chain`);

    //       if (response.ok) {
    //         const data = await response.json();
    //         setEvolutionData(data);
    //       } else {
    //         setError('진화 체인을 찾을 수 없습니다.');
    //         setEvolutionData(null);
    //       }
    //     } catch (err) {
    //       setError('서버 연결에 실패했습니다.');
    //       setEvolutionData(null);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    const searchEvolutionChain = async (keyword: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/pokemon/evolution-chain/search?keyword=${encodeURIComponent(keyword)}`);

            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
                setCurrentView('results');
            } else {
                setError('검색 결과를 찾을 수 없습니다.');
                setSearchResults([]);
            }
        } catch (err) {
            setError('서버 연결에 실패했습니다.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePokemonSelect = async (pokemon: PokemonDTO) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/pokemon/${pokemon.name}/evolution-chain`);

            if (response.ok) {
                const data = await response.json();
                setSelectedPokemon(pokemon);
                setEvolutionChain(data);
                setCurrentView('detail');
            } else {
                setError('진화 체인을 찾을 수 없습니다.');

            }
        } catch (err) {
            setError('서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToResults = () => {
        setCurrentView('results');
        setSelectedPokemon(null);
        setEvolutionChain(null);
    };

    const handleBackToGuide = () => {
        setCurrentView('guide');
        setSelectedPokemon(null);
        setEvolutionChain(null);
    };

    const handleKeywordChange = (keyword: string) => {
        setKeyword(keyword);
    }

    const handleSearch = (searchKeyword: string) => {
        if (searchKeyword.trim()) {
            searchEvolutionChain(searchKeyword.trim());
        }
    };

    useEffect(() => {
        // 초기 로딩이 필요하다면 여기에 추가
    }, []);



    return (
        <div className="evolution-page">
            <h1>포켓몬 진화 체인</h1>

            <EvolutionChainSearch
                keyword={keyword}
                onKeywordChange={handleKeywordChange}
                onSearch={handleSearch}
                loading={loading}
            />

            {loading && <LoadingSpinner message="진화 체인을 불러오는 중..." />}
            {error && <ErrorMessage message={error} onRetry={() => {}} />}

            {currentView === 'guide' && <EvolutionChainGuide />}
            {currentView === 'results' && (
                <>
                    <button onClick={handleBackToGuide} className="back-to-guide-button">
                        ← 처음으로
                    </button>
                    <EvolutionChainResults 
                        results={searchResults}
                        onPokemonSelect={handlePokemonSelect}
                    />
                </>
            )}
            {currentView === 'detail' && selectedPokemon && evolutionChain && (
                <EvolutionChainDetail
                    pokemon={selectedPokemon}
                    evolutionChain={evolutionChain}
                    onBack={handleBackToResults}
                />
            )}
        </div>
    );
};

export default EvolutionPage;
