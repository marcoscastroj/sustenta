'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Card, CardColor, cardsData } from '../data/cards';
import { BotProfile, botsData, botResponses } from '../data/bots';
import confetti from 'canvas-confetti';

export type GameStatus = 'setup' | 'playing' | 'reflecting' | 'bot_reacting' | 'color_choice' | 'ended';

export interface ReflectionLog {
  cardId: string;
  question: string;
  color: CardColor;
  category: string;
  answer: string;
  author: string; // 'Você' or Bot name
  age?: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  hand: Card[];
  isBot: boolean;
  age?: number;
  description?: string;
  themeColor?: string;
}

interface Reaction {
  botId: string;
  emoji: string;
  message: string;
  id: number;
}

interface GameContextType {
  players: Player[];
  deck: Card[];
  discardPile: Card[];
  currentPlayerId: string;
  activeColor: CardColor;
  activeNumber: number | undefined;
  activeAction: string | undefined;
  direction: 1 | -1;
  gameStatus: GameStatus;
  interactionMode: 'write' | 'select';
  selectedCard: Card | null;
  reflectionsHistory: ReflectionLog[];
  botSpeech: { botId: string; text: string; cardId: string } | null;
  reactions: Reaction[];
  sustentaClicked: boolean;
  winner: string | null;
  gameLogs: string[];
  botTimer: number | null;
  skipBotReaction: () => void;
  setInteractionMode: (mode: 'write' | 'select') => void;
  startGame: () => void;
  playCard: (cardId: string) => void;
  submitReflection: (answerText: string) => void;
  passTurn: () => void; // Draws a card and passes
  userDrawCard: () => void; // User clicks draw pile
  chooseColor: (color: 'red' | 'blue' | 'yellow') => void;
  toggleSustenta: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Helper to shuffle array
const shuffle = (array: Card[]): Card[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [deck, setDeck] = useState<Card[]>([]);
  const [discardPile, setDiscardPile] = useState<Card[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>('user');
  const [activeColor, setActiveColor] = useState<CardColor>('red');
  const [activeNumber, setActiveNumber] = useState<number | undefined>(undefined);
  const [activeAction, setActiveAction] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [interactionMode, setInteractionMode] = useState<'write' | 'select'>('write');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [reflectionsHistory, setReflectionsHistory] = useState<ReflectionLog[]>([]);
  const [botSpeech, setBotSpeech] = useState<{ botId: string; text: string; cardId: string } | null>(null);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [sustentaClicked, setSustentaClicked] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameLogs, setGameLogs] = useState<string[]>([]);
  const [botTimer, setBotTimer] = useState<number | null>(null);
  
  const botTurnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reactionIdCounter = useRef<number>(0);

  // Initialize Game
  const startGame = () => {
    // 1. Create a double deck of reflection cards to ensure we have enough, plus action cards
    const reflections = cardsData.filter(c => c.type === 'reflection');
    const actions = cardsData.filter(c => c.type === 'action');
    
    // Duplicate reflections to make the deck larger (30 reflections + 6 actions = 36 cards)
    const fullDeckTemplates = [...reflections, ...reflections, ...actions];
    
    // Add unique identifiers to each card instance in the deck
    const instancedDeck: Card[] = fullDeckTemplates.map((card, index) => ({
      ...card,
      id: `${card.id}_inst_${index}`
    }));
    
    let shuffled = shuffle(instancedDeck);

    // 2. Setup players
    const initialPlayers: Player[] = [
      {
        id: 'user',
        name: 'Você',
        avatar: '🌸',
        hand: [],
        isBot: false
      },
      ...botsData.map(bot => ({
        id: bot.id,
        name: bot.name,
        avatar: bot.avatar,
        hand: [],
        isBot: true,
        age: bot.age,
        description: bot.description,
        themeColor: bot.themeColor
      }))
    ];

    // 3. Deal 5 cards to each player
    for (let i = 0; i < 5; i++) {
      initialPlayers.forEach(player => {
        const card = shuffled.pop();
        if (card) {
          player.hand.push(card);
        }
      });
    }

    // 4. Draw first card for discard pile (must be a reflection card to start with a question)
    let firstCardIndex = shuffled.findIndex(c => c.type === 'reflection');
    if (firstCardIndex === -1) firstCardIndex = 0; // fallback
    const firstCard = shuffled.splice(firstCardIndex, 1)[0];

    // 5. Update State
    setPlayers(initialPlayers);
    setDeck(shuffled);
    setDiscardPile([firstCard]);
    setActiveColor(firstCard.color);
    setActiveNumber(firstCard.number);
    setActiveAction(undefined);
    setCurrentPlayerId('user');
    setDirection(1);
    setGameStatus('playing');
    setSelectedCard(null);
    setReflectionsHistory([]);
    setBotSpeech(null);
    setReactions([]);
    setSustentaClicked(false);
    setWinner(null);
    setBotTimer(null);
    setGameLogs([`O jogo começou! A carta inicial é ${firstCard.color.toUpperCase()} (${firstCard.category}). Pergunta: "${firstCard.question}"`]);
  };

  const resetGame = () => {
    if (botTurnTimeoutRef.current) clearTimeout(botTurnTimeoutRef.current);
    setGameStatus('setup');
    setPlayers([]);
    setDeck([]);
    setDiscardPile([]);
    setSelectedCard(null);
    setWinner(null);
    setBotTimer(null);
  };

  // Helper to add a game log
  const logEvent = (message: string) => {
    setGameLogs(prev => [message, ...prev.slice(0, 49)]);
  };

  // Check if a card is valid to play
  const isValidPlay = (card: Card): boolean => {
    if (discardPile.length === 0) return true;
    const topCard = discardPile[discardPile.length - 1];

    // Purple action cards can be played on any card
    if (card.color === 'purple') return true;

    // If top card is Purple, check if card matches the active color
    if (topCard.color === 'purple') {
      return card.color === activeColor;
    }

    // Regular matching: same color OR same number OR same category
    return (
      card.color === activeColor ||
      (card.number !== undefined && card.number === activeNumber) ||
      (card.category !== undefined && card.category === topCard.category)
    );
  };

  // Player action to try playing a card
  const playCard = (cardId: string) => {
    if (gameStatus !== 'playing' || currentPlayerId !== 'user') return;

    const user = players.find(p => p.id === 'user');
    if (!user) return;

    const cardIndex = user.hand.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const card = user.hand[cardIndex];

    if (!isValidPlay(card)) {
      logEvent('Essa carta não pode ser jogada. Combine a cor, número ou jogue uma carta roxa.');
      return;
    }

    // Handle Sustenta rules
    // User is playing their second-to-last card, meaning they will be left with 1 card
    const leavesOneCard = user.hand.length === 2;
    if (leavesOneCard && !sustentaClicked) {
      logEvent('Você esqueceu de clicar em "SUSTENTA!" e recebeu 2 cartas de penalidade.');
      drawPenaltyCards('user', 2);
      // Even with penalty, let's proceed with playing the card
    }

    if (card.type === 'reflection') {
      // User must reflect before playing enters the discard pile
      setSelectedCard(card);
      setGameStatus('reflecting');
    } else {
      // Action card: play immediately
      executeActionCardPlay('user', card);
    }
  };

  const drawPenaltyCards = (playerId: string, count: number) => {
    let currentDeck = [...deck];
    let currentDiscard = [...discardPile];
    const updatedPlayers = players.map(p => {
      if (p.id === playerId) {
        const drawn: Card[] = [];
        for (let i = 0; i < count; i++) {
          if (currentDeck.length === 0) {
            // Reshuffle discard pile
            if (currentDiscard.length > 1) {
              const top = currentDiscard.pop()!;
              currentDeck = shuffle(currentDiscard);
              currentDiscard = [top];
            } else {
              break; // no cards left at all
            }
          }
          const c = currentDeck.pop();
          if (c) drawn.push(c);
        }
        return { ...p, hand: [...p.hand, ...drawn] };
      }
      return p;
    });

    setDeck(currentDeck);
    setDiscardPile(currentDiscard);
    setPlayers(updatedPlayers);
    logEvent(`${players.find(p => p.id === playerId)?.name} comprou ${count} cartas de penalidade.`);
  };

  // Submit User Reflection
  const submitReflection = (answerText: string) => {
    if (gameStatus !== 'reflecting' || !selectedCard) return;

    const user = players.find(p => p.id === 'user');
    if (!user) return;

    // Log the reflection
    const newLog: ReflectionLog = {
      cardId: selectedCard.id,
      question: selectedCard.question || '',
      color: selectedCard.color,
      category: selectedCard.category || 'Geral',
      answer: answerText,
      author: 'Você'
    };

    setReflectionsHistory(prev => [...prev, newLog]);
    logEvent(`Você desabafou sobre a categoria ${selectedCard.category}: "${answerText.substring(0, 60)}..."`);

    // Place card on discard pile
    const updatedUserHand = user.hand.filter(c => c.id !== selectedCard.id);
    const newDiscardPile = [...discardPile, selectedCard];

    // Update state variables for active matching
    setActiveColor(selectedCard.color);
    setActiveNumber(selectedCard.number);
    setActiveAction(undefined);

    // Update players
    const updatedPlayers = players.map(p => {
      if (p.id === 'user') {
        return { ...p, hand: updatedUserHand };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setDiscardPile(newDiscardPile);
    setSelectedCard(null);
    setSustentaClicked(false); // reset for next turn

    // Check Victory
    if (updatedUserHand.length === 0) {
      handleVictory('user');
      return;
    }

    // Trigger Bot Reactions (Acolhimento)
    triggerBotReactions(answerText);
    setGameStatus('bot_reacting');

    // Wait 3.5s during bot reaction before moving to the next turn
    botTurnTimeoutRef.current = setTimeout(() => {
      setReactions([]); // clear emoji reactions
      advanceTurn(updatedPlayers, newDiscardPile, direction);
    }, 3500);
  };

  // Simulates Bot empathy/reactions
  const triggerBotReactions = (userSpeech: string) => {
    const list = [
      { botId: 'mariana', emoji: '❤️', msg: 'Mariana acolheu seu desabafo.' },
      { botId: 'juliana', emoji: '🤗', msg: 'Juliana se identificou com sua fala.' },
      { botId: 'sonia', emoji: '🌸', msg: 'Dona Sônia enviou energias positivas.' }
    ];

    const currentReactions = list.map(item => {
      reactionIdCounter.current += 1;
      return {
        botId: item.botId,
        emoji: item.emoji,
        message: item.msg,
        id: reactionIdCounter.current
      };
    });

    setReactions(currentReactions);
    logEvent('As outras jogadoras enviaram carinho e acolhimento para o seu desabafo.');
  };

  // Play Action Card (User or Bot)
  const executeActionCardPlay = (playerId: string, card: Card) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    logEvent(`${player.name} jogou uma carta de Ação: ${card.action?.toUpperCase()}`);

    // Remove from hand
    const updatedHand = player.hand.filter(c => c.id !== card.id);
    const newDiscardPile = [...discardPile, card];

    const updatedPlayers = players.map(p => {
      if (p.id === playerId) {
        return { ...p, hand: updatedHand };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    setDiscardPile(newDiscardPile);
    setSustentaClicked(false);

    // Check Victory
    if (updatedHand.length === 0) {
      handleVictory(playerId);
      return;
    }

    // Apply action effects on direction/skip/draw
    let nextDirection = direction;
    let nextPlayers = updatedPlayers;
    let nextDeck = [...deck];
    let nextDiscard = newDiscardPile;

    if (card.action === 'reverse') {
      nextDirection = (direction === 1 ? -1 : 1) as 1 | -1;
      setDirection(nextDirection);
      logEvent('O sentido do jogo foi invertido!');
    }

    // Determine target for Skip or Draw 2
    const currentIdx = updatedPlayers.findIndex(p => p.id === playerId);
    const nextPlayerIdx = getNextPlayerIndex(currentIdx, nextDirection, updatedPlayers.length);
    const targetPlayer = updatedPlayers[nextPlayerIdx];

    let skipNext = false;

    if (card.action === 'skip') {
      skipNext = true;
      logEvent(`${targetPlayer.name} foi bloqueada e perdeu a vez!`);
    } else if (card.action === 'draw2') {
      skipNext = true;
      logEvent(`${targetPlayer.name} comprou +2 cartas e perdeu a vez!`);
      
      // Draw 2 cards for target
      nextPlayers = updatedPlayers.map(p => {
        if (p.id === targetPlayer.id) {
          const drawn: Card[] = [];
          for (let i = 0; i < 2; i++) {
            if (nextDeck.length === 0) {
              if (nextDiscard.length > 1) {
                const top = nextDiscard.pop()!;
                nextDeck = shuffle(nextDiscard);
                nextDiscard = [top];
              } else {
                break;
              }
            }
            const c = nextDeck.pop();
            if (c) drawn.push(c);
          }
          return { ...p, hand: [...p.hand, ...drawn] };
        }
        return p;
      });

      setDeck(nextDeck);
      setDiscardPile(nextDiscard);
      setPlayers(nextPlayers);
    }

    // Update matches
    setActiveColor('purple');
    setActiveNumber(undefined);
    setActiveAction(card.action);

    // Purple actions act as wild/choice card
    if (playerId === 'user') {
      setGameStatus('color_choice'); // open color choice modal for user
    } else {
      // Bot chooses color based on what color it holds most
      const botHand = targetPlayer.id === playerId ? updatedHand : targetPlayer.hand; // use correct hand
      const colorsCount = { red: 0, blue: 0, yellow: 0 };
      player.hand.forEach(c => {
        if (c.color !== 'purple') {
          colorsCount[c.color]++;
        }
      });
      let chosenColor: CardColor = 'red';
      if (colorsCount.blue >= colorsCount.red && colorsCount.blue >= colorsCount.yellow) {
        chosenColor = 'blue';
      } else if (colorsCount.yellow >= colorsCount.red && colorsCount.yellow >= colorsCount.blue) {
        chosenColor = 'yellow';
      }
      
      setActiveColor(chosenColor);
      logEvent(`${player.name} escolheu a cor ${chosenColor.toUpperCase()}`);

      // Advance turn
      advanceTurn(nextPlayers, nextDiscard, nextDirection, skipNext ? 2 : 1);
    }
  };

  // User color choice for Purple actions
  const chooseColor = (color: 'red' | 'blue' | 'yellow') => {
    setActiveColor(color);
    logEvent(`Você escolheu a cor ${color.toUpperCase()}`);
    setGameStatus('playing');

    // Check if the next player was skipped or draw2-ed
    const topCard = discardPile[discardPile.length - 1];
    const wasSkipOrDraw2 = topCard?.action === 'skip' || topCard?.action === 'draw2';
    
    advanceTurn(players, discardPile, direction, wasSkipOrDraw2 ? 2 : 1);
  };

  // Get next player index
  const getNextPlayerIndex = (currentIdx: number, dir: 1 | -1, length: number, steps: number = 1): number => {
    let nextIdx = currentIdx + (dir * steps);
    while (nextIdx < 0) nextIdx += length;
    return nextIdx % length;
  };

  // Advance turn logic
  const advanceTurn = (
    currentPlayers: Player[] = players, 
    currentDiscard: Card[] = discardPile, 
    currentDir: 1 | -1 = direction, 
    steps: number = 1
  ) => {
    const currentIdx = currentPlayers.findIndex(p => p.id === currentPlayerId);
    const nextIdx = getNextPlayerIndex(currentIdx, currentDir, currentPlayers.length, steps);
    const nextPlayer = currentPlayers[nextIdx];

    setCurrentPlayerId(nextPlayer.id);
    setBotSpeech(null);
    setGameStatus('playing');
    logEvent(`Turno de: ${nextPlayer.name}`);
  };

  // Draw card for user
  const userDrawCard = () => {
    if (gameStatus !== 'playing' || currentPlayerId !== 'user') return;

    let currentDeck = [...deck];
    let currentDiscard = [...discardPile];
    
    if (currentDeck.length === 0) {
      if (currentDiscard.length > 1) {
        const top = currentDiscard.pop()!;
        currentDeck = shuffle(currentDiscard);
        currentDiscard = [top];
      } else {
        logEvent('Não há mais cartas para comprar.');
        return;
      }
    }

    const card = currentDeck.pop()!;
    const user = players.find(p => p.id === 'user')!;
    
    const updatedPlayers = players.map(p => {
      if (p.id === 'user') {
        return { ...p, hand: [...p.hand, card] };
      }
      return p;
    });

    setDeck(currentDeck);
    setDiscardPile(currentDiscard);
    setPlayers(updatedPlayers);
    logEvent(`Você comprou uma carta: ${card.color.toUpperCase()} ${card.type === 'reflection' ? `(${card.category})` : '(Ação)'}`);

    // If drawn card is playable, we don't auto-pass. The user can choose to play it.
    // If it's not playable, they will have to click "Passar a Vez" manually.
  };

  // Manual pass turn (after drawing)
  const passTurn = () => {
    if ((gameStatus !== 'playing' && gameStatus !== 'reflecting') || currentPlayerId !== 'user') return;

    logEvent('Você passou a vez.');
    // To comply with Issue 1.2: "Ao clicar no botão 'Passar a Vez', a ação atual é cancelada. A usuária recebe 1 carta do monte de compras. O turno avança para o próximo Bot automaticamente."
    // Let's check if the user already drew this turn. If they didn't, let's draw one card for them.
    let currentDeck = [...deck];
    let currentDiscard = [...discardPile];
    const user = players.find(p => p.id === 'user')!;
    
    if (currentDeck.length === 0 && currentDiscard.length > 1) {
      const top = currentDiscard.pop()!;
      currentDeck = shuffle(currentDiscard);
      currentDiscard = [top];
    }

    const card = currentDeck.pop();
    const updatedPlayers = players.map(p => {
      if (p.id === 'user') {
        return { ...p, hand: card ? [...p.hand, card] : p.hand };
      }
      return p;
    });

    setDeck(currentDeck);
    setDiscardPile(currentDiscard);
    setPlayers(updatedPlayers);
    setSustentaClicked(false);
    setSelectedCard(null); // Cancel current play selection and close modal
    
    advanceTurn(updatedPlayers, currentDiscard, direction);
  };

  // Toggle Sustenta
  const toggleSustenta = () => {
    setSustentaClicked(prev => !prev);
    logEvent('Você declarou "SUSTENTA!"');
  };

  // Handle Victory
  const handleVictory = (playerId: string) => {
    setGameStatus('ended');
    const winnerName = players.find(p => p.id === playerId)?.name || '';
    setWinner(playerId);
    logEvent(`Partida finalizada! Vencedora: ${winnerName}`);

    if (playerId === 'user') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Bot logic loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const currentPlayer = players.find(p => p.id === currentPlayerId);
    if (!currentPlayer || !currentPlayer.isBot) return;

    // Simulate thinking delay (setTimeout)
    botTurnTimeoutRef.current = setTimeout(() => {
      runBotTurn(currentPlayer);
    }, 2000);

    return () => {
      if (botTurnTimeoutRef.current) clearTimeout(botTurnTimeoutRef.current);
    };
  }, [currentPlayerId, gameStatus]);

  const skipBotReaction = () => {
    if (gameStatus !== 'bot_reacting') return;
    if (botTurnTimeoutRef.current) clearTimeout(botTurnTimeoutRef.current);
    setBotTimer(null);
    setBotSpeech(null);
    advanceTurn(players, discardPile, direction);
  };

  // Countdown decrement effect for bots
  useEffect(() => {
    if (gameStatus !== 'bot_reacting' || botTimer === null) return;

    const interval = setInterval(() => {
      setBotTimer(prev => {
        if (prev === null) return null;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, botTimer === null]);

  // Expiration effect for bots
  useEffect(() => {
    if (gameStatus === 'bot_reacting' && botTimer === 0) {
      setBotTimer(null);
      setBotSpeech(null);
      advanceTurn(players, discardPile, direction);
    }
  }, [botTimer, gameStatus, players, discardPile, direction]);

  // Execute Bot Turn
  const runBotTurn = (bot: Player) => {
    // 1. Find valid cards
    const playableCards = bot.hand.filter(isValidPlay);

    // Therapeutic hesitation factor: 25% chance for the bot to draw a card instead of playing,
    // giving the user a higher chance of winning.
    const shouldHesitate = playableCards.length > 0 && Math.random() < 0.25;

    if (playableCards.length > 0 && !shouldHesitate) {
      // Strategy: Play Action cards first, otherwise play standard reflection card
      const actionCard = playableCards.find(c => c.type === 'action');
      const cardToPlay = actionCard || playableCards[0];

      // Simulate bot clicking Sustenta if they will have 1 card left
      const leavesOneCard = bot.hand.length === 2;
      if (leavesOneCard) {
        logEvent(`${bot.name} declarou "SUSTENTA!"`);
      }

      if (cardToPlay.type === 'reflection') {
        // Bot plays a reflection card
        const response = botResponses[bot.id]?.[cardToPlay.id.split('_inst_')[0]] || 
          'Gosto muito de compartilhar e acolher as histórias desse grupo.';

        setBotSpeech({
          botId: bot.id,
          text: response,
          cardId: cardToPlay.id
        });

        // Add to history
        const newLog: ReflectionLog = {
          cardId: cardToPlay.id,
          question: cardToPlay.question || '',
          color: cardToPlay.color,
          category: cardToPlay.category || 'Geral',
          answer: response,
          author: bot.name,
          age: bot.age
        };
        setReflectionsHistory(prev => [...prev, newLog]);
        logEvent(`${bot.name} jogou ${cardToPlay.color.toUpperCase()} (${cardToPlay.category}) e desabafou.`);

        // Update hands
        const updatedHand = bot.hand.filter(c => c.id !== cardToPlay.id);
        const newDiscardPile = [...discardPile, cardToPlay];

        // Update match targets
        setActiveColor(cardToPlay.color);
        setActiveNumber(cardToPlay.number);
        setActiveAction(undefined);

        const updatedPlayers = players.map(p => {
          if (p.id === bot.id) {
            return { ...p, hand: updatedHand };
          }
          return p;
        });

        setPlayers(updatedPlayers);
        setDiscardPile(newDiscardPile);

        // Check Victory
        if (updatedHand.length === 0) {
          handleVictory(bot.id);
          return;
        }

        // Show the bot reflection for 60 seconds (1 minute) with a countdown
        setGameStatus('bot_reacting');
        setBotTimer(60);

      } else {
        // Bot plays Action card
        executeActionCardPlay(bot.id, cardToPlay);
      }
    } else {
      // 2. Draw card since no play is valid or bot chose to hesitate
      if (shouldHesitate) {
        const hesitationPhrases = [
          'preferiu ouvir mais o grupo e comprou 1 carta.',
          'decidiu refletir um pouco mais e comprou 1 carta.',
          'escolheu fazer uma pausa para respirar e comprou 1 carta.'
        ];
        const phrase = hesitationPhrases[Math.floor(Math.random() * hesitationPhrases.length)];
        logEvent(`${bot.name} ${phrase}`);
      } else {
        logEvent(`${bot.name} não tem cartas válidas e comprou 1 carta.`);
      }
      
      let currentDeck = [...deck];
      let currentDiscard = [...discardPile];
      
      if (currentDeck.length === 0 && currentDiscard.length > 1) {
        const top = currentDiscard.pop()!;
        currentDeck = shuffle(currentDiscard);
        currentDiscard = [top];
      }

      const drawnCard = currentDeck.pop();
      
      if (drawnCard) {
        const updatedHand = [...bot.hand, drawnCard];
        
        // Check if drawn card is playable immediately (only if they didn't hesitate)
        const isPlayable = !shouldHesitate && isValidPlay(drawnCard);

        const updatedPlayers = players.map(p => {
          if (p.id === bot.id) {
            return { ...p, hand: updatedHand };
          }
          return p;
        });

        setDeck(currentDeck);
        setDiscardPile(currentDiscard);
        setPlayers(updatedPlayers);

        if (isPlayable) {
          logEvent(`${bot.name} comprou e jogará a carta imediatamente.`);
          // Play the card in next tick/short delay
          botTurnTimeoutRef.current = setTimeout(() => {
            if (drawnCard.type === 'reflection') {
              const response = botResponses[bot.id]?.[drawnCard.id.split('_inst_')[0]] || 
                'Me identifico muito com o que conversamos aqui.';

              setBotSpeech({
                botId: bot.id,
                text: response,
                cardId: drawnCard.id
              });

              const newLog: ReflectionLog = {
                cardId: drawnCard.id,
                question: drawnCard.question || '',
                color: drawnCard.color,
                category: drawnCard.category || 'Geral',
                answer: response,
                author: bot.name,
                age: bot.age
              };
              setReflectionsHistory(prev => [...prev, newLog]);
              logEvent(`${bot.name} jogou a carta comprada: ${drawnCard.color.toUpperCase()} (${drawnCard.category}).`);

              const finalHand = updatedHand.filter(c => c.id !== drawnCard.id);
              const finalDiscard = [...currentDiscard, drawnCard];

              setActiveColor(drawnCard.color);
              setActiveNumber(drawnCard.number);
              setActiveAction(undefined);

              const finalPlayers = updatedPlayers.map(p => {
                if (p.id === bot.id) {
                  return { ...p, hand: finalHand };
                }
                return p;
              });

              setPlayers(finalPlayers);
              setDiscardPile(finalDiscard);

              setGameStatus('bot_reacting');
              setBotTimer(60);
            } else {
              executeActionCardPlay(bot.id, drawnCard);
            }
          }, 1500);
        } else {
          if (!shouldHesitate) {
            logEvent(`${bot.name} guardou a carta comprada.`);
          }
          advanceTurn(updatedPlayers, currentDiscard, direction);
        }
      } else {
        logEvent(`${bot.name} passou a vez.`);
        advanceTurn(players, currentDiscard, direction);
      }
    }
  };

  return (
    <GameContext.Provider value={{
      players,
      deck,
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
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame deve ser utilizado dentro de um GameProvider');
  }
  return context;
};
