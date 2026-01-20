import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.ts";
import IChat from "../../models/Chat.ts";
import Message from "../../models/Message.ts";

async function getMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await IChat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat)
      return res
        .status(404)
        .json({ message: "Chat not found", success: false });

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 }); //oldest one first

    res.json(messages);
  } catch (error) {
    res.json(500);
    next();
  }
}

export default getMessages;
