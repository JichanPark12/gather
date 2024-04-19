import { cardNumberList, cardTypeList } from '@/constants/cardConfig';
import { PlayingUser } from './player';

export interface TrumpCard {
  type: (typeof cardTypeList)[number];
  number: (typeof cardNumberList)[number];
}

export interface JokerCard {
  type: 'joker';
  number: 'black' | 'color';
}

export interface CardInfo {
  Card: TrumpCard | JokerCard;
}

export interface CardsState {
  tombList: CardInfo[];
  deckList: CardInfo[];
  playerList: PlayingUser[];
}
