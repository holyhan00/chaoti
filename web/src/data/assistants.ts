//
export interface Assistant {
  id: string;
  name: string;
  avatar: string;
  description: string;
  type: 'system' | 'custom' | 'robot'; 
  capabilities: string[];
  lastActive?: string;
}

export const PRESET_ASSISTANTS: Assistant[] = [
  {
    id: 'super-assistant',
    name: '超级助手',
    avatar: '/avatars/super.png',
    description: '全能型智能助手，处理复杂工作流',
    type: 'system',
    capabilities: ['对话', '文件处理', '数据分析']
  },
  {
    id: 'customer-service',
    name: '客服助手',
    avatar: '/avatars/service.png',
    description: '自动处理客户咨询与工单',
    type: 'robot',
    capabilities: ['工单处理', 'FAQ匹配']
  },
  {
    id: 'data-analyst',
    name: '数据分析师',
    avatar: '/avatars/analyst.png',
    description: '智能生成数据可视化报告',
    type: 'system',
    capabilities: ['数据清洗', '可视化']
  }
];