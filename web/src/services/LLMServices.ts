
//src/services/LLMServices.ts
import { LLMConfig } from "../contexts/ChatContext";

interface LLMRequestParams {
userMessage: string;
llmConfig: LLMConfig;
}

export const getLLMResponse = async ({ userMessage, llmConfig }: LLMRequestParams): Promise<string> => {
if (!llmConfig?.apiKey) {
// 最后尝试从 localStorage 获取
const fallbackConfig = localStorage.getItem('globalLLMConfig');
if (fallbackConfig) {
llmConfig = JSON.parse(fallbackConfig);
}
}

if (!llmConfig) {
console.log('未获取到有效的 LLM 配置');
return "⚠️ 请先在设置中配置 AI API Key。";
}

const { apiKey, provider, model } = llmConfig;

// 检查 API Key 是否为空
if (!apiKey) {
console.log('API Key 为空');
return "⚠️ 请先在设置中配置有效的 AI API Key。";
}

let apiUrl = "";

switch (provider) {
case "deepseek":
apiUrl = "https://api.deepseek.com/chat/completions";
break;
case "openai":
apiUrl = "https://api.openai.com/v1/chat/completions";
break;
case "aliyun":
apiUrl = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";
break;
case "yuanbao":
apiUrl = "https://yuanbao.api.com/chat";
break;
case "kimi":
apiUrl = "https://kimi.ai/api/chat";
break;
case "doubao":
apiUrl = "https://doubao.com/api/chat";
break;
case "guiji":
apiUrl = "https://guiji.com/api/chat";
break;
case "baidu":
apiUrl = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions";
break;
case "zhipu":
apiUrl = "https://open.bigmodel.cn/api/paas/v3/model-api";
break;
case "custom":
// 对于自定义 API，使用用户输入的 API URL
apiUrl = llmConfig.apiUrl;
if (!apiUrl) {
return "⚠️ 请输入有效的自定义 API 端点。";
}
break;
default:
return "⚠️ 请选择有效的 LLM 提供商。";
}

console.log('即将发送请求的 API URL:', apiUrl);
console.log('最终请求参数', {
apiUrl,
apiKey: apiKey?.substring(0, 5) + '...',
model
});

try {
const response = await fetch(apiUrl, {
method: "POST",
headers: {
"Content-Type": "application/json",
"Authorization": `Bearer ${apiKey}`,
},
body: JSON.stringify({
model: model,
messages: [
{ role: "system", content: "You are a helpful assistant." },
{ role: "user", content: userMessage }
],
temperature: llmConfig.temperature || 0.7,
stream: false
}),
});

console.log('请求的响应状态:', response.status);

if (!response.ok) {
// 处理请求失败的情况，根据响应状态码给出不同提示
const errorData = await response.json();
if (response.status === 401) {
return "⚠️ API Key 无效，请检查配置。";
} else {
return `⚠️ 请求失败，状态码: ${response.status}, 错误信息: ${JSON.stringify(errorData)}`;
}
}

const data = await response.json();
return data?.choices?.[0]?.message?.content || "AI 生成失败。";
} catch (error) {
console.error("LLM 请求失败:", error);
return "⚠️ AI 请求失败，请检查 API Key 或网络连接。";
}
};




















这是我的src/contexts/ChatContext.tsx文件代码
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
setAssistants: (newAssistants: Assistant[]) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

interface ChatProviderProps {
children: React.ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
// 从 localStorage 中获取存储的助手数据
const storedAssistants = localStorage.getItem("assistants");
// 解析存储的数据，如果没有则使用空数组
const initialAssistants = storedAssistants? JSON.parse(storedAssistants) : [];

// 从 localStorage 中获取全局配置
const storedGlobalLLMConfig = localStorage.getItem("globalLLMConfig");
const initialGlobalLLMConfig = storedGlobalLLMConfig? JSON.parse(storedGlobalLLMConfig) : {};

const [settingsOpen, setSettingsOpen] = useState(false);
const [selectedAssistantForSettings, setSelectedAssistantForSettings] = useState<Assistant | null>(null);
const [isGlobalSettings, setIsGlobalSettings] = useState(false);
// 使用解析后的数据作为初始状态
const [assistants, setAssistants] = useState<Assistant[]>(initialAssistants);
const [currentAssistant, setCurrentAssistant] = useState<Assistant | null>(null);
const [globalLLMConfig, setGlobalLLMConfig] = useState<LLMConfig>(initialGlobalLLMConfig);

// 页面加载时确保默认超级助手存在
useEffect(() => {
const superAssistantExists = assistants.some((assistant) => assistant.id === "super");
if (!superAssistantExists) {
const superAssistant: Assistant = {
id: "super",
name: "超级助手",
avatar: "/super - assistant.png",
description: "全能助手，轻松搞定",
};
const updatedAssistants = [superAssistant,...assistants];
setAssistants(updatedAssistants);
// 将更新后的助手数据存储到 localStorage 中
localStorage.setItem("assistants", JSON.stringify(updatedAssistants));
}
}, []);

// 监听 assistants 状态的变化，一旦变化就更新 localStorage
useEffect(() => {
localStorage.setItem("assistants", JSON.stringify(assistants));
}, [assistants]);

// 监听全局配置的变化，一旦变化就更新 localStorage
useEffect(() => {
localStorage.setItem("globalLLMConfig", JSON.stringify(globalLLMConfig));
}, [globalLLMConfig]);

// 修改 useEffect 确保配置继承
useEffect(() => {
setCurrentAssistant((prev) => {
if (!prev) return prev;
// 深度合并配置
const mergedConfig = {
...globalLLMConfig,
...(prev.llmConfig || {})
};

return {
...prev,
llmConfig: mergedConfig
};
});
}, [globalLLMConfig]);

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

// 添加选择助手的方法
const selectAssistant = (assistant: Assistant) => {
setCurrentAssistant(assistant);
};

// 添加更新助手列表的方法
const updateAssistants = (newAssistants: Assistant[]) => {
setAssistants(newAssistants);
};

// 添加删除助手的方法
const deleteAssistantAndConversations = (index: number) => {
const newAssistants = [...assistants];
newAssistants.splice(index, 1);
setAssistants(newAssistants);
};

// 添加添加助手的方法
const addAssistant = (newAssistant: Assistant) => {
setAssistants([...assistants, newAssistant]);
};

// 更新全局配置的方法
const updateGlobalLLMConfig = (newConfig: LLMConfig) => {
console.log('更新全局配置', newConfig);
localStorage.setItem('globalLLMConfig_debug', JSON.stringify(newConfig));
setGlobalLLMConfig(newConfig);
localStorage.setItem("globalLLMConfig", JSON.stringify(newConfig)); 
setCurrentAssistant((prev) => {
if (!prev) return prev;
const mergedConfig = {
...prev.llmConfig,
...(prev.llmConfig || {})
};
return {
...prev,
llmConfig: mergedConfig
};
});
};

// 更新助手配置的方法
const updateAssistantLLMConfig = (assistantId: string, newConfig: LLMConfig) => {
const updatedAssistants = assistants.map((assistant) => {
if (assistant.id === assistantId) {
return {
...assistant,
llmConfig: newConfig
};
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
updateAssistantLLMConfig,
setAssistants
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
throw new Error('useChatContext must be used within a ChatProvider');
}
return context;
};

export { ChatProvider, useChatContext, type LLMConfig };