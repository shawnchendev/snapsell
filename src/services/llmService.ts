import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '../env';
import type { GeneratedListing } from '../types/models';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a marketplace listing generator. Given a photo of an item, generate a JSON object with these fields:
- title: a concise, appealing listing title (max 60 chars)
- description: a detailed description highlighting condition, features, and appeal (2-3 sentences)
- category: one of: Outdoor, Home Improvement, Automotive, Furniture, Clothing, Electronics, Appliances, Sports, Tools, Gaming, Computers, Photography, Kids, Music, Fitness
- price: a fair market price as a number (no dollar sign)

Respond with ONLY valid JSON, no markdown, no code fences.`;

export const generateListingFromImage = async (base64Image: string): Promise<GeneratedListing> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    const rawText = response.text;

    if (!rawText) {
      console.error('[LLM] No text in response');
      throw new Error('No response from Gemini API.');
    }

    console.log('[LLM] Raw text:', rawText.slice(0, 300));

    const cleaned = rawText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      title: String(parsed.title ?? 'Untitled Listing'),
      description: String(parsed.description ?? ''),
      category: String(parsed.category ?? 'Uncategorized'),
      price: Number(parsed.price) || 0,
    };
  } catch (err) {
    console.error('[LLM] generateListingFromImage failed:', err);
    throw err;
  }
};
