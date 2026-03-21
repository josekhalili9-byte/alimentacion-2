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
        "Analiza esta imagen de un alimento. Identifica qué es y proporciona una estimación nutricional por porción estándar. Evalúa qué tan saludable es del 1 al 10. Devuelve los resultados estrictamente en formato JSON con las siguientes claves: name (string), isHealthy (boolean), calories (number), protein (number), fat (number), carbs (number), sugar (number), recommendation ('saludable', 'moderado', o 'poco saludable'), healthScore (number 1-10). No incluyas markdown, solo el JSON puro."
      ]
    });
    
    let resultText = response.text || "";
    // Clean up potential markdown formatting from the response
    if (resultText.startsWith("```json")) {
      resultText = resultText.replace(/```json\n?/, "").replace(/```\n?$/, "");
    }

    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    const result = JSON.parse(resultText);
    
    // Ensure recommendation matches the literal type
    if (!['saludable', 'moderado', 'poco saludable'].includes(result.recommendation)) {
      result.recommendation = result.isHealthy ? 'saludable' : 'poco saludable';
    }

    return result;
  } catch (error) {
    console.error("Error analyzing food image:", error);
    
    // DEMO MODE FALLBACK:
    // Si la API falla (por ejemplo, por límite de cuota en Vercel), 
    // devolvemos un resultado simulado para que la app siga funcionando.
    console.log("Activando Modo Demo por error de API...");
    return {
      name: "Alimento Detectado (Modo Demo)",
      isHealthy: true,
      calories: 250,
      protein: 12,
      fat: 8,
      carbs: 30,
      sugar: 5,
      recommendation: "saludable",
      healthScore: 8
    };
  }
}
