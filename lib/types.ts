// Auth types
export interface AdminCredentials {
  username: string;
  password: string;
  message: string;
  expires_at: string;
}

export interface LoginResponse {
  access_token: string;
  username?: string;
  admin_id?: string;
  user_id?: string;
  name?: string;
  message: string;
}

// User types
export interface User {
  user_id: string;
  name: string;
  username?: string; // Optional - VR users don't have username
  email?: string;
  phone?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
  total_sessions: number;
  total_downloads: number;
  user_type?: 'vr' | 'dashboard'; // NEW: User type
}

export interface CreateUserRequest {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface CreateUserResponse {
  user_id: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  created_at: string;
  message: string;
}

// Session types
export interface Session {
  session_id: string;
  user_id: string;
  user_name: string;
  session_type: string;
  start_time: string;
  end_time?: string;
  status: string;
  message_count: number;
  has_report: boolean;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tags?: string[];
}

export interface ChatMessageRequest {
  session_id: string;
  message: string;
}

export interface ChatMessageResponse {
  session_id: string;
  user_message: string;
  bot_response: string;
  timestamp: string;
  conversation_count: number;
}

// Report types
export interface Report {
  report_id: string;
  session_id: string;
  user_id: string;
  user_name: string;
  generated_at: string;
  conversation_summary: string;
  underlying_cause: string;
  therapy_tags: string[];
  message_count: number;
  session_duration_minutes: number;
  report_url: string;
}

// Admin dashboard types
export interface DashboardStats {
  total_users: number;
  active_users: number;
  total_sessions: number;
  active_sessions: number;
  total_reports_generated: number;
  total_downloads: number;
  sessions_today: number;
  new_users_this_week: number;
  average_session_duration: number;
  most_active_users: Array<{
    user_id: string;
    user_name: string;
    session_count: number;
  }>;
}

export interface ActivityLog {
  activity_id: string;
  user_id: string;
  user_name: string;
  activity_type: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
