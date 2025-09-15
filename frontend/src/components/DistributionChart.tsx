// React import 제거 (사용하지 않음)

// 챠트 데이터 타입
interface ChartDataItem {
    label: string;
    value: number;
    percentage: number;
    color?: string;
}

// Props 인터페이스
interface DistributionChartProps {
    data: ChartDataItem[];
    type?: 'bar' | 'horizontal' | 'pie';
    maxItems?: number;
    showValues?: boolean;
    showPercentages?: boolean;
    className?: string;
}

const DistributionChart = ({
    data,
    type = 'bar',
    maxItems = 10,
    showValues = true,
    showPercentages = true,
    className = ''
}: DistributionChartProps) => {

    const defaultColors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
        '#10AC84', '#EE5A24', '#0984E3', '#A29BFE', '#FD79A8'
    ];

    // 정령된 데이터( 값 기준)
    const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, maxItems);

    const renderBarChart = () => (
        <div className="bar-chart">
            {sortedData.map((item, index) => (
                <div key={item.label} className="chart-bar">
                    <div className="bar-label">{item.label}</div>
                    <div className="bar-container">
                        <div className="bar-fill"
                            style={{
                                width: `${item.percentage}%`,
                                backgroundColor: item.color || defaultColors[index % defaultColors.length]
                            }}
                        ></div>
                        {showValues && (
                            <span className="bar-value">
                                {item.value}
                                {showPercentages && `(${item.percentage}%)`}
                            </span>

                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    // 수평막대 차트 랜더링
    const renderHorizontalChart= () => (
        <div className="horizontla-chart">
            {sortedData.map((item, index) => (
                <div key={item.label} className="horizontal-bar">
                    <div className="bar-info">
                        <span className="bar-label">{item.label}</span>
                        {showValues && (
                            <span className="bar-value">
                                {item.value}
                                {showPercentages && `(${item.percentage}%)`}
                            </span>
                        )}
                    </div>
                    <div className="bar-container">
                        <div
                            className="bar-fill"
                            style={{
                                width: `${item.percentage}`,
                                backgroundColor: item.color || defaultColors[index % defaultColors.length]
                            }}></div>
                    </div>
                </div>
            ))}
        </div>
    );

    // 파이 차트 랜더링 (CSS로 구현)
    const renderPieChart = () => {
        let cumulativePercentage = 0;
        
        return (
            <div className="pie-chart">
                <div className="pie-container">
                    {sortedData.map((item, index) => {
                        const startAngle = (cumulativePercentage / 100) * 360;
                        const endAngle = ((cumulativePercentage + item.percentage) / 100) * 360;
                        cumulativePercentage += item.percentage;
                        
                        return (
                            <div
                                key={item.label}
                                className="pie-slice"
                                style={{
                                    background: `conic-gradient(
                                        ${item.color || defaultColors[index % defaultColors.length]} 
                                        ${startAngle}deg ${endAngle}deg, 
                                        transparent ${endAngle}deg
                                    )`
                                }}
                            ></div>
                        );
                    })}
                </div>
                <div className="pie-legend">
                    {sortedData.map((item, index) => (
                        <div key={item.label} className="legend-item">
                            <div 
                                className="legend-color"
                                style={{ 
                                    backgroundColor: item.color || defaultColors[index % defaultColors.length] 
                                }}
                            ></div>
                            <span className="legend-label">{item.label}</span>
                            {showValues && (
                                <span className="legend-value">
                                    {item.value}
                                    {showPercentages && ` (${item.percentage}%)`}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // 차트 타입에 따른 렌더링
    const renderChart = () => {
        switch (type) {
            case 'horizontal':
                return renderHorizontalChart();
            case 'pie':
                return renderPieChart();
            default:
                return renderBarChart();
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className={`distribution-chart empty ${className}`}>
                <p>표시할 데이터가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={`distribution-chart ${type} ${className}`}>
            {renderChart()}
        </div>
    );
};

export default DistributionChart;