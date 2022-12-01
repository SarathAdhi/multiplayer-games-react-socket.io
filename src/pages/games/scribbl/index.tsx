import { CreateOrJoinRoom } from "@components/CreateOrJoinRoom";
import { PageLayout } from "@layouts/PageLayout";
import { ScribleGameBoard } from "@modules/games/Scribbl";

import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const ScribblGame = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUsernameComponent, setShowUsernameComponent] = useState(true);

  const id = router.query.id as string;

  useEffect(() => {
    const _username = localStorage.getItem("username");

    if (_username) {
      setUsername(_username);
      setShowUsernameComponent(false);
    }

    setIsLoading(false);
  }, [id]);

  if (isLoading) return <></>;

  if (!id) return <CreateOrJoinRoom setIsAdmin={setIsAdmin} />;

  return (
    <PageLayout>
      <ScribleGameBoard roomId={id} username={username} isAdmin={isAdmin} />
    </PageLayout>
  );
};

export default ScribblGame;
