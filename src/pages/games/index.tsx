import { PageLayout } from "@layouts/PageLayout";
import Link from "next/link";
import React from "react";
import { Card, CardBody, Stack, Text, Heading, Image } from "@chakra-ui/react";
import { allGames } from "@utils/constants/game";

const ViewGames = () => {
  return (
    <PageLayout>
      <div className="w-full flex flex-wrap justify-center gap-5">
        {allGames.map(({ img, name, href, linkText, description }) => (
          <Card
            maxW="sm"
            bg="gray.400"
            key={name}
            className="duration-200 hover:shadow-xl !shadow-gray-600"
          >
            <CardBody>
              <Image
                borderRadius="lg"
                src={img}
                alt="Green double couch with wooden legs"
              />

              <Stack mt="6">
                <Heading size="lg">{name}</Heading>

                <Text fontWeight="medium">{description}</Text>

                <Link
                  href={href}
                  className="!mt-5 w-full text-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
                >
                  {linkText}
                </Link>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default ViewGames;
