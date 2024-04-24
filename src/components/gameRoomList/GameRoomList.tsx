'use client';

import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { GameInfo } from '@/interface/game';
import { useRouter } from 'next/navigation';

interface GameRoomInfo extends GameInfo {
  id: string;
}

const GameRoomList = () => {
  const [dataList, setDataList] = useState<GameRoomInfo[]>();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'oneCard'), (snapshot) => {
      const newDataList: GameRoomInfo[] = [];
      snapshot.forEach((doc) => {
        const gameInfo = doc.data() as GameInfo;
        newDataList.push({ ...gameInfo, id: doc.id });
      });

      const filterData = newDataList.filter(
        (data) => data.state === 'waiting' && data.creator !== null
      );
      setDataList(filterData);
    });

    // Cleanup function to unsubscribe from snapshot listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-screen-md mx-auto bg-red-400 h-screen p-10">
      {dataList?.map((data) => (
        <div
          key={data.creator}
          className="flex mt-5"
          onClick={async () => {
            const newData = (
              await getDoc(doc(db, 'oneCard', data.id))
            ).data() as GameInfo;
            if (!newData) return;
            if (newData.state !== 'waiting') {
              alert('대기중인 대기방이 아닙니다.');
              return;
            }
            if (newData.playerList.length === 2) {
              alert('이미 꽉 찬 방입니다.');
              return;
            }

            router.push(`/gameRoom/${data.id}`);
          }}>
          <div>{data.creator} 님의 게임</div>
          <div>{`${data.playerList.length} / 2`}</div>
        </div>
      ))}
    </div>
  );
};

export default GameRoomList;
