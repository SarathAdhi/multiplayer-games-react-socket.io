import { PageLayout } from "@layouts/PageLayout";
import Link from "next/link";
import React from "react";
import { Card, CardBody, Stack, Text, Heading, Image } from "@chakra-ui/react";

const ViewGames = () => {
  return (
    <PageLayout>
      <div className="w-full flex flex-wrap justify-center gap-2">
        <Card
          maxW="sm"
          bg="gray.400"
          className="duration-200 hover:shadow-xl !shadow-gray-600"
        >
          <CardBody>
            <Image
              borderRadius="lg"
              src="https://cdn.pixabay.com/photo/2013/07/12/15/56/tic-tac-toe-150614_960_720.png"
              alt="Green double couch with wooden legs"
            />

            <Stack mt="6">
              <Heading size="lg">Tic Tac Toe</Heading>

              <Text fontWeight="medium">
                {`Play the classic Tic-Tac-Toe game (also called Noughts and
                Crosses) for free online with your friends.`}
              </Text>

              <Link
                href="/games/xo"
                className="!mt-5 w-full text-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
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
