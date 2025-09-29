// Handles chat queries and context-aware responses
import { Request, Response } from "express";
import {
  embedText,
  generateResponse,
  summarizeText,
} from "../services/cohereService";
import Material from "../models/Material";
import ChatSession from "../models/ChatSession";
import { findRelevantChunks, findRelevantChunksByKeywords } from "../utils/embeddingUtils";
import jwt from "jsonwebtoken";

export const chatWithBot = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decoded: any = jwt.verify(token || "", process.env.JWT_SECRET || "");
    const userId = decoded.id;

    let queryEmbedding: number[] = [];
    let relevantChunks: string[] = [];
    try {
      queryEmbedding = await embedText(query);
      const materials = await Material.find();
      relevantChunks = findRelevantChunks(queryEmbedding, materials);
    } catch (embedError) {
      console.warn("Query embedding failed, falling back to keyword search:", embedError);
      const materials = await Material.find();
      relevantChunks = findRelevantChunksByKeywords(query, materials);
    }

    const previousChats = await ChatSession.find({ userId })
      .sort({ timestamp: -1 })
      .limit(5);
    const history = previousChats
      .map((chat) => `User: ${chat.query}\nTutor: ${chat.response}`)
      .join("\n");

    let summarizedHistory = "";
    try {
      summarizedHistory = await summarizeText(history);
    } catch (summarizeError) {
      console.warn("Summarize failed, proceeding without summary:", summarizeError);
      summarizedHistory = history; // use raw history
    }
    const prompt = `You are a friendly tutor. Here's the recent conversation summary:\n${summarizedHistory}\n\nNow answer this:\n${query}\nRelevant Material:\n${relevantChunks.join(
      "\n"
    )}`;

    const response = await generateResponse(prompt);

    const chatSession = new ChatSession({
      userId,
      query,
      response,
      timestamp: new Date(),
      relatedMaterial: relevantChunks.join("\n"),
    });

    await chatSession.save();
    res.status(200).json({ response });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Chat failed", details: errMsg });
  }
};
