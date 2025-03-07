// src/components/LoginForm.tsx
import { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

interface LoginFormProps {
  onLogin: (type: 'user' | 'enterprise', phone?: string, code?: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    // 实际开发需调用短信服务接口
    setIsCodeSent(true);
    console.log('验证码已发送至：', phone);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Chaoti AI
      </Typography>
      
      <TextField
        fullWidth
        label="手机号码"
        variant="outlined"
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      
      {isCodeSent && (
        <TextField
          fullWidth
          label="验证码"
          variant="outlined"
          margin="normal"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      )}
      
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={isCodeSent ? () => onLogin('user', phone, code) : handleSendCode}
      >
        {isCodeSent ? '立即登录' : '获取验证码'}
      </Button>
      
      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => onLogin('enterprise')}
      >
        企业账号登录
      </Button>
    </Box>
  );
};