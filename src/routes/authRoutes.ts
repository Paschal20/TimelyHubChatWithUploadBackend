import express from "express";
import { signIn } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/signin", signIn);

export default authRouter;
