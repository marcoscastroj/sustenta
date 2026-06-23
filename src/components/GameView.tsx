'use client';

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BotAvatar } from './BotAvatar';
import { DiscardPile } from './DiscardPile';
import { CardHand } from './CardHand';
import { ReflectionModal } from './ReflectionModal';
import { HistoryPanel } from './HistoryPanel';
import { CardColor } from '../data/cards';
import { BookOpen, RefreshCw, Volume2, HelpCircle, Trophy, Sparkles, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const selfCareQuotes = [
  "Cuidar de si mesma não é egoísmo, é sobrevivência e preservação.",
  "Você não precisa dar conta de tudo sozinha. Pedir ajuda é um ato de extrema coragem e maturidade.",
  "Dizer não para os outros, muitas vezes, é dizer um sim vital para a sua própria saúde mental.",
  "Sua produtividade diária não define o seu valor humano. Você tem o direito de descansar sem carregar culpa.",
  "Acolha seus limites tanto quanto suas conquistas. Você é um ser humano real, não uma máquina."
];

export const GameView: React.FC = () => {
  const {
    players,
    discardPile,
    currentPlayerId,
    activeColor,
    activeNumber,
    activeAction,
    direction,
    gameStatus,
    interactionMode,
    selectedCard,
    reflectionsHistory,
    botSpeech,
    reactions,
    sustentaClicked,
    winner,
    gameLogs,
    botTimer,
    skipBotReaction,
    setInteractionMode,
    startGame,
    playCard,
    submitReflection,
    passTurn,
    userDrawCard,
    chooseColor,
    toggleSustenta,
    resetGame
  } = useGame();

  const [showTutorial, setShowTutorial] = useState(false);
  const [randomQuote] = useState(() => selfCareQuotes[Math.floor(Math.random() * selfCareQuotes.length)]);

  const user = players.find(p => p.id === 'user');
  const bots = players.filter(p => p.isBot);
  const topCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

  // Filter playable card IDs from user hand
  const getPlayableCardIds = () => {
    if (!user || currentPlayerId !== 'user') return [];
    return user.hand.filter(card => {
      // Purple action card is always playable
      if (card.color === 'purple') return true;
      if (!topCard) return true;
      
      // Top card is Purple wild card
      if (topCard.color === 'purple') {
        return card.color === activeColor;
      }
      
      // Matches active state
      return (
        card.color === activeColor ||
        (card.number !== undefined && card.number === activeNumber) ||
        (card.category !== undefined && card.category === topCard.category)
      );
    }).map(c => c.id);
  };

  // Find bot profile data
  const getBotSpeechText = (botId: string) => {
    return botSpeech && botSpeech.botId === botId ? botSpeech.text : null;
  };

  const getBotReactionEmoji = (botId: string) => {
    const reaction = reactions.find(r => r.botId === botId);
    return reaction ? reaction.emoji : null;
  };

  // ----------------------------------------------------
  // GAME OVER / END SCREEN VIEW
  // ----------------------------------------------------
  if (gameStatus === 'ended' && winner) {
    const winnerName = players.find(p => p.id === winner)?.name || '';
    const userReflections = reflectionsHistory.filter(r => r.author === 'Você');

    return (
      <div className="min-h-screen bg-[#fcf9f5] dark:bg-[#121110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col items-center gap-6"
        >
          {/* Winner details header */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center text-4xl shadow-inner animate-pulse">
              {winner === 'user' ? '🏆' : '🌸'}
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-zinc-900 dark:text-zinc-50 mt-2">
              {winner === 'user' ? 'Você zerou suas cartas!' : `${winnerName} zerou as cartas!`}
            </h2>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-semibold">
              Partida Finalizada
            </span>
          </div>

          {/* Self-Care Message Box */}
          <div className="w-full p-5 rounded-2xl bg-[#fffaf0] dark:bg-amber-950/10 border border-[#fef08a] dark:border-amber-900 text-center relative overflow-hidden">
            <span className="absolute -top-2 -left-2 text-4xl opacity-10 pointer-events-none select-none">🌱</span>
            <span className="text-xs uppercase font-extrabold text-amber-700 dark:text-amber-400 tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4" /> Mensagem de Autocuidado
            </span>
            <p className="mt-2 text-sm text-[#451a03] dark:text-amber-100/90 font-serif leading-relaxed italic max-w-lg mx-auto">
              "{randomQuote}"
            </p>
          </div>

          {/* Reflections History log created during match */}
          <div className="w-full flex flex-col gap-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <FileText className="w-4 h-4 text-indigo-500" /> Seu Diário de Desabafos ({userReflections.length})
            </h3>
            
            <div className="max-h-60 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 p-4 flex flex-col gap-4 scrollbar-thin">
              {userReflections.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">
                  Você passou a vez em todas as rodadas e não registrou reflexões nesta partida. Tudo bem, respeitar seu tempo também é autocuidado.
                </p>
              ) : (
                userReflections.map((ref, idx) => (
                  <div key={idx} className="border-b border-zinc-200/50 dark:border-zinc-800/40 pb-3 last:border-b-0">
                    <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                      Categoria {ref.category}
                    </span>
                    <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 italic mt-0.5">
                      "{ref.question}"
                    </p>
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 font-serif border-l-2 border-indigo-400 pl-2 mt-1.5">
                      "{ref.answer}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={resetGame}
            className="w-full sm:w-auto py-3.5 px-8 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30 transition text-sm cursor-pointer"
          >
            Jogar Novamente
          </button>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // INITIAL LANDING / SETUP SCREEN VIEW
  // ----------------------------------------------------
  if (gameStatus === 'setup') {
    return (
      <div className="min-h-screen bg-[#fcf9f5] dark:bg-[#121110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6"
        >
          {/* Logo & Welcome Header */}
          <div className="text-center flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-4xl shadow-inner border border-indigo-100 dark:border-indigo-900">
              🌱
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-serif text-indigo-950 dark:text-zinc-50 tracking-wide mt-2">
              SUSTENTA
            </h1>
            <p className="text-xs text-zinc-400 uppercase tracking-widest font-semibold">
              Roda de Conversa & Reflexão
            </p>
          </div>

          {/* Intro Body Description */}
          <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-3 text-center leading-relaxed">
            <p>
              Seja bem-vinda ao <strong>Sustenta</strong>, um jogo digital individual adaptado para simular o acolhimento de uma roda de conversa terapêutica.
            </p>
            <p>
              Você jogará contra três oponentes virtuais (Mariana, Juliana e Dona Sônia), cujos desabafos representam perfis reais de sobrecarga mental e cuidado feminino.
            </p>
          </div>

          {/* Quick instructions list */}
          <div className="border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex gap-2">
              <span>🃏</span>
              <p>
                <strong>Regras Estilo Uno:</strong> Combine a cor da carta, o número ou jogue cartas roxas de ação (inverter, pular, compre +2).
              </p>
            </div>
            <div className="flex gap-2">
              <span>✏️</span>
              <p>
                <strong>Reflexão e Acolhimento:</strong> Ao jogar cartas de reflexão (vermelha, azul, amarela), desabafe escrevendo livremente ou escolhendo opções rápidas.
              </p>
            </div>
            <div className="flex gap-2">
              <span>❤️</span>
              <p>
                <strong>Respeite seus limites:</strong> Não quer responder? Clique em "Passar a vez" para comprar uma carta e avançar sem gatilhos.
              </p>
            </div>
            <div className="flex gap-2">
              <span>🔔</span>
              <p>
                <strong>Sustenta!</strong> Quando tiver apenas 2 cartas e for jogar uma delas, clique no botão "SUSTENTA!" para não sofrer penalidades de compra.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setShowTutorial(true)}
              className="flex-1 py-3 px-4 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-2xl text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              📖 Manual Completo
            </button>
            
            <button
              onClick={startGame}
              className="flex-1 py-3 px-4 bg-indigo-600 text-white font-bold rounded-2xl text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              🚀 Iniciar Partida
            </button>
          </div>
        </motion.div>

        {/* Complete Tutorial Manual Modal */}
        <AnimatePresence>
          {showTutorial && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin"
              >
                <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h2 className="font-serif font-bold text-lg text-indigo-950 dark:text-zinc-50">
                    Manual do Jogo
                  </h2>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                  <div>
                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wider mb-1">
                      1. As Jogadoras Virtuais
                    </h3>
                    <p>
                      Para gerar identificação e acolhimento, o jogo conta com três perfis:
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Mariana (34 anos):</strong> Mãe solo sob tripla jornada. Representa as cartas amarelas de <em>"Nomear"</em>.</li>
                      <li><strong>Juliana (42 anos):</strong> Sanduíche familiar (cuida de pais e filhos). Representa as cartas vermelhas de <em>"Rede de Apoio"</em>.</li>
                      <li><strong>Dona Sônia (61 anos):</strong> Centraliza todas as tarefas domésticas. Representa as cartas azuis de <em>"Culpa"</em>.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wider mb-1">
                      2. A Mecânica das Rodadas
                    </h3>
                    <p>
                      Nas rodadas de jogo:
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Quando for a sua vez, clique nas cartas válidas de sua mão.</li>
                      <li>Ao jogar cartas de reflexão (Amarelo, Azul ou Vermelho), você deverá responder à pergunta associada.</li>
                      <li>Você pode escolher responder livremente escrevendo no <strong>Modo Expressão</strong> ou escolher respostas rápidas no <strong>Modo Rápido</strong>.</li>
                      <li>Se a pergunta gerar gatilhos ou desconforto, clique em <strong>Não Quero Responder (Passar a vez)</strong>. Você comprará uma carta como penalidade e passará a vez de forma segura.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-indigo-600 dark:text-indigo-400 text-xs uppercase tracking-wider mb-1">
                      3. Efeitos de Ação (Cartas Roxas)
                    </h3>
                    <p>
                      As cartas Roxas servem para manipular o fluxo de jogo:
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><strong>Bloqueio:</strong> Pula o turno do próximo jogador.</li>
                      <li><strong>Inverter:</strong> Altera o sentido do fluxo das jogadas (Horário ⇄ Anti-horário).</li>
                      <li><strong>Compre +2:</strong> Obriga o próximo jogador a comprar duas cartas e perder o turno.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs transition cursor-pointer"
                  >
                    Entendido, Voltar
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN GAME BOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#fcf9f5] dark:bg-[#121110] text-zinc-800 dark:text-zinc-200 font-sans flex flex-col pb-6 relative">
      
      {/* Top Header Control Bar */}
      <header className="bg-white/80 dark:bg-zinc-900/80 border-b border-zinc-200/50 dark:border-zinc-800/50 backdrop-blur-md sticky top-0 z-40 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌱</span>
          <div>
            <h1 className="font-serif font-extrabold text-sm md:text-base text-indigo-950 dark:text-zinc-50 leading-none">
              SUSTENTA
            </h1>
            <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5 block">
              Roda de Acolhimento
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Interaction Mode Quick Toggle */}
          <div className="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 text-xxs font-bold">
            <button
              onClick={() => setInteractionMode('write')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                interactionMode === 'write'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              ✏️ Escrita
            </button>
            <button
              onClick={() => setInteractionMode('select')}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                interactionMode === 'select'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              🔘 Múltipla
            </button>
          </div>

          <button
            onClick={() => setShowTutorial(true)}
            className="p-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer"
            title="Ajuda / Tutorial"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={resetGame}
            className="p-2 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Reiniciar Jogo"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        </div>
      </header>

      {/* Main Core Section */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto h-auto min-h-0">
        
        {/* Game Area (Left/Main section) */}
        <div className="flex-1 flex flex-col gap-6 justify-between min-w-0">
          
          {/* Bots Positioning Table area */}
          <div className="grid grid-cols-3 items-center justify-center gap-2 bg-white/40 dark:bg-zinc-900/10 p-4 border border-zinc-200/40 dark:border-zinc-800/40 rounded-3xl">
            {/* Bot 1: Mariana (Left) */}
            <div className="flex justify-center">
              <BotAvatar
                player={bots.find(b => b.id === 'mariana')!}
                isActive={currentPlayerId === 'mariana'}
                speechText={getBotSpeechText('mariana')}
                reactionEmoji={getBotReactionEmoji('mariana')}
              />
            </div>

            {/* Bot 3: Dona Sônia (Top Center) */}
            <div className="flex justify-center">
              <BotAvatar
                player={bots.find(b => b.id === 'sonia')!}
                isActive={currentPlayerId === 'sonia'}
                speechText={getBotSpeechText('sonia')}
                reactionEmoji={getBotReactionEmoji('sonia')}
              />
            </div>

            {/* Bot 2: Juliana (Right) */}
            <div className="flex justify-center">
              <BotAvatar
                player={bots.find(b => b.id === 'juliana')!}
                isActive={currentPlayerId === 'juliana'}
                speechText={getBotSpeechText('juliana')}
                reactionEmoji={getBotReactionEmoji('juliana')}
              />
            </div>
          </div>

          {/* Central Discard and Draw Pile Board */}
          <DiscardPile
            topCard={topCard}
            activeColor={activeColor}
            activeNumber={activeNumber}
            activeAction={activeAction}
            direction={direction}
            deckCount={players.reduce((sum, p) => sum - p.hand.length, 36) - discardPile.length} // estimated
            onDrawCard={userDrawCard}
            isUserTurn={currentPlayerId === 'user' && gameStatus === 'playing'}
          />

          {/* Bottom Control Bar and Hand Cards */}
          <div className="flex flex-col gap-3">
            
            {/* User Info & Sustenta declaration section */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xl shadow-inner border border-indigo-200 dark:border-indigo-800">
                  🌸
                </div>
                <div>
                  <h4 className="font-bold text-xs">Você (Jogadora)</h4>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider block mt-0.5">
                    {currentPlayerId === 'user' ? '👉 Seu Turno' : '⏱️ Aguardando Jogadoras'}
                  </span>
                </div>
              </div>

              {/* Action Buttons for User */}
              <div className="flex items-center gap-2">
                {/* Bot Timer Banner */}
                {gameStatus === 'bot_reacting' && botTimer !== null && (
                  <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/60 px-3 py-1.5 rounded-xl shadow-sm mr-2 animate-fade-in">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xxs font-medium text-indigo-900 dark:text-indigo-200">
                      {players.find(p => p.id === currentPlayerId)?.name} desabafando... <strong>{botTimer}s</strong>
                    </span>
                    <button
                      onClick={skipBotReaction}
                      className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] rounded-lg transition cursor-pointer flex items-center gap-1 shadow-sm uppercase tracking-wider"
                    >
                      Avançar Roda ➔
                    </button>
                  </div>
                )}

                {/* Draw check helper button */}
                {currentPlayerId === 'user' && gameStatus === 'playing' && (
                  <button
                    onClick={passTurn}
                    className="py-2.5 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xxs font-bold transition cursor-pointer"
                  >
                    Passar a Vez
                  </button>
                )}

                {/* Flashing Sustenta button if hand size is small (warning helper) */}
                <div className="relative flex flex-col items-center">
                  <button
                    disabled={!user || user.hand.length !== 2}
                    onClick={toggleSustenta}
                    className={`py-2.5 px-5 rounded-xl font-extrabold text-xxs tracking-wider uppercase transition shadow-md ${
                      user && user.hand.length === 2
                        ? sustentaClicked
                          ? 'bg-emerald-600 text-white border-2 border-emerald-400 dark:border-emerald-700 hover:bg-emerald-700 shadow-emerald-600/20 cursor-pointer'
                          : 'bg-amber-400 text-amber-950 border-3 border-rose-500 dark:border-rose-400 hover:bg-amber-500 animate-pulse shadow-amber-400/30 cursor-pointer font-black'
                        : 'bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-600 cursor-not-allowed opacity-50 shadow-none'
                    }`}
                    title={user && user.hand.length === 2 ? 'Declare SUSTENTA antes de jogar sua penúltima carta!' : 'Disponível apenas quando você tiver exatamente 2 cartas'}
                  >
                    🔔 SUSTENTA!
                  </button>
                  {user && user.hand.length === 2 && !sustentaClicked && (
                    <span className="absolute bottom-full mb-1.5 text-[8.5px] font-bold text-rose-500 animate-bounce uppercase tracking-wider bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-900 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-30">
                      Declare agora!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Hand Cards list */}
            {user && (
              <CardHand
                hand={user.hand}
                playableCardIds={getPlayableCardIds()}
                onPlayCard={playCard}
                isUserTurn={currentPlayerId === 'user' && gameStatus === 'playing'}
              />
            )}
          </div>
        </div>

        {/* Sidebar Log area (Right section) */}
        <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 lg:max-h-[85vh]">
          {/* Conversation history logs panel */}
          <div className="flex-1 min-h-[350px] lg:min-h-0">
            <HistoryPanel logs={reflectionsHistory} />
          </div>

          {/* Quick running game logs console */}
          <div className="bg-zinc-950 text-zinc-400 dark:bg-black font-mono text-[10px] p-4 rounded-3xl border border-zinc-800 flex flex-col gap-2 h-44 shadow-md">
            <span className="font-bold text-zinc-500 uppercase tracking-widest text-[9px] border-b border-zinc-800 pb-1.5">
              🎮 Painel de Transmissão
            </span>
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
              {gameLogs.map((log, index) => (
                <div key={index} className="leading-relaxed border-l-2 border-zinc-800 pl-1.5">
                  <span className="text-zinc-600">[{index === 0 ? 'NOVO' : 'LOG'}]</span> {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reflection dialog interaction overlay (Modal) */}
      <AnimatePresence>
        {gameStatus === 'reflecting' && selectedCard && (
          <ReflectionModal
            card={selectedCard}
            interactionMode={interactionMode}
            setInteractionMode={setInteractionMode}
            onSubmit={submitReflection}
            onCancel={passTurn}
          />
        )}
      </AnimatePresence>

      {/* Color Choice popup overlay (when playing Purple action card) */}
      <AnimatePresence>
        {gameStatus === 'color_choice' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center space-y-4"
            >
              <h3 className="font-bold font-serif text-lg text-zinc-900 dark:text-zinc-50">
                Escolha a próxima Cor
              </h3>
              <p className="text-xs text-zinc-500 leading-normal">
                Você jogou uma carta de ação! Escolha qual categoria a próxima jogadora precisará responder.
              </p>

              <div className="grid grid-cols-1 gap-2.5 pt-2">
                <button
                  onClick={() => chooseColor('yellow')}
                  className="py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-500/10 hover:shadow-amber-500/25 transition cursor-pointer uppercase tracking-wider"
                >
                  🟡 Nomear (Amarelo)
                </button>
                <button
                  onClick={() => chooseColor('red')}
                  className="py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-500/10 hover:shadow-rose-500/25 transition cursor-pointer uppercase tracking-wider"
                >
                  🔴 Rede (Rosa)
                </button>
                <button
                  onClick={() => chooseColor('blue')}
                  className="py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/10 hover:shadow-sky-500/25 transition cursor-pointer uppercase tracking-wider"
                >
                  🔵 Culpa (Azul)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
