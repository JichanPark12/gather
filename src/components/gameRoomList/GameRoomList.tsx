'use client';

import { collection, getDocs } from 'firebase/firestore';
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
    const fetch = async () => {
      const data = await getDocs(collection(db, 'oneCard'));
      const dataList = data.docs.map((doc) => {
        const gameInfo = doc.data() as GameInfo;
        return { ...gameInfo, id: doc.id };
      });
      const filterData = dataList.filter(
        (data) => data.state === 'waiting' && data.creator !== null
      );
      setDataList(filterData);
    };
    fetch();
    return () => {};
  }, []);

  return (
    <div className=" max-w-screen-md mx-auto bg-red-400 h-screen p-10">
      {dataList?.map((data) => (
        <div
          key={data.creator}
          className=" flex mt-5"
          onClick={() => {
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
