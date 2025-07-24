import { useState, useEffect } from 'react';
import PokemonCard from '../components/PokemonCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import type { PokemonDTO } from '../types/Pokemon';

interface PokemonDetailPageProps {
  pokemonName: string;
  onBack: () => void;
}

const PokemonDetailPage = ({ pokemonName, onBack }: PokemonDetailPageProps) => {
  const [pokemon, setPokemon] = useState<PokemonDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:8080/api/pokemon/${pokemonName}`);
        if (response.ok) {
          const data = await response.json();
          setPokemon(data);
        } else {
          setError('포켓몬을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('서버 연결에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonName]);

  if (loading) {
    return <LoadingSpinner message="포켓몬 정보를 불러오는 중..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => window.location.reload()} />;
  }

  if (!pokemon) {
    return <ErrorMessage message="포켓몬 정보를 찾을 수 없습니다." onRetry={onBack} />;
  }

  return (
    <div className="pokemon-detail-page">
      <button onClick={onBack} className="back-button">
        ← 뒤로 가기
      </button>
      
      <PokemonCard pokemon={pokemon} />
    </div>
  );
};

export default PokemonDetailPage;
