import { Typography } from "@mui/material";

// src/pages/KnowledgeBase/index.tsx
export const KnowledgeBasePage = () => {
    return (
      <div style={{ padding: 24 }}>
        <h2>知识库管理系统</h2>
        <p style={{ marginBottom: 16 }}>本地化知识存储与检索系统（集成VectorDB）</p>
        <div style={{ 
          border: '1px dashed #ccc',
          borderRadius: 8,
          padding: 24,
          textAlign: 'center'
        }}>
          <Typography color="textSecondary">
            知识库文件上传区域（开发中）
          </Typography>
        </div>
      </div>
    );
  };