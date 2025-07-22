import {useMemo} from 'react';
import type {EvolutionDetail} from '../types/Evolution';

interface EvolutionConditionProps {
    evolutionDetail: EvolutionDetail;
}

const EvolutionCondition = ({evolutionDetail} :EvolutionConditionProps) => {
    const conditionText = useMemo(() => {
        const conditions: string[] = [];

         // 레벨 조건
         if (evolutionDetail.min_level) {
            conditions.push(`레벨 ${evolutionDetail.min_level} 이상`);
        }

        // 아이템 조건
        if (evolutionDetail.item) {
            conditions.push(`${evolutionDetail.item.name} 사용`);
        }

        // 시간 조건
        if (evolutionDetail.time_of_day) {
            conditions.push(`${evolutionDetail.time_of_day}에 진화`);
        }

        // 성별 조건
        if (evolutionDetail.gender) {
            const genderText = evolutionDetail.gender === 1 ? '수컷' : '암컷';
            conditions.push(`${genderText}일 때`);
        }

        // 알려진 기술 조건
        if (evolutionDetail.known_move) {
            conditions.push(`기술 "${evolutionDetail.known_move.name}" 습득`);
        }

        // 알려진 기술 타입 조건
        if (evolutionDetail.known_move_type) {
            conditions.push(`${evolutionDetail.known_move_type.name} 타입 기술 습득`);
        }

        // 장소 조건
        if (evolutionDetail.location) {
            conditions.push(`${evolutionDetail.location.name}에서 진화`);
        }

        // 파티 포켓몬 조건
        if (evolutionDetail.party_species) {
            conditions.push(`파티에 ${evolutionDetail.party_species.name} 포함`);
        }

        // 파티 타입 조건
        if (evolutionDetail.party_type) {
            conditions.push(`파티에 ${evolutionDetail.party_type.name} 타입 포켓몬 포함`);
        }
          // 상대방 포켓몬 조건
          if (evolutionDetail.relative_physical_stats) {
            const statsText = evolutionDetail.relative_physical_stats === 1 ? '공격 > 방어' : 
                            evolutionDetail.relative_physical_stats === -1 ? '방어 > 공격' : '공격 = 방어';
            conditions.push(`스탯: ${statsText}`);
        }

        // 트레이드 조건
        if (evolutionDetail.trade_species) {
            conditions.push(`${evolutionDetail.trade_species.name}와 교환`);
        }

        // 턴 수 조건
        if (evolutionDetail.turn_upside_down) {
            conditions.push('3턴 동안 뒤집어져 있기');
        }

        return conditions.length > 0 ? conditions.join(', ') : '특별한 조건 없음';
    }, [evolutionDetail]);

    return (
        <div className="evolution-condition">
            <span className="condition-text">{conditionText}</span>
        </div>
    );
};

export default EvolutionCondition;