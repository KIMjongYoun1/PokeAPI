import { useState } from 'react';
import type { PokemonDTO } from '../types/Pokemon';
import PokemonCard from './PokemonCard';

interface EvolutionChainResultsProps {
    results: PokemonDTO[];
    onPokemonSelect: (pokemon: PokemonDTO) => void;
    title?: string;
    tip?: string;
}

const EvolutionChainResults = ({
    results,
    onPokemonSelect,
    title = "검색결과",
    tip = "포켓몬을 클릭하면 진화체인을 확인할 수 있습니다."
}: EvolutionChainResultsProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10; // 한 페이지당 10개 (2줄 x 5개)
    
    const handlePokemonClick = (pokemon: PokemonDTO): void => {
        onPokemonSelect(pokemon);
    };
    
    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };
    
    // 페이징 계산
    const totalPages = Math.ceil(results.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = results.slice(startIndex, endIndex);

    return (
        <div className="evolution-search-results">
            <h3>{title} ({results.length}개)</h3>
            <p className="search-tip">{tip}</p>
            <div className="pokemon-grid">
                {currentResults.map((pokemon: PokemonDTO) => (
                    <div key={pokemon.name}
                        className="pokemon-grid-item"
                        onClick={() => handlePokemonClick(pokemon)} >
                        <PokemonCard pokemon={pokemon} />
                    </div>
                ))}
            </div>
            
            {/* 페이징 컨트롤 */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="page-btn"
                    >
                        이전
                    </button>
                    
                    <span className="page-info">
                        {currentPage + 1} / {totalPages}
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="page-btn"
                    >
                        다음
                    </button>
                </div>
            )}

        </div>
    );
}

export default EvolutionChainResults;