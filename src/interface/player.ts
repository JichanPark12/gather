import { CardInfo } from './card';

export interface PlayingUser {
  id?: string;
  name: string;
  hand: CardInfo[];
}
