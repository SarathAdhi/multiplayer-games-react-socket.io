import React from "react";
import { Button, IconButton, Image, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { pages } from "./page";
import { useRouter } from "next/router";
import clsx from "clsx";
import { FaShareAlt } from "react-icons/fa";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";

const MobileNavbar = () => (
  <Menu>
    <MenuButton
      as={IconButton}
      aria-label="Options"
      icon={<GiHamburgerMenu />}
      variant="outline"
    />
    <MenuList>
      {pages.map(({ name, href, Icon }) => (
        <MenuItem as={Link} href={href} key={name} icon={<Icon />}>
          {name}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
);

export const Navbar = () => {
  const router = useRouter();
  const currentPath = router.asPath;
  const toast = useToast();

  const isGamesPage = currentPath.includes("/games/");

  return (
    <header
      className={clsx(
        "z-50 w-full flex items-center justify-center bg-[#030303] shadow-md",
        !isGamesPage && "sticky top-0"
      )}
    >
      <div className="w-full h-16 p-2 lg:px-4 flex items-center justify-between">
        <Link href="/">
          <Image className="h-12" src="/assets/games/tic-tac-toe.png" />
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-5">
            {pages.map(({ name, href, Icon }) => (
              <Link
                key={name}
                href={href}
                className={clsx(
                  "rounded-full font-medium transition flex items-center gap-1 text-[#6f6f6f]",
                  currentPath === href && "text-gray-200"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{name}</span>
              </Link>
            ))}
          </div>

          {currentPath.includes("?id=") && (
            <Button
              borderRadius={"full"}
              w={10}
              h={10}
              p={0}
              onClick={() => {
                toast({
                  title: "Copied successfully.",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });

                navigator.clipboard.writeText(window.location.href);
              }}
            >
              <FaShareAlt />
            </Button>
          )}

          <div className="block md:hidden">
            <MobileNavbar />
          </div>
        </div>
      </div>
    </header>
  );
};
