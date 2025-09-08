import React, { useState, useEffect, useCallback } from 'react';
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

const WorldCupHistory =({
    onSelectResult,
    onDeleteResult,
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

    //5. 선탠된 히스토리 상태 (상세보기)
    const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

    // ==== useEffect ====

   //1. 컴포넌트 마운트시 초기 데이터 로드
   useEffect(() => {
    loadingHistories(true);
   }, []);

   //2. 필터 변경시 데이터 재로드
   useEffect(() => {
    loadingHistories(true);
    setCurrentPage(1);
   }, [filter]);

   // ==== API 호출 함수들 ====

   // 히스토리 목록 로드 함수
   const loadingHistories = useCallback(async (isInitalLoad: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            //API 호출 파라미터 구성
            const params = new URLSearchParams({
                page: isInitalLoad ? '1' : currentPage.toString(),
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

            if (isInitalLoad) {
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
   },[currentPage, maxItems, filter]);
    
}