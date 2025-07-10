import type { AdvancedSearchParams } from "../types/Pokemon";

interface AdvancedSearchFormProps {
    filters: AdvancedSearchParams;
    onFiltersChange: (filters: AdvancedSearchParams) => void;
    onSearch: (e: React.FormEvent) => void;
}

const AdvancedSearchForm = ({ filters, onFiltersChange, onSearch} : AdvancedSearchFormProps) => {
    return (
        <div className="advanced-search-form">
            <div className="filter-section">
                <h3>포켓몬 타입</h3>
                <input
                    type="text"
                    value={filters.type}
                    onChange={(e) => onFiltersChange({...filters, type: e.target.value})}
                    placeholder="타입을 입력하세요 (예: Electric, Fire, Water, 전기, 불)"
                    className="filter-input"
                />
            </div>

            <div className="filter-section">
                <h3>키(cm)</h3>
                <div className="range-input:>">
                    <input
                        type="number"
                        value={filters.minHeight}
                        onChange={(e) => onFiltersChange({...filters, minHeight: e.target.value})}
                        placeholder="최소 키"
                        className="range-input"
                    />
                    <span>~</span>
                    <input
                        type="number"
                        value={filters.maxHeight}
                        onChange={(e) => onFiltersChange({...filters, maxHeight: e.target.value})}
                        placeholder="최대 키"
                        className="range-input"
                    />
                </div>
            </div>
        </div>
    )
}