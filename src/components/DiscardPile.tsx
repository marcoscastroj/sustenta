'use client';

import React from 'react';
import { Card, CardColor } from '../data/cards';
import { CardUI } from './CardUI';
import { RotateCw, RotateCcw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DiscardPileProps {
  topCard: Card | null;
  activeColor: CardColor;
  activeNumber: number | undefined;
  activeAction: string | undefined;
  direction: 1 | -1;
  deckCount: number;
  onDrawCard: () => void;
  isUserTurn: boolean;
}

export const DiscardPile: React.FC<DiscardPileProps> = ({
  topCard,
  activeColor,
  activeNumber,
  activeAction,
  direction,
  deckCount,
  onDrawCard,
  isUserTurn
}) => {
  
  // Color code styles
  const colorBgs: Record<CardColor, string> = {
    red: 'bg-rose-500 shadow-rose-500/20 text-rose-500',
    blue: 'bg-sky-500 shadow-sky-500/20 text-sky-500',
    yellow: 'bg-amber-500 shadow-amber-500/20 text-amber-500',
    purple: 'bg-purple-500 shadow-purple-500/20 text-purple-500'
  };

  const colorLabels: Record<CardColor, string> = {
    red: 'REDE (Rosa)',
    blue: 'CULPA (Azul)',
    yellow: 'NOMEAR (Amarelo)',
    purple: 'AÇÃO (Roxo)'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-md shadow-inner relative overflow-hidden w-full max-w-2xl mx-auto min-h-[300px]">
      
      {/* Direction indicators wrapping the table */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <motion.div
          animate={{ rotate: direction === 1 ? 360 : -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="w-72 h-72 rounded-full border-4 border-dashed border-zinc-400 flex items-center justify-center"
        >
          {direction === 1 ? (
            <RotateCw className="w-10 h-10 text-zinc-500" />
          ) : (
            <RotateCcw className="w-10 h-10 text-zinc-500" />
          )}
        </motion.div>
      </div>

      <div className="flex flex-row items-center justify-center gap-12 relative z-10">
        {/* Draw Pile (Baralho) */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onDrawCard}
            disabled={!isUserTurn}
            className={`group relative rounded-2xl transition-all duration-300 ${
              isUserTurn
                ? 'hover:scale-105 cursor-pointer shadow-indigo-500/10 hover:shadow-indigo-500/25 active:scale-95'
                : 'opacity-85 cursor-not-allowed'
            }`}
          >
            {/* Draw pile representation */}
            <div className="absolute top-1 left-1 w-32 h-48 bg-zinc-300 dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-400/50 dark:border-zinc-700/50 z-0 transform translate-x-1 translate-y-1" />
            <div className="absolute top-0.5 left-0.5 w-32 h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-400/50 dark:border-zinc-700/50 z-10 transform translate-x-0.5 translate-y-0.5" />
            <div className="relative z-20">
              <CardUI
                card={{ id: 'back', color: 'purple', type: 'action' }}
                showBack={true}
                size="md"
                isPlayable={false}
              />
            </div>
            
            {/* Hover overlay hint */}
            {isUserTurn && (
              <div className="absolute inset-0 z-30 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <span className="bg-white/95 dark:bg-zinc-900/95 text-indigo-700 dark:text-indigo-300 font-bold px-3 py-1 rounded-full text-xs shadow-md border border-indigo-200 dark:border-indigo-800">
                  Comprar Carta
                </span>
              </div>
            )}
          </button>
          
          <span className="text-xxs text-zinc-500 font-semibold tracking-wider mt-1 uppercase">
            Monte ({deckCount})
          </span>
        </div>

        {/* Discard Pile (Mesa / Descarte) */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-48 flex items-center justify-center">
            {topCard ? (
              <motion.div
                key={topCard.id}
                initial={{ scale: 0.8, rotate: Math.random() * 10 - 5, y: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, y: 0, opacity: 1 }}
                className="absolute"
              >
                <CardUI card={topCard} size="md" isPlayable={false} />
              </motion.div>
            ) : (
              <div className="w-32 h-48 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 dark:text-zinc-600 text-xs">
                Mesa Vazia
              </div>
            )}
          </div>
          
          <span className="text-xxs text-zinc-500 font-semibold tracking-wider mt-1 uppercase">
            Descarte
          </span>
        </div>
      </div>

      {/* Info Stats Bar */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 bg-white/70 dark:bg-zinc-900/70 py-2 px-5 rounded-full shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 z-10 w-auto">
        {/* Active Color Spot */}
        <div className="flex items-center gap-2">
          <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest">
            Cor Ativa:
          </span>
          <div className={`w-3.5 h-3.5 rounded-full ${colorBgs[activeColor]} border-2 border-white dark:border-zinc-900 shadow-sm`} />
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {colorLabels[activeColor]}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

        {/* Direction Spot */}
        <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
          <span className="text-xxs font-bold text-zinc-400 uppercase tracking-widest">
            Sentido:
          </span>
          {direction === 1 ? (
            <RotateCw className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5 text-indigo-500 animate-spin-slow" />
          )}
          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
            {direction === 1 ? 'Horário' : 'Anti-horário'}
          </span>
        </div>
      </div>
    </div>
  );
};
