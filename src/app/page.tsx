'use client';

import CreateGameRoomBtn from '@/components/button/CreateGameRoomBtn';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <div
      className="hero min-h-screen p-0"
      style={{}}>
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">원카드</h1>
          <p className="mb-5">계정을 만들고 게임을 즐겨보세요</p>
          {session.data ? (
            <>
              <CreateGameRoomBtn />
              <Link
                href={'/gameRoomList'}
                className="btn btn-primary ml-5">
                방 탐색
              </Link>
            </>
          ) : (
            <>
              <Link
                href={'/signIn'}
                className="btn btn-primary">
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
