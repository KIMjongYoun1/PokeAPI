// React import 제거 (사용하지 않음)

// Pokimon basic info
interface PokemonInfo {
    id: number;
    koreanName: string;
    name: string;
    spriteUrl: string;
    types?: string[];
}

//통계정보 영어로못쓰겠음
interface StatInfo {
    label: string;
    value: string | number;
    unit?: string;
    color?: string;
}

//props 인터페이스
interface PokemonStatCardProps {
    pokemon: PokemonInfo;
    rank: number;
    stats: StatInfo[];
    variant?: 'winner' | 'popular' | 'default';
    onClick?: () => void;
    className?: string;
}

const PokemonStatCard = ({
    pokemon,
    rank,
    stats,
    variant = 'default',
    onClick,
    className = ''
}: PokemonStatCardProps) => {

    const getRankBadgeColor = (rank: number) => {
        switch (rank) {
            case 1: return 'gold';
            case 2: return 'silver';
            case 3: return 'bronze';
            default: return 'default';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '��';
            default: return `#${rank}`;
        }
    };

    return (
        <div className={`pokemon-stat-card ${variant} ${className} ${onClick ? 'clickable' : ''}`}
            onClick={onClick} >
            {/**랭크 뱃지 */}
            <div className={`rank-badge ${getRankBadgeColor(rank)}`}>
                {getRankIcon(rank)}
            </div>

            {/**포켓몬 이미지 */}
            <div className="pokemon-image">
                <img src={pokemon.spriteUrl}
                    alt={pokemon.koreanName}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/default-pokemon.png';
                    }}
                />
            </div>

            {/** 포켓몬 정보 */}
            <div className="pokemon-info">
                <h5 className="pokemon-name">{pokemon.koreanName}</h5>
                <p className="pokemon-english">{pokemon.name}</p>

                {/**타입 표시 */}
                {pokemon.types && pokemon.types.length > 0 && (
                    <div className="pokemon-types">
                        {pokemon.types.map((type, index) => (
                            <span key={index} className={`type-badge type-${type}`}>
                                {type}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/**통계 정보 */}
            <div className="stat-numbers">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <span className="stat-label">{stat.label}</span>
                        <span className="stat-value"
                            style={{ color: stat.color }}>
                            {stat.value}{stat.unit}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default PokemonStatCard;

