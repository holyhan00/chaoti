// src/contexts/ChatContext.tsx
import { createContext, useContext, useState, useEffect } from "react";

// 定义 LLMConfig 类型
interface LLMConfig {
  apiKey?: string;
  provider?: string;
  apiUrl?: string;
  model?: string;
  temperature?: number;
}

// 定义助手类型
interface Assistant {
  id: string;
  name: string;
  avatar: string;
  description: string;
  llmConfig?: LLMConfig;
}

// 定义 ChatContext 的值类型
interface ChatContextValue {
  assistants: Assistant[];
  currentAssistant: Assistant | null;
  addAssistant: (newAssistant: Assistant) => void;
  selectAssistant: (assistant: Assistant) => void;
  updateAssistants: (newAssistants: Assistant[]) => void;
  deleteAssistantAndConversations: (index: number) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  selectedAssistantForSettings: Assistant | null;
  isGlobalSettings: boolean;
  openGlobalSettings: () => void;
  openAssistantSettings: (assistant: Assistant) => void;
  globalLLMConfig: LLMConfig;
  updateGlobalLLMConfig: (newConfig: LLMConfig) => void;
  updateAssistantLLMConfig: (assistantId: string, newConfig: LLMConfig) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
  children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const storedAssistants = localStorage.getItem("assistants");
  const initialAssistants = storedAssistants ? JSON.parse(storedAssistants) : [];

  const storedGlobalLLMConfig = localStorage.getItem("globalLLMConfig");
  const initialGlobalLLMConfig = storedGlobalLLMConfig ? JSON.parse(storedGlobalLLMConfig) : {};

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedAssistantForSettings, setSelectedAssistantForSettings] = useState<Assistant | null>(null);
  const [isGlobalSettings, setIsGlobalSettings] = useState(false);
  const [assistants, setAssistants] = useState<Assistant[]>(initialAssistants);
  const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);
  const [globalLLMConfig, setGlobalLLMConfig] = useState<LLMConfig>(initialGlobalLLMConfig);

  useEffect(() => {
    const superAssistantExists = assistants.some((assistant) => assistant.id === "super");
    if (!superAssistantExists) {
      const superAssistant: Assistant = {
        id: "super",
        name: "超级助手",
        avatar: "/super-assistant.png",
        description: "全能助手，轻松搞定",
      };
      const updatedAssistants = [superAssistant, ...assistants];
      setAssistants(updatedAssistants);
      localStorage.setItem("assistants", JSON.stringify(updatedAssistants));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("assistants", JSON.stringify(assistants));
  }, [assistants]);

  useEffect(() => {
    localStorage.setItem("globalLLMConfig", JSON.stringify(globalLLMConfig));
  }, [globalLLMConfig]);

  useEffect(() => {
    if (currentAssistant && !currentAssistant.llmConfig) {
      setCurrentAssistant((prev) => ({
        ...prev!,
        llmConfig: globalLLMConfig
      }));
    }
  }, [globalLLMConfig, currentAssistant]);

  const openGlobalSettings = () => {
    setIsGlobalSettings(true);
    setSettingsOpen(true);
    setSelectedAssistantForSettings(null);
  };

  const openAssistantSettings = (assistant: Assistant) => {
    setIsGlobalSettings(false);
    setSettingsOpen(true);
    setSelectedAssistantForSettings(assistant);
  };

  const selectAssistant = (assistant: Assistant) => {
    setCurrentAssistant(assistant);
  };

  const updateAssistants = (newAssistants: Assistant[]) => {
    setAssistants(newAssistants);
  };

  const deleteAssistantAndConversations = (index: number) => {
    const newAssistants = [...assistants];
    newAssistants.splice(index, 1);
    setAssistants(newAssistants);
  };

  const addAssistant = (newAssistant: Assistant) => {
    setAssistants([...assistants, newAssistant]);
  };

  const updateGlobalLLMConfig = (newConfig: LLMConfig) => {
    setGlobalLLMConfig(newConfig);
  };

  const updateAssistantLLMConfig = (assistantId: string, newConfig: LLMConfig) => {
    const updatedAssistants = assistants.map((assistant) => {
      if (assistant.id === assistantId) {
        return { ...assistant, llmConfig: newConfig };
      }
      return assistant;
    });
    setAssistants(updatedAssistants);
  };

  const value: ChatContextValue = {
    assistants,
    currentAssistant,
    addAssistant,
    selectAssistant,
    updateAssistants,
    deleteAssistantAndConversations,
    settingsOpen,
    setSettingsOpen,
    selectedAssistantForSettings,
    isGlobalSettings,
    openGlobalSettings,
    openAssistantSettings,
    globalLLMConfig,
    updateGlobalLLMConfig,
    updateAssistantLLMConfig
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export { ChatProvider, useChatContext };
