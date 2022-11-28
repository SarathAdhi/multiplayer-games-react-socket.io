import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Tooltip, Button } from "@chakra-ui/react";
import { useToast, Box } from "@chakra-ui/react";

const boardTile = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((e) => ({
  tile: e,
  username: "",
  playerSymbol: "",
}));

type Props = {
  roomId: string;
  username: string;
};

type BoardTileInfoProps = {
  tile: string;
  playerSymbol: string;
  username: string;
};

enum gameStatusEnum {
  START = "START",
  WAIT = "WAIT",
  LIVE = "LIVE",
}

let socket: any;

export const XOGameBoard: React.FC<Props> = ({ roomId, username }) => {
  const [boardTileInfo, setBoardTileInfo] =
    useState<BoardTileInfoProps[]>(boardTile);

  const [playerSymbol, setPlayerSymbol] = useState("");
  const [isMyTurn, setIsMyTurn] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<gameStatusEnum>(
    gameStatusEnum.WAIT
  );
  const [winnerDetails, setWinnerDetails] = useState<BoardTileInfoProps>();

  const toast = useToast();

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch("/api/xo");

    socket = io();

    socket.emit("join_xo_room", { username, roomId });

    socket.on("start_xo", (data: { count: number } & BoardTileInfoProps) => {
      setPlayerSymbol(data.playerSymbol);
      setIsMyTurn(data.playerSymbol === "X" ? true : false);

      setGameStatus(
        data.count > 2
          ? gameStatusEnum.LIVE
          : data.count === 2
          ? gameStatusEnum.START
          : gameStatusEnum.WAIT
      );
    });

    socket.on(
      "waiting_lobby",
      (data: { gameStatus: gameStatusEnum } & BoardTileInfoProps) => {
        setGameStatus(data.gameStatus);
      }
    );

    socket.on("receive_message_xo", (data: BoardTileInfoProps) => {
      setIsMyTurn(data.username === username ? false : true);

      setBoardTileInfo((currentMsg) =>
        currentMsg.map((e) => {
          if (e.tile === data.tile) return data;
          else return e;
        })
      );
    });

    socket.on("announce_winner", (winnerData: any) => {
      console.log({ winnerData });
      setWinnerDetails(winnerData);

      toast({
        position: "bottom",
        variant: "top-accent",
        render: () => (
          <Box color="white" px={5} py={3} bg="blue.500" borderRadius={"md"}>
            {`Player ${winnerData.playerSymbol} won!`}
          </Box>
        ),
      });
    });
  };

  function handleTileTouch(tile: string) {
    console.log({ playerSymbol });

    socket.emit("send_message_xo", {
      roomId,
      username,
      tile,
      playerSymbol,
    });
  }

  function announceWinner() {
    if (winnerDetails?.username) return;

    socket.emit("winner_xo", {
      roomId,
      username,
      playerSymbol,
    });
  }

  useEffect(() => {
    const getBoardTileSymbol = boardTileInfo.map((e, index) => {
      if (e.playerSymbol === "") return `${index + 1}-random`;
      else return e.playerSymbol;
    });
    const diagonalL_R = [
      getBoardTileSymbol[0],
      getBoardTileSymbol[4],
      getBoardTileSymbol[8],
    ].every((e) => e === playerSymbol);

    const diagonalR_L = [
      getBoardTileSymbol[2],
      getBoardTileSymbol[4],
      getBoardTileSymbol[6],
    ].every((e) => e === playerSymbol);

    const Horizontal_0 = [
      getBoardTileSymbol[0],
      getBoardTileSymbol[1],
      getBoardTileSymbol[2],
    ].every((e) => e === playerSymbol);

    const Horizontal_1 = [
      getBoardTileSymbol[3],
      getBoardTileSymbol[4],
      getBoardTileSymbol[5],
    ].every((e) => e === playerSymbol);

    const Horizontal_2 = [
      getBoardTileSymbol[6],
      getBoardTileSymbol[7],
      getBoardTileSymbol[8],
    ].every((e) => e === playerSymbol);

    const Virtical_0 = [
      getBoardTileSymbol[0],
      getBoardTileSymbol[3],
      getBoardTileSymbol[6],
    ].every((e) => e === playerSymbol);

    const Virtical_1 = [
      getBoardTileSymbol[1],
      getBoardTileSymbol[4],
      getBoardTileSymbol[7],
    ].every((e) => e === playerSymbol);

    const Virtical_2 = [
      getBoardTileSymbol[2],
      getBoardTileSymbol[5],
      getBoardTileSymbol[8],
    ].every((e) => e === playerSymbol);
    if (
      diagonalL_R ||
      diagonalR_L ||
      Horizontal_0 ||
      Horizontal_1 ||
      Horizontal_2 ||
      Virtical_0 ||
      Virtical_1 ||
      Virtical_2
    )
      announceWinner();
  }, [boardTileInfo]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center gap-5">
      {gameStatus === gameStatusEnum.WAIT && (
        <div>
          <h1>Waiting for the opponent</h1>
        </div>
      )}

      {gameStatus === gameStatusEnum.LIVE && (
        <div>
          <h1>Watching Live</h1>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {boardTileInfo.map(({ playerSymbol, tile, username: _username }) => (
          <Tooltip
            key={tile}
            placement="top"
            label={
              _username &&
              (_username === username ? "You" : `Player: ${playerSymbol}`)
            }
          >
            <Button
              bgColor="gray.500"
              _hover={{ bgColor: "gray.600" }}
              _disabled={{
                bgColor: "gray.400",
                _hover: { bgColor: "gray.400" },
                cursor: "not-allowed",
              }}
              fontSize={"4xl"}
              className="!h-20 !w-20"
              onClick={() => handleTileTouch(tile)}
              disabled={
                !!playerSymbol ||
                gameStatus !== gameStatusEnum.START ||
                !!winnerDetails?.username ||
                !isMyTurn
              }
            >
              {playerSymbol}
            </Button>
          </Tooltip>
        ))}
      </div>

      {winnerDetails && (
        <div className="flex flex-col items-center justify-center leading-none">
          <h1 className="text-2xl font-semibold">
            Player {winnerDetails.playerSymbol} won
          </h1>

          <p>username: {winnerDetails.username}</p>

          <Button
            mt={5}
            onClick={async () => {
              socket.emit("leave_room", {
                roomId,
              });

              setPlayerSymbol("");
              setIsMyTurn(false);
              setGameStatus(gameStatusEnum.WAIT);
              setWinnerDetails(undefined);
              setBoardTileInfo(boardTile);

              socketInitializer();
            }}
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};
