'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '../data/cards';
import { HelpCircle, AlertCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReflectionModalProps {
  card: Card | null;
  interactionMode: 'write' | 'select';
  setInteractionMode: (mode: 'write' | 'select') => void;
  onSubmit: (answer: string) => void;
  onCancel: () => void; // Passar a vez/Cancelar
}

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  card,
  interactionMode,
  setInteractionMode,
  onSubmit,
  onCancel
}) => {
  const [writtenText, setWrittenText] = useState('');
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);

  // Reset local state when card changes
  useEffect(() => {
    setWrittenText('');
    setSelectedOptionIdx(null);
  }, [card]);

  if (!card) return null;

  const minChars = 15;
  const isWriteValid = writtenText.trim().length >= minChars;
  const isSelectValid = selectedOptionIdx !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interactionMode === 'write' && isWriteValid) {
      onSubmit(writtenText.trim());
    } else if (interactionMode === 'select' && isSelectValid && card.quickOptions) {
      onSubmit(card.quickOptions[selectedOptionIdx!]);
    }
  };

  // Styles based on card color
  const styles: Record<string, {
    primaryText: string;
    border: string;
    bg: string;
    badgeBg: string;
    tagText: string;
  }> = {
    yellow: {
      primaryText: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50/50 dark:bg-amber-950/10',
      badgeBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
      tagText: 'NOMEAR (Autoestima & Cansaço)'
    },
    red: {
      primaryText: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      bg: 'bg-rose-50/50 dark:bg-rose-950/10',
      badgeBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300',
      tagText: 'REDE (Cuidado Compartilhado)'
    },
    blue: {
      primaryText: 'text-sky-800 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800',
      bg: 'bg-sky-50/50 dark:bg-sky-950/10',
      badgeBg: 'bg-sky-100 dark:bg-sky-900/30 text-sky-800 dark:text-sky-300',
      tagText: 'CULPA (Sobrecarga & Cobrança)'
    }
  };

  const style = styles[card.color] || styles.yellow;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header Card Info */}
        <div className={`p-6 border-b border-zinc-100 dark:border-zinc-800 ${style.bg} relative`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${style.badgeBg}`}>
              {style.tagText}
            </span>
            <span className="text-xs font-semibold text-zinc-400">Carta #{card.number}</span>
          </div>

          <h3 className="text-base md:text-lg font-bold font-serif text-zinc-900 dark:text-zinc-50 leading-snug">
            {card.question}
          </h3>

          <div className="flex items-start gap-1.5 mt-3 text-xxs text-zinc-400 dark:text-zinc-500 max-w-md">
            <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 text-indigo-500" />
            <span className="leading-normal font-sans italic">
              <strong>Objetivo Clínico:</strong> {card.objective}
            </span>
          </div>
        </div>

        {/* Interaction Mode Selection */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-500">
          <button
            type="button"
            onClick={() => setInteractionMode('write')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              interactionMode === 'write'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/10'
                : 'border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            ✏️ Modo Expressão (Escrita Livre)
          </button>
          <button
            type="button"
            onClick={() => setInteractionMode('select')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              interactionMode === 'select'
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/10'
                : 'border-transparent hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            🔘 Modo Rápido (Múltipla Escolha)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          
          {interactionMode === 'write' ? (
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Seu Desabafo / Resposta:
              </label>
              <textarea
                value={writtenText}
                onChange={(e) => setWrittenText(e.target.value)}
                placeholder="Escreva como você se sente em relação a esta pergunta... Não existe julgamentos aqui."
                className="w-full h-32 p-3 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none leading-relaxed font-sans"
              />
              
              <div className="flex items-center justify-between text-xxs text-zinc-400">
                <span>Escreva pelo menos {minChars} caracteres para liberar a jogada.</span>
                <span className={isWriteValid ? 'text-emerald-500 font-bold' : 'text-zinc-400'}>
                  {writtenText.trim().length} / {minChars}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                Selecione a opção que mais se aproxima da sua realidade:
              </label>
              
              {card.quickOptions?.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedOptionIdx(idx)}
                  className={`w-full p-4 rounded-xl border-2 text-left text-xs md:text-sm font-medium transition-all leading-relaxed ${
                    selectedOptionIdx === idx
                      ? 'border-indigo-500 bg-indigo-50/20 text-indigo-900 dark:text-indigo-200'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 text-[10px] font-bold mt-0.5 ${
                      selectedOptionIdx === idx
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-zinc-300 dark:border-zinc-700 text-zinc-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Lembrete / Clinical Acolhimento box */}
          <div className="p-4 rounded-2xl bg-indigo-50/30 dark:bg-zinc-800/60 border border-indigo-100/50 dark:border-zinc-800 text-xxs text-indigo-900/70 dark:text-indigo-300/80 flex items-start gap-2.5 mt-auto">
            <Heart className="w-4 h-4 text-indigo-500 flex-shrink-0 fill-current mt-0.5" />
            <div className="leading-relaxed">
              <strong>Lembrete de Acolhimento:</strong> Não existe resposta certa ou errada neste jogo.
              Esta rodada é um espaço seguro de escuta ativa e universalidade — outras jogadoras virtuais
              no grupo também compartilham os mesmos desafios de carga mental.
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 px-4 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition text-xs font-bold order-2 sm:order-1 flex items-center justify-center gap-1.5"
            >
              🚫 Não quero responder (Passar Vez +1)
            </button>
            <button
              type="submit"
              disabled={interactionMode === 'write' ? !isWriteValid : !isSelectValid}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs order-1 sm:order-2 transition shadow-md ${
                (interactionMode === 'write' ? isWriteValid : isSelectValid)
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/25 cursor-pointer'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
              }`}
            >
              ✨ Confirmar Jogada & Desabafar
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};
