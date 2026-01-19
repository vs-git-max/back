import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import getMe from "../controllers/auth/getMe.ts";
import authCallback from "../controllers/auth/authCallback.ts";

const authRoutes = Router();

authRoutes.get("/me", protectRoute, getMe);
authRoutes.post("/callback", authCallback);

export default authRoutes;
