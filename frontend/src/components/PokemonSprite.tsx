import { useState, useEffect} from 'react';

interface PokemonSpriteProps {
    pokemonName: string;
}

const PokemonSprite = ({pokemonName}: PokemonSpriteProps) => {
        const [spriteUrl, setSpriteUrl] = useState<string>('');
        const [isLoading, setIsLoading] = useState(true);
        const [hasError, setHasError] = useState(false);

       
        useEffect(()=> {
            const loadSprite = async () => {
                setIsLoading(true);
                setHasError(false);
                try {
                    const response = await fetch(`/api/pokemon/${pokemonName}`);
                    if (response.ok) {
                        const pokemonData = await response.json();
                        setSpriteUrl(pokemonData.spriteUrl);
                    } else {
                        setHasError(true);
                    }
                } catch (error) {
                    console.error('스프라이트 로딩 실패', error);
                } finally {
                    setIsLoading(false);
                }
            };
            loadSprite();
        }, [pokemonName]);
        return (
            <div className="pokemon-sprite">
                {isLoading ? (
                    <div className="loading">로딩...</div>
                ) : hasError ? (
                    <div className="error">이미지 없음</div>
                ) : (
                    <img 
                        src={spriteUrl}
                        alt={pokemonName}
                        loading="lazy"
                    />
                )}
            </div>
        );
};

export default PokemonSprite;