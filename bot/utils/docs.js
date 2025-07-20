import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";
import fs from "fs";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GENAI_API_KEY);

// Convert file to generative AI part
async function fileToGenerativePart(path, mimeType) {
   const response = await fetch(path);
   const data = await response.arrayBuffer(); // Get ArrayBuffer directly
   const base64Data = Buffer.from(data).toString("base64");

  return {
    inlineData: {
      data:base64Data,
      mimeType,
    },
  };
}

// Utility function to extract text from an image
export const extractText = async (imagePath, mimeType) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const filePart = await fileToGenerativePart(imagePath, mimeType);
    const prompt =
      "Extract the text from the provided image and return it in the following JSON format: {name: <extracted_name>,country: <extracted_country>,passportno:} If the provided image does not contain the required text fields (name or country or passportno), return the following JSON response:{error: 'Cannot find required details'}";

    const imageParts = [filePart];
    const generatedContent = await model.generateContent([
      prompt,
      ...imageParts,
    ]);

    let responseText = generatedContent.response.text().trim();

    const jsonMatch = responseText.match(/\{.*?\}/s);
    const jsonText = jsonMatch ? jsonMatch[0] : "{}";

    let result;
    try {
      result = JSON.parse(jsonText);
    } catch (parseError) {
      return { error: "Failed to parse response as JSON" };
    }

    if (result.error) {
      return { error: result.error };
    }

    if (!result.name || !result.country) {
      return { error: "Cannot find required details in document" };
    }

    return result;
  } catch (error) {
    console.log(error)
    return { error: "An error occurred while processing the image" };
  }
};
