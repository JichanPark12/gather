import React from 'react';
import { CardInfo } from '../interface/card';
import { initCardList } from './utils/initCardList';
import shuffleArray from './utils/shuffle';
import { gameConfig } from '@/constants/gameConfig';
import { getGame, setGame } from './curd/crud';
import { DocumentData, DocumentReference, onSnapshot } from 'firebase/firestore';
import { GameInfo } from '@/interface/game';
import { currentTurnPlayer } from './utils/currentTurnPlayer';
import { checkCorrectCard, getAttackCount, getTurnCount } from './rules/rules';
import { PlayingUser } from '@/interface/player';

interface Props {
  setCardsState: React.Dispatch<React.SetStateAction<GameInfo>>;
  gameId: string;
  docRef: DocumentReference<DocumentData, DocumentData>;
  player: string;
  gameData: GameInfo;
}

class GameViewModel {
  #setCardsState;

  #gameId;
  #docRef;
  #player;
  #gameData;

  constructor({ setCardsState, gameId, docRef, player, gameData }: Props) {
    this.#setCardsState = setCardsState;
    this.#player = player;
    this.#gameId = gameId;
    this.#docRef = docRef;
    this.#gameData = gameData;
    const isJoinMe = gameData.playerList.filter((my) => my.name === player).length > 0;
    if (gameData.playerList.length < 2 && !isJoinMe) this.joinGame();
    this.watchGameUpdates();
  }

  async start() {
    !(await this.isCheckStart()) && this.initGame();
  }

  async initGame() {
    const cardList = shuffleArray(initCardList());
    (this.#gameData.deckList = cardList), (this.#gameData.tombList = []);
    const newPlayerList = this.#gameData.playerList.map((player) => {
      return {
        ...player,
        hand: [],
      };
    });
    this.#gameData.playerList = newPlayerList;

    this.#gameData.playerList.forEach((player) => {
      [...new Array(gameConfig.startDrawCardCount)].forEach(() =>
        this.drawCard(player.name)
      );
    });

    await setGame(this.#docRef, {
      ...this.#gameData,
      deckList: cardList,
      state: 'start',
      turn: 1,
      tombList: [],
      attackCount: 0,
      lastCardType: 'any',
      winner: null,
    });
  }

  async playCard(cardData: CardInfo) {
    if (this.#gameData.winner !== null) return false;
    if (
      !checkCorrectCard(
        cardData,
        this.#gameData.lastCardType,
        this.#gameData.attackCount > 0
      )
    )
      return false;
    const turnCount = getTurnCount(cardData);
    let isEnd = false;
    const newPlayerList = this.#gameData.playerList.map((player) => {
      if (player.name !== this.#player) return player;
      const newHand = player.hand.filter(
        (card) =>
          cardData.Card.number !== card.Card.number ||
          cardData.Card.type !== card.Card.type
      );
      newHand.length === 0 && (isEnd = true);
      return {
        ...player,
        hand: newHand,
      };
    });

    const newTombList = [...this.#gameData.tombList, cardData];
    const newAttackCount = this.#gameData.attackCount + getAttackCount(cardData);

    if (isEnd) {
      await setGame(this.#docRef, {
        ...this.#gameData,
        playerList: newPlayerList,
        tombList: newTombList,
        turn: this.#gameData.turn + turnCount,
        attackCount: newAttackCount,
        lastCardType: cardData,
        winner: this.#player,
      });

      return;
    }
    await setGame(this.#docRef, {
      ...this.#gameData,
      playerList: newPlayerList,
      tombList: newTombList,
      turn: this.#gameData.turn + turnCount,
      attackCount: newAttackCount,
      lastCardType: cardData,
    });
    return true;
  }

  async nothingPlayCard() {
    if (this.#gameData.winner !== null) return;
    const attackCount = this.#gameData.attackCount === 0 ? 1 : this.#gameData.attackCount;

    const lastCardType =
      this.#gameData.lastCardType === 'any'
        ? 'any'
        : this.#gameData.lastCardType.Card.type === 'joker'
        ? 'any'
        : this.#gameData.lastCardType;

    [...new Array(attackCount)].forEach(() => this.drawCard());

    setGame(this.#docRef, {
      ...this.#gameData,
      turn: this.#gameData.turn + 1,
      attackCount: 0,
      lastCardType,
    });
  }

  async isCheckStart() {
    const data = (await getGame(this.#docRef)) as GameInfo;
    return data.state === 'start';
  }
  getCurrentTurnPlayer() {
    const player = currentTurnPlayer(this.#gameData.turn, this.#gameData.playerList);
    if (player) return player.name;
  }
  async isCheckMyTurn() {
    const data = (await getGame(this.#docRef)) as GameInfo;
    return this.#player === currentTurnPlayer(data.turn, this.#gameData.playerList).name;
  }

  watchGameUpdates() {
    onSnapshot(this.#docRef, (doc) => {
      const newData = doc.data() as GameInfo;
      this.#gameData = newData;

      this.#setCardsState(newData);
    });
  }
  async drawCard(playerName?: string) {
    if (this.#gameData.deckList.length === 0) {
      this.mergeAndShuffle();
    }
    playerName = playerName ? playerName : this.#player;

    const newPlayerList = this.#gameData.playerList.map((player) => {
      if (player.name !== playerName) return player;

      return {
        ...player,
        hand: [...player.hand, this.#gameData.deckList.pop()],
      };
    });
    this.#gameData.playerList = newPlayerList as PlayingUser[];
  }
  async mergeAndShuffle() {
    const lastCard = [this.#gameData.tombList.pop()] as CardInfo[];
    const newDeckList = shuffleArray([
      ...this.#gameData.deckList,
      ...this.#gameData.tombList,
    ]);

    this.#gameData.deckList = newDeckList;
    this.#gameData.tombList = lastCard;
  }
  getWinner() {
    return this.#gameData.winner;
  }
  getGameState() {
    return this.#gameData.state;
  }
  exitGame() {
    const newPlayerList = this.#gameData.playerList.filter(
      (player) => this.#player !== player.name
    );

    const newGameData: GameInfo =
      this.#player === this.#gameData.creator
        ? { ...this.#gameData, playerList: [], creator: null, state: 'close' }
        : { ...this.#gameData, playerList: newPlayerList };
    console.log(this.#player);
    setGame(this.#docRef, newGameData);
  }
  joinGame() {
    const newPlayerList: PlayingUser[] = [
      ...this.#gameData.playerList,
      {
        name: this.#player,
        hand: [],
      },
    ];
    setGame(this.#docRef, { ...this.#gameData, playerList: newPlayerList });
  }
}

export default GameViewModel;
