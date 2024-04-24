import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signIn',
    signOut: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(
        credentials
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ): Promise<any> {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            (credentials as Credentials).email || '',
            (credentials as Credentials).password || ''
          );
          if (userCredential.user) {
            return userCredential.user;
          }
          return null;
        } catch (e) {
          console.error(e);
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
