// 시계열 차트 컴포넌트
// 월별/년별 월드컵 활동 트렌드를 시각화

// 시계열 데이터 타입
interface TimelineDataItem {
    period: string;
    tournaments: number;
    participants: number;
    date?: string;
}

// Props 인터페이스
interface TimelineChartProps {
    data: TimelineDataItem[];
    type?: 'monthly' | 'yearly' | 'daily';
    showParticipants?: boolean;
    maxItems?: number;
    className?: string;
}

const TimelineChart = ({ 
    data, 
    type = 'monthly',
    showParticipants = true,
    maxItems = 12,
    className = ''
}: TimelineChartProps) => {
    
    // 최대값 계산 (정규화용)
    const maxTournaments = Math.max(...data.map(item => item.tournaments));
    const maxParticipants = Math.max(...data.map(item => item.participants));

    // 제한된 데이터
    const limitedData = data.slice(0, maxItems);

    // 기간 포맷팅
    const formatPeriod = (period: string, type: string) => {
        if (type === 'yearly') {
            return `${period}년`;
        } else if (type === 'monthly') {
            return period;
        } else {
            return period;
        }
    };

    // 빈 데이터 처리
    if (!data || data.length === 0) {
        return (
            <div className={`timeline-chart empty ${className}`}>
                <p>표시할 시계열 데이터가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className={`timeline-chart ${type} ${className}`}>
            <div className="timeline-container">
                {limitedData.map((item) => (
                    <div key={item.period} className="timeline-item">
                        <div className="timeline-label">
                            {formatPeriod(item.period, type)}
                        </div>
                        
                        <div className="timeline-bars">
                            {/* 토너먼트 수 막대 */}
                            <div className="timeline-bar tournaments">
                                <span className="bar-label">월드컵</span>
                                <div className="bar-container">
                                    <div 
                                        className="bar-fill tournaments"
                                        style={{ 
                                            width: `${(item.tournaments / maxTournaments) * 100}%` 
                                        }}
                                    ></div>
                                    <span className="bar-value">{item.tournaments}</span>
                                </div>
                            </div>
                            
                            {/* 참가자 수 막대 (옵션) */}
                            {showParticipants && (
                                <div className="timeline-bar participants">
                                    <span className="bar-label">참가자</span>
                                    <div className="bar-container">
                                        <div 
                                            className="bar-fill participants"
                                            style={{ 
                                                width: `${(item.participants / maxParticipants) * 100}%` 
                                            }}
                                        ></div>
                                        <span className="bar-value">{item.participants}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 범례 */}
            <div className="timeline-legend">
                <div className="legend-item">
                    <div className="legend-color tournaments"></div>
                    <span className="legend-label">월드컵 수</span>
                </div>
                {showParticipants && (
                    <div className="legend-item">
                        <div className="legend-color participants"></div>
                        <span className="legend-label">참가자 수</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelineChart;
