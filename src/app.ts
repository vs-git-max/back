import express from "express";
import { clerkMiddleware } from "@clerk/express";

const app = express();

//the functions
import userRouter from "./routes/user.routes.ts";
import messageRoutes from "./routes/message.routes.ts";
import chatRoutes from "./routes/chat.routes.ts";
import authRoutes from "./routes/auth.routes.ts";
import errorHandler from "./middleware/error.ts";

app.use(clerkMiddleware());

app.use(express.json());

//checking the health of the app
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running.",
  });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/,auth", authRoutes);

app.use(errorHandler);

export default app;
