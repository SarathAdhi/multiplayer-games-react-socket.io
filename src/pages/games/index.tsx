import { PageLayout } from "@layouts/PageLayout";
import Link from "next/link";
import React from "react";
import { Card, CardBody, Stack, Text, Heading, Image } from "@chakra-ui/react";

const ViewGames = () => {
  return (
    <PageLayout>
      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        <Card maxW="sm">
          <CardBody>
            <Image
              borderRadius="lg"
              src="https://cdn.pixabay.com/photo/2013/07/12/15/56/tic-tac-toe-150614_960_720.png"
              alt="Green double couch with wooden legs"
            />

            <Stack mt="6" spacing={{ base: "2", md: "3" }} align="start">
              <Heading size="md">Tic Tac Toe</Heading>

              <Text>
                {`Play the classic Tic-Tac-Toe game (also called Noughts and
                Crosses) for free online with your friends.`}
              </Text>

              <Link
                href="/games/xo"
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
              >
                Play Tic-Tac-Toe
              </Link>
            </Stack>
          </CardBody>
        </Card>
      </div>
    </PageLayout>
  );
};

export default ViewGames;
