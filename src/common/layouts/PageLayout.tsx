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

      <main className="flex flex-col items-center justify-center h-screen bg-slate-200">
        <Navbar />
        <section
          className={clsx(
            "w-full h-full max-w-[1440px] p-2 flex flex-col mt-5",
            className
          )}
        >
          {children}
        </section>
      </main>
    </>
  );
};
