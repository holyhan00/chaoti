//消息气泡//src/pages/Chat/components/MessageBubble.tsx
import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Tooltip, Avatar } from "@mui/material";
import { ContentCopy, Replay, VolumeUp, VolumeOff, Timer } from "@mui/icons-material";
import { Message } from "../../../types/chat";
import { getAssistantReply } from "../../../services/ai/engine";
import { useChatStore } from "../../../stores/chatStore";

interface Props {
  message: Message;
  previousTimestamp?: string;
}

const MessageBubble = ({ message, previousTimestamp }: Props) => {
  const { sendMessage } = useChatStore();
  const [responseTime, setResponseTime] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const speech = new SpeechSynthesisUtterance(message.content.toString());

  useEffect(() => {
    if (previousTimestamp) {
      setResponseTime(calculateResponseTime(previousTimestamp, message.timestamp));
    }
  }, [previousTimestamp, message.timestamp]);

  // 📋 复制 AI 回复
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content.toString());
    alert("已复制到剪贴板！");
  };

  // 🔄 重新生成 AI 回复（追加显示）
  const handleRegenerate = async () => {
    const newResponse = await getAssistantReply(message.content.toString());
    sendMessage(newResponse); // **追加新消息**
  };

  // 🔊 播放 / ⏹ 停止朗读
  const handleReadAloud = () => {
    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speech.text = message.content.toString();
      speech.onend = () => setIsPlaying(false);
      speechSynthesis.speak(speech);
      setIsPlaying(true);
    }
  };

  // ⏳ 计算 AI 回复用时
  function calculateResponseTime(start: string, end: string): string {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const diff = (endTime - startTime) / 1000;
    return `${diff.toFixed(1)} 秒`;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      {message.sender === "assistant" && (
        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: "primary.main" }}>
          🤖
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: "70%",
          p: 1.5,
          borderRadius: 2,
          border: message.sender === "assistant" ? "1px solid #1976D2" : "1px solid #ddd",
          bgcolor: message.sender === "assistant" ? "#E3F2FD" : "#fff",
          position: "relative",
        }}
      >
        {/* 🌟 消息内容 */}
        <Typography variant="body1">{message.content}</Typography>

        {/* ⏳ 回复时间 */}
        {responseTime && message.sender === "assistant" && (
          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
            <Timer fontSize="inherit" sx={{ verticalAlign: "middle", mr: 0.5 }} />
            回复用时：{responseTime}
          </Typography>
        )}

        {/* 🎛 操作按钮 */}
        {message.sender === "assistant" && (
          <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
            <Tooltip title="复制">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="重新生成">
              <IconButton size="small" onClick={handleRegenerate}>
                <Replay fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isPlaying ? "停止播放" : "朗读"}>
              <IconButton size="small" onClick={handleReadAloud}>
                {isPlaying ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;