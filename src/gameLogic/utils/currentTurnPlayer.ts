export const currentTurnPlayer = (turn: number, playerList: string[]): string =>
  playerList[(turn - 1) % playerList.length];
