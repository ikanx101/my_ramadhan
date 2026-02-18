
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRamadanInsight = async (day: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berikan satu kutipan islami pendek (spirit Ramadan) untuk hari ke-${day} di bulan Ramadan dalam bahasa Indonesia. 
      PENTING: Berikan jawaban hanya berupa teks polos (plain text). 
      DILARANG menggunakan format markdown seperti bintang (**), pagar (#), atau list (-). 
      Langsung berikan kutipan dan maknanya dalam satu paragraf singkat.`,
      config: {
        temperature: 0.7,
      }
    });
    // Extra safety: strip any lingering markdown-like characters
    return (response.text || "Semoga Ramadan ini membawa berkah bagi kita semua.").replace(/[*#_~`]/g, '');
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Jadikan setiap detik di bulan Ramadan sebagai ladang pahala.";
  }
};
