// Defines routes for uploading materials
import express from "express";
import multer from "multer";
import { uploadMaterial } from "../controllers/uploadController";

const uploadRouter = express.Router();
const upload = multer({ dest: "uploads/" });

uploadRouter.post("/upload", upload.single("file"), uploadMaterial);

export default uploadRouter;
