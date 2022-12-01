import { randomObjectNames } from "./scribbl-words";

export const boardTile = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
  (e) => ({
    tile: e,
    username: "",
    playerSymbol: "",
  })
);

export enum gameStatusEnum {
  START = "START",
  WAIT = "WAIT",
  LIVE = "LIVE",
}

export const getRamdomObjects = () => {
  const randIndex: any = (num?: number) => {
    const randNum = Math.floor(Math.random() * randomObjectNames.length);

    if (num === randNum) return randIndex(num);
    return randNum;
  };

  const randNum1 = randIndex();
  const randNum2 = randIndex(randNum1);
  const randNum3 = randIndex(randNum2);

  const words = [
    randomObjectNames[randNum1],
    randomObjectNames[randNum2],
    randomObjectNames[randNum3],
  ];

  return words;
};
