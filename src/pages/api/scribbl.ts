import { Players } from "@modules/games/Skribbl";
import { NextApiRequest } from "next";
import { Server } from "socket.io";

let currentPlayers: Players[] = [];

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("join_skribbl_room", (obj) => {
      console.log("Joined room");

      let count = io.sockets.adapter.rooms.get(obj.roomId)?.size!;
      count = count ? count : 0;
      const _player = { ...obj.player, isAdmin: count === 0 };

      if (count === 0) io.to(socket.id).emit("new_admin", "You are the admin");

      console.log({ count });

      currentPlayers = currentPlayers.map((player) =>
        player.username === _player.username && player.roomId === _player.roomId
          ? { ...player, playerId: _player.playerId, socketId: socket.id }
          : { ...player, socketId: socket.id }
      );

      socket.join(obj.roomId);
      (socket as any).username = _player.username;

      const isUserAlreadyInRoom = currentPlayers.some(
        (player) => player.username === _player.username
      );

      if (!isUserAlreadyInRoom) {
        currentPlayers.push({
          ...obj.player,
          id: count,
          socketId: socket.id,
        });
      }

      io.to(obj.roomId).emit("player_joined", { currentPlayers });
    });

    socket.on("start_skribbl", (obj) => {
      io.to(obj.roomId).emit("start_skribbl_init", {
        currentPlayers,
        playerTurn: currentPlayers[0].playerId,
      });
    });

    socket.on("next_player_turn", (obj) => {
      const playerIndex = currentPlayers.findIndex(
        (player) => player.playerId === obj.playerId
      );

      const nextPlayerIndex =
        playerIndex + 1 === currentPlayers.length ? 0 : playerIndex + 1;

      io.to(obj.roomId).emit("change_player_turn", {
        currentPlayers,
        playerTurn: currentPlayers[nextPlayerIndex].playerId,
      });
    });

    socket.on("send_message_skribbl", (obj) => {
      if (obj.action === "chat")
        io.in(obj.roomId).emit("receive_chat_message", obj);
      //
      else if (obj.action === "draw")
        io.in(obj.roomId).emit("receive_drawing", obj);
      //
      else {
        // const adminPlayer = currentPlayers.find((player) => player.isAdmin);

        io.in(obj.roomId).emit("receive_word_to_find", obj);
      }
    });

    socket.on("winner_skribbl", (obj) => {
      const result = {
        result: obj,
        currentPlayers,
      };

      io.in(obj.roomId).emit("announce_winner", result);
    });

    socket.on("leave_room", (obj) => {
      const count = io.sockets.adapter.rooms.get(obj.roomId)?.size!;

      if (count === 2) {
        io.socketsLeave(obj.roomId);
      } else {
        socket.leave(obj.roomId);
        currentPlayers = currentPlayers.filter(
          (player) => player.playerId !== obj.player.playerId
        );
      }

      io.to(socket.id).emit("reset_tile", obj);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");

      let _isAdmin = false;

      const user = currentPlayers.find(
        (player) => player.username === (socket as any).username
      );

      if (user?.isAdmin) {
        _isAdmin = true;
      }

      currentPlayers = currentPlayers.filter(
        (player) => player.username !== (socket as any).username
      );

      // changing the id of the players
      currentPlayers = currentPlayers.map((player, index) => {
        return {
          ...player,
          id: index + 1,
          isAdmin: index === 0 ? true : false,
        };
      });

      console.log({ currentPlayers });

      io.to(user?.socketId!).emit(
        "new_admin",
        "You are the admin. You previous admin has left the game."
      );

      io.in(user?.roomId!).emit("player_joined", { currentPlayers });
    });
  });

  console.log("Setting up socket");
  res.end();
}
