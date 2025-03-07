// src/pages/Chat/components/MessageList.tsx
import { Box, Button } from "@mui/material";
import { useChatContext } from "../../../contexts/ChatContext";

const MessageList = ({ messages, showConfigOptions, setShowConfigOptions, currentAssistant }) => {
    const { openGlobalSettings, openAssistantSettings } = useChatContext();

    const handleGlobalConfig = () => {
        openGlobalSettings();
        setShowConfigOptions(false);
    };

    const handleSingleConfig = () => {
        openAssistantSettings(currentAssistant);
        setShowConfigOptions(false);
    };

    return (
        <Box>
            {messages.map((message) => (
                <Box key={message.id}>
                    <p>{message.content}</p>
                    {message.configOptions && showConfigOptions && (
                        <Box>
                            <Button onClick={handleGlobalConfig}>全局配置</Button>
                            <Button onClick={handleSingleConfig}>单项配置</Button>
                        </Box>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default MessageList;