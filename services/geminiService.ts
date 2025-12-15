import { GoogleGenAI, Type } from "@google/genai";
import { CareTipResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getPlantCareAdvice = async (plantName: string): Promise<CareTipResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    const response = await ai.models.generateContent({
      model,
      contents: `Provide care instructions for a plant named "${plantName}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            light: { type: Type.STRING, description: "Light requirements" },
            water: { type: Type.STRING, description: "Watering frequency and needs" },
            soil: { type: Type.STRING, description: "Soil type recommendations" },
            temperature: { type: Type.STRING, description: "Ideal temperature range" },
            summary: { type: Type.STRING, description: "A brief, friendly summary of the plant's personality." }
          },
          required: ["light", "water", "soil", "temperature", "summary"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as CareTipResponse;

  } catch (error) {
    console.error("Error fetching plant care advice:", error);
    return {
      light: "Consult a local expert.",
      water: "Check soil moisture regularly.",
      soil: "Standard potting mix.",
      temperature: "Keep away from drafts.",
      summary: "We couldn't retrieve specific AI details for this plant right now."
    };
  }
};
