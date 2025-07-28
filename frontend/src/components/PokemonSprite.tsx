import { useState, useEffect } from 'react';

interface PokemonSpriteProps {
  pokemonName: string;
  size?: number;
  className?: string;
}

const PokemonSprite = ({ pokemonName, size = 80, className = '' }: PokemonSpriteProps) => {
  const [spriteUrl, setSpriteUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSprite = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // 먼저 백엔드에서 포켓몬 정보 가져오기
        const response = await fetch(`http://localhost:8080/api/pokemon/${pokemonName}`);
        
        if (response.ok) {
          const pokemonData = await response.json();
          if (pokemonData.spriteUrl) {
            setSpriteUrl(pokemonData.spriteUrl);
            setLoading(false);
            return;
          }
        }
        
        // 백엔드에 없으면 PokeAPI 직접 호출
        const pokeApiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (pokeApiResponse.ok) {
          const data = await pokeApiResponse.json();
          setSpriteUrl(data.sprites.front_default);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (pokemonName) {
      fetchSprite();
    }
  }, [pokemonName]);

  if (loading) {
    return (
      <div 
        className={`pokemon-sprite-loading ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="loading-spinner">로딩...</div>
      </div>
    );
  }

  if (error || !spriteUrl) {
    return (
      <div 
        className={`pokemon-sprite-error ${className}`}
        style={{ width: size, height: size }}
      >
        <span>❓</span>
      </div>
    );
  }

  return (
    <img
      src={spriteUrl}
      alt={`${pokemonName} sprite`}
      className={`pokemon-sprite ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
    />
  );
};

export default PokemonSprite;