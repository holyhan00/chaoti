// engine.ts

export const getAssistantReply = async (userInput: string, llmConfig: { 
  apiKey: string; 
  model: string; 
  apiUrl: string;
  temperature?: number;
}) => {
  // 检查 API Key 是否配置
  if (!llmConfig.apiKey) {
    console.warn("未配置 API Key，助手无法回复");
    return "（助手无法回复，请先配置 API Key）";
  }

  // 构建请求的负载
  const payload = {
    // 使用配置中的模型，如果未提供则默认使用 deepseek-chat
    model: llmConfig.model || "deepseek-chat",
    messages: [
      // 添加系统消息，表明助手的角色
      { role: "system", content: "You are a helpful assistant." },
      // 用户输入的消息
      { role: "user", content: userInput }
    ],
    // 使用配置中的温度，如果未提供则默认使用 0.7
    temperature: llmConfig.temperature || 0.7,
    // 默认不使用流式输出
    stream: false
  };

  try {
    // 使用配置中的 API URL，如果未提供则默认使用 https://api.deepseek.com/chat/completions
    const apiUrl = llmConfig.apiUrl || "https://api.deepseek.com/chat/completions";
    // 发起 POST 请求
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        // 在请求头中携带 API Key
        "Authorization": `Bearer ${llmConfig.apiKey}`,
        // 指定请求体的内容类型为 JSON
        "Content-Type": "application/json",
      },
      // 将请求负载转换为 JSON 字符串并作为请求体发送
      body: JSON.stringify(payload),
    });

    // 检查响应状态是否为成功
    if (!response.ok) {
      // 解析响应中的错误信息
      const errorData = await response.json();
      // 打印错误日志，包含状态码和错误信息
      console.error("AI 请求失败，状态码:", response.status, "错误信息:", errorData);
      // 返回包含错误信息的提示
      return `（请求失败，状态码: ${response.status}, 错误信息: ${JSON.stringify(errorData)}）`;
    }

    // 解析响应数据
    const data = await response.json();
    // 提取助手的回复内容，如果没有则返回提示信息
    return data.choices?.[0]?.message?.content || "（AI 没有返回内容）";
  } catch (error) {
    // 打印请求过程中发生的错误
    console.error("AI 请求失败", error);
    // 返回通用的错误提示
    return "（助手回复失败，请检查 API Key 或网络）";
  }
};