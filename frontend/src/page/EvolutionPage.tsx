import { useState, useEffect } from 'react';
import EvolutionChain from '../components/EvolutionChain';
import SearchForm from '../components/SearchForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EvolutionPage = () => {
  const [evolutionData, setEvolutionData] = useState(null);
  const [searchName, setSearchName] = useState('pikachu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvolutionChain = async (name: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/pokemon/${name}/evolution-chain`);
      
      if (response.ok) {
        const data = await response.json();
        setEvolutionData(data);
      } else {
        setError('진화 체인을 찾을 수 없습니다.');
        setEvolutionData(null);
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      setEvolutionData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvolutionChain(searchName);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvolutionChain(searchName);
  };

  return (
    <div className="evolution-page">
      <h1>포켓몬 진화 체인</h1>
      
      <SearchForm
        searchName={searchName}
        onSearchNameChange={setSearchName}
        onSearch={handleSearch}
      />
      
      {loading && <LoadingSpinner message="진화 체인을 불러오는 중..." />}
      {error && <ErrorMessage message={error} onRetry={() => fetchEvolutionChain(searchName)} />}
      
      {evolutionData && (
        <EvolutionChain 
          evolutionData={evolutionData}
          isLoading={loading}
          error={error}
        />
      )}
    </div>
  );
};

export default EvolutionPage;
