'use client';
import { Session } from 'next-auth';
import { SessionProvider as Provider } from 'next-auth/react';

interface Props {
  children: React.ReactNode;
  session?: Session | undefined | null;
}

const SessionProvider = ({ children, session }: Props) => {
  return <Provider session={session}>{children}</Provider>;
};

export default SessionProvider;
