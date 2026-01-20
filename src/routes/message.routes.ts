import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import getMessages from "../controllers/messages/getmessages.ts";

const messageRoutes = Router();

messageRoutes.get("/get-messages/:chatId", protectRoute, getMessages);

export default messageRoutes;
