// src/pages/Settings.tsx
import { useState } from "react";
import { 
Dialog, DialogTitle, DialogContent, DialogActions, 
TextField, Button, Autocomplete 
} from "@mui/material";
import { useChatContext } from "../contexts/ChatContext";

const LLM_PROVIDERS = [
{ 
id: "deepseek", 
name: "DeepSeek Chat", 
apiUrl: "https://api.deepseek.com/chat/completions", 
docs: "https://api-docs.deepseek.com/zh-cn/", 
defaultModel: "deepseek-chat",
models: ["deepseek-R1", "DeepSeek-V3"] 
},
{ 
id: "openai", 
name: "ChatGPT (OpenAI)", 
apiUrl: "https://api.openai.com/v1/chat/completions", 
docs: "https://platform.openai.com/docs/",
defaultModel: "gpt-4"
},
{ 
id: "yuanbao", 
name: "元宝 (YuanBao)", 
apiUrl: "https://yuanbao.api.com/chat",
docs: "https://yuanbao.com/docs",
defaultModel: "yuanbao-model" 
},
{ 
id: "kimi", 
name: "Kimi AI", 
apiUrl: "https://kimi.ai/api/chat", 
docs: "https://platform.moonshot.cn/docs/guide/start-using-kimi-api",
defaultModel: "kimi-model" 
},
{ 
id: "doubao", 
name: "豆包 (DouBao)", 
apiUrl: "https://doubao.com/api/chat", 
docs: "https://doubao.com/docs",
defaultModel: "doubao-model" 
},
{ 
id: "guiji", 
name: "硅基流动 (Guiji)", 
apiUrl: "https://guiji.com/api/chat", 
docs: "https://guiji.com/docs",
defaultModel: "guiji-model" 
},
{ 
id: "baidu", 
name: "文心一言 (Baidu)", 
apiUrl: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions", 
docs: "https://cloud.baidu.com/doc/WENXINWORKSHOP/s/Ilkkrb0i5",
defaultModel: "ernie-bot" 
},
{ 
id: "aliyun", 
name: "通义千问 (Alibaba Cloud)", 
apiUrl: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation", 
docs: "https://help.aliyun.com/document_detail/258586.html",
defaultModel: "tongyi-qianwen" 
},
{ 
id: "zhipu", 
name: "智谱清言 (Zhipu AI)", 
apiUrl: "https://open.bigmodel.cn/api/paas/v3/model-api", 
docs: "https://open.bigmodel.cn/dev/api",
defaultModel: "glm-4" 
},
{ 
id: "custom", 
name: "自定义 API", 
apiUrl: "", 
docs: "",
defaultModel: ""
}, 
];

// 添加 model 属性到 LLMConfig 类型
interface LLMConfig {
apiKey?: string;
provider?: string;
apiUrl?: string;
model?: string; 
temperature?: number;
}

interface SettingsProps {
open: boolean;
onClose: () => void;
assistant?: {
id: string;
name: string;
llmConfig: LLMConfig;
};
}

