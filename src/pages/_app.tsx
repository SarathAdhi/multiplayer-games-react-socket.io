import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading)
    return (
      <main className="h-screen grid place-content-center">
        <Spinner />
      </main>
    );

  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
