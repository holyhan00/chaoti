import { Message } from "../../types/chat";

interface Task {
  id: string;
  name: string;
  status: "pending" | "processing" | "completed";
}

// 获取任务流
export const getTaskFlow = (messages: Message[]): Task[] => {
  if (messages.length === 0) return [];

  return [
    { id: "1", name: "需求分析", status: "completed" },
    { id: "2", name: "任务分配", status: "processing" },
    { id: "3", name: "执行", status: "pending" },
    { id: "4", name: "结果验证", status: "pending" },
  ];
};

// 任务自动流转
export const processTaskStep = (taskId: string, status: "pending" | "processing" | "completed") => {
  console.log(`任务 ${taskId} 状态变更为 ${status}`);

  // AI 可自动调整后续任务
  if (status === "completed") {
    return "下一任务开始";
  }
  return "任务处理中...";
};

// 新增 getAIResponse 函数
export const getAIResponse = async (input: string): Promise<string> => {
  // 这里可以实现具体的获取 AI 响应的逻辑，比如调用 API
  // 示例中简单返回一个拼接字符串作为响应
  return `AI 对 "${input}" 的响应`;
};