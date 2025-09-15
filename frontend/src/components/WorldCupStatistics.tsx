import { useState, useEffect, useCallback } from 'react';
// import type { WorldCupResult } from '../types/WorldCup'; // 사용하지 않음
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PokemonStatCard from './PokemonStatCard';
import StatCard from './StatCard';
import DistributionChart from './DistributionChart';
import TimelineChart from './TimelineChart';

// 통계 데이터 타입 정의
interface StatisticsData {
    // 전체 통계
    overall: {
        totalTournaments: number;
        totalParticipants: number;
        averageParticipantsPerTournament: number;
        mostPopularType: string;
        mostActiveGeneration: string;
    };

    // 우승자 통계
    winners: {
        topWinners: Array<{
            pokemonId: number;
            koreanName: string;
            name: string;
            spriteUrl: string;
            winCount: number;
            winRate: number;
        }>;
        generationDistribution: Array<{
            generation: string;
            count: number;
            percentage: number;
        }>;
        typeDistribution: Array<{
            type: string;
            count: number;
            percentage: number;
        }>;
    };

    // 참가자 통계
    participants: {
        mostPopularPokemon: Array<{
            pokemonId: number;
            koreanName: string;
            name: string;
            spriteUrl: string;
            participationCount: number;
            participationRate: number;
        }>;
        typePreferences: Array<{
            type: string;
            participationCount: number;
            percentage: number;
        }>;
    };

    // 시계열 통계
    timeline: {
        monthlyActivity: Array<{
            month: string;
            tournamentCount: number;
            participantCount: number;
        }>;
        yearlyTrends: Array<{
            year: string;
            totalTournaments: number;
            totalParticipants: number;
            averageParticipants: number;
        }>;
    };
}

// 필터 옵션
interface StatisticsFilter {
    generation: string;
    type: string;
    dateRange: {
        start: string;
        end: string;
    };
    period: 'all' | 'monthly' | 'yearly';
}

// Props 인터페이스
interface WorldCupStatisticsProps {
    isCompactMode?: boolean;
    maxItems?: number;
}

