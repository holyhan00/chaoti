import { Typography } from "@mui/material";

// src/pages/RobotControl/index.tsx
export const RobotControlPage = () => {
    return (
      <div style={{ padding: 24 }}>
        <h2>机器人控制台</h2>
        <p>此处将集成Boston Dynamics Spot等工业机器人控制界面</p>
        <div style={{ 
          height: 400,
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography color="textSecondary">机器人3D控制面板（开发中）</Typography>
        </div>
      </div>
    );
  };