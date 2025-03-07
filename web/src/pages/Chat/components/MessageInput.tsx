//src/pages/Chat/components/MessageInput.tsx
import { useState, useRef } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
AttachFile as AttachIcon,
EmojiEmotions as EmojiIcon,
Link as SmartChainIcon,
Mic as VoiceIcon,
Videocam as VideoIcon,
InsertPhoto as ImageIcon,
} from "@mui/icons-material";

interface MessageInputProps {
onSend: (message: string) => void;
}

const MessageInput = ({ onSend }: MessageInputProps) => {
const [input, setInput] = useState("");
const fileInputRef = useRef<HTMLInputElement>(null);
const imageInputRef = useRef<HTMLInputElement>(null);

const handleSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
if (e.key === "Enter" &&!e.shiftKey) {
e.preventDefault();
if (input.trim()) {
onSend(input.trim());
setInput("");
}
}
};

return (
<Box
sx={{
display: "flex",
flexDirection: "column",
width: "100%",
backgroundColor: "white",
margin: 0,
padding: 0, 
"& *": {
margin: 0,
padding: 0,
}, 
}}
>
<Box
sx={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
px: 1,
py: 0, 
minHeight: 40,
maxHeight: 60,
}}
>
<Box sx={{ display: "flex", gap: 2 }}>
<Tooltip title="表情">
<IconButton>
<EmojiIcon fontSize="small" />
</IconButton>
</Tooltip>
<Tooltip title="上传图片">
<IconButton onClick={() => imageInputRef.current?.click()}>
<ImageIcon fontSize="small" />
<input ref={imageInputRef} type="file" hidden accept="image/*" />
</IconButton>
</Tooltip>
<Tooltip title="上传文件">
<IconButton onClick={() => fileInputRef.current?.click()}>
<AttachIcon fontSize="small" />
<input ref={fileInputRef} type="file" hidden />
</IconButton>
</Tooltip>
<Tooltip title="智能链">
<IconButton>
<SmartChainIcon fontSize="small" />
</IconButton>
</Tooltip>
</Box>
<Box sx={{ display: "flex", gap: 2 }}>
<Tooltip title="音频通话">
<IconButton>
<VoiceIcon fontSize="small" />
</IconButton>
</Tooltip>
<Tooltip title="视频通话">
<IconButton>
<VideoIcon fontSize="small" />
</IconButton>
</Tooltip>
</Box>
</Box>
<Box
sx={{
position: "relative",
padding: "8px 16px", // 如果不需要这里的padding，可以去掉或调整
}}
>
<textarea
ref={useRef<HTMLTextAreaElement>(null)}
value={input}
onChange={(e) => setInput(e.target.value)}
onKeyDown={handleSend}
placeholder="输入消息..."
style={{
width: "100%",
border: "none",
outline: "none",
fontSize: "14px",
resize: "none",
backgroundColor: "transparent",
minHeight: 120,
maxHeight: 400,
overflowY: "auto",
}}
/>
</Box>
</Box>
);
};

export default MessageInput;