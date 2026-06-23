'use client';

import { GameProvider } from '../context/GameContext';
import { GameView } from '../components/GameView';

export default function Home() {
  return (
    <GameProvider>
      <GameView />
    </GameProvider>
  );
}
