// src/pages/Chat/components/ChatArea.tsx
import { Box, Toolbar, Avatar, Typography, Divider } from "@mui/material";
import { useChatContext } from "../../../contexts/ChatContext";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import TaskFlow from "./TaskFlow";
import { useChatStore } from "../../../stores/chatStore";

const ChatArea = () => {
    const { currentAssistant } = useChatContext();
    const { messages, sendMessage } = useChatStore();
    const apiKey = currentAssistant?.llmConfig?.apiKey;  // 获取当前助手的 API Key

    const handleSendMessage = (message: string) => {
        // 可以保留此检查以在前端更早提示用户
        if (!apiKey) {
            alert("助手无法回复，请先配置 API Key");
            return;
        }
        // 调用聊天存储中的发送消息方法
        sendMessage(message);
    };

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
                borderLeft: '1px solid #e0e0e0',
                minHeight: 0,
                padding: 0,
                margin: 0
            }}
        >
            {/* 顶部工具栏:固定不动 */}
            <Toolbar
                sx={{
                    minHeight: 64,
                    backgroundColor: 'background.paper',
                    position:'sticky',
                    top: 0,
                    zIndex: 10
                }}
            >
                <Avatar src={currentAssistant?.avatar} sx={{ width: 40, height: 40 }} />
                <Box sx={{ ml: 2 }}>
                    <Typography variant="h6">{currentAssistant?.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                        {currentAssistant?.description}
                    </Typography>
                </Box>
            </Toolbar>
            {/* 消息显示区域,固定高度+ 滚动 */}
            <Box
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    minHeight: 0,
                    height: 'calc(100% - 64px - 64px)'
                }}
            >
                {/* 渲染消息列表 */}
                <MessageList messages={messages} showConfigOptions={undefined} setShowConfigOptions={undefined} currentAssistant={undefined} />
            </Box>
            {/* AI 任务流:如果有任务流,则显示,否则不占空间 */}
            <Box sx={{ flexShrink: 0 }}>
                <TaskFlow />
            </Box>
            {/* 添加底部横线 */}
            <Divider sx={{ borderColor: "#e0e0e0" }} />
            {/* 底部输入框 */}
            <Box
                sx={{
                    p: 2,
                    width: '100%',
                    backgroundColor: 'background.paper',
                    position:'sticky',
                    bottom: 0,
                    zIndex: 10,
                    minHeight: 64
                }}
            >
                {/* 消息输入组件，传递发送消息的处理函数 */}
                <MessageInput onSend={handleSendMessage} />
            </Box>
        </Box>
    );
};

export default ChatArea;