import React, {useState} from 'react';
import type { WorldCupParticipant } from '../types/WorldCup';

interface PokemonMatchCardProps {
    pokemonA: WorldCupParticipant;
    pokemonB: WorldCupParticipant;
    onSelect: (winnerId: number) => void;
    isSelecting?: boolean;
    selectedPokemonId?: number;
    round?: number;
    isCompleted?: boolean;
    winnerId?: number;
}