'use client';
import dynamic from 'next/dynamic';
const Game = dynamic(() => import('./Game'), { ssr: false });

const GameContainer = () => {
  return <Game />;
};

export default GameContainer;
