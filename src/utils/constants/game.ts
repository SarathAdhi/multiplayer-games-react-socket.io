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
