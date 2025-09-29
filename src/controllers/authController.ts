import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "", {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: "Sign-in failed", details: errMsg });
  }
};
