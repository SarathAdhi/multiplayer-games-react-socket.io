import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Tooltip, Button, useToast } from "@chakra-ui/react";
import { boardTile, gameStatusEnum } from "@utils/constants/game";

type Props = {
  roomId: string;
  username: string;
};

type BoardTileInfoProps = {
  tile: string;
  playerSymbol: string;
  username: string;
};

type SocketInitializerProps = {
  _winnerDetails: BoardTileInfoProps | null;
  currentPlayers: string[];
};

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
    socketInitializer({ _winnerDetails: null, currentPlayers: [] });

    return () => {
      socket.disconnect();
    };
  }, []);

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

    const isWinner =
      diagonalL_R ||
      diagonalR_L ||
      Horizontal_0 ||
      Horizontal_1 ||
      Horizontal_2 ||
      Virtical_0 ||
      Virtical_1 ||
      Virtical_2;

    if (isWinner) announceWinner();
  }, [boardTileInfo]);

  function resetTheGame(
    _winnerDetails: BoardTileInfoProps,
    currentPlayers: string[]
  ) {
    socket.emit("leave_room", {
      roomId,
      boardTile,
    });

    socketInitializer({ _winnerDetails, currentPlayers });
  }

  async function socketInitializer({
    _winnerDetails,
    currentPlayers,
  }: SocketInitializerProps) {
    setWinnerDetails(undefined);

    await fetch("/api/xo").finally(() => {
      socket = io();

      socket.emit("join_xo_room", {
        username,
        roomId,
        preWinner: _winnerDetails?.username,
        isGameReset: !!_winnerDetails?.username,
        currentPlayers,
      });

      socket.on(
        "start_xo",
        (
          data: {
            count: number;
            gameStatus: gameStatusEnum;
          } & BoardTileInfoProps
        ) => {
          setPlayerSymbol(data.playerSymbol);
          setIsMyTurn(data.playerSymbol === "X" ? true : false);
          setGameStatus(data.gameStatus);
        }
      );

      socket.on(
        "waiting_lobby",
        (data: { gameStatus: gameStatusEnum } & BoardTileInfoProps) => {
          setGameStatus(data.gameStatus);
        }
      );

      socket.on("reset_tile", (data: { boardTile: BoardTileInfoProps[] }) => {
        setBoardTileInfo(data.boardTile);
      });

      socket.on("receive_message_xo", (data: BoardTileInfoProps) => {
        setIsMyTurn(data.username === username ? false : true);

        setBoardTileInfo((currentMsg) =>
          currentMsg.map((e) => {
            if (e.tile === data.tile) return data;
            else return e;
          })
        );
      });

      socket.on(
        "announce_winner",
        (data: { currentPlayers: string[]; result: BoardTileInfoProps }) => {
          setWinnerDetails(data.result);

          toast.closeAll();

          toast({
            title: "Refreshing in 3 seconds",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setTimeout(
            () => resetTheGame(data.result, data.currentPlayers),
            3000
          );
        }
      );
    });
  }

  function handleTileTouch(tile: string) {
    socket.emit("send_message_xo", {
      roomId,
      username,
      tile,
      playerSymbol,
    });
  }

  function announceWinner() {
    socket.emit("winner_xo", {
      roomId,
      username,
      playerSymbol,
    });
  }

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
        </div>
      )}
    </div>
  );
};
