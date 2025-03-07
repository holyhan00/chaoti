import { useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/Login';
import ChatPage from './pages/Chat';
import { useAuthStore } from './stores/authStore';
import { ChatProvider } from './contexts/ChatContext';
import './styles/global.css';

const App = () => {
  const { isAuthenticated } = useAuthStore();

  // 初始化认证状态（例如检查localStorage）
  useEffect(() => {
    useAuthStore.getState().initialize();
    document.title = 'Chaoti AI 助手';
  }, []);

  return (
    <ChatProvider>
      <Router>
        <Routes>
          {/* 登录页（未登录可访问） */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 主布局路由（需要登录） */}
          <Route path="/" element={
            isAuthenticated ? (
              <MainLayout />  // 包含侧边栏的主布局
            ) : (
              <Navigate to="/login" replace />
            )
          }>
            {/* 默认重定向到聊天界面 */}
            <Route index element={<Navigate to="/chat" replace />} />
            
            {/* 聊天主页面 */}
            <Route path="chat" element={<ChatPage />} />
            
            {/* 其他功能页面示例 */}
            {/* <Route path="knowledge" element={<KnowledgePage />} /> */}
            
            {/* 未匹配路由处理 */}
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Route>
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default App;