import { useState, ReactNode, isValidElement } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  Toolbar,
  ListItemText,
  styled,
  ListItemIcon,
  Tooltip,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import Settings from '../pages/Settings';

// 图标路径根据实际项目结构调整
import messageFullColorSvg from '../assets/icons/full-color/message.svg';
import agentFullColorSvg from '../assets/icons/full-color/agent.svg';
import robotFullColorSvg from '../assets/icons/full-color/robot.svg';
import knowledgeBaseFullColorSvg from '../assets/icons/full-color/knowledge.svg';
import extensionFullColorSvg from '../assets/icons/full-color/extension.svg';

import messageLineSvg from '../assets/icons/line/message.svg';
import agentLineSvg from '../assets/icons/line/agent.svg';
import robotLineSvg from '../assets/icons/line/robot.svg';
import knowledgeBaseLineSvg from '../assets/icons/line/knowledge.svg';
import extensionLineSvg from '../assets/icons/line/extension.svg';
import helpLineSvg from '../assets/icons/line/help.svg';
import settingsLineSvg from '../assets/icons/line/settings.svg';

const CustomIcon = styled('img')(({ }) => ({
  width: 21,
  height: 21,
  display: 'block',
  transition: 'filter 0.3s',
  filter: 'brightness(0.8)',
  '&.active': {
    filter: 'brightness(1)',
  },
}));

const drawerWidth = 60;

interface MenuItemData {
  text: string;
  path: string;
  fullColorIcon: string;
  lineIcon: string;
}

interface SettingsItemData {
  text: string;
}

// 修复路径配置：确保路径层级不重叠
const menuItems: MenuItemData[] = [
  { text: '会话', path: '/chat', fullColorIcon: messageFullColorSvg, lineIcon: messageLineSvg },
  { text: '智能体', path: '/agent', fullColorIcon: agentFullColorSvg, lineIcon: agentLineSvg },
  { text: '机器人', path: '/robot', fullColorIcon: robotFullColorSvg, lineIcon: robotLineSvg },
  { text: '知识库', path: '/knowledge', fullColorIcon: knowledgeBaseFullColorSvg, lineIcon: knowledgeBaseLineSvg },
  { text: '扩展库', path: '/extensions', fullColorIcon: extensionFullColorSvg, lineIcon: extensionLineSvg },
];

const settingsItems: SettingsItemData[] = [
  { text: '迁移与备份' },
  { text: '锁定' },
  { text: '意见与反馈' },
  { text: '设置' },
];

const DelayedTooltip = ({ title, children }: { title?: string; children: ReactNode }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  let timer: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    timer = setTimeout(() => setShowTooltip(true), 500);
  };

  const handleMouseLeave = () => {
    timer && clearTimeout(timer);
    setShowTooltip(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {showTooltip && isValidElement(children) && (
        <Tooltip
          title={title}
          placement="right"
          arrow
          sx={{
            '& .MuiTooltip-tooltip': {
              fontSize: '0.75rem',
              backgroundColor: 'rgba(50, 50, 50, 0.9)',
              marginLeft: '8px !important',
            },
          }}
        >
          {children}
        </Tooltip>
      )}
      {!showTooltip && children}
    </div>
  );
};

export const MainLayout = () => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleOpenSettingsDialog = () => {
    setSettingsDialogOpen(true);
    handleCloseMenu();
  };

  const handleCloseSettingsDialog = () => {
    setSettingsDialogOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: theme.palette.background.paper,
        width: drawerWidth,
      }}
    >
      <Box sx={{ mt: 9, px: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
          <img
            src="/avatar-placeholder.jpg"
            alt="用户头像"
            style={{
              width: 44,
              height: 44,
              borderRadius: '4px',
              objectFit: 'cover',
              border: `0.5px solid ${theme.palette.divider}`,
            }}
          />
        </Box>
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.path}
              disablePadding
              sx={{
                position: 'relative',
                '&:not(:last-child)': { mb: 0.5 }
              }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  py: 1.5,
                  px: 0,
                  minHeight: 48,
                  justifyContent: 'center',
                  '&.Mui-selected': {
                    backgroundColor: 'transparent',
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <DelayedTooltip title={item.text}>
                  <ListItemIcon sx={{
                    minWidth: 'auto',
                    p: 0,
                    margin: 0,
                    color: location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  }}>
                    <CustomIcon
                      src={location.pathname === item.path
                        ? item.fullColorIcon
                        : item.lineIcon}
                      className={location.pathname === item.path ? 'active' : ''}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </ListItemIcon>
                </DelayedTooltip>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mt: 'auto', pb: 2 }}>
        <List sx={{ p: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                py: 1.5,
                px: 0,
                justifyContent: 'center',
                '&:hover': { backgroundColor: theme.palette.action.hover }
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', p: 0 }}>
                <CustomIcon src={helpLineSvg} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleMenuClick}
              sx={{
                py: 1.5,
                px: 0,
                justifyContent: 'center',
                '&:hover': { backgroundColor: theme.palette.action.hover }
              }}
            >
              <ListItemIcon sx={{ minWidth: 'auto', p: 0 }}>
                <CustomIcon src={settingsLineSvg} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* 设置菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            ml: '2px',
            mt: -1,
            minWidth: 160,
            borderRadius: '4px',
            boxShadow: theme.shadows[8],
          },
        }}
        PaperProps={{
          style: {
            left: `${drawerWidth}px !important`,
          },
        }}
      >
        {settingsItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={item.text === '设置' ? handleOpenSettingsDialog : handleCloseMenu}
            sx={{
              py: 1,
              '&:hover': { background: theme.palette.action.hover },
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'text.primary',
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.background.default,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>

      {/* 设置弹窗 */}
      <Dialog
        open={settingsDialogOpen}
        onClose={handleCloseSettingsDialog}
        sx={{
          '& .MuiDialog-paper': {
            minWidth: 400,
            borderRadius: 4,
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <DialogTitle>设置</DialogTitle>
        <DialogContent>
          <Settings open={settingsDialogOpen} onClose={handleCloseSettingsDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettingsDialog}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};