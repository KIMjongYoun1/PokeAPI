interface SearchFormProps {
    searchName: string;
    onSearchNameChange: (name : string) => void;
    onSearch: (e: React.FormEvent) => void;
}

const SearchForm = ({ searchName, onSearchNameChange, onSearch }: SearchFormProps) => {
    return (
        <form onSubmit={onSearch} className="search-form">
            <input
                type="text"
                value={searchName}
                onChange={(e) => onSearchNameChange(e. target.value)}
                placeholder="포켓몬 이름을 입력하세요 (예: pikachu, 피카츄)"
                className="search-input"
                />
                <button type="submit" className="search-button">
                    검색
                </button>
        </form>
    );
};

export default SearchForm;