import {
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PageLayout } from "@layouts/PageLayout";
import { uuid } from "@utils/uuid";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardBody } from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export const CreateOrJoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  return (
    <PageLayout className="flex-1 justify-center">
      <div className="grid md:grid-cols-2 gap-5">
        <Card bg="gray.700" color="white">
          <CardBody>
            <Image
              w="full"
              h={{ base: "60", md: "80" }}
              margin="auto"
              borderRadius="lg"
              src="/assets/games/create.svg"
              alt="Create room"
            />

            <Stack mt={{ base: "5", md: "10" }} spacing="3">
              <Heading size="lg">Create a room</Heading>

              <Text py="2">
                Start a new game with your friends. Create a room and share the
                ID with your friends.
              </Text>

              <Link
                href={`?id=${uuid(6)}`}
                className="w-full text-center bg-blue-600 p-2 rounded-md text-white font-medium tracking-wide"
              >
                Create
              </Link>
            </Stack>
          </CardBody>
        </Card>

        <Card bg="gray.700" color="white">
          <CardBody>
            <Image
              w="full"
              h={{ base: "60", md: "80" }}
              margin="auto"
              borderRadius="lg"
              src="/assets/games/join.svg"
              alt="Join room"
            />

            <Stack mt={{ base: "5", md: "10" }} spacing="3">
              <Heading size="lg">Join a room</Heading>

              <Text py="2">
                Join a game with your friends. Enter the room ID and start the
                game.
              </Text>

              <Popover>
                <PopoverTrigger>
                  <Button className="!bg-blue-600 text-white font-medium tracking-wide">
                    Join
                  </Button>
                </PopoverTrigger>

                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader fontWeight="bold">
                    Enter your Room ID
                  </PopoverHeader>
                  <PopoverBody>
                    <Flex gap={2}>
                      <Input
                        className="!w-full !border !border-gray-500 !bg-white"
                        placeholder="uDA1A0"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyUp={(e) => {
                          if (e.key === "Enter") {
                            router.replace(`?id=${roomId}`);
                          }
                        }}
                      />

                      <Link
                        href={`?id=${roomId}`}
                        className="text-center bg-blue-600 p-2 px-4 rounded-md text-white font-medium tracking-wide"
                      >
                        Join
                      </Link>
                    </Flex>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Stack>
          </CardBody>
        </Card>
      </div>
    </PageLayout>
  );
};
