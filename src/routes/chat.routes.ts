import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import getChats from "../controllers/chat/getChats.ts";
import getOrCreateChats from "../controllers/chat/getOrCreateChats.ts";

const chatRoutes = Router();

chatRoutes.get("/get-chats", protectRoute, getChats);
chatRoutes.post(
  "/get-or-create-chats/:participantId",
  protectRoute,
  getOrCreateChats,
);

export default chatRoutes;
