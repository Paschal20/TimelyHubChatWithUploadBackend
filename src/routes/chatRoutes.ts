// Defines routes for chatting with the bot
import express from "express";
import { chatWithBot } from "../controllers/chatController";

const chatRouter = express.Router();

chatRouter.post("/chat", chatWithBot);

export default chatRouter;
