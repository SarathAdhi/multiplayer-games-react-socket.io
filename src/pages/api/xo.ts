import { NextApiRequest, NextApiResponse } from "next";
import { Server, Socket } from "socket.io";

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join_xo_room", (obj) => {
      console.log("Joined room");
      socket.join(obj.roomId);

      const count = io.sockets.adapter.rooms.get(obj.roomId)?.size!;
      console.log({ count });

      const newObject = {
        ...obj,
        playerSymbol: count <= 1 ? "X" : "O",
        gameStatus: count === 2 ? "START" : "WAIT",
        count,
      };

      io.to(socket.id).emit("start_xo", newObject);

      if (count <= 2) {
        io.in(obj.roomId).emit("waiting_lobby", newObject);
      }

      // socket.broadcast.emit("newIncomingMessage", obj);
    });

    socket.on("send_message_xo", (obj) => {
      console.log({ obj });
      io.in(obj.roomId).emit("receive_message_xo", obj);
    });

    socket.on("winner_xo", (obj) => {
      console.log({ obj });
      io.in(obj.roomId).emit("announce_winner", obj);
    });
  });

  console.log("Setting up socket");
  res.end();
}
