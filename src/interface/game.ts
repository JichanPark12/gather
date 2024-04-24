import { CardInfo } from './card';
import { PlayingUser } from './player';

export interface GameInfo {
  deckList: CardInfo[];
  tombList: CardInfo[];
  playerList: PlayingUser[];
  state: 'start' | 'waiting' | 'end' | 'close';
  turn: number;
  attackCount: number;
  lastCardType: CardInfo | 'any';
  winner: string | null;
  creator: string | null;
}
