// components/WinnerCard.tsx 파일 생성
import React from 'react';

interface WinnerCardProps {
    winner: {
        id: number;
        name: string;
        koreanName: string;
        spriteUrl: string;
        types: string[];
    };
}

const WinnerCard = ({ winner }: WinnerCardProps) => {
    return (
        <div className="winner-card">
            <div className="winner-crown">👑</div>
            <div className="winner-image">
                <img src={winner.spriteUrl} alt={winner.koreanName} />
            </div>
            <div className="winner-info">
                <h3 className="winner-name">{winner.koreanName}</h3>
                <p className="winner-english-name">{winner.name}</p>
                <div className="winner-types">
                    {winner.types.map((type, index) => (
                        <span key={index} className={`type-badge type-${type}`}>
                            {type}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WinnerCard;