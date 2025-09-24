import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './page/HomePage';
import PokemonDetailPage from './page/PokemonDetailPage';
import ComparisonPage from './page/ComparisonPage';
import EvolutionPage from './page/EvolutionPage';
import WorldCupPage from './page/WorldCupPage'; // 수정: WorldCupPage import 추가
import type { PokemonDTO } from './types/Pokemon';

// 네비게이션 컴포넌트
const Navigation = () => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-link">홈</Link>
        <Link to="/comparison" className="nav-link">능력치 비교</Link>
        <Link to="/evolution" className="nav-link">진화 체인</Link>
        <Link to="/worldcup" className="nav-link">🏆 월드컵</Link> {/* 수정: 월드컵 네비게이션 추가 */}
      </div>
    </nav>
  );
};

// 포켓몬 상세 페이지 래퍼 (URL 파라미터 처리)
const PokemonDetailWrapper = () => {
  const { pokemonName } = useParams<{ pokemonName: string }>();
  const navigate = useNavigate();
  
  if (!pokemonName) {
    return <div>포켓몬 이름이 필요합니다.</div>;
  }

  return (
    <PokemonDetailPage 
      pokemonName={pokemonName} 
      onBack={() => navigate('/')} 
    />
  );
};

// 홈 페이지 래퍼 (포켓몬 선택 처리)
const HomePageWrapper = () => {
  const navigate = useNavigate();
  
  const handlePokemonSelect = (pokemon: PokemonDTO) => {
    navigate(`/pokemon/${pokemon.koreanName || pokemon.name}`);
  };

  return <HomePage onPokemonSelect={handlePokemonSelect} />;
};

function App() {
  return (
    <Router>
      <div className="pokemon-app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/pokemon/:pokemonName" element={<PokemonDetailWrapper />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/evolution" element={<EvolutionPage />} />
            <Route path="/worldcup" element={<WorldCupPage />} /> {/* 수정: 월드컵 페이지 라우트 추가 */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
