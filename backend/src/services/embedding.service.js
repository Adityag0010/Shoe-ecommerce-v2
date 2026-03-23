
import {ProductDescription} from "../models/productDescription.model.js"; 
import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

export async function generateAndStoreEmbedding(shoeId, descriptionText) {

  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("❌ GEMINI_API_KEY is missing from environment variables!");
    }
    // console.log(`🔑 Key loaded: ${process.env.GEMINI_API_KEY.substring(0,4)}...`);
    
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "text-embedding-004" }); 
  }

  try {
    console.log(`Generating embedding for: "${descriptionText.substring(0, 20)}..."`);

    const result = await model.embedContent(descriptionText);  // Generate embedding
    const vector = result.embedding.values; // Extract embedding vector, result me bahut info : like how many token and all also present h

    const savedDoc = await ProductDescription.findOneAndUpdate(
      { shoe_id: shoeId },
      { 
        shoe_id: shoeId,
        description: descriptionText,
        embedding_description: vector 
      },
      { upsert: true, new: true }  // Create if not exists, return new doc
    );

    console.log("✅ Saved:", shoeId);
    return savedDoc;

  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    
    if (error.message.includes("429")) {
        console.log("⚠️ Rate limit hit. Waiting 10 seconds...");
        await new Promise(r => setTimeout(r, 10000));
    }
  }
}

export async function getEmbeddingVector(text) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("❌ GEMINI_API_KEY is missing from environment variables!");
  }

  try {
    console.log(`Generating embedding for chat query: "${text.substring(0, 40)}..."`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text }] },
          outputDimensionality: 768
        })
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    return data.embedding.values;
  } catch (error) {
    console.error("❌ Gemini Error during chat embedding:", error.message);
    throw error;
  }
}