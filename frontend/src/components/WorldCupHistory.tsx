import { useState, useEffect, useCallback } from 'react';
import type { WorldCupResult } from '../types/WorldCup';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// 히스토리 목록 표시용
interface HistorySummary {
    tournamentId: string;
    title: string;
    tournamentType: string;

    //우승자 정보 (목록 간단표시)
    winner: {
        id: number;
        koreanName: string;
        name: string;
        spriteUrl: string;
        types?: string[];
    };

    //메타 데이터
    metadata: {
        participantCount: number;
        generation: string;
        type: string;
        completedAt: string;
    };
}

// 필터링 옵션
interface HistoryFilter {
    generation: string;
    type: string;
    sortBy: 'recent' | 'oldest' | 'participantCount';
}

interface WorldCupHistoryProps {
    onSelectResult: (result: WorldCupResult) => void;
    isCompactMode?: boolean;
    maxItems?: number;
}

const WorldCupHistory = ({
    onSelectResult,
    isCompactMode = false,
    maxItems = 20
}: WorldCupHistoryProps) => {

    // ==== 상태관리 ====
    //1.히스토리 상태관리
    const [histories, setHistories] = useState<HistorySummary[]>([]);
    //2. 로딩 및 에러 상태
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //3. 필터링 상태
    const [filter, setFilter] = useState<HistoryFilter>({
        generation: 'all',
        type: 'all',
        sortBy: 'recent'
    });

    //4 페이지 네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    //5. 선택된 히스토리 상태 (상세보기)
    const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

    // ==== API 호출 함수들 ====

    // 히스토리 목록 로드 함수
    const loadHistories = useCallback(async (isInitialLoad: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            //API 호출 파라미터 구성
            const params = new URLSearchParams({
                page: isInitialLoad ? '1' : currentPage.toString(),
                limit: maxItems.toString(),
                generation: filter.generation,
                type: filter.type,
                sortBy: filter.sortBy
            });

            // 백앤드 API 호출 (구현해야됨 TODO)
            const response = await fetch(`/api/worldcup/results/history?${params}`);

            if (!response.ok) {
                throw new Error('히스토리를 불러오는데 실패했습니다.');
            }

            const data = await response.json();

            const historySummaries = data.results.map(transformToHistorySummary);

            if (isInitialLoad) {
                setHistories(historySummaries);
            } else {
                // 페이지네이션 시 기존 데이터 추가
                setHistories(prev => [...prev, ...historySummaries]);
            }

            setHasMore(data.hasMore);

        } catch (err) {
            console.error('히스토리 목록 로드 실패:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, maxItems, filter]);

    // ==== useEffect ====

    //1. 컴포넌트 마운트시 초기 데이터 로드
    useEffect(() => {
        loadHistories(true);
    }, [loadHistories]);

    //2. 필터 변경시 데이터 재로드
    useEffect(() => {
        loadHistories(true);
        setCurrentPage(1);
    }, [filter, loadHistories]);

    //백엔드 데이터를 HistorySummary 형식으로 변환
    const transformToHistorySummary = (backendData: Record<string, unknown>): HistorySummary => {
        const conditions = typeof backendData.conditions === 'string'
            ? JSON.parse(backendData.conditions)
            : backendData.conditions || {};

        // 타입 안전한 변환 함수들
        const toString = (value: unknown, defaultValue: string = ''): string => {
            return typeof value === 'string' ? value : defaultValue;
        };

        const toNumber = (value: unknown, defaultValue: number = 0): number => {
            return typeof value === 'number' ? value : defaultValue;
        };

        return {
            tournamentId: toString(backendData.tournamentId),
            title: toString(backendData.title),
            tournamentType: toString(backendData.tournamentType),

            winner: {
                id: toNumber(backendData.winnerId),
                koreanName: toString(backendData.winnerKoreanName, '알 수 없음'),
                name: toString(backendData.winnerName, 'Unknown'),
                spriteUrl: toString(backendData.winnerSpriteUrl, '/default-pokemon.png'),
                types: [], // 목록에서는 간단히 표시
            },

            metadata: {
                participantCount: toNumber(conditions.participantCount),
                generation: toString(conditions.generation, 'all'),
                type: toString(conditions.type, 'all'),
                completedAt: toString(backendData.completedAt),
            }
        };
    };

    // 특정 히스토리 상세 조회 함수
    const loadHistoryDetail = async (tournamentId: string) => {
        try {
            setIsLoading(true);
            setSelectedHistory(tournamentId);

            //상세정보 API 호출
            const response = await fetch(`/api/worldcup/results/public/${tournamentId}`);

            if (!response.ok) {
                throw new Error('히스토리 상세정보를 불러오는데 실패했습니다.');
            }

            const fullResult: WorldCupResult = await response.json();

            // 부모 컴포넌트에 상세 정보 전달
            onSelectResult(fullResult);

        } catch (err) {
            console.error('상세정보 로드 실패 :', err);
            setError(err instanceof Error ? err.message : '상세정보를 불러 올 수 없습니다.');

        } finally {
            setIsLoading(false);
        }
    };

    // ==== 이벤트 핸들러들 ====

    // filter 변경 핸들러
    const handleFilterChange = (filterType: keyof HistoryFilter, value: string) => {
        setFilter(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // History Card Click 핸들러
    const handleHistoryCardClick = (tournamentId: string) => {
        loadHistoryDetail(tournamentId);
    };

    // More See Click  핸들러
    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setCurrentPage(prev => prev + 1);
            loadHistories(false); // false = 추가로드
        }
    };

    // ==== 로딩 및 에러 상태 처리 ===
    if (isLoading && histories.length === 0) {
        return <LoadingSpinner message='히스토리를 불러오는 중...' />;
    }

    if (error && histories.length === 0) {
        return <ErrorMessage message={error} onRetry={() => loadHistories(true)} />;
    }

    //==== Compact 모드 랜더링 (홈페이지용)
    if (isCompactMode) {
        return (
            <div className="worldcup-history-compact">
                <div className="compact-header">
                    <h3>최근 월드컵 결과</h3>
                </div>
                <div className="compact-list">
                    {histories.slice(0, 5).map((history) => (
                        <CompactHistoryCard
                            key={history.tournamentId}
                            history={history}
                            onClick={() => handleHistoryCardClick(history.tournamentId)} />
                    ))}
                </div>

                {histories.length > 5 && (
                    <div className="compact-footer">
                        <button className="btn-view-all">
                            모든 기록 보기
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="worldcup-history">
            {/** 헤더 섹션 */}
            <div className="history-header">
                <h2>월드컵 결과 히스토리</h2>
                <p>지난 월드컵 기록들을 확인해 보세요</p>
            </div>

            {/** Filter 섹션 */}
            <div className="history-filters">
                <div className="filter-group">
                    <label htmlFor="generation-filter">세대:</label>
                    <select
                        id="generation-filter"
                        value={filter.generation}
                        onChange={(e) => handleFilterChange('generation', e.target.value)}>
                        <option value="all">전체</option>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1)} > {i + 1}세대</option>
                        ))}
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="type-filter">타입:</label>
                    <select
                        id="type-filter"
                        value={filter.type}
                        onChange={(e) => handleFilterChange('type', e.target.value)}>
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
                    <label htmlFor="sort-filter">정렬:</label>
                    <select
                        id="sort-filter"
                        value={filter.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
                        <option value="recent">최신순</option>
                        <option value="oldest">오래된 순</option>
                        <option value="participantCount">참가자 수순</option>
                    </select>
                </div>
            </div>

            {/** History 목록 */}
            <div className="history-list">
                {histories.length === 0 ? (
                    <div className="empty-history">
                        <p>아직 월드컵 결과가 없습니다.</p>
                        <p>첫 번째 월드컵을 시작해 보세요!</p>
                    </div>
                ) : (
                    <>
                        {histories.map((history) => (
                            <HistoryCard
                                key={history.tournamentId}
                                history={history}
                                onClick={() => handleHistoryCardClick(history.tournamentId)}
                                isSelected={selectedHistory === history.tournamentId} />
                        ))}

                        {/*더보기 버튼*/}
                        {hasMore && (
                            <div className="load-more-container">
                                <button
                                    onClick={handleLoadMore}
                                    disabled={isLoading}
                                    className="btn-load-more">
                                    {isLoading ? '로딩중...' : '더보기'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {/**에러 메세지 (목록이 있을때) */}
            {error && histories.length > 0 && (
                <div className="error-banner">
                    <ErrorMessage message={error} onRetry={() => setError(null)} />
                </div>
            )}
        </div>
    );
};

// == 서브 컴포넌트들 ==

// 일반 히스토리 카드
interface HistoryCardProps {
    history: HistorySummary;
    onClick: () => void;
    isSelected: boolean;
}

const HistoryCard =({history, onClick, isSelected}: HistoryCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getGenerationText = (generation: string) => {
        return generation === 'all' ? '전체' : `${generation}세대`;
    };
    return (
        <div className={`history-card ${isSelected ? 'selected' : ''}`}
        onClick={onClick} >

            <div className="winner-preview">
                <img
                    src={history.winner.spriteUrl}
                    alt={history.winner.koreanName}
                    className="winner-sprite" />

                    <div className="winner-crown">👑</div>
            </div>

            <div className="tournament-info">
                <h3 className="tournament-title">{history.title}</h3>
                <p className="winner-name">{history.winner.koreanName} 우승</p>

                <div className="tournament-meta">
                    <span className="participant-count">
                        {history.metadata.participantCount}명 참가
                    </span>
                    <span className="generation">
                        {getGenerationText(history.metadata.generation)}
                    </span>
                    {history.metadata.type !== 'all' &&(
                        <span className="type">
                            {history.metadata.type}타입
                        </span>
                    )}
                </div>
                <p className="completion-date">
                    {formatDate(history.metadata.completedAt)}
                </p>
            </div>
            <div className="card-actions">
                <button className="btn-view-detail">상세보기</button>
            </div>
        </div>
    );
};

interface CompactHistoryCardProps {
    history: HistorySummary;
    onClick: () => void;
}

const CompactHistoryCard = ({history, onClick}: CompactHistoryCardProps) => {
    return (
        <div className="compact-history-card" onClick={onClick} >
            <img
                src={history.winner.spriteUrl}
                alt={history.winner.koreanName}
                className="winner-sprite" />

            <div className="compact-info">
                <span className="compact-title">{history.title}</span>
                <span className="compact-winner">{history.winner.koreanName} 우승</span>             
            </div>
            <div className="compact-date">
                {new Date(history.metadata.completedAt).toLocaleDateString('ko-KR')}
            </div>
        </div>
    );
};

export default WorldCupHistory;

