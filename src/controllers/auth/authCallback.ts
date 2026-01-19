import { clerkClient, getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import User from "../../models/User.ts";

async function authCallback(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });
    let user = await User.findOne({ clerkId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "User",
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl,
      });
    }

    res.json(user).status(200);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export default authCallback;
