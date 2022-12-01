import { Heading } from "@chakra-ui/react";
import { PageLayout } from "@layouts/PageLayout";

export default function Home() {
  return (
    <PageLayout className="flex-1 items-center justify-center">
      <div className="grid gap-2">
        <Heading size="3xl" fontFamily="serif">
          Play Realtime online games with your friends
        </Heading>

        <Heading size="lg" as={"p"} fontFamily="monospace">
          Free online multiplayer games.
        </Heading>
      </div>
    </PageLayout>
  );
}
