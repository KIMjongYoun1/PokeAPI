import type { PokemonDTO } from "../types/Pokemon";

interface PokemonCardProps {
    pokemon: PokemonDTO;
}

function PokemonCard({ pokemon }: PokemonCardProps) {
    return (
        <div className="pokemon-card">
            <div className="pokemon-header">
                <h2>{pokemon.name.toLocaleUpperCase()}</h2>
                <div className="pokemon-id">#{pokemon.pokemonId}</div>
            </div>

            {/* 포켓몬 이미지  */}
            <div className="pokemon-images">
                <div className="pokemon-image-container">
                    <img src={pokemon.spriteUrl} alt={`${pokemon.name} sprite`} />
                    <p>일반 스프라이트</p>
                </div>
                <div className="image-container">
                    <img src={pokemon.shinySpriteUrl} alt={`${pokemon.name} shiny sprite`} />
                    <p>샤인 스프라이트</p>
                </div>
                {pokemon.officialArtworkUrl && (
                    <div className="image-container">
                        <img src={pokemon.officialArtworkUrl} alt={`${pokemon.name} official artwork`} />
                        <p>공식 아트워크</p>
                    </div>
                )}
            </div>
            {/*기본 정보*/}
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
                {/**능력치 */}
                <div className="info-section">
                    <h3>능력치</h3>
                    <div className="stats">
                        {pokemon.stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <span className="stat-name">{stat.name.toLocaleUpperCase()}</span>
                                <div className="stat-bar">
                                    <div
                                        className="stat-bar-fill"
                                        style={{width: `${stat.baseStat / 255 * 100}%`}}
                                    ></div>
                                </div>
                                <span className="stat-value">{stat.baseStat}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default PokemonCard;