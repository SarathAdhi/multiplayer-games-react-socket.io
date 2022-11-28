import io from "socket.io-client";
import { useState, useEffect } from "react";
import { PageLayout } from "@layouts/PageLayout";

let socket: any;

type Message = {
  author: string;
  message: string;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [chosenUsername, setChosenUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);

  // useEffect(() => {
  //   socketInitializer();

  //   return () => {
  //     socket = null;
  //   };
  // }, []);

  // const socketInitializer = async () => {
  //   await fetch("/api/socket");

  //   socket = io();

  //   socket.emit("join_xo_room", { username, roomId: "123" });

  //   socket.on("receive_message", (data) => {
  //     setMessages((currentMsg) => [...currentMsg, data]);
  //   });
  // };

  // const sendMessage = async () => {
  //   socket.emit("send_message", {
  //     roomId: "123",
  //     author: chosenUsername,
  //     message,
  //   });

  //   setMessage("");
  // };

  // const handleKeypress = (e) => {
  //   if (e.keyCode === 13) {
  //     if (message) {
  //       sendMessage();
  //     }
  //   }
  // };

  return (
    <PageLayout className="flex items-center">
      <p>Hello</p>
    </PageLayout>
  );
}
