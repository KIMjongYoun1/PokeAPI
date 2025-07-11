
import type { SearchMode } from "../types/Pokemon";

interface SearchModeSelectorProps {
    searchMode: SearchMode;
    onModeChange: (mode: SearchMode) => void;
}

const SearchModeSelector = ({ searchMode, onModeChange }: SearchModeSelectorProps) => {
    return (
        <div className="search-mode-selector">
            <button
                className={`mode-button ${searchMode === 'single' ? 'active' : ''}`}
                onClick={() => onModeChange('single')}
                >
                    단일 검색
                </button>
            <button
                className={`mode-button ${searchMode === 'advanced' ? 'active' : ''}`}
                onClick={() => onModeChange('advanced')}
                >
                    고급 검색
                </button>
        </div>
    );
};

export default SearchModeSelector;
