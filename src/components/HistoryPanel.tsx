'use client';

import React from 'react';
import { ReflectionLog } from '../context/GameContext';
import { CardColor } from '../data/cards';
import { HelpCircle, Heart } from 'lucide-react';

interface HistoryPanelProps {
  logs: ReflectionLog[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ logs }) => {
  
  const categoryBg: Record<CardColor, string> = {
    red: 'bg-rose-100/50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    blue: 'bg-sky-100/50 dark:bg-sky-950/20 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    yellow: 'bg-amber-100/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    purple: 'bg-purple-100/50 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  };

  const getAuthorAvatar = (author: string): string => {
    if (author === 'Você') return '🌸';
    if (author === 'Mariana') return '👩‍👦';
    if (author === 'Juliana') return '👩‍👧‍👦';
    return '👵'; // Sônia
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/20">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span>💬 Roda de Conversa ({logs.length})</span>
        </h3>
        <p className="text-xxs text-zinc-400 mt-1 leading-normal">
          Diálogo ativo do grupo. Aqui ficam registradas todas as vivências e sentimentos compartilhados durante a partida.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        {logs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <span className="text-3xl mb-2 opacity-50">🍃</span>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[200px] leading-relaxed">
              O diálogo ainda não começou. Jogue cartas para expressar seus desabafos e ouvir as outras jogadoras.
            </p>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex gap-3 items-start border-b border-zinc-100/50 dark:border-zinc-800/30 pb-4 last:border-b-0">
              {/* Avatar Icon */}
              <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl shadow-sm border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0">
                {getAuthorAvatar(log.author)}
              </div>

              {/* Speech bubble & Question card */}
              <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    {log.author}
                  </span>
                  {log.age && (
                    <span className="text-[10px] text-zinc-400 font-normal">
                      ({log.age} anos)
                    </span>
                  )}
                  
                  {/* Category Tag */}
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${categoryBg[log.color]}`}>
                    {log.category}
                  </span>
                </div>

                {/* The reflection question triggered */}
                <div className="flex items-start gap-1 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xxs text-zinc-500 dark:text-zinc-400 italic">
                  <HelpCircle className="w-3 h-3 text-indigo-500/70 mt-0.5 flex-shrink-0" />
                  <span className="leading-tight">
                    "{log.question}"
                  </span>
                </div>

                {/* Response */}
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed mt-0.5 border-l-2 border-indigo-400 pl-2 bg-indigo-50/5 dark:bg-indigo-950/5 py-0.5 rounded-r">
                  "{log.answer}"
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
