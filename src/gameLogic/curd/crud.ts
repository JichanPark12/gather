import { GameInfo } from '@/interface/game';
import {
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';

export const getGame = async (docRef: DocumentReference<DocumentData, DocumentData>) => {
  const gameRoom = await getDoc(docRef);
  return gameRoom.data();
};

export const updateGame = async <T>(
  docRef: DocumentReference<DocumentData, DocumentData>,
  data: T,
  updateKey: string
) => {
  await updateDoc(docRef, {
    [updateKey]: data,
  });
};

export const setGame = async (
  docRef: DocumentReference<DocumentData, DocumentData>,
  data: GameInfo
) => {
  const gameData = await getGame(docRef);
  await setDoc(docRef, {
    ...gameData,
    ...data,
  });
};
