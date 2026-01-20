import { Router } from "express";
import { protectRoute } from "../middleware/auth.ts";
import getUsers from "../controllers/users/getUsers.ts";

const userRouter = Router();

userRouter.get("/get-users", protectRoute, getUsers);

export default userRouter;
