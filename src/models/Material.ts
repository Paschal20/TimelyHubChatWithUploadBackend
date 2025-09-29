// MongoDB model for storing material metadata and content
import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
  filename: String,
  content: String,
  embedding: [Number],
});

export default mongoose.model("Material", MaterialSchema);