const WorldCupStatistics = ({
    isCompactMode = false,
    maxItems = 10
}: WorldCupStatisticsProps) => {

    // ==== 상태 관리 ====
    
    // 1. 통계 데이터 상태
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    
    // 2. 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // 3. 필터 상태
    const [filter, setFilter] = useState<StatisticsFilter>({
        generation: 'all',
        type: 'all',
        dateRange: {
            start: '',
            end: ''
        },
        period: 'all'
    });

    // ==== API 호출 함수들 ====

    // 통계 데이터 로드 함수
    const loadStatistics = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            // API 호출 파라미터 구성
            const params = new URLSearchParams({
                generation: filter.generation,
                type: filter.type,
                period: filter.period,
                ...(filter.dateRange.start && { startDate: filter.dateRange.start }),
                ...(filter.dateRange.end && { endDate: filter.dateRange.end })
            });

            // 백엔드 API 호출 (구현해야됨 TODO)
            const response = await fetch(`/api/worldcup/statistics?${params}`);

            if (!response.ok) {
                throw new Error('통계 데이터를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            setStatistics(data);

        } catch (err) {
            console.error('통계 데이터 로드 실패:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
        } finally {
            setIsLoading(false);
        }
    }, [filter]);

    // ==== useEffect ====

    // 1. 컴포넌트 마운트시 초기 데이터 로드
    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    // ==== 이벤트 핸들러들 ====

    // 필터 변경 핸들러
    const handleFilterChange = (filterType: keyof StatisticsFilter, value: string) => {
        setFilter(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // 날짜 범위 변경 핸들러
    const handleDateRangeChange = (rangeType: 'start' | 'end', value: string) => {
        setFilter(prev => ({
            ...prev,
            dateRange: {
                ...prev.dateRange,
                [rangeType]: value
            }
        }));
    };

    // ==== 렌더링 함수들 ====

    // 전체 통계 섹션
    const renderOverallSection = () => {
        if (!statistics) return null;
        
        return (
            <div className="statistics-section overall-section">
                <h3>🎯 전체 통계</h3>
                <div className="overall-stats-grid">
                    <StatCard 
                        icon="🏆" 
                        number={statistics.overall.totalTournaments} 
                        label="총 월드컵" 
                    />
                    <StatCard 
                        icon="👥" 
                        number={statistics.overall.totalParticipants} 
                        label="총 참가자" 
                    />
                    <StatCard 
                        icon="📊" 
                        number={statistics.overall.averageParticipantsPerTournament} 
                        label="평균 참가자" 
                    />
                    <StatCard 
                        icon="🔥" 
                        number={statistics.overall.mostPopularType} 
                        label="인기 타입" 
                    />
                    <StatCard 
                        icon="⭐" 
                        number={statistics.overall.mostActiveGeneration} 
                        label="활발한 세대" 
                    />
                </div>
            </div>
        );
    };

    // 우승자 통계 섹션
    const renderWinnersSection = () => {
        if (!statistics) return null;
        
        return (
            <div className="statistics-section winners-section">
                <h3>👑 우승자 통계</h3>
                
                {/* 최다 우승자 */}
                <div className="stat-subsection">
                    <h4>최다 우승자 TOP {maxItems}</h4>
                    <div className="winners-list">
                        {statistics.winners.topWinners.slice(0, maxItems).map((winner, index) => (
                            <PokemonStatCard 
                                key={winner.pokemonId}
                                pokemon={{
                                    id: winner.pokemonId,
                                    koreanName: winner.koreanName,
                                    name: winner.name,
                                    spriteUrl: winner.spriteUrl
                                }}
                                rank={index + 1}
                                stats={[
                                    { label: '우승', value: winner.winCount, unit: '회' },
                                    { label: '승률', value: winner.winRate, unit: '%' }
                                ]}
                                variant="winner"
                            />
                        ))}
                    </div>
                </div>
                
                {/* 세대별 우승 분포 */}
                <div className="stat-subsection">
                    <h4>세대별 우승 분포</h4>
                    <DistributionChart 
                        data={statistics.winners.generationDistribution.map(item => ({
                            label: `${item.generation}세대`,
                            value: item.count,
                            percentage: item.percentage
                        }))}
                        type="bar"
                    />
                </div>
                
                {/* 타입별 우승 분포 */}
                <div className="stat-subsection">
                    <h4>타입별 우승 분포</h4>
                    <DistributionChart 
                        data={statistics.winners.typeDistribution.map(item => ({
                            label: item.type,
                            value: item.count,
                            percentage: item.percentage
                        }))}
                        type="pie"
                    />
                </div>
            </div>
        );
    };

    // 참가자 통계 섹션
    const renderParticipantsSection = () => {
        if (!statistics) return null;
        
        return (
            <div className="statistics-section participants-section">
                <h3>👥 참가자 통계</h3>
                
                {/* 인기 포켓몬 */}
                <div className="stat-subsection">
                    <h4>인기 참가 포켓몬 TOP {maxItems}</h4>
                    <div className="popular-pokemon-list">
                        {statistics.participants.mostPopularPokemon.slice(0, maxItems).map((pokemon, index) => (
                            <PokemonStatCard 
                                key={pokemon.pokemonId}
                                pokemon={{
                                    id: pokemon.pokemonId,
                                    koreanName: pokemon.koreanName,
                                    name: pokemon.name,
                                    spriteUrl: pokemon.spriteUrl
                                }}
                                rank={index + 1}
                                stats={[
                                    { label: '참가', value: pokemon.participationCount, unit: '회' },
                                    { label: '참가율', value: pokemon.participationRate, unit: '%' }
                                ]}
                                variant="popular"
                            />
                        ))}
                    </div>
                </div>
                
                {/* 타입별 선호도 */}
                <div className="stat-subsection">
                    <h4>타입별 참가 선호도</h4>
                    <DistributionChart 
                        data={statistics.participants.typePreferences.map(item => ({
                            label: item.type,
                            value: item.participationCount,
                            percentage: item.percentage
                        }))}
                        type="bar"
                    />
                </div>
            </div>
        );
    };

    // 시계열 통계 섹션
    const renderTimelineSection = () => {
        if (!statistics) return null;
        
        return (
            <div className="statistics-section timeline-section">
                <h3>📅 시계열 분석</h3>
                
                {/* 월별 활동 */}
                {(filter.period === 'all' || filter.period === 'monthly') && (
                    <div className="stat-subsection">
                        <h4>월별 월드컵 활동</h4>
                        <TimelineChart 
                            data={statistics.timeline.monthlyActivity.map(item => ({
                                period: item.month,
                                tournaments: item.tournamentCount,
                                participants: item.participantCount
                            }))}
                            type="monthly"
                            showParticipants={true}
                        />
                    </div>
                )}
                
                {/* 년별 트렌드 */}
                {(filter.period === 'all' || filter.period === 'yearly') && (
                    <div className="stat-subsection">
                        <h4>년별 트렌드</h4>
                        <div className="yearly-trends">
                            {statistics.timeline.yearlyTrends.map((item) => (
                                <div key={item.year} className="yearly-item">
                                    <div className="year-label">{item.year}년</div>
                                    <div className="year-stats">
                                        <div className="year-stat">
                                            <span className="stat-label">월드컵</span>
                                            <span className="stat-value">{item.totalTournaments}회</span>
                                        </div>
                                        <div className="year-stat">
                                            <span className="stat-label">참가자</span>
                                            <span className="stat-value">{item.totalParticipants}명</span>
                                        </div>
                                        <div className="year-stat">
                                            <span className="stat-label">평균</span>
                                            <span className="stat-value">{item.averageParticipants}명</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // ==== 로딩 및 에러 상태 처리 ====
    
    if (isLoading && !statistics) {
        return <LoadingSpinner message="통계 데이터를 불러오는 중..." />;
    }

    if (error && !statistics) {
        return <ErrorMessage message={error} onRetry={loadStatistics} />;
    }

    // ==== 컴팩트 모드 렌더링 (홈페이지용) ====
    
    if (isCompactMode) {
        return (
            <div className="worldcup-statistics-compact">
                <div className="compact-header">
                    <h3>📊 월드컵 통계</h3>
                </div>
                
                {statistics && (
                    <div className="compact-stats">
                        <StatCard 
                            icon="🏆" 
                            number={statistics.overall.totalTournaments} 
                            label="총 월드컵" 
                            size="small"
                        />
                        <StatCard 
                            icon="👥" 
                            number={statistics.overall.totalParticipants} 
                            label="총 참가자" 
                            size="small"
                        />
                        <StatCard 
                            icon="🔥" 
                            number={statistics.overall.mostPopularType} 
                            label="인기 타입" 
                            size="small"
                        />
                    </div>
                )}
                
                <div className="compact-footer">
                    <button className="btn-view-all">
                        전체 통계 보기 →
                    </button>
                </div>
            </div>
        );
    }

    // ==== 전체 모드 렌더링 (전용 페이지) ====
    
    return (
        <div className="worldcup-statistics">
            {/* 헤더 섹션 */}
            <div className="statistics-header">
                <h2>📊 월드컵 통계</h2>
                <p>포켓몬 월드컵의 다양한 통계를 확인해보세요</p>
            </div>

            {/* 필터 섹션 */}
            <div className="statistics-filters">
                <div className="filter-group">
                    <label htmlFor="generation-filter">세대:</label>
                    <select 
                        id="generation-filter"
                        value={filter.generation}
                        onChange={(e) => handleFilterChange('generation', e.target.value)}
                    >
                        <option value="all">전체</option>
                        {Array.from({length: 10}, (_, i) => (
                            <option key={i + 1} value={String(i + 1)}>{i + 1}세대</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="type-filter">타입:</label>
                    <select 
                        id="type-filter"
                        value={filter.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                        <option value="all">전체</option>
                        <option value="fire">불꽃</option>
                        <option value="water">물</option>
                        <option value="electric">전기</option>
                        <option value="grass">풀</option>
                        <option value="ice">얼음</option>
                        <option value="fighting">격투</option>
                        <option value="poison">독</option>
                        <option value="ground">땅</option>
                        <option value="flying">비행</option>
                        <option value="psychic">에스퍼</option>
                        <option value="bug">벌레</option>
                        <option value="rock">바위</option>
                        <option value="ghost">고스트</option>
                        <option value="dragon">드래곤</option>
                        <option value="dark">악</option>
                        <option value="steel">강철</option>
                        <option value="fairy">페어리</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="period-filter">기간:</label>
                    <select 
                        id="period-filter"
                        value={filter.period}
                        onChange={(e) => handleFilterChange('period', e.target.value)}
                    >
                        <option value="all">전체</option>
                        <option value="monthly">월별</option>
                        <option value="yearly">년별</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="start-date">시작일:</label>
                    <input 
                        type="date"
                        id="start-date"
                        value={filter.dateRange.start}
                        onChange={(e) => handleDateRangeChange('start', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="end-date">종료일:</label>
                    <input 
                        type="date"
                        id="end-date"
                        value={filter.dateRange.end}
                        onChange={(e) => handleDateRangeChange('end', e.target.value)}
                    />
                </div>
            </div>

            {/* 통계 내용 */}
            {statistics ? (
                <div className="statistics-content">
                    {renderOverallSection()}
                    {renderWinnersSection()}
                    {renderParticipantsSection()}
                    {renderTimelineSection()}
                </div>
            ) : (
                <div className="empty-statistics">
                    <p>아직 통계 데이터가 없습니다.</p>
                    <p>월드컵을 진행해보세요! 🚀</p>
                </div>
            )}

            {/* 에러 메시지 */}
            {error && (
                <div className="error-banner">
                    <ErrorMessage message={error} onRetry={() => setError(null)} />
                </div>
            )}
        </div>
    );
};

export default WorldCupStatistics;
