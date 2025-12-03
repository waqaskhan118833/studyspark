/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { Quiz } from '../types';

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Robust JSON parser for AI responses
const parseAIJson = (text: string | undefined): any => {
  if (!text) return null;
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.error("Failed to parse JSON:", clean);
    return null;
  }
};

export const explainTopic = async (topic: string, simplify: boolean = false): Promise<string> => {
  const ai = getAI();
  
  const prompt = simplify 
    ? `Explain "${topic}" to me like I'm 10 years old. Use very simple words and a fun example. Keep it under 3 sentences.`
    : `Explain "${topic}" simply and clearly for a student. Include one key fact. Keep it short and friendly.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are StudySpark, a friendly AI study buddy. You help students on low-end phones, so you keep answers very short, clear, and encouraging. Never lecture."
      }
    });
    return response.text || "I couldn't explain that right now, but keep trying!";
  } catch (error) {
    return "Oops, my brain froze! Try asking again.";
  }
};

export const generateQuiz = async (topic: string): Promise<Quiz | null> => {
  const ai = getAI();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a mini quiz about "${topic}" with 3 questions.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctAnswerIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING }
                },
                required: ['question', 'options', 'correctAnswerIndex', 'explanation']
              }
            }
          },
          required: ['topic', 'questions']
        }
      }
    });

    const data = parseAIJson(response.text);
    return data as Quiz;
  } catch (error) {
    console.error("Quiz generation failed", error);
    return null;
  }
};

export const getMotivation = async (): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Give me a super short (5 words max) high-energy compliment for a student studying hard.",
    });
    return response.text?.trim() || "You are doing great!";
  } catch (error) {
    return "Keep going!";
  }
};