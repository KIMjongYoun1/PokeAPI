
import type {
    WorldCupParticipant,
    WorldCupRequest,
    AutoWorldCupRequest,
    WorldCupStatistics,
    WorldCupResult,
    WorldCupApiEndpoints,
    TournamentType,
    SelectionMethod,
    SortBy,
} from '../types/WorldCup';

const API_BASE_URL = 'http://localhost:8080/api/worldcup';

type ApiResponse<T> = {
    data: T;
    success: boolean;
    message?: string;
}

type ApiError = {
    error: string;
    status: number;
    timestamp: string;
}

// API 호출 유틸리티
class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }


    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Contant-type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, defaultOptions);

            if (!response.ok) {
                const errorData: ApiError = await response.json().catch(() => ({
                    timestamp: new Date().toISOString(),
                }));

                throw new Error(errorData.error || `HTTP ${response.status} : ${response.statusText}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error(`API 호출 실패 (${endpoint}:`, error);
            throw error;
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

}

// API 클라이언트 인스턴스
const apiClient = new ApiClient(API_BASE_URL);

// 월드컵 API 서비스
export const worldCupApi: WorldCupApiEndpoints = {
    // 참가자 조회
    selectParticipants: async (request: WorldCupRequest): Promise<WorldCupParticipant[]> => {
        return apiClient.post<WorldCupParticipant[]>('/participants', request);
    },

    // 자동 월드컵 생성
    createAutoWorldCup: async (request: AutoWorldCupRequest): Promise<WorldCupResult> => {
        return apiClient.post<WorldCupResult>('/auto', request);
    },

    // 월드컵 결과 저장
    saveWorldCupResult: async (result: WorldCupResult): Promise<WorldCupResult> => {
        return apiClient.post<WorldCupResult>('/results', result);
    },

    // 월드컵 결과 조회
    getWorldCupResult: async (tournamentId: string): Promise<WorldCupResult> => {
        return apiClient.get<WorldCupResult>(`/results/${tournamentId}`);
    },

    // 최근 월드컵 결과 조회
    getRecentWorldCupResults: async (limit: number = 10): Promise<WorldCupResult[]> => {
        const endpoint = limit ? `/results/recent?limet=${limit}` : '/results/recent';
        return apiClient.get<WorldCupResult[]>(endpoint);
    },

    // 세대별 월드컵 통계 조회
    getStatisticsByGeneration: async (generation: number): Promise<WorldCupStatistics[]> => {
        return apiClient.get<WorldCupStatistics[]>(`/statistics/generation/${generation}`);
    },

    // 타입별 월드컵 통계 조회
    getStatisticsByType: async (type: string): Promise<WorldCupStatistics[]> => {
        return apiClient.get<WorldCupStatistics[]>(`/statistics/type/${type}`);
    },

    // 세데 + 타입별 통계 조회
    getStatisticsByGenerationAndType: async(generation:number, type:string): Promise<WorldCupStatistics[]> => {
        return apiClient.get<WorldCupStatistics[]>(`/statisttics/${generation}/type/${type}`);
    },
}