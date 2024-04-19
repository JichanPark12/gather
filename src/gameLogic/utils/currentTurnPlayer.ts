import { PlayingUser } from '@/interface/player';

export const currentTurnPlayer = (turn: number, playerList: PlayingUser[]): PlayingUser =>
  playerList[(turn - 1) % playerList.length];
