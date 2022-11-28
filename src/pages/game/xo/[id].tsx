import { PageLayout } from "@layouts/PageLayout";
import { XOGameBoard } from "@modules/games/XO/indexXO";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Button, Input } from "@chakra-ui/react";

type UsernameCompProps = {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setShowUsernameComponent: React.Dispatch<React.SetStateAction<boolean>>;
};

const UsernameComponent: React.FC<UsernameCompProps> = ({
  username,
  setUsername,
  setShowUsernameComponent,
}) => (
  <div className="max-w-full w-[500px] h-full flex items-center justify-center gap-2">
    <Input
      bgColor={"white"}
      placeholder="Enter your username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
    />

    <Button
      bgColor={"green.500"}
      _hover={{ bgColor: "green.600" }}
      _active={{ bgColor: "green.400" }}
      color={"white"}
      onClick={() => setShowUsernameComponent(username ? false : true)}
    >
      Start
    </Button>
  </div>
);

const XOGame = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [showUsernameComponent, setShowUsernameComponent] = useState(true);

  const id = router.query.id as string;

  return (
    <PageLayout className="items-center">
      <h1 className="top-10 fixed text-4xl font-bold">X-O Game</h1>

      {showUsernameComponent ? (
        <UsernameComponent
          username={username}
          setUsername={setUsername}
          setShowUsernameComponent={setShowUsernameComponent}
        />
      ) : (
        <XOGameBoard roomId={id} username={username} />
      )}
    </PageLayout>
  );
};

export default XOGame;
