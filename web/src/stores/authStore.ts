// src/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserInfo {
  phone: string;
  enterpriseToken?: string;
  lastLogin: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  user: UserInfo | null;
  
  initialize: () => void;
  login: (phone: string, code: string) => Promise<void>;
  enterpriseLogin: (token: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// 模拟 API 调用
const mockAuthAPI = {
  userLogin: async (phone: string, code: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (code !== '123456') throw new Error('验证码错误');
    return { phone };
  },

  enterpriseAuth: async (token: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (!token.startsWith('ent_')) throw new Error('无效的企业令牌');
    return { enterpriseToken: token };
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: null,

      initialize: () => {
        const saved = get().user;
        if (saved) {
          set({ isAuthenticated: true });
        }
      },

      login: async (phone, code) => {
        try {
          set({ isLoading: true, error: null });
          
          const userData = await mockAuthAPI.userLogin(phone, code);
          const userInfo = {
            phone: userData.phone,
            lastLogin: new Date().toISOString()
          };

          set({
            isAuthenticated: true,
            user: userInfo,
            isLoading: false
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '登录失败',
            isLoading: false
          });
          throw error;
        }
      },

      enterpriseLogin: async (token) => {
        try {
          set({ isLoading: true, error: null });
          
          const enterpriseData = await mockAuthAPI.enterpriseAuth(token);
          const userInfo = {
            phone: '',
            enterpriseToken: enterpriseData.enterpriseToken,
            lastLogin: new Date().toISOString()
          };

          set({
            isAuthenticated: true,
            user: userInfo,
            isLoading: false
          });

        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '企业认证失败',
            isLoading: false
          });
          throw error;
        }
      },

      logout: () => {
        set({
          isAuthenticated: false,
          user: null
        });
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage', // localStorage 的 key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }) // 仅持久化用户数据
    }
  )
);