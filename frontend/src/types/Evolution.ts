/**
 * API 리소스 정보 인터페이스
 * PokeAPI에서 공통으로 사용되는 name과 url구조 
 */
export interface ApiResourceDTO {
    name: string;
    url: string;
}

/**
 * 진화 조건 정보 인터페이스
 * 포켓몬이 진화하기 위한 조건들
 */
export interface EvolutionDetail {
    item: ApiResourceDTO | null; // 진화에 필요한 아이템
    trigger: ApiResourceDTO; // 진화 트리거
    gender: number | null; // 성별 조건 1: 수컷, 2: 암컷 null: 무관
    held_item: ApiResourceDTO | null; // 지니고 있어야하는 아이템
    known_move: ApiResourceDTO | null; // 알려야 하는 기술
    known_move_type: ApiResourceDTO | null; // 알려야 하는 타입의 기술
    location: ApiResourceDTO | null; // 진화 장소
    min_level: number | null; //최소 레벨
    min_happiness: number | null; // 최소 행복도
    min_beauty: number | null; // 최소 아름다움?..
    min_affection: number | null; //최소 애정도
    needs_overworld_rain: boolean; // 비가내려야 하는지
    party_species: ApiResourceDTO | null; //파티에 있어야 하는 포켓몬
    party_type: ApiResourceDTO | null; // 파티에 있어야 하는 타입
    relative_physical_stats: number | null; // 상대적 물리 능력치
    time_of_day: string | null; //시간대 조건 day, night, dusk
    trade_species: ApiResourceDTO | null; // 교환해야하는 포켓몬
    turn_upside_down: boolean; // 3ds뒤집어야 하는지
}

/**
 * 진화 체인의 각 단계를 나타내는 인터페이스
 * 재귀적 구조로 진화 트리를 표현?.. 재귀적?
 */
export interface ChainDTO {
    is_baby: boolean; // 아기 포켓몬인지 여부
    species: ApiResourceDTO; //포켓몬 종 정보
    evolution_details: EvolutionDetail[]; // 진화 조건들
    evolves_to: ChainDTO[]; // 진화 할 수 있는 포켓몬들(재귀)
}

/**
 * 진화 체인 전체 정보를 담는 인터페이스
 * 백엔드 EvolutionDTO와 매칭
 */
export interface EvolutionDTO {
    id: number; // 진화체인 ID
    baby_trigger_item: ApiResourceDTO | null; //아기포켓몬 트리거 아이템
    chain: ChainDTO; // 진화 체인 루트 노드
}

/**
 * EvolutionChain 컴포넌트에서 사용하는 Props 인터페이스
 */
export interface EvolutionChainsProps {
    evolutionData: EvolutionDTO | null; // 진화체인 데이터
    isLoading: boolean; // 로딩상태
    error: string | null; // 에러 메세지
}

/**
 * 진화 노드를 시각화 할 때 사용하는 인터페이스
 */
export interface EvolutionNodeData {
    pokemonName: string; // 포켓몬이름
    pokemonId: number; // 포켓몬 ID
    spriteUrl: string; // 스프라이트 url
    isCurrent: boolean; // 현재 포켓몬 인지
    evolutionDetails: EvolutionDetail[]; // 진화조건
    children: EvolutionNodeData[]; // 진화 할 수 있는 포켓몬들
}
