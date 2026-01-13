import { GoogleGenAI, Type } from "@google/genai";
import { Character } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for the text generation model
const SYSTEM_INSTRUCTION = `
당신은 세계적인 수준의 판타지/SF 캐릭터 디자이너이자 작가입니다. 
사용자의 요청에 따라 매력적이고 독창적인 캐릭터 설정을 한국어로 생성해야 합니다.
캐릭터의 이름, 이명(Title), 성격, 배경 이야기, 능력치 등을 상세하게 작성하세요.
특히 'visualPrompt'는 이미지 생성 AI가 캐릭터의 초상화를 그릴 수 있도록 영어로 아주 상세하게 묘사해야 합니다 (외모, 복장, 조명, 스타일 등).
`;

export const generateCharacterProfile = async (userPrompt: string): Promise<Omit<Character, 'id' | 'createdAt'>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "캐릭터의 이름" },
            title: { type: Type.STRING, description: "캐릭터의 이명 또는 직업 (예: 용의 기사)" },
            shortDescription: { type: Type.STRING, description: "한 문장으로 요약한 캐릭터 소개" },
            fullBackstory: { type: Type.STRING, description: "300자 내외의 상세한 배경 이야기" },
            visualPrompt: { type: Type.STRING, description: "이미지 생성을 위한 영어 프롬프트 (High quality, detailed description)" },
            traits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "캐릭터의 성격 키워드 3~5개"
            },
            stats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: "능력치 이름 (예: 힘, 지능, 민첩, 운)" },
                  value: { type: Type.NUMBER, description: "0에서 100 사이의 수치" }
                },
                required: ["label", "value"]
              },
              description: "캐릭터의 능력치 5개"
            }
          },
          required: ["name", "title", "shortDescription", "fullBackstory", "visualPrompt", "traits", "stats"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text response from Gemini.");
    }

    const data = JSON.parse(response.text);
    return data as Omit<Character, 'id' | 'createdAt'>;

  } catch (error) {
    console.error("Error generating character profile:", error);
    throw error;
  }
};

export const generateCharacterImage = async (visualPrompt: string): Promise<string> => {
  try {
    // Adding stylistic enhancements to the prompt
    const enhancedPrompt = `${visualPrompt}, character concept art, high quality, 4k, digital painting, detailed lighting, centered composition`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract image from response
    // Based on guidelines: "The output response may contain both image and text parts; you must iterate through all parts to find the image part."
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
       throw new Error("No content parts in image response");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
         return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating character image:", error);
    // Return a placeholder if generation fails, or let the error bubble up
    throw error; 
  }
};
