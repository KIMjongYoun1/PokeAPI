import type { PokemonDTO } from './Pokemon';

/**
 * 차트 타입을 정의하는 유니온 타입
 * 막대 그래프와 레이더 차트 중 선택 가능
 */
export type ChartType = 'bar' | 'radar';

/**
 * StatComparisonChart 컴포넌트의 Props 인터페이스
 * 차트 렌더링에 필요한 모든 설정을 포함
 */
export interface StatComparisonChartProps {
  /** 포켓몬 배열 (1개 또는 여러개) */
  pokemons: PokemonDTO[];
  /** 최대 능력치 (기본값: 255) */
  maxStat?: number;
  /** 수치 표시 여부 */
  showValues?: boolean;
  /** 퍼센트 표시 여부 */
  showPercentage?: boolean;
  /** 차트 높이 (픽셀) */
  height?: number;
  /** 차트 너비 (반응형용, CSS 값) */
  width?: string;
}

/**
 * 차트 데이터 구조를 정의하는 인터페이스
 * Recharts 라이브러리에서 사용하는 데이터 형태
 */
export interface ChartData {
  /** 능력치 이름 (한글) */
  stat: string;
  /** 포켓몬별 능력치 값 (동적 키) */
  [key: string]: string | number;
}

/**
 * 툴팁 Props 인터페이스
 * Recharts Tooltip 컴포넌트에서 사용
 */
export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

/**
 * 능력치 한글 이름 매핑 객체
 * 영문 능력치명을 한글로 변환
 */
export const STAT_NAMES: Record<string, string> = {
  'hp': 'HP',
  'attack': '공격',
  'defense': '방어',
  'special-attack': '특공',
  'special-defense': '특방',
  'speed': '속도'
} as const;

/**
 * 포켓몬별 색상 배열
 * 차트에서 포켓몬을 구분하기 위한 색상 팔레트
 */
export const POKEMON_COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000',
  '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
] as const;

/**
 * 차트 설정 옵션 인터페이스
 * 차트의 스타일링과 동작을 커스터마이징
 */
export interface ChartOptions {
  /** 차트 배경색 */
  backgroundColor?: string;
  /** 그리드 색상 */
  gridColor?: string;
  /** 툴팁 스타일 */
  tooltipStyle?: React.CSSProperties;
  /** 버튼 스타일 */
  buttonStyle?: React.CSSProperties;
} 