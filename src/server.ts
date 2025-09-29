// Starts the server and connects to MongoDB
import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 5020;
const MONGO_URL = process.env.MONGO_URL || "";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
