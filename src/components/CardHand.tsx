'use client';

import React from 'react';
import { Card } from '../data/cards';
import { CardUI } from './CardUI';
import { motion } from 'framer-motion';

interface CardHandProps {
  hand: Card[];
  playableCardIds: string[];
  onPlayCard: (cardId: string) => void;
  isUserTurn: boolean;
}

export const CardHand: React.FC<CardHandProps> = ({
  hand,
  playableCardIds,
  onPlayCard,
  isUserTurn
}) => {
  return (
    <div className="w-full bg-zinc-50/30 dark:bg-zinc-900/10 p-4 border border-zinc-200/40 dark:border-zinc-800/40 rounded-3xl mt-4">
      <div className="flex flex-col gap-2 mb-3 px-2">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
          <span>Sua Mão de Cartas ({hand.length})</span>
          {isUserTurn ? (
            <span className="text-xxs bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full animate-pulse">
              Seu Turno
            </span>
          ) : (
            <span className="text-xxs bg-zinc-100 dark:bg-zinc-800 text-zinc-400 font-semibold px-2 py-0.5 rounded-full">
              Aguarde sua vez
            </span>
          )}
        </h3>
        <p className="text-xxs text-zinc-400 leading-tight">
          {isUserTurn
            ? 'Selecione uma carta destacada com a cor ativa, número igual ou categoria correspondente para jogar.'
            : 'As outras jogadoras estão jogando... Leia os desabafos e participe da roda de conversa.'}
        </p>
      </div>

      {hand.length === 0 ? (
        <div className="h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-2xl flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs">
          Nenhuma carta na mão.
        </div>
      ) : (
        /* Horizontal scroll for hand */
        <div className="flex overflow-x-auto gap-4 pb-4 pt-6 px-2 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800 scroll-smooth items-center justify-start min-h-[220px]">
          {hand.map((card, idx) => {
            const isPlayable = isUserTurn && playableCardIds.includes(card.id);
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  {/* Indicator glow for playable cards */}
                  {isPlayable && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white font-bold text-[9px] uppercase tracking-wider py-0.5 px-2 rounded-full z-20 shadow-sm border border-indigo-200 pointer-events-none animate-pulse">
                      Jogável
                    </span>
                  )}
                  
                  <div
                    className={`${
                      isPlayable 
                        ? 'ring-2 ring-indigo-500/50 rounded-2xl shadow-indigo-500/10' 
                        : 'opacity-50 ring-0 filter grayscale-[20%]'
                    }`}
                  >
                    <CardUI
                      card={card}
                      onClick={() => onPlayCard(card.id)}
                      isPlayable={isPlayable}
                      size="md"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
