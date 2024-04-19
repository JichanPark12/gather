'use client';

import { CardsState } from '@/interface/card';
import { useEffect, useState } from 'react';
import { Group, Layer, Stage, Text } from 'react-konva';
import GameViewModel from '@/gameLogic/GameViewModel';
import Card from '../card/Card';
import { cardSize } from '@/constants/cardConfig';

const Game = () => {
  const [cardsState, setCardsState] = useState<CardsState>({
    playerList: [],
    tombList: [],
    deckList: [],
  });
  const [gameViewModel, setGameViewModel] = useState<GameViewModel>();

  useEffect(() => {
    const newGameViewModel = new GameViewModel({
      setCardsState,
      playerList: ['me', 'other'],
    });

    setGameViewModel(newGameViewModel);
    newGameViewModel.start();
    return () => {};
  }, []);

  if (!gameViewModel || !cardsState) {
    return <div>게임 로딩중</div>;
  }
  if (cardsState.playerList.length === 0) return <div>게임 로딩중</div>;
  const localData = localStorage.getItem('player');
  if (!localData) return <div>정상적이지 않은 접근입니다</div>;

  const currentPlayer = JSON.parse(localData);
  const myInfo = cardsState?.playerList.filter(
    (player) => player.name === currentPlayer
  )[0];
  const otherInfo = cardsState?.playerList.filter(
    (player) => player.name !== currentPlayer
  )[0];

  const myCardListLength = myInfo.hand.length ? myInfo?.hand.length : 0;
  const otherCardListLength = otherInfo.hand.length ? otherInfo.hand.length : 0;

  const myCardsInitialX =
    window.innerWidth / 2 - (myCardListLength * cardSize.cardSpacing) / 2;

  const otherCardsInitialX =
    window.innerWidth / 2 - (otherCardListLength * cardSize.cardSpacing) / 2;

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        className={` bg-green-500`}>
        <Layer>
          <Group>
            <Card
              x={window.innerWidth / 2 - 100}
              y={window.innerHeight / 2 - 100}
              imageUrl={`/asset/card/card.png`}
              isMine={false}
            />
            {cardsState?.tombList.length > 0 && (
              <Card
                x={window.innerWidth / 2 + 100}
                y={window.innerHeight / 2 - 100}
                imageUrl={`/asset/card/${
                  cardsState.tombList[cardsState.tombList.length - 1].Card.type
                }_${cardsState.tombList[cardsState.tombList.length - 1].Card.number}.png`}
                isMine={false}
              />
            )}
          </Group>
          <Group
            x={otherCardsInitialX}
            y={0}>
            {otherInfo.hand.map((card, idx) => (
              <Card
                x={idx * +cardSize.cardSpacing}
                y={10}
                key={`${card.Card.type}_${card.Card.number}`}
                imageUrl={`/asset/card/card.png`}
                isMine={false}
              />
            ))}
          </Group>
          <Group
            x={myCardsInitialX}
            y={window.innerHeight - cardSize.height - 20}>
            {myInfo.hand.map((card, idx) => (
              <Card
                x={idx * +cardSize.cardSpacing}
                y={10}
                key={`${card.Card.type}_${card.Card.number}`}
                imageUrl={`/asset/card/${card.Card.type}_${card.Card.number}.png`}
                isMine={true}
                gameViewModel={gameViewModel}
                cardInfo={card}
              />
            ))}
          </Group>
          <Text
            fontSize={60}
            text="턴넘기기"
            wrap="char"
            width={700}
            onClick={async () => {
              if (await gameViewModel.isCheckMyTurn()) {
                console.log(await gameViewModel.isCheckMyTurn());
                gameViewModel.nothingPlayCard();
              }
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default Game;
