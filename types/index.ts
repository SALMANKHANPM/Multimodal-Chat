import type { JSX } from "react";
export interface Message {
  role: "assistant" | "user" | "error";
  content: string | JSX.Element;
  images?: string[];
  audio?: string;
}

export interface ProcessOptions {
  temperature?: number;
  maxTokens?: number;
  image_data?: string;
  audio_data?: string;
  sourceLang?: string;
  targetLang?: string;
}