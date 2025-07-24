import { useState, useEffect} from 'react';

interface PokemonSpriteProps {
    pokemonName: string;
    spriteUrl?: string; // 직접 스프라이트 URL을 받을 수 있도록
}

const PokemonSprite = ({pokemonName, spriteUrl: directSpriteUrl}: PokemonSpriteProps) => {
        const [spriteUrl, setSpriteUrl] = useState<string>('');
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);

       
        useEffect(()=> {
            const loadSprite = async () => {
                setIsLoading(true);
                setHasError(false);
                
                // 직접 스프라이트 URL이 제공된 경우
                if (directSpriteUrl) {
                    setSpriteUrl(directSpriteUrl);
                    setIsLoading(false);
                    return;
                }
                
                try {
                    const response = await fetch(`http://localhost:8080/api/pokemon/${pokemonName}`);
                    if (response.ok) {
                        const pokemonData = await response.json();
                        setSpriteUrl(pokemonData.spriteUrl);
                    } else {
                        // 백엔드에서 찾지 못한 경우 PokeAPI 직접 호출
                        console.log(`백엔드에서 ${pokemonName}을 찾지 못함, PokeAPI 직접 호출`);
                        const pokeApiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                        if (pokeApiResponse.ok) {
                            const pokeApiData = await pokeApiResponse.json();
                            setSpriteUrl(pokeApiData.sprites.front_default);
                        } else {
                            setHasError(true);
                        }
                    }
                } catch (error) {
                    console.error('스프라이트 로딩 실패', error);
                    setHasError(true);
                } finally {
                    setIsLoading(false);
                }
            };
            loadSprite();
        }, [pokemonName, directSpriteUrl]);
        return (
            <div className="pokemon-sprite">
                {isLoading ? (
                    <div className="loading">로딩...</div>
                ) : hasError ? (
                    <div className="error">이미지 없음</div>
                ) : spriteUrl ? (
                    <img 
                        src={spriteUrl}
                        alt={pokemonName}
                        loading="lazy"
                    />
                ) : (
                    <div className="error">이미지 없음</div>
                )}
            </div>
        );
};

export default PokemonSprite;