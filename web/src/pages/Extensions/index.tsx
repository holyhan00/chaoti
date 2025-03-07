// src/pages/Extensions/index.tsx
import { Typography } from "@mui/material";

export const ExtensionsPage = () => {
    return (
        <div style={{ padding: 24 }}>
            <h2>扩展功能管理</h2>
            <p style={{ marginBottom: 16 }}>管理和配置各类扩展功能</p>
            <div style={{
                border: '1px dashed #ccc',
                borderRadius: 8,
                padding: 24,
                textAlign: 'center'
            }}>
                <Typography color="textSecondary">
                    扩展功能添加与配置区域（开发中）
                </Typography>
            </div>
        </div>
    );
};