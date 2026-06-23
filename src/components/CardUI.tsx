'use client';

import React from 'react';
import { Card, CardColor } from '../data/cards';
import { Ban, ArrowLeftRight, HelpCircle, Heart } from 'lucide-react';

interface CardUIProps {
  card: Card;
  onClick?: () => void;
  isPlayable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showBack?: boolean;
}

export const CardUI: React.FC<CardUIProps> = ({
  card,
  onClick,
  isPlayable = true,
  size = 'md',
  showBack = false
}) => {
  const isAction = card.type === 'action';
  
  // Style Mapping based on Color
  const themeStyles: Record<CardColor, {
    bg: string;
    border: string;
    text: string;
    accentBg: string;
    accentText: string;
    waves: string;
    darkText: string;
    categoryText: string;
  }> = {
    yellow: {
      bg: 'bg-[#fefdf0] dark:bg-[#1c1a0e]',
      border: 'border-[#fef08a] dark:border-amber-900',
      text: 'text-[#854d0e] dark:text-amber-200',
      accentBg: 'bg-[#fef9c3] dark:bg-amber-950/40',
      accentText: 'text-[#ca8a04] dark:text-amber-400',
      waves: 'bg-[#fef9c3] dark:bg-amber-900/30',
      darkText: 'text-[#451a03] dark:text-amber-50',
      categoryText: 'NOMEAR'
    },
    red: {
      bg: 'bg-[#fffbfb] dark:bg-[#1d0e11]',
      border: 'border-[#fecdd3] dark:border-rose-900',
      text: 'text-[#9f1239] dark:text-rose-200',
      accentBg: 'bg-[#ffe4e6] dark:bg-rose-950/40',
      accentText: 'text-[#e11d48] dark:text-rose-400',
      waves: 'bg-[#ffe4e6] dark:bg-rose-900/30',
      darkText: 'text-[#4c0519] dark:text-rose-50',
      categoryText: 'REDE'
    },
    blue: {
      bg: 'bg-[#fbfdff] dark:bg-[#0e161d]',
      border: 'border-[#bae6fd] dark:border-sky-900',
      text: 'text-[#075985] dark:text-sky-200',
      accentBg: 'bg-[#e0f2fe] dark:bg-sky-950/40',
      accentText: 'text-[#0284c7] dark:text-sky-400',
      waves: 'bg-[#e0f2fe] dark:bg-sky-900/30',
      darkText: 'text-[#0c4a6e] dark:text-sky-50',
      categoryText: 'CULPA'
    },
    purple: {
      bg: 'bg-[#fdfbfe] dark:bg-[#170e1d]',
      border: 'border-[#edd9ff] dark:border-purple-900',
      text: 'text-[#6b21a8] dark:text-purple-200',
      accentBg: 'bg-[#fae8ff] dark:bg-purple-950/40',
      accentText: 'text-[#c084fc] dark:text-purple-400',
      waves: 'bg-[#fae8ff] dark:bg-purple-900/30',
      darkText: 'text-[#4a044e] dark:text-purple-50',
      categoryText: 'AÇÃO'
    }
  };

  const style = themeStyles[card.color];

  // Action Icon Selector
  const getActionIcon = () => {
    switch (card.action) {
      case 'skip':
        return <Ban className="w-8 h-8 md:w-10 md:h-10" />;
      case 'reverse':
        return <ArrowLeftRight className="w-8 h-8 md:w-10 md:h-10" />;
      case 'draw2':
        return <span className="font-extrabold text-2xl md:text-3xl font-sans">+2</span>;
      default:
        return <HelpCircle className="w-8 h-8 md:w-10 md:h-10" />;
    }
  };

  const sizeClasses = {
    sm: 'w-24 h-36 text-xxs p-1',
    md: 'w-48 h-72 text-xs p-3',
    lg: 'w-64 h-96 text-sm p-4'
  };

  // ----------------------------------------------------
  // CARD BACK DESIGN
  // ----------------------------------------------------
  if (showBack) {
    return (
      <div
        className={`relative ${sizeClasses[size]} rounded-2xl border-4 ${style.border} ${style.bg} shadow-md overflow-hidden flex flex-col justify-between`}
      >
        {/* Soft Background Wave Patterns */}
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 ${style.waves} opacity-75`} />
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-8 -mb-8 ${style.waves} opacity-75`} />

        {/* Central Logo */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 relative z-10">
          <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 border-2 border-dashed border-indigo-400 flex items-center justify-center shadow-inner mb-2">
            <span className="text-2xl">🌱</span>
          </div>
          <h2 className="text-lg font-bold font-serif tracking-wider text-indigo-900 dark:text-indigo-200">
            SUSTENTA
          </h2>
          <p className="text-xxs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
            Jogo de Reflexão
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CARD FRONT DESIGN (Standard)
  // ----------------------------------------------------
  return (
    <button
      disabled={!isPlayable || !onClick}
      onClick={onClick}
      className={`relative ${sizeClasses[size]} rounded-2xl border-2 ${style.border} ${style.bg} text-left flex flex-col justify-between shadow-lg transition-all duration-300 select-none group text-zinc-800 dark:text-zinc-200 overflow-hidden ${
        isPlayable && onClick
          ? 'hover:-translate-y-4 hover:shadow-xl cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-700'
          : 'opacity-90'
      }`}
    >
      {/* Wave Corner Graphics */}
      <div className={`absolute top-0 left-0 w-16 h-16 rounded-br-full ${style.waves} opacity-80 z-0`} />
      <div className={`absolute bottom-0 right-0 w-16 h-16 rounded-tl-full ${style.waves} opacity-80 z-0`} />

      {/* Decorative Dots */}
      <div className="absolute top-4 right-4 flex gap-1 z-0">
        <div className={`w-1 h-1 rounded-full ${style.accentBg}`} />
        <div className={`w-1.5 h-1.5 rounded-full ${style.accentBg}`} />
      </div>

      {/* Leaf outline (Bottom left decorative branch) */}
      {!isAction && size !== 'sm' && (
        <div className={`absolute bottom-2 left-2 pointer-events-none opacity-20 ${style.text}`}>
          <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 1.62-.48 3.13-1.3 4.39z" />
          </svg>
        </div>
      )}

      {/* Top Left Number / Action Icon */}
      <div className="flex flex-col items-center justify-start p-2 md:p-3 z-10 leading-none">
        {isAction ? (
          <div className={`${style.text}`}>{getActionIcon()}</div>
        ) : (
          <>
            <span className="font-serif font-black text-2xl md:text-3xl leading-none">{card.number}</span>
            <Heart className="w-3.5 h-3.5 fill-current mt-0.5" />
          </>
        )}
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-2 text-center z-10 relative">
        {isAction ? (
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full ${style.accentBg} ${style.text} shadow-sm border ${style.border} mb-3 group-hover:scale-110 transition-transform duration-300`}>
              {getActionIcon()}
            </div>
            <span className="font-extrabold uppercase tracking-wider text-sm">
              {card.action === 'skip' ? 'Bloqueio' : card.action === 'reverse' ? 'Inverter' : 'Compre +2'}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Category Header */}
            <span className={`text-[9px] md:text-[10px] font-bold tracking-widest ${style.text} uppercase mb-0.5 select-none relative`}>
              {style.categoryText}
              <div className={`h-[1.5px] w-6 ${style.accentBg} mx-auto mt-0.5 rounded`} />
            </span>

            {/* Conversation Speech Bubble Icon (Only on large cards to preserve space) */}
            {size === 'lg' && (
              <div className={`mt-2 mb-2 p-1.5 rounded-full ${style.accentBg} ${style.accentText}`}>
                <span className="text-sm">💬</span>
              </div>
            )}

            {/* The Question */}
            <p className={`font-serif leading-relaxed ${style.darkText} font-medium px-1 text-center ${
              size === 'sm' 
                ? 'text-[8px] leading-tight line-clamp-4' 
                : size === 'md' 
                ? 'text-[10.5px] leading-relaxed mt-2' 
                : 'text-sm mt-3'
            }`}>
              {card.question}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Right Number / Action Icon */}
      <div className="flex justify-end p-2 md:p-3 z-10">
        <div className="flex flex-col items-center leading-none">
          {isAction ? (
            <div className={`scale-x-[-1] ${style.text}`}>{getActionIcon()}</div>
          ) : (
            <>
              <Heart className="w-3.5 h-3.5 fill-current mb-0.5" />
              <span className="font-serif font-black text-2xl md:text-3xl leading-none">{card.number}</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
};
