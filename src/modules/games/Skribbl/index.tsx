import {
  Avatar,
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { getDummyPicture } from "@utils/getUserImage";
import { uuid } from "@utils/uuid";
import React, { useCallback, useEffect, useState } from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import io from "socket.io-client";
import { useToast } from "@chakra-ui/react";
import { Modal } from "@components/Modal";
import { getRamdomObjects } from "@utils/constants/game";
import clsx from "clsx";

export type Players = {
  id: number;
  socketId: string;
  playerId: string;
  username: string;
  image: string;
  roomId: string;
  isAdmin: boolean;
};

type Props = {
  username: string;
  isAdmin: boolean;
  roomId: string;
};

type Message = {
  message: string;
  isCorrectAnswer: boolean;
} & Players;

let socket: any;
let timerClone: any;

const timePerRound = 10;

export const SkribblGameBoard: React.FC<Props> = ({
  username,
  isAdmin,
  roomId,
}) => {
  const [drawnPng, setDrawnPng] = useState<string>("");
  const [myDetails, setMyDetails] = useState({
    username,
    playerId: uuid(10),
    image: getDummyPicture(username),
    roomId,
    isAdmin,
  });

  const [currentPlayers, setCurrentPlayers] = useState<Players[]>([]);
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [wordToFind, setWordToFind] = useState<string>("");
  const [startGame, setStartGame] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(timePerRound);

  const { isOpen, onClose, onToggle } = useDisclosure();

  const ref = React.useRef(null);

  const toast = useToast();

  useEffect(() => {
    socketInitializer();

    return () => {
      socket.disconnect();
    };
  }, []);

  let startTimer = useCallback(() => {
    timerClone = setInterval(() => {
      setRemainingTime((pre) => pre - 1);
    }, 1000);
  }, []);

  useEffect(() => {
    let timer: any;

    if (startGame) {
      startTimer();
    }

    if (isMyTurn) {
      timer = setTimeout(() => {
        setIsMyTurn(false);
        // (ref.current as any).resetCanvas();

        socket.emit("next_player_turn", {
          roomId,
          playerId: myDetails.playerId,
        });
      }, 10000);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(timerClone);
    };
  }, [wordToFind]);

  async function socketInitializer() {
    await fetch("/api/skribbl");

    socket = io();

    socket.emit("join_skribbl_room", {
      player: myDetails,
      roomId,
      currentPlayers: [],
    });

    socket.on("player_joined", (data: { currentPlayers: any }) => {
      setCurrentPlayers(data.currentPlayers);
    });

    socket.on("new_admin", (msg: string) => {
      toast({
        title: msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setMyDetails((pre) => ({ ...pre, isAdmin: true }));
    });

    socket.on("start_skribbl_init", (data: { playerTurn: string }) => {
      setStartGame(true);
      setIsMyTurn(data.playerTurn === myDetails.playerId);

      if (data.playerTurn === myDetails.playerId) {
        const words = getRamdomObjects();

        setRandomWords(words);
        onToggle();
      }
    });

    socket.on(
      "change_player_turn",
      (data: { playerTurn: string; words: string[] }) => {
        setIsMyTurn(data.playerTurn === myDetails.playerId);
        setChatMessages([]);

        clearInterval(timerClone);
        setRemainingTime(timePerRound);

        if (data.playerTurn === myDetails.playerId) {
          const words = getRamdomObjects();

          setRandomWords(words);
          onToggle();
        }
      }
    );

    socket.on("receive_drawing", (data: { png: string }) => {
      setDrawnPng(data.png);
    });

    socket.on("receive_word_to_find", (data: { word: string }) => {
      if (data.word) setWordToFind(data.word);
    });

    socket.on("receive_chat_message", (data: Message) => {
      setChatMessages((pre) => [...pre, { ...data }]);
    });
  }

  async function handleDraw() {
    const png = await (ref?.current as any)?.exportImage("png");

    socket?.emit("send_message_skribbl", {
      ...myDetails,
      roomId,
      png,
      action: "draw",
    });
  }

  async function handleGroupChat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = (e.currentTarget as any)[0].value;

    if (!message) return;

    socket?.emit("send_message_skribbl", {
      ...myDetails,
      roomId,
      message,
      action: "chat",
      isCorrectAnswer: message.toLowerCase() === wordToFind.toLowerCase(),
    });

    (e.currentTarget as any)[0].value = "";
  }

  return (
    <>
      <div className="w-full flex flex-col gap-5">
        {startGame && <Heading>{remainingTime}</Heading>}

        <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="sticky top-0 flex order-5 sm:order-3 lg:order-none flex-col gap-2 col-span-3 sm:col-span-1">
            {currentPlayers.map(({ playerId, image, username }, index) => (
              <Box
                key={playerId}
                className=" p-2 flex items-center justify-between gap-2 bg-gray-500 rounded-md"
              >
                <Heading size="lg" color="white">
                  {index + 1}.
                </Heading>

                <Text fontSize="lg" color="white" fontWeight="medium">
                  {username}
                </Text>

                <Avatar src={image} bg="white" className="!w-10 !h-10" />
              </Box>
            ))}
          </div>

          {startGame && (
            <>
              <div className="w-full col-span-3">
                {isMyTurn ? (
                  <ReactSketchCanvas
                    ref={ref}
                    strokeWidth={5}
                    strokeColor="black"
                    onChange={handleDraw}
                    className="w-full !h-[500px]"
                  />
                ) : (
                  <img
                    className="w-full select-none !h-[500px]"
                    src={drawnPng}
                  />
                )}
              </div>

              <form
                onSubmit={handleGroupChat}
                id="chat-box"
                className="flex flex-col col-span-3 sm:col-span-2 md:col-span-1 order-4 md:order-none bg-white !h-[500px]"
              >
                <div className="flex flex-col h-full overflow-auto bg-gray-100 rounded-sm">
                  {chatMessages.map(
                    ({ username, message, isCorrectAnswer }, index) => (
                      <p
                        key={index + message}
                        className={clsx(
                          isCorrectAnswer
                            ? "border-b bg-green-500 "
                            : "bg-white odd:bg-gray-200",
                          "p-1 font-medium text-black"
                        )}
                      >
                        {username}:{" "}
                        {isCorrectAnswer
                          ? "guessed the word correctly"
                          : message}
                      </p>
                    )
                  )}
                </div>

                <input
                  className="mx-1 mb-1 px-2 py-1 focus:outline-slate-600 border rounded-sm"
                  placeholder="Type your guess here"
                />
              </form>
            </>
          )}
        </div>

        {myDetails.isAdmin && !startGame && currentPlayers.length > 1 ? (
          <Button
            position="fixed"
            className="!fixed !left-1/2 !-translate-x-1/2"
            onClick={() => {
              socket.emit("start_skribbl", { roomId });

              setStartGame(true);
            }}
          >
            Start the game
          </Button>
        ) : (
          !startGame && (
            <Heading size="lg" textAlign="center">
              {myDetails.isAdmin
                ? "Waiting for others to join"
                : "Waiting for admin to start the game"}
            </Heading>
          )
        )}
      </div>

      <Modal
        title="Select a word."
        isOpen={isOpen}
        onClose={() => {}}
        showCloseBtn={false}
      >
        <Stack>
          {randomWords.map((word) => (
            <Button
              key={word}
              onClick={() => {
                setWordToFind(word);

                socket?.emit("send_message_skribbl", {
                  ...myDetails,
                  roomId,
                  action: "word",
                  word,
                });

                onToggle();
              }}
            >
              {word}
            </Button>
          ))}
        </Stack>
      </Modal>
    </>
  );
};
