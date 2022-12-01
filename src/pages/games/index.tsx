import { PageLayout } from "@layouts/PageLayout";
import Link from "next/link";
import React from "react";
import { Card, CardBody, Text, Heading, Image } from "@chakra-ui/react";
import { allGames } from "@utils/constants/game";

const ViewGames = () => {
  return (
    <PageLayout>
      <div className="w-full flex flex-wrap justify-center gap-5">
        {allGames.map(({ img, name, href, linkText, description }) => (
          <Card
            maxW={{ base: "full", sm: "xs" }}
            bg="gray.400"
            key={name}
            className="duration-200 hover:shadow-xl !shadow-gray-600"
          >
            <CardBody className="flex flex-col">
              <Image
                borderRadius="lg"
                src={img}
                alt="Green double couch with wooden legs"
              />

              <div className="h-full mt-5 flex flex-col justify-between">
                <div className="grid gap-1">
                  <Heading size="lg">{name}</Heading>

                  <Text fontWeight="medium">{description}</Text>
                </div>

                <Link
                  href={href}
                  className="!mt-5 w-full text-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-md"
                >
                  {linkText}
                </Link>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default ViewGames;
