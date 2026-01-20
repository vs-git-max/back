import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.ts";
import User from "../../models/User.ts";

async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;
    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);

    res.json(users).status(200);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export default getUsers;
