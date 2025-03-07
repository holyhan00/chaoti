//联系人头部 // src/pages/Chat/components/ContactsHeader.tsx
import { Box, TextField, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

interface ContactsHeaderProps {
  onSearch: (keyword: string) => void;
  onAddClick: () => void;
}

const ContactsHeader = ({ onSearch, onAddClick }: ContactsHeaderProps) => {
  return (
    <Box sx={{ 
      p: 2.1,
      display: 'flex',
      gap: 1,
      bgcolor: 'background.paper',
      alignItems: 'center', // 垂直居中对齐
    }}>
      {/* 搜索输入框 */}
      <TextField
        fullWidth={false} // 不占满父容器宽度
        variant="outlined"
        placeholder="搜索助手..."
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
        }}
        onChange={(e) => onSearch(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            bgcolor: 'background.paper',
            fontSize: '0.875rem',
            height: 30, // 调整搜索框高度
            width: 200, // 调整搜索框宽度
          },
          marginLeft: -2.1, // 调整搜索框左侧外边距
          marginRight: 2, // 调整搜索框右侧外边距
        }}
      />

      {/* 添加按钮 */}
      <Tooltip title="添加新助手">
        <IconButton
          sx={{ 
            width: 30,
            height: 30,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '50%',
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}
          onClick={onAddClick}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ContactsHeader;