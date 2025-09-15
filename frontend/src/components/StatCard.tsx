// React import 제거 (사용하지 않음)

//Props interface
interface StatCardProps {
    icon: string;
    number: string | number;
    label: string;
    color?: string;
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
    className?: string;
}

const StatCard = ({
    icon,
    number,
    label,
    color = '#333',
    size = 'medium',
    onClick,
    className = ''
}: StatCardProps) => {

    // 숫자 포매팅 함수
    const fromatNumber = (num: string | number): string => {
        if (typeof num === 'string') return num;

        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'
        }

        return num.toString();

    };

    return (
        <div className={`stat-card ${size} ${className} ${onClick ? 'clickable' : ''}`}
            onClick={onClick}>
                <div className="stat-icon"
                    style={{color}}>
                        {icon}
                </div>
                <div className="stat-info">
                    <span className="stat-number" style={{color}}>
                        {fromatNumber(number)}
                    </span>
                    <span className="stat-label">{label}</span>
                </div>
            </div>
    )
};

export default StatCard;
