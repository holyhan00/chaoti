import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField as MuiTextField, Typography } from "@mui/material";
import styled from "styled-components";

// 自定义去除边框的TextField样式组件
const CustomTextField = styled(MuiTextField)`
    & fieldset {
        border: none;
    }
`;

const StyledDialog = styled(Dialog)`
  && {
   .MuiPaper-root {
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
      min-width: 350px;
      max-width: 700px;
      background: #f5f5f5;
      border: none;
    }

   .MuiDialogTitle-root {
      padding: 20px 24px 8px;
      font-size: 1rem;
      font-weight: 500;
      color: #1d1d1f;
      text-align: center;
      background: #f5f5f5;
    }

   .MuiDialogContent-root {
      padding: 0; 
      border-radius: 8px;
      margin: 12px;
    }

   .MuiDialogActions-root {
      padding: 16px 24px;
      justify-content: center;
      gap: 12px;
      background: #f5f5f5;
    }

   .MuiButton-root {
      text-transform: none;
      font-weight: 500;
      border-radius: 10px;
      padding: 6px 60px;
      transition: all 0.2s ease;
    }

   .MuiButton-outlined {
      border: none;
      background: #ccc;
      color: white;
      &:hover {
        background: #b3b3b3;
      }
    }

   .MuiButton-contained {
      background: #007AFF;
      &:hover {
        background: #0063CC;
      }
    }
  }
`;

interface AppleDialogProps {
  open: boolean;
  title: string;
  content: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  deleteDialog?: boolean; // 新增的props，用于判断是否是删除助手弹窗
  textLetterSpacing?: string; // 新增：字间距
  textFontSize?: string; // 新增：字体大小
}

const AppleDialog = ({
  open,
  title,
  content,
  confirmText = "确认",
  cancelText = "取消",
  onClose,
  onConfirm,
  deleteDialog = false,
  textLetterSpacing = "normal", // 默认值
  textFontSize = "1rem" // 默认值
}: AppleDialogProps) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ 
        backgroundColor: deleteDialog? '#f5f5f5' : 'white', 
        paddingLeft: deleteDialog? '20px' : '0',
        letterSpacing: textLetterSpacing, // 设置字间距
        fontSize: textFontSize // 设置字体大小
      }}>
        {content}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          {confirmText}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export { AppleDialog, CustomTextField };