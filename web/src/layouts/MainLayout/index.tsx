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
} from '@mui/material';

// 引入全色图标
import messageFullColorSvg from '@/assets/icons/full-color/message.svg';
import agentFullColorSvg from '@/assets/icons/full-color/agent.svg';
import robotFullColorSvg from '@/assets/icons/full-color/robot.svg';
import knowledgeBaseFullColorSvg from '@/assets/icons/full-color/knowledge.svg';
import extensionFullColorSvg from '@/assets/icons/full-color/extension.svg';

// 引入线条状图标
import messageLineSvg from '@/assets/icons/line/message.svg';
import agentLineSvg from '@/assets/icons/line/agent.svg';
import robotLineSvg from '@/assets/icons/line/robot.svg';
import knowledgeBaseLineSvg from '@/assets/icons/line/knowledge.svg';
import extensionLineSvg from '@/assets/icons/line/extension.svg';
import helpLineSvg from '@/assets/icons/line/help.svg';
import settingsLineSvg from '@/assets/icons/line/settings.svg';

// 自定义图标组件
const CustomIcon = styled('img')({
  width: 24,
  height: 24,
  color: 'primary.main',
  transition: 'color 0.3s',
});

const drawerWidth = 70;

// 定义菜单项的数据结构
interface MenuItemData {
  text: string;
  path: string;
  fullColorIcon: string;
  lineIcon: string;
}

// 定义设置项的数据结构
interface SettingsItemData {
  text: string;
}

// 主菜单的菜单项
const menuItems: MenuItemData[] = [
  { text: '会话', path: '/workspace', fullColorIcon: messageFullColorSvg, lineIcon: messageLineSvg },
  { text: '智能体', path: '/studio/agent', fullColorIcon: agentFullColorSvg, lineIcon: agentLineSvg },
  { text: '机器人', path: '/workspace/robot-control', fullColorIcon: robotFullColorSvg, lineIcon: robotLineSvg },
  { text: '知识库', path: '/workspace/knowledge-base', fullColorIcon: knowledgeBaseFullColorSvg, lineIcon: knowledgeBaseLineSvg },
  { text: '扩展库', path: '/workspace/extensions', fullColorIcon: extensionFullColorSvg, lineIcon: extensionLineSvg },
];

// 设置菜单的菜单项
const settingsItems: SettingsItemData[] = [
  { text: '迁移与备份' },
  { text: '锁定' },
  { text: '意见与反馈' },
  { text: '设置' },
];

// 自定义带延迟功能的 Tooltip 组件
const DelayedTooltip = ({
  title = '',
  children,
  disableTooltip = false,
}: {
  title?: string;
  children: ReactNode;
  disableTooltip?: boolean;
}) => {
  if (disableTooltip) {
    return <div>{children}</div>;
  }

  const [showTooltip, setShowTooltip] = useState(false);
  let timer: NodeJS.Timeout | null = null;

  const handleMouseEnter = () => {
    timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer);
    }
    setShowTooltip(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {showTooltip && isValidElement(children) && (
        <Tooltip
          title={title}
          placement="bottom-end"
          arrow
          sx={{
            '& .MuiTooltip-tooltip': {
              fontSize: '0.65rem', // 缩小提示文字大小
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              transform: 'translateY(4px)', // 向下偏移一点，避免遮挡
              whiteSpace: 'nowrap', // 防止文字换行
            },
            '& .MuiTooltip-arrow': {
              color: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          {children}
        </Tooltip>
      )}
    </div>
  );
};

/**
 * 主布局组件
 */
export const MainLayout = () => {
  // 控制移动端侧边栏的显示与隐藏
  const [mobileOpen, setMobileOpen] = useState(false);
  // 控制设置菜单的显示与隐藏
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // 获取当前页面路径
  const location = useLocation();

  /**
   * 处理侧边栏的显示与隐藏
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /**
   * 处理设置菜单的打开
   * @param event - 鼠标点击事件
   */
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * 处理设置菜单的关闭
   * @param item - 点击的菜单项
   */
  const handleCloseMenu = (item: SettingsItemData) => {
    setAnchorEl(null);
    if (item.text === '设置') {
      // 这里可以添加跳转到设置页面的逻辑，例如使用 react-router-dom
      // 假设设置页面路径为 /settings
      // 你需要引入 useNavigate 钩子
      // import { useNavigate } from 'react-router-dom';
      // const navigate = useNavigate();
      // navigate('/settings');
    }
  };

  // 侧边栏内容
  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#f7f9fc',
      }}
    >
      {/* 主内容区域，添加 marginTop 来下移元素 */}
      <Box sx={{ marginTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 2 }}>
          <img
            src="/avatar-placeholder.jpg"
            alt="用户头像"
            style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              objectFit: 'cover',
            }}
          />
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton component={Link} to={item.path}>
                <DelayedTooltip title={item.text}>
                  <ListItemIcon
                    sx={{
                      minWidth: 30,
                      display: 'flex',
                      justifyContent: 'center',
                      paddingY: 0.7,
                    }}
                  >
                    <CustomIcon
                      src={location.pathname === item.path ? item.fullColorIcon : item.lineIcon}
                      style={{
                        // 可以在这里添加更多样式，如点击效果等
                      }}
                    />
                  </ListItemIcon>
                </DelayedTooltip>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 底部固定区域 */}
      <Box sx={{ marginTop: 'auto', pb: 2 }}>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <DelayedTooltip title="帮助" disableTooltip>
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                    display: 'flex',
                    justifyContent: 'center',
                    paddingY: 0.8,
                  }}
                >
                  <CustomIcon
                    src={helpLineSvg} // 这里简单使用线条状图标，你可以根据需求调整
                    style={{
                      // 可以在这里添加更多样式
                    }}
                  />
                </ListItemIcon>
              </DelayedTooltip>
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton onClick={handleMenuClick}>
              <DelayedTooltip title="设置" disableTooltip>
                <ListItemIcon
                  sx={{
                    minWidth: 30,
                    display: 'flex',
                    justifyContent: 'center',
                    paddingY: 0.8,
                  }}
                >
                  <CustomIcon
                    src={settingsLineSvg} // 这里简单使用线条状图标，你可以根据需求调整
                    style={{
                      // 可以在这里添加更多样式
                    }}
                  />
                </ListItemIcon>
              </DelayedTooltip>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleCloseMenu({ text: '' })}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right', // 锚点定位在右侧
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left', // 弹窗从左侧弹出
        }}
        sx={{
          '& .MuiPaper-root': {
            marginLeft: '2px', // 微调间距
            marginTop: '-8px', // 对齐顶部
            boxShadow: '2px 2px 20px rgba(0, 0, 0, 0.2)', // 添加阴影
            borderRadius: '0 2px 2px 0', // 右侧圆角
            minWidth: '160px', // 设置最小宽度
            background: '#2D2F39', // 深色背景
            color: '#FFFFFF', // 文字颜色
          },
        }}
        // 关键定位样式
        PaperProps={{
          style: {
            left: `${drawerWidth}px !important`, // 紧贴侧边栏右侧
            top: 'auto !important',
            bottom: 'auto !important',
          },
        }}
      >
        {settingsItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => handleCloseMenu(item)}
            sx={{
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
              },
              justifyContent: 'flex-start', // 文字左对齐
            }}
          >
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: 200,
                fontSize: '0.875rem',
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

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              background: '#f7f9fc',
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
              borderRight: 'none',
              background: '#f7f9fc',
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};