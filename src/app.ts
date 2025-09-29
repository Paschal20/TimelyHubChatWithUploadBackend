// Express app setup and middleware configuration
import express from "express";
import cors from "cors";
import uploadRouter from "./routes/uploadRoutes";
import chatRouter from "./routes/chatRoutes";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes";

dotenv.config();

const app = express();
app.use(cors());
// app.use(express.json());

app.use("/api", uploadRouter);
app.use("/api", chatRouter);
app.use("/api", authRouter);

export default app;
