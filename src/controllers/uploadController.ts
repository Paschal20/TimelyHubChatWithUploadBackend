// Handles file uploads and text extraction
import { Request, Response } from "express";
import { extractTextFromPDF } from "../services/textExtractor";
import { embedText } from "../services/cohereService";
import Material from "../models/Material";

export const uploadMaterial = async (req: Request, res: Response) => {
  console.log("req.file:", req.file);
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const text = await extractTextFromPDF(file.path);
    let embedding: number[] = [];
    try {
      embedding = await embedText(text);
    } catch (embedError) {
      console.warn("Embedding failed, proceeding without embedding:", embedError);
    }

    const material = new Material({
      filename: file.originalname,
      content: text,
      embedding,
    });

    await material.save();
    res
      .status(200)
      .json({ message: "Material uploaded and processed successfully" });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Upload failed", details: errMsg });
  }
};
