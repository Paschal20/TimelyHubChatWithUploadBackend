import mongoose from "mongoose";

const ChatSessionSchema = new mongoose.Schema({
  userId: String,
  query: String,
  response: String,
  timestamp: { type: Date, default: Date.now },
  relatedMaterial: String,
});

export default mongoose.model("ChatSession", ChatSessionSchema);
