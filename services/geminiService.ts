
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

// Basic instance for standard tasks
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Personalized Product Filtering using Gemini 3 Pro
 */
export const getPersonalizedRecommendations = async (userPhotoBase64: string, category: string) => {
  const ai = getAI();
  const categoryProducts = MOCK_PRODUCTS.filter(p => p.category === category);
  
  const productListStr = categoryProducts.map(p => 
    `ID: ${p.id}, Name: ${p.name}, Description: ${p.description}`
  ).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: userPhotoBase64 } },
          { text: `Analyze the person in this photo. Out of the following products in the category "${category}", identify which ones would look best on them based on their body type, skin tone, and apparent style. Return the IDs of the recommended products as a JSON list. 
          
          Products:
          ${productListStr}` }
        ]
      },
      config: {
        systemInstruction: "You are an elite AI stylist. Analyze photos with precision and recommend fashion that enhances the user's natural features. Return ONLY a valid JSON array of strings (the IDs).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]') as string[];
  } catch (error) {
    console.error("Personalized Filter Error:", error);
    return categoryProducts.map(p => p.id); // Fallback to all items in category
  }
};

/**
 * Image Analysis using Gemini 3 Pro
 */
export const analyzeFashionImage = async (base64: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64 } },
          { text: "Analyze this fashion item or outfit. Identify the style, fabric type, and suggest how to style it with minimalist luxury pieces. Keep it concise." }
        ]
      },
      config: {
        systemInstruction: "You are an expert fashion curator. Your tone is sophisticated and professional."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Could not analyze the image at this time.";
  }
};

/**
 * Search Grounded Advice using Gemini 3 Flash
 */
export const getSearchGroundedAdvice = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide the latest fashion trends and specific advice for: ${query}. Include real-world references if possible.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text;
    const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text, links };
  } catch (error) {
    console.error("Search Grounding Error:", error);
    return { text: "Trend data is currently unavailable. Stick to timeless minimal classics.", links: [] };
  }
};

/**
 * High Quality Image Generation using Gemini 3 Pro Image
 */
export const generateStudioImage = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A high-end luxury fashion product shot. ${prompt}. Minimalist studio background, soft lighting, 8k resolution, professional photography.` }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: size
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

/**
 * Image Editing using Gemini 2.5 Flash Image
 */
export const editFashionImage = async (base64: string, editPrompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64 } },
          { text: `Edit this fashion photo: ${editPrompt}. Maintain the high-end luxury aesthetic.` }
        ]
      },
      config: {
        imageConfig: { aspectRatio: "3:4" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    return null;
  }
};

export const getFashionAdvice = async (occasion: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest", // Fast response model
      contents: `Suggest a fashion style and key pieces for a ${occasion}. Give a short, stylish summary.`,
      config: {
        systemInstruction: "You are a senior fashion editor at Vogue. Your advice is minimal, luxury-focused, and trend-aware.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Elegance is the only beauty that never fades.";
  }
};

export const generateFitCheckImage = async (
  productName: string, 
  productImageBase64?: string, 
  userImageBase64?: string | null,
  color?: string,
  pose: 'Front' | 'Left' | 'Right' | 'Back' = 'Front'
) => {
  const ai = getAI();
  try {
    let prompt = "";
    const parts: any[] = [];
    const colorDesc = color ? ` in color ${color}` : "";
    const poseDesc = `The person is standing and showing the ${pose} side view.`;

    if (userImageBase64) {
      prompt = `A high-end, professional fashion photograph. The exact person from the first image is now wearing the garment shown in the second image. The garment is a ${productName}${colorDesc}. ${poseDesc} Replicate texture precisely. Solid clean white background.`;
      parts.push({ inlineData: { mimeType: "image/jpeg", data: userImageBase64 } });
    } else {
      prompt = `A high-end fashion e-commerce photo of a model wearing the ${productName}${colorDesc}. ${poseDesc} Replicate fit and design. Clean white background.`;
    }

    if (productImageBase64) {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: productImageBase64 } });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { imageConfig: { aspectRatio: "3:4" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Fit Check Error:", error);
    return null;
  }
};

const inventoryDescription = MOCK_PRODUCTS.map(p => 
  `- ID: ${p.id}, Name: ${p.name}, Description: ${p.description}, Price: $${p.price}`
).join('\n');

export const createStylistChat = () => {
  const ai = getAI();
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Lumi, a luxury fashion consultant. Inventory:
      ${inventoryDescription}
      Suggest 1-3 items as JSON: { 'text': string, 'suggestedProductIds': string[] }. Use sophisticated tone.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          suggestedProductIds: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["text", "suggestedProductIds"]
      }
    },
  });
};
