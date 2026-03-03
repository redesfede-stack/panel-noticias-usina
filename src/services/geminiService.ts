
import { GoogleGenAI, Type } from "@google/genai";
import { Rating } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeSentiment = async (title: string): Promise<Rating | null> => {
  if (!API_KEY) {
    console.error("Cannot analyze sentiment: Gemini API key not available.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza el sentimiento del siguiente titular de noticia y clasifícalo como 'positive', 'negative' o 'neutral'. Titular: "${title}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "El sentimiento del titular, que debe ser 'positive', 'negative' o 'neutral'.",
            },
          },
          required: ['sentiment'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    const sentiment = result.sentiment;

    if (sentiment === 'positive' || sentiment === 'negative' || sentiment === 'neutral') {
      return sentiment as Rating;
    }

    console.warn("Gemini returned an unexpected sentiment value:", sentiment);
    return 'neutral'; // Fallback to neutral if the value is unexpected
  } catch (error) {
    console.error("Error analyzing sentiment with Gemini:", error);
    return null;
  }
};
