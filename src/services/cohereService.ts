// Interacts with Cohere API for embeddings and chat
import axios from "axios";

const COHERE_API_KEY = process.env.COHERE_API_KEY;

export const embedText = async (text: string): Promise<number[]> => {
  const response = await axios.post(
    "https://api.cohere.ai/embed",
    {
      texts: [text],
      model: "embed-english-v2.0",
    },
    {
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
      },
    }
  );
  return response.data.embeddings[0];
};

export const generateResponse = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    "https://api.cohere.ai/generate",
    {
      model: "command",
      prompt,
      max_tokens: 300,
    },
    {
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
      },
    }
  );
  return response.data.generations[0].text;
};

export const summarizeText = async (text: string): Promise<string> => {
  const response = await axios.post(
    "https://api.cohere.ai/summarize",
    {
      text,
      length: "medium",
      format: "paragraph",
      model: "summarize-xlarge",
    },
    {
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
      },
    }
  );
  return response.data.summary;
};
