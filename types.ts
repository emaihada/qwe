export interface CharacterStat {
  label: string;
  value: number; // 0-100
}

export interface Character {
  id: string;
  name: string;
  title: string;
  shortDescription: string;
  fullBackstory: string;
  visualPrompt: string; // Used for image generation
  traits: string[];
  stats: CharacterStat[];
  imageUrl?: string;
  createdAt: number;
}

export interface CharacterGenerationRequest {
  prompt: string;
}
