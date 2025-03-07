// src/types/Assistant.ts
export interface Assistant {
  id: string;
  name: string;
  avatar: string;
  description?: string;
  lastActive: string;
  createdAt: string;
  model?: string;
  systemPrompt?: string;
  // 根据你的实际使用情况添加更多字段
}