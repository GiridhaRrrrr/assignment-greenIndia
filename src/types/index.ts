export interface User {
  $id: string;
  email: string;
  name: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  createdAt: string;
  lastActive: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  buyerId: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  tags?: string[];
  priority: 'low' | 'medium' | 'high';
}

export interface Message {
  id: string;
  dealId: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  readBy: string[];
  edited?: boolean;
  editedAt?: string;
}

export interface ChatRoom {
  id: string;
  dealId: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping: string[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  mode: 'light' | 'dark';
  systemPreference: 'light' | 'dark';
}

export interface UIState {
  sidebarOpen: boolean;
  notifications: Notification[];
  loading: boolean;
}