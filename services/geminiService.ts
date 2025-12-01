
import { GoogleGenAI, Type } from "@google/genai";
import { Role } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateDashboardSummarySchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    summaryPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    recommendation: { type: Type.STRING },
  },
};

export const generateDashboardSummary = async (role: Role): Promise<string> => {
    if (!process.env.API_KEY) {
        return JSON.stringify({
            title: "AI Assistant Offline",
            summaryPoints: ["API Key is not configured.", "Please set the API_KEY environment variable to enable this feature."],
            recommendation: "Contact your system administrator."
        });
    }

    let prompt = `
      You are an AI assistant for EriPro Connect, a professional platform.
      Generate a concise, insightful dashboard summary for a user with the role of "${role}".
      The summary should be motivating and actionable, focusing on key priorities for that role.
      Provide a title, 3-4 summary bullet points, and one key recommendation.
      
      Example Data (for context, do not repeat):
      - Company Goals: Increase Q4 revenue by 15%, Launch Project Phoenix.
      - Recent Activities: Successful marketing campaign, minor server outage yesterday.
      - User Metrics: User engagement is up 10% week-over-week.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: generateDashboardSummarySchema,
                temperature: 0.8,
            }
        });
        
        // FIX: Clean the response text to remove markdown formatting before returning.
        let jsonText = response.text.trim();
        const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
        const match = jsonText.match(jsonRegex);
        if (match && match[1]) {
            jsonText = match[1];
        }
        return jsonText;
    } catch (error) {
        console.error("Error generating summary with Gemini:", error);
        return JSON.stringify({
            title: "Error Generating Summary",
            summaryPoints: ["Could not connect to the AI assistant.", "There might be an issue with the API or configuration."],
            recommendation: "Please try again later or contact support."
        });
    }
};
