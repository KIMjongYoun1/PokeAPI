/**
 * 포켓몬의 개별 능력치 정보를 담는 인터페이스
 * PokéAPI에서 제공하는 능력치 데이터 구조와 일치
 */
export interface StatDTO {
    name: string;        // 능력치 이름 (예: "hp", "attack", "defense", "speed", "special-attack", "special-defense")
    baseStat: number;    // 기본 수치 (0~255 범위, 포켓몬의 기본 능력치) - PokéAPI 필드명과 일치
    effort: number;      // 노력치 (0~3 범위, 포켓몬을 키울 때 얻는 추가 능력치)
}

/**
 * 포켓몬의 전체 정보를 담는 인터페이스
 * 백엔드 API와 프론트엔드 간의 데이터 전송에 사용
 * PokéAPI 응답 구조와 백엔드 DTO 구조를 기반으로 작성
 */
export interface PokemonDTO {
    id: number;                    // 데이터베이스 내부 ID (자동 생성)
    pokemonId: number;             // 포켓몬 도감 번호 (1~151, 1세대 기준)
    name: string;                  // 포켓몬 이름 (영문 소문자, 예: "pikachu")
    koreanName: string;            // 포켓몬 한글 이름 (예: "피카츄")
    baseExperience: number;        // 기본 경험치 (포켓몬을 잡았을 때 얻는 경험치)
    height: number;                // 키 (cm 단위, 실제 표시시 10으로 나누어 m 단위로 변환)
    weight: number;                // 몸무게 (g 단위, 실제 표시시 10으로 나누어 kg 단위로 변환)
    spriteUrl: string;             // 일반 스프라이트 이미지 URL (작은 크기)
    shinySpriteUrl: string;        // 샤이니 스프라이트 이미지 URL (희귀한 색상)
    officialArtworkUrl: string;    // 공식 일러스트 URL (큰 크기, 고화질)
    types: string[];               // 타입 배열 (예: ["Electric"], ["Fire", "Flying"])
    stats: StatDTO[];              // 능력치 배열 (HP, 공격, 방어, 특공, 특방, 속도)
    description: string;           // 포켓몬 설명 (한국어 또는 영문)
    abilities: string[];           // 특성 배열 (예: ["Static"], ["Blaze", "Solar Power"])
}

/**
 * 고급 검색에서 사용하는 필터링 파라미터 인터페이스
 * 모든 값은 문자열로 받아서 유효성 검사 후 숫자로 변환
 */
export interface AdvancedSearchParams {
    type: string;           // 포켓몬 타입 (예: "Electric", "Fire", "Water")
    minHeight: string;      // 최소 키 (cm 단위, 숫자 문자열)
    maxHeight: string;      // 최대 키 (cm 단위, 숫자 문자열)
    minWeight: string;      // 최소 몸무게 (g 단위, 숫자 문자열)
    maxWeight: string;      // 최대 몸무게 (g 단위, 숫자 문자열)
    minAttack: string;      // 최소 공격력 (0~255 범위, 숫자 문자열)
    maxAttack: string;      // 최대 공격력 (0~255 범위, 숫자 문자열)
    minDefense: string;     // 최소 방어력 (0~255 범위, 숫자 문자열)
    maxDefense: string;     // 최대 방어력 (0~255 범위, 숫자 문자열)
    minHp: string;          // 최소 HP (0~255 범위, 숫자 문자열)
    maxHp: string;          // 최대 HP (0~255 범위, 숫자 문자열)
    minSpeed: string;       // 최소 속도 (0~255 범위, 숫자 문자열)
    maxSpeed: string;       // 최대 속도 (0~255 범위, 숫자 문자열)
}

/**
 * 검색 모드를 구분하는 유니온 타입
 * 컴포넌트에서 현재 검색 모드를 추적할 때 사용
 */
export type SearchMode = 'single' | 'advanced';

/**
 * 진화 체인에서 각 포켓몬 노드를 나타내는 인터페이스
 * 진화 트리 구조를 시각화할 때 사용
 */
export interface EvolutionNode {
    pokemon: PokemonDTO;        // 포켓몬 정보
    evolutionChain: string;     // 진화 체인 식별자 (예: "1", "2", "3")
    isCurrent: boolean;         // 현재 선택된 포켓몬인지 여부 (UI 하이라이트용)
}

/**
 * 포켓몬 비교 기능에서 사용하는 상태 인터페이스
 * 두 포켓몬의 능력치를 비교하고 승률을 계산할 때 사용
 */
export interface ComparisonState {
    pokemon1: PokemonDTO | null;    // 첫 번째 비교 대상 포켓몬
    pokemon2: PokemonDTO | null;    // 두 번째 비교 대상 포켓몬
    winRate: number;                // pokemon1의 승률 (0~100 범위, 백분율)
}