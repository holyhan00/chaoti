import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAssistantReply } from "../services/ai/engine";
import { useSettingsStore } from "../stores/settingsStore";

// 定义消息接口
interface Message {
id: string;
content: string;
sender: "user" | "assistant";
timestamp: string;
}

// 定义聊天状态接口
interface ChatState {
messages: Message[];
sendMessage: (content: string) => Promise<void>;
clearMessages: () => void;
}

// 创建聊天状态存储
export const useChatStore = create<ChatState>()(
persist(
(set, get) => ({
// 初始化消息列表为空数组
messages: [],
// 发送消息的异步方法
sendMessage: async (content) => {
// 获取 LLM 配置信息
const { llmConfig } = useSettingsStore.getState();

// 创建用户消息对象
const userMessage: Message = {
id: Date.now().toString(),
content,
sender: "user",
timestamp: new Date().toISOString(),
};

try {
// 将用户消息添加到消息列表
set((state) => ({
messages: [...state.messages, userMessage],
}));

// 调用 AI 引擎获取助手回复，传递用户输入和 LLM 配置
const assistantReply = await getAssistantReply(content, llmConfig);

if (assistantReply) {
// 创建助手消息对象
const assistantMessage: Message = {
id: Date.now().toString(),
content: assistantReply,
sender: "assistant",
timestamp: new Date().toISOString(),
};

// 将助手消息添加到消息列表
set((state) => ({
messages: [...state.messages, assistantMessage],
}));
}
} catch (error) {
// 捕获并打印发送消息时的错误
console.error("发送消息时出错:", error);

// 创建错误消息对象
const errorMessage: Message = {
id: Date.now().toString(),
content: "（发送消息时出现错误，请稍后再试）",
sender: "assistant",
timestamp: new Date().toISOString(),
};

// 将错误消息添加到消息列表
set((state) => ({
messages: [...state.messages, errorMessage],
}));
}
},
// 清除消息列表的方法
clearMessages: () => {
set({ messages: [] });
},
}),
{
name: "chat-storage",
// 只持久化 messages 字段
partialize: (state) => ({ messages: state.messages }),
// 当从存储中恢复状态时打印日志
onRehydrateStorage: (state) => {
console.log("从存储中恢复状态:", state);
},
}
)
);