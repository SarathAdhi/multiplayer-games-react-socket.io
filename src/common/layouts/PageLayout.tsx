import { Navbar } from "@components/Navbar";
import clsx from "clsx";
import Head from "next/head";
import React from "react";
import { Component } from "types/page";

export const PageLayout: React.FC<Component> = ({ className, children }) => {
  return (
    <>
      <Head>
        <title>Next.js + TypeScript Example</title>
      </Head>

      <main className="flex flex-col items-center h-screen bg-[#030303] overflow-auto">
        <Navbar />

        <section
          className={clsx(
            "w-full max-w-[1440px] mt-10 p-2 flex flex-col text-[#6f6f6f]",
            className
          )}
        >
          {children}
        </section>
      </main>
    </>
  );
};
