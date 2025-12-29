
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export class FoodLensService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeFoodLabel(imageBase64: string, mimeType: string): Promise<AnalysisResult> {
    const prompt = `
      Act as a world-class food scientist and regulatory specialist.
      Analyze the provided image of a food product. 
      
      1. OCR the ingredients and nutrition.
      2. Provide a detailed, authoritative description of the product and its health impact.
      3. Identify if there are any critical "REGULATORY HEALTH ALERTS" (e.g. high caffeine, banned in certain countries).
      4. List all ingredients with their risk level (SAFE, CAUTION, AVOID).
      5. Provide real-world verification links (reputable health sites like WHO, NIH, Healthline) and static knowledge bases.
      6. Assign a risk badge: "HEALTHY", "OCCASIONAL", or "AVOID".
      
      Return JSON strictly matching the requested schema.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: imageBase64, mimeType } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: { type: Type.STRING },
              riskBadge: { type: Type.STRING },
              alert: { type: Type.STRING },
              detailedDescription: { type: Type.STRING },
              healthVerdict: { type: Type.STRING },
              overallScore: { type: Type.NUMBER },
              confidenceScore: { type: Type.NUMBER },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    normalizedName: { type: Type.STRING },
                    originalName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    riskLevel: { type: Type.STRING, enum: ['SAFE', 'CAUTION', 'AVOID'] },
                    usageReason: { type: Type.STRING },
                    sideEffects: { type: Type.STRING },
                    sourceAuthority: { type: Type.STRING }
                  },
                  required: ['name', 'normalizedName', 'riskLevel', 'usageReason']
                }
              },
              nutrition: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.STRING },
                  sugar: { type: Type.STRING },
                  fat: { type: Type.STRING },
                  sodium: { type: Type.STRING }
                }
              },
              verificationLinks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                }
              },
              knowledgeBases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                }
              },
              dataSources: { type: Type.ARRAY, items: { type: Type.STRING } },
              disclaimer: { type: Type.STRING }
            },
            required: ['productName', 'riskBadge', 'detailedDescription', 'ingredients', 'overallScore', 'confidenceScore', 'verificationLinks']
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from AI");
      const result = JSON.parse(text);
      return { ...result, scanDate: new Date().toLocaleDateString() } as AnalysisResult;
    } catch (error) {
      console.error("FoodCheck Analysis Error:", error);
      throw error;
    }
  }
}
