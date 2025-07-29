import { useState, useMemo } from 'react';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';

import type {
    StatComparisonChartProps,
    ChartType,
    ChartData,
    CustomTooltipProps
} from '../types/StatComparison';

import { STAT_NAMES, POKEMON_COLORS } from '../types/StatComparison';

/**
 * 포켓몬 능력치 비교 차트 컴포넌트
 * 막대그래프와 레이더 차트를 지원하며 단일, 다중 포켓몬 비교 가능
 */

function StatComparisonChart({
    pokemons,
    maxStat = 255,
    showValues = true, // 차트에 숫자표시 추후 구현할지말지 정할듯
    showPercentage = false,
    height = 400,
    width = '100%',
}: StatComparisonChartProps) {
    const [chartType, setChartType] = useState<ChartType>('bar');

    const chartData = useMemo(() => {
        if (!pokemons || pokemons.length === 0) return [];

        const data: ChartData[] = [];

        // 첫 번째 포켓몬의 능력치를 기준으로 데이터 구조 생성
        const firstPokemon = pokemons[0];
        if (firstPokemon.stats) {
            firstPokemon.stats.forEach(stat => {
                const dataPoint: ChartData = {
                    stat: STAT_NAMES[stat.name] || stat.name.toUpperCase()
                };

                pokemons.forEach((pokemon, index) => {
                    const pokemonStat = pokemon.stats?.find(s => s.name === stat.name);
                    if (pokemonStat) {
                        dataPoint[`pokemon${index + 1}`] = pokemonStat.baseStat;
                        dataPoint[`${pokemon.koreanName || pokemon.name} (${pokemonStat.baseStat})`] = pokemonStat.baseStat;
                    }
                });
                data.push(dataPoint);
            });
        }
        return data;
    }, [pokemons]);

    /**
     * 커스텀 툴팁 컴포넌트
     * 차트 위에 마우스 오버시 표시되는 상세 정보
     */
    function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                    <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{
                            color: entry.color,
                            margin: '2px 0',
                            fontSize: '12px'
                        }}>
                            {`${entry.name}: ${entry.value}${showPercentage ? `(${((entry.value / maxStat) * 100).toFixed(1)}%)` : ''}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    }

    // 나머지 리턴값 작성필요
    if (!pokemons || pokemons.length === 0) {
        return (
            <div style={{
                height,
                width,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f8f9fa'
            }}>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    포켓몬 데이터가 없습니다.
                </p>
            </div>
        );
    }

    return (
        <div style={{ width, height: height + 60 }}>
            {/** 차트 삽입 버튼 선택 */}
            <div style={{
                marginBottom: '20px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                gap: '10px'
            }}>
                <button
                    onClick={() => setChartType('bar')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: chartType === 'bar' ? '#007bff' : '#f8f9fa',
                        color: chartType === 'bar' ? 'white' : '#333',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        fontWeight: '500'
                    }}>
                    막대 그래프
                </button>
                <button
                    onClick={() => setChartType('radar')}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: chartType === 'radar' ? '#007bff' : '#f8f9fa',
                        color: chartType === 'radar' ? 'white' : '#333',
                        border: '1px solid #007bff',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                fontWeight: '500'
                    }}>
                    레이더 차트
                </button>
            </div>
            {/** 포켓몬 이름 표시 (색상 구분) */}
            <div style={{
                marginBottom: '10px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#666'
            }}>
                {pokemons.map((pokemon, index) => (
                    <span key={index} style={{
                        marginRight: '15px',
                        color: POKEMON_COLORS[index % POKEMON_COLORS.length],
                        fontWeight: 'bold'
                    }}>
                        {pokemon.koreanName || pokemon.name.toUpperCase()}
                    </span>
                ))}
            </div>
            {/** 반응형 차트 컨테이너 */}
            <ResponsiveContainer width="100%" height={height}>
                {chartType === 'bar' ? (
                    //막대 그래프 렌더링
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="stat"
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#ccc' }} />
                        <YAxis
                            domain={[0, maxStat]}
                            tick={{ fontSize: 12 }}
                            axisLine={{ stroke: '#ccc' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {pokemons.map((pokemon, index) => (
                            <Bar
                                key={pokemon.id}
                                dataKey={`pokemon${index + 1}`}
                                name={pokemon.koreanName || pokemon.name.toUpperCase()}
                                fill={POKEMON_COLORS[index % POKEMON_COLORS.length]}
                                radius={[4, 4, 0, 0]} />
                        ))}
                    </BarChart>) : (
                    //레이더 차트 렌더링
                    <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <PolarGrid stroke="#e0e0e0" />
                        <PolarAngleAxis
                            dataKey="stat"
                            tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis
                            domain={[0, maxStat]}
                            tick={{ fontSize: 10 }} />
                        <Tooltip content={<CustomTooltip />} />
                        {pokemons.map((pokemon, index) => (
                            <Radar
                                key={pokemon.id}
                                name={pokemon.koreanName || pokemon.name.toUpperCase()}
                                dataKey={`pokemon${index + 1}`}
                                stroke={POKEMON_COLORS[index % POKEMON_COLORS.length]}
                                fill={POKEMON_COLORS[index % POKEMON_COLORS.length]}
                                fillOpacity={0.2}
                                strokeWidth={2} />
                        ))}
                    </RadarChart>

                )}
            
            </ResponsiveContainer>
        </div >
    );
}

export default StatComparisonChart;