import { randomObjectNames } from "./skribbl-words";

export const allGames = [
  {
    img: "https://cdn.pixabay.com/photo/2013/07/12/15/56/tic-tac-toe-150614_960_720.png",
    name: "Tic Tac Toe",
    linkText: "Play Tic-Tac-Toe",
    href: "/games/xo",
    description:
      "Play the classic Tic-Tac-Toe game (also called Noughts and Crosses) for free online with your friends.",
  },
  {
    img: "https://cdn.pixabay.com/photo/2013/07/12/15/56/tic-tac-toe-150614_960_720.png",
    name: "Skribbl",
    linkText: "Play Skribbl",
    href: "/games/skribbl",
    description:
      "Play the classic Skribbl game for free online with your friends.",
  },
];

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
