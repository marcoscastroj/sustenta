'use client';

import React from 'react';
import { Player } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

interface BotAvatarProps {
  player: Player;
  isActive: boolean;
  speechText: string | null;
  reactionEmoji: string | null;
}

export const BotAvatar: React.FC<BotAvatarProps> = ({
  player,
  isActive,
  speechText,
  reactionEmoji
}) => {
  return (
    <div className="relative flex flex-col items-center p-3 select-none">
      {/* Turn Indicator Ring */}
      <div className="relative">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md border-3 transition-all duration-300 ${
            isActive
              ? 'border-indigo-500 shadow-indigo-500/30 scale-105 animate-pulse bg-white dark:bg-zinc-800'
              : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900'
          }`}
        >
          {player.avatar}

          {/* Card Count Badge */}
          <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-white font-bold text-xs rounded-full h-6 w-6 flex items-center justify-center border-2 border-white dark:border-zinc-950 shadow-sm animate-bounce">
            {player.hand.length}
          </span>
        </div>

        {/* Reaction Emoji (Float Animation) */}
        <AnimatePresence>
          {reactionEmoji && (
            <motion.div
              initial={{ scale: 0, y: 10, opacity: 0 }}
              animate={{ scale: 1.5, y: -40, opacity: 1 }}
              exit={{ scale: 0.8, y: -60, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none text-4xl drop-shadow"
            >
              {reactionEmoji}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Details */}
      <div className="mt-2 text-center">
        <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm flex items-center justify-center gap-1">
          {player.name}
          <span className="text-xs text-zinc-500 font-normal">({player.age} anos)</span>
        </h4>
        <p className="text-xxs text-zinc-400 max-w-[130px] leading-tight mt-0.5 italic">
          {player.description}
        </p>
      </div>

      {/* Bot Speech Bubble Dialog */}
      <AnimatePresence>
        {speechText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            className="absolute z-30 top-full mt-3 w-64 p-4 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs text-left"
          >
            <div className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {player.name} desabafa:
            </div>
            <p className="leading-relaxed font-medium font-serif italic">"{speechText}"</p>
            {/* Speech Bubble Arrow (Pointing Up) */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-b-white dark:border-b-zinc-800 drop-shadow-[0_-4px_3px_rgba(0,0,0,0.07)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
