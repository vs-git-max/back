import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.ts";
import IChat from "../../models/Chat.ts";
import { Types } from "mongoose";

async function getOrCreateChats(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;

    const { participantId } = req.params;

    if (!participantId)
      return res
        .json({ success: false, message: "Not participant Id found" })
        .status(404);

    if (!Types.ObjectId.isValid(participantId as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid participant ID",
      });
    }

    if (participantId === userId) {
      return res
        .json({
          success: false,
          message: "You cannot create a chat with yourself",
        })
        .status(400);
    }

    let chat = await IChat.findOne({
      participants: [userId, participantId],
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");

    if (!chat) {
      const newChat = new IChat({
        participants: [userId, participantId],
      });
      await newChat.save();

      chat = await newChat.populate("participants", "name email avatar");
    }

    const otherParticipant = chat.participants.find(
      (p: any) => p._id.toString() !== userId,
    );

    res
      .json({
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      })
      .status(200);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export default getOrCreateChats;
