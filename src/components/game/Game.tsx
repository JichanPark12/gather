'use client';

import { useEffect, useMemo, useState } from 'react';
import { Group, Layer, Stage, Text } from 'react-konva';
import GameViewModel from '@/gameLogic/GameViewModel';
import Card from '../card/Card';
import { cardSize } from '@/constants/cardConfig';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { GameInfo } from '@/interface/game';
import { useSession } from 'next-auth/react';

const Game = () => {
  const params = useParams();
  const gameId = params?.id as string;
  const docRef = useMemo(() => doc(db, 'oneCard', gameId), [gameId]);
  const session = useSession();
  const router = useRouter();
  const [cardsState, setCardsState] = useState<GameInfo>({
    state: 'waiting',
    playerList: [],
    turn: 0,
    deckList: [],
    tombList: [],
    attackCount: 0,
    lastCardType: 'any',
    winner: null,
    creator: '',
  });
  const [gameViewModel, setGameViewModel] = useState<GameViewModel>();

  useEffect(() => {
    const fetchGame = async () => {
      if (!session.data?.user?.email) return;
      const gameData = (await getDoc(docRef)).data() as GameInfo;
      if (!gameData) return;
      const newGameViewModel = new GameViewModel({
        setCardsState,
        gameId,
        docRef,
        player: session.data?.user?.email,
        gameData,
      });
      setGameViewModel(newGameViewModel);
    };
    fetchGame();
    return () => {
      if (!gameViewModel) return;
      gameViewModel.exitGame();
    };
  }, [gameId, docRef, session]);

  if (!gameViewModel || !cardsState) {
    return <div>게임 로딩중</div>;
  }
  if (cardsState.creator === null) {
    alert('방장이 게임에서 나갔습니다.');
    router.push('/gameRoomList');
    return;
  }

  if (cardsState.state === 'waiting') {
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
                  }_${
                    cardsState.tombList[cardsState.tombList.length - 1].Card.number
                  }.png`}
                  isMine={false}
                />
              )}
            </Group>

            <Text
              fontSize={30}
              y={10}
              text={`현재 참가자: ${cardsState.playerList.map((player) => player.name)}`}
              wrap="char"
              width={700}
            />
            <Text
              fontSize={30}
              y={60}
              text={`방장: ${cardsState.creator}`}
              wrap="char"
              width={1920}
            />
            {cardsState.playerList.length >= 2 &&
              session.data?.user?.email === cardsState.creator && (
                <Text
                  fontSize={60}
                  x={window.innerWidth / 2 + 100}
                  y={window.innerHeight / 2 - 20}
                  text="시작하기"
                  wrap="char"
                  width={500}
                  onClick={() => gameViewModel.start()}
                />
              )}
          </Layer>
        </Stage>
      </div>
    );
  }

  if (!session.data?.user?.email) return <div>로그인이 필요한 서비스 입니다.</div>;

  const currentPlayer = session.data.user?.email;
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
            fontSize={30}
            x={window.innerWidth / 2 + 100}
            y={window.innerHeight / 2 - 20}
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
          <Text
            fontSize={20}
            text={`현재 턴 유저 ${gameViewModel.getCurrentTurnPlayer()}`}
            wrap="char"
            width={700}
            y={window.innerHeight / 2 - 20}
            onClick={async () => {
              if (await gameViewModel.isCheckMyTurn()) {
                console.log(await gameViewModel.isCheckMyTurn());
                gameViewModel.nothingPlayCard();
              }
            }}
          />
          {gameViewModel.getWinner() !== null && (
            <Text
              fontSize={60}
              text={`승리: ${gameViewModel.getWinner()}`}
              wrap="char"
              width={700}
              y={200}
              onClick={async () => {
                if (await gameViewModel.isCheckMyTurn()) {
                  console.log(await gameViewModel.isCheckMyTurn());
                  gameViewModel.nothingPlayCard();
                }
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default Game;
