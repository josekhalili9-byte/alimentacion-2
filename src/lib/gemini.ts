import { GoogleGenAI, Type } from '@google/genai';
import { FoodAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeFoodImage(base64Image: string, mimeType: string): Promise<Omit<FoodAnalysis, 'id' | 'date' | 'imageUrl'>> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType
          }
        },
        "Analiza esta imagen de un alimento. Identifica qué es y proporciona una estimación nutricional por porción estándar. Evalúa qué tan saludable es del 1 al 10. Devuelve los resultados estrictamente en formato JSON."
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Nombre del alimento detectado" },
            isHealthy: { type: Type.BOOLEAN, description: "¿Es considerado un alimento saludable en general?" },
            calories: { type: Type.NUMBER, description: "Calorías estimadas (kcal)" },
            protein: { type: Type.NUMBER, description: "Proteínas estimadas en gramos" },
            fat: { type: Type.NUMBER, description: "Grasas estimadas en gramos" },
            carbs: { type: Type.NUMBER, description: "Carbohidratos estimados en gramos" },
            sugar: { type: Type.NUMBER, description: "Nivel de azúcar estimado en gramos" },
            recommendation: { type: Type.STRING, description: "Debe ser exactamente una de estas opciones: 'saludable', 'moderado', o 'poco saludable'" },
            healthScore: { type: Type.NUMBER, description: "Calificación del 1 al 10 de qué tan saludable es el alimento (10 es lo más saludable)" }
          },
          required: ["name", "isHealthy", "calories", "protein", "fat", "carbs", "sugar", "recommendation", "healthScore"]
        }
      }
    });
    
    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(response.text);
    
    // Ensure recommendation matches the literal type
    if (!['saludable', 'moderado', 'poco saludable'].includes(result.recommendation)) {
      result.recommendation = result.isHealthy ? 'saludable' : 'poco saludable';
    }

    return result;
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw error;
  }
}
