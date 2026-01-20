import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.ts";
import IChat from "../../models/Chat.ts";

async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const chats = await IChat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (p) => p._id.toString() !== userId,
      );

      return {
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });

    res.json(formattedChats).status(200);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export default getChats;