const Settings = ({ open, onClose, assistant }: SettingsProps) => {
const { globalLLMConfig, updateGlobalLLMConfig, updateAssistantLLMConfig, selectAssistant, setAssistants } = useChatContext();
const initialLLMConfig = assistant?.llmConfig || globalLLMConfig;
const [apiKey, setApiKey] = useState(initialLLMConfig?.apiKey || "");
const [selectedProvider, setSelectedProvider] = useState(
LLM_PROVIDERS.find(p => p.id === initialLLMConfig?.provider) || LLM_PROVIDERS[0]
);
const [customApiUrl, setCustomApiUrl] = useState(initialLLMConfig?.apiUrl || "");
const [model, setModel] = useState(initialLLMConfig?.model || selectedProvider.defaultModel);
const [temperature, setTemperature] = useState(initialLLMConfig?.temperature || 0.7);

const handleSave = () => {
if (!apiKey.trim()) {
alert("请输入 API Key");
return;
}

if (selectedProvider.id === "custom") {
try {
new URL(customApiUrl); 
} catch {
alert("请输入有效的 URL 地址");
return;
}
}

if (selectedProvider.id === "custom" &&!customApiUrl.trim()) {
alert("请输入有效的自定义 API 端点");
return;
}

const finalApiUrl = selectedProvider.id === "custom"? customApiUrl : selectedProvider.apiUrl;
const newLLMConfig: LLMConfig = { 
apiKey, 
provider: selectedProvider.id, 
apiUrl: finalApiUrl,
model,
temperature
};

console.log('即将保存的配置信息:', newLLMConfig);

if (assistant) {
// 如果有 assistant，则更新该助手的 LLM 配置
updateAssistantLLMConfig(assistant.id, newLLMConfig);
// 立即刷新当前助手
selectAssistant({...assistant, llmConfig: newLLMConfig });
console.log(`已更新助手 ${assistant.name} 的配置信息`);
} else {
// 如果没有 assistant，则更新全局配置
updateGlobalLLMConfig(newLLMConfig);
// 强制所有助手继承新配置
setAssistants(prev => prev.map(a => ({
...a,
llmConfig: a.llmConfig? a.llmConfig : newLLMConfig
})));
console.log('已更新全局配置信息');
}

console.log('保存的配置信息:', newLLMConfig); 
alert("LLM 配置已保存！");
onClose();
};

const handleProviderChange = (_, newValue: typeof LLM_PROVIDERS[number]) => {
if (newValue) {
setSelectedProvider(newValue);
if (newValue.id!== "custom") {
setCustomApiUrl(newValue.apiUrl);
}
setModel(newValue.defaultModel); 
}
};

return (
<Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
<DialogTitle>{assistant? `配置 ${assistant.name}` : "AI 配置"}</DialogTitle>
<DialogContent>
{/* LLM 提供商选择 */}
<Autocomplete
options={LLM_PROVIDERS}
getOptionLabel={(option) => option.name}
value={selectedProvider}
onChange={handleProviderChange}
renderInput={(params) => <TextField {...params} label="选择 LLM 提供商" fullWidth sx={{ my: 2 }} />}
/>

{/* API Key 输入框 */}
<TextField
label="API Key"
fullWidth
type="password"
value={apiKey}
onChange={(e) => setApiKey(e.target.value)}
sx={{ my: 2 }}
/>

{/* API URL 仅在自定义模式下可编辑 */}
<TextField
label="API 端点"
fullWidth
value={selectedProvider.id === "custom"? customApiUrl : selectedProvider.apiUrl}
onChange={(e) => setCustomApiUrl(e.target.value)}
disabled={selectedProvider.id!== "custom"}
sx={{ my: 2 }}
/>

{/* 模型选择，使用 Autocomplete 组件 */}
<Autocomplete
options={selectedProvider.models || []}
getOptionLabel={(option) => option}
value={model}
onChange={(event, newValue) => setModel(newValue)}
renderInput={(params) => <TextField {...params} label="选择模型" fullWidth sx={{ my: 2 }} />}
/>

{/* 温度设置 */}
<TextField
label="温度"
fullWidth
type="number"
value={temperature}
onChange={(e) => setTemperature(Number(e.target.value))}
sx={{ my: 2 }}
/>

{/* 文档链接 */}
{selectedProvider.docs && (
<Button 
href={selectedProvider.docs} 
target="_blank" 
rel="noopener noreferrer" 
sx={{ textTransform: "none", mb: 2 }}
>
查看 {selectedProvider.name} API 文档
</Button>
)}
</DialogContent>
<DialogActions>
<Button onClick={onClose}>取消</Button>
<Button variant="contained" color="primary" onClick={handleSave}>
保存
</Button>
</DialogActions>
</Dialog>
);
};

export default Settings;