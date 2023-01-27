import { PageLayout } from "@layouts/PageLayout";
import { XOGameBoard } from "@modules/games/XO/indexXO";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import { CreateOrJoinRoom } from "@components/CreateOrJoinRoom";
import { uuid } from "@utils/uuid";

const XOGame = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const id = router.query.id as string;

  useEffect(() => {
    const _username = localStorage.getItem("username");

    setUsername(_username || `Player-${uuid(4)}`);

    setIsLoading(false);
  }, [id]);

  if (isLoading) return <></>;

  if (!id) return <CreateOrJoinRoom />;

  console.log({ username });

  return (
    <PageLayout title="Games | Tic Tac Toe" className="items-center">
      <div className="w-full h-full flex flex-col items-center">
        <Heading size="xl">Tic Tac Toe</Heading>

        <XOGameBoard roomId={id} username={username || "Bunny 123"} />
      </div>
    </PageLayout>
  );
};

export default XOGame;
