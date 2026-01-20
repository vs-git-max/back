import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.ts";
import User from "../../models/User.ts";

async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in the getMe", error);
    res.status(500);
    next(error);
  }
}

export default getMe;
