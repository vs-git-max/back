import { getAuth, requireAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import User from "../models/User";

export type AuthRequest = Request & {
  userId?: string;
};

export const protectRoute = [
  requireAuth(),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { userId: clerkId } = getAuth(req);

      if (!clerkId)
        return res.status(401).json({
          success: false,
          message: "Unauthorized - invalid token",
        });

      const user = await User.findOne({ clerkId });
      if (!user)
        return res
          .status(404)
          .json({ message: "User not found", success: false });

      req.userId = user._id.toString();

      next();
    } catch (error) {
      console.log("Error in protectRoute");
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
