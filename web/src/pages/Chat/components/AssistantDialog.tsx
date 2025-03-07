//智能助手对话框//src/pages/Chat/components/AssistantDialog.tsx
import { 
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Divider,
  Tabs,
  Tab,
  TextField,
  Box
} from '@mui/material';
import { PRESET_ASSISTANTS, Assistant } from '../../../data/assistants';
import { useState } from 'react';

interface AssistantDialogProps {
  open: boolean;
  currentAssistants: Assistant[];
  onClose: () => void;
  onSelect: (assistant: Assistant) => void; // 严格类型定义
}

export default function AssistantDialog({
  open,
  currentAssistants,
  onClose,
  onSelect
}: AssistantDialogProps) {
  const [tab, setTab] = useState<'all' | Assistant['type']>('all');
  const [searchText, setSearchText] = useState('');

  // 严格类型过滤逻辑
  const filtered = PRESET_ASSISTANTS.filter(a => {
    const matchesSearch = a.name.includes(searchText) || 
                        a.description.includes(searchText);
    // 使用可选链操作符检查 currentAssistants 是否为有效数组
    const notAdded = !currentAssistants?.some(ca => ca.id === a.id);
    const matchesType = tab === 'all' || a.type === tab;
    
    return matchesSearch && notAdded && matchesType;
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="span">选择智能助手</Box>
        <TextField
          size="small"
          placeholder="搜索助手..."
          sx={{ ml: 2, flex: 1 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
      </DialogTitle>

      <Tabs value={tab} sx={{ px: 2 }}>
        <Tab label="全部" value="all" onClick={() => setTab('all')} />
        <Tab label="系统助手" value="system" />
        <Tab label="流程机器人" value="robot" />
      </Tabs>
      <Divider />

      <List sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
        {filtered.map(assistant => (
          <ListItemButton
            key={assistant.id}
            onClick={() => onSelect(assistant)} // 正确传递完整对象
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemAvatar>
              <Avatar 
                src={assistant.avatar} 
                sx={{ width: 40, height: 40 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={assistant.name}
              secondary={
                <Box component="div">
                  {assistant.description}
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    {assistant.capabilities.map(cap => (
                      <Chip 
                        key={cap}
                        label={cap}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              }
              secondaryTypographyProps={{ component: 'div' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}