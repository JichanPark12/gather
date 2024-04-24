'use client';

import { useSession } from 'next-auth/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { GameInfo } from '@/interface/game';
import { useRouter } from 'next/navigation';

const CreateGameRoomBtn = () => {
  const session = useSession();
  const router = useRouter();
  const handleClick = async () => {
    if (!session.data) return;
    const gameInfo: GameInfo = {
      deckList: [],
      tombList: [],
      playerList: [],
      turn: 0,
      state: 'waiting',
      attackCount: 0,
      lastCardType: 'any',
      winner: null,
      creator: session.data.user?.email as string,
    };
    const docRef = await addDoc(collection(db, 'oneCard'), gameInfo);
    router.push(`/gameRoom/${docRef.id}`);
  };
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={handleClick}>
      방 생성
    </button>
  );
};

export default CreateGameRoomBtn;
