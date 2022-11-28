import { PageLayout } from "@layouts/PageLayout";
import { XOGameBoard } from "@modules/games/XO/indexXO";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Heading, Input } from "@chakra-ui/react";
import { uuid } from "@utils/uuid";
import Link from "next/link";

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
  <div className="w-full max-w-[700px] h-full flex items-center justify-center gap-2">
    <Input
      className="!w-full !border !border-gray-500 !bg-white"
      placeholder="Enter your username"
      value={username}
      onChange={(e) => {
        setUsername(e.target.value);
        localStorage.setItem("username", e.target.value);
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          setShowUsernameComponent(username ? false : true);
        }
      }}
    />

    <Button
      color={"white"}
      letterSpacing="1px"
      className="!bg-blue-600"
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

  useEffect(() => {
    const _username = localStorage.getItem("username");

    if (_username) {
      setUsername(_username);
      setShowUsernameComponent(false);
    }
  }, [id]);

  return (
    <PageLayout className="items-center">
      {id ? (
        <div className="w-full h-full flex flex-col items-center">
          <Heading size="xl" className="-mb-10">
            Tic Tac Toe
          </Heading>

          {showUsernameComponent ? (
            <UsernameComponent
              username={username}
              setUsername={setUsername}
              setShowUsernameComponent={setShowUsernameComponent}
            />
          ) : (
            <XOGameBoard roomId={id} username={username} />
          )}
        </div>
      ) : (
        <div className="h-full grid place-content-center place-items-center gap-4">
          <Heading size="xl">Create a new room</Heading>

          <Link
            href={`?id=${uuid(6)}`}
            className="bg-blue-600 px-3 py-1 rounded-md text-white font-medium tracking-wide"
          >
            Create
          </Link>
        </div>
      )}
    </PageLayout>
  );
};

export default XOGame;
