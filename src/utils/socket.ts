import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import User from "../models/User";
import IChat from "../models/Chat";
import Message from "../models/Message";

interface SocketWithUserId extends Socket {
  userId: string;
}

//store online users in memory: userId and socketId
export const onlineUsers: Map<string, string> = new Map();

export function initializeSocket(httpServer: HttpServer) {
  const allowedOrigins = [
    "http://localhost:8001",
    "http://localhost:3001",
    "http://localhost:5001",
  ];

  const io = new SocketServer(httpServer, {
    cors: { origin: allowedOrigins },
  });

  //verify the socket connection

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token; //what the user will be sending from the frontend

    if (!token) return next(new Error("Authentication error"));

    try {
      const session = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      const clerkId = session.sub;

      const user = await User.findOne({ clerkId });

      if (!user) return next(new Error("User not found"));

      (socket as SocketWithUserId).userId = user._id.toString();

      next();
    } catch (error: any) {
      next(new Error(error.message));
    }
  });

  //the connection event name is special and should be written like it is
  //its the even triggered when a new user connects to the server

  io.on("connection", (socket) => {
    const userId = (socket as SocketWithUserId).userId;

    //send a list of currently online users to the newly connected client
    socket.emit("online-users", { userId: Array.from(onlineUsers.keys()) });

    //store user in the onlineUsers map
    onlineUsers.set(userId, socket.id);

    //notify others that the user is online
    socket.broadcast.emit("user-online", { userId });

    //joining the private room
    socket.join(`user:${userId}`);

    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
    });
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
    });

    //handle sending messages
    socket.on(
      "send-message",
      async (data: { chatId: string; text: string }) => {
        try {
          const { chatId, text } = data;

          const chat = await IChat.findOne({
            _id: chatId,
            participants: userId,
          });

          if (!chat) {
            socket.emit("socket-error", {
              message: "Chat not found",
            });
            return;
          }

          const message = await Message.create({
            chat: chatId,
            sender: userId,
            text,
          });

          chat.lastMessage = message._id;
          chat.lastMessageAt = new Date();

          await chat.save();

          await message.populate("sender", "name  avatar");

          //emit to the chatroom for users within the chat
          io.to(`chat:${chatId}`).emit("new-message", message);

          //update the chat list view by making sure that all participants have the messages
          for (const participantsId of chat.participants) {
            io.to(`user:${participantsId}`).emit("new-message", message);
          }
        } catch (error) {
          socket.emit("socket-error", {
            message: "Failed to send the message",
          });
        }
      },
    );

    //TODO
    socket.on("typing", async (data) => {});

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);

      //notify others
      socket.broadcast.emit("user-offline", { userId });
    });
  });

  return io;
}
