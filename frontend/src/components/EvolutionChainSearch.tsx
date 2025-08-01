import React from 'react';

interface EvolutionChainSearchProps {
    keyword: string;
    onKeywordChange: (value: string) => void;
    onSearch:(keyword: string) => void;
    loading: boolean;
    placeholder?: string;
}

const EvolutionChainSearch = ({
    keyword,
    onKeywordChange,
    onSearch,
    loading,
    placeholder = "포켓몬 이름을 입력하세요"
}: EvolutionChainSearchProps) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if(e.key === 'Enter' && !loading) 
            onSearch(keyword);
        }
    };

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onKeywordChange(e.target.value);
};

const handleSearch = () : void => {
    onSearch(keyword);
};

return (
    <div className='search-sectiion'>
        <div className='search-form'>
            <input
                type='text'
                value={keyword}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
            />
            <button
                onClick={handleSearch}
                className="search-buttion"
                disabled={loading} >
                    {loading ? '검색중...' : 검색}
                </button>
        </div>
    </div>
)