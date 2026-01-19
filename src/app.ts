import express from "express";

const app = express();

//the functions
import userRouter from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";
import chatRoutes from "./routes/chat.routes";
import authRoutes from "./routes/auth.routes";

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

export default app;
