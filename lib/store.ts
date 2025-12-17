import { create } from 'zustand';
import { User, Session, Message } from './types';

interface AuthState {
  user: User | null;
  userType: 'admin' | 'user' | null;
  isAuthenticated: boolean;
  setUser: (user: User | null, userType: 'admin' | 'user' | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userType: null,
  isAuthenticated: false,
  setUser: (user, userType) => set({ user, userType, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_type');
    set({ user: null, userType: null, isAuthenticated: false });
  },
}));

interface ChatState {
  currentSession: Session | null;
  messages: Message[];
  setCurrentSession: (session: Session | null) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  currentSession: null,
  messages: [],
  setCurrentSession: (session) => set({ currentSession: session }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setMessages: (messages) => set({ messages }),
}));

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
