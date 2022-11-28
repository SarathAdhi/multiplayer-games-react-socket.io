import React from "react";
import { Button, Heading, IconButton, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { pages } from "./page";
import { useRouter } from "next/router";
import clsx from "clsx";
import { FaShareAlt } from "react-icons/fa";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
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

  return (
    <header className="w-full flex items-center justify-center bg-white shadow-md">
      <div className="w-[1440px] max-w-full p-2 flex items-center justify-between">
        <Link href="/">
          <Heading size="lg" color="GrayText">
            MG
          </Heading>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {pages.map(({ name, href, Icon }) => (
              <Link
                key={name}
                href={href}
                className={clsx(
                  "px-3 py-2 rounded-full font-bold transition flex items-center gap-1",
                  currentPath === href && "bg-gray-200"
                )}
              >
                <Icon className="w-5 h-5" />
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
