import { CreateOrJoinRoom } from "@components/CreateOrJoinRoom";
import { PageLayout } from "@layouts/PageLayout";
import { SkribblGameBoard } from "@modules/games/Skribbl";

import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

const SkribblGame = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const id = router.query.id as string;

  useEffect(() => {
    const _username = localStorage.getItem("username");

    if (_username) setUsername(_username);

    setIsLoading(false);
  }, [id]);

  if (isLoading) return <></>;

  if (!id) return <CreateOrJoinRoom setIsAdmin={setIsAdmin} />;

  return (
    <PageLayout>
      <SkribblGameBoard roomId={id} username={username} isAdmin={isAdmin} />
    </PageLayout>
  );
};

export default SkribblGame;
