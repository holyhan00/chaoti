//src/stores/settingsStore.ts
import { create } from "zustand";

interface LLMConfig {
apiKey?: string;
provider?: string;
apiUrl?: string;
}

interface Assistant {
id: string;
name: string;
llmConfig: LLMConfig;
}

interface SettingsState {
llmConfig: LLMConfig;
assistants: Assistant[];
setLLMConfig: (config: LLMConfig) => void;
setAssistantLLMConfig: (assistantId: string, config: LLMConfig) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
llmConfig: {},
assistants: [],
setLLMConfig: (config) => set({ llmConfig: config }),
setAssistantLLMConfig: (assistantId, config) => set((state) => ({
assistants: state.assistants.map((assistant) =>
assistant.id === assistantId ? { ...assistant, llmConfig: config } : assistant
)
}))
}));