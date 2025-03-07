export interface Assistant {
  id: string;
  name: string;
  avatar: string;
  description: string;
  type: 'system' | 'custom' | 'robot'; 
  capabilities: string[];
  lastActive?: string;
}

export interface Message {
  id: string;
  content: string | File;
  sender: 'user' | 'assistant';
  type: 'text' | 'image' | 'file';
  timestamp: string;
}

export interface TaskStep {
  agentId: string;
  status: 'pending' | 'processing' | 'completed';
}