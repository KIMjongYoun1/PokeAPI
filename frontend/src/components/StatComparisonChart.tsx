import React, { useState, useMemo } from 'react';

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
    showValues = true,
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
                        dataPoint[`${pokemon.name} (${pokemonStat.baseStat})`] = pokemonStat.baseStat;
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
    function CustomTooltip ({ active, payload, label }: CustomTooltipProps) {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{
                    backgroundColor: '#fff',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}>
                    <p className="label" style={{ fontWeight: 'bold', marginBottom: '5px'}}>
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
}
