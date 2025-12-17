import axios from 'axios';



// API Base URL - Update this to your backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // ← ADD THIS
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Admin endpoints
  ADMIN_VERIFY_CODE: '/dashboard/api/v1/dashboard/admin/verify-code',
  ADMIN_LOGIN: '/dashboard/api/v1/dashboard/admin/login',
  ADMIN_CREATE_USER: '/dashboard/api/v1/dashboard/admin/users/create',
  ADMIN_GET_USERS: '/dashboard/api/v1/dashboard/admin/users', // LEGACY: Dashboard users only
  ADMIN_GET_ALL_USERS: '/dashboard/api/v1/dashboard/admin/all-users', // NEW: All users with filter
  ADMIN_GET_USER: (userId: string) => `/dashboard/api/v1/dashboard/admin/users/${userId}`,
  ADMIN_UPDATE_USER: (userId: string) => `/dashboard/api/v1/dashboard/admin/users/${userId}`,
  ADMIN_DELETE_USER: (userId: string) => `/dashboard/api/v1/dashboard/admin/users/${userId}`,
  ADMIN_REACTIVATE_USER: (userId: string) => `/dashboard/api/v1/dashboard/admin/users/${userId}/reactivate`, // NEW
  ADMIN_STATS: '/dashboard/api/v1/dashboard/admin/stats',
  ADMIN_ACTIVITY: '/dashboard/api/v1/dashboard/admin/activity',
  ADMIN_ALL_SESSIONS: '/dashboard/api/v1/dashboard/admin/sessions',
  ADMIN_USER_HISTORY: (userId: string) => `/dashboard/api/v1/dashboard/admin/users/${userId}/history`,

  // User endpoints
  USER_LOGIN: '/dashboard/api/v1/dashboard/user/login',
  
  // Session endpoints
  SESSION_CREATE: '/dashboard/api/v1/dashboard/sessions/create',
  SESSION_MY_SESSIONS: '/dashboard/api/v1/dashboard/sessions/my-sessions',
  SESSION_ANALYZE: (sessionId: string) => `/dashboard/api/v1/dashboard/sessions/${sessionId}/analyze`,
  
  // Chat endpoints
  CHAT_MESSAGE: '/dashboard/api/v1/dashboard/chat/message',
  CHAT_AUDIO: '/dashboard/api/v1/dashboard/chat/audio',
  
  // Report endpoints
  REPORT_GENERATE: (sessionId: string) => `/dashboard/api/v1/dashboard/sessions/${sessionId}/report`,
  REPORT_DOWNLOAD: (sessionId: string) => `/dashboard/api/v1/dashboard/reports/${sessionId}/download`,
};

// Auth helpers
export const saveAuthToken = (token: string, userType: 'admin' | 'user') => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_type', userType);
};

export const updateUser = async (userId: string, data: any) => {
  return apiClient.put(`/dashboard/api/v1/dashboard/admin/users/${userId}`, data);
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const getUserType = (): 'admin' | 'user' | null => {
  return localStorage.getItem('user_type') as 'admin' | 'user' | null;
};

export const clearAuth = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_type');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};


/**
 * Download session report as PDF
 * @param sessionId - The session ID to download report for
 * @returns Promise with blob data
 */
export const downloadSessionReport = async (sessionId: string) => {
  return apiClient.get(API_ENDPOINTS.REPORT_DOWNLOAD(sessionId), {
    responseType: 'blob',
  });
};

/**
 * Helper function to trigger browser download of a blob
 * @param blob - The blob data to download
 * @param filename - The filename to save as
 */
export const triggerBrowserDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

/**
 * Generate report for a session
 * @param sessionId - The session ID to generate report for
 */
export const generateSessionReport = async (sessionId: string) => {
  return apiClient.post(API_ENDPOINTS.REPORT_GENERATE(sessionId));
};

// ═══════════════════════════════════════════════════════════════════════════
// API Helper Functions - Sessions
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all sessions (admin only)
 * @param status - Filter by status
 */
export const getAllSessions = async (status?: string) => {
  const params: any = {};
  if (status) params.status = status;
  return apiClient.get(API_ENDPOINTS.ADMIN_ALL_SESSIONS, { params });
};

/**
 * Get user's own sessions
 */
export const getMySessions = async () => {
  return apiClient.get(API_ENDPOINTS.SESSION_MY_SESSIONS);
};

/**
 * Create a new session
 */
export const createSession = async (data: { session_type: 'web' | 'vr' }) => {
  return apiClient.post(API_ENDPOINTS.SESSION_CREATE, data);
};

/**
 * Analyze a session
 * @param sessionId - The session ID to analyze
 */
export const analyzeSession = async (sessionId: string) => {
  return apiClient.post(API_ENDPOINTS.SESSION_ANALYZE(sessionId));
};

/**
 * Get user activity history (admin only)
 * @param userId - The user ID to get history for
 */
export const getUserHistory = async (userId: string) => {
  return apiClient.get(API_ENDPOINTS.ADMIN_USER_HISTORY(userId));
};

// ═══════════════════════════════════════════════════════════════════════════
// API Helper Functions - Admin Stats & Activity
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = async () => {
  return apiClient.get(API_ENDPOINTS.ADMIN_STATS);
};

/**
 * Get recent activity log
 */
export const getAdminActivity = async () => {
  return apiClient.get(API_ENDPOINTS.ADMIN_ACTIVITY);
};

// ═══════════════════════════════════════════════════════════════════════════
// API Helper Functions - User Management
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get all users (VR + Dashboard) with optional filtering
 * @param skip - Number of users to skip (pagination)
 * @param limit - Maximum users to return
 * @param userType - Filter by user type: 'vr', 'dashboard', or undefined for all
 * @param includeInactive - Include deactivated users
 */
export const getAllUsers = async (
  skip = 0,
  limit = 100,
  userType?: 'vr' | 'dashboard',
  includeInactive = false
) => {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
    include_inactive: includeInactive.toString(),
  });

  if (userType) {
    params.append('user_type', userType);
  }

  return apiClient.get(`${API_ENDPOINTS.ADMIN_GET_ALL_USERS}?${params.toString()}`);
};

/**
 * LEGACY: Get dashboard users only (kept for backward compatibility)
 */
export const getDashboardUsers = async (skip = 0, limit = 100) => {
  return apiClient.get(`${API_ENDPOINTS.ADMIN_GET_USERS}?skip=${skip}&limit=${limit}`);
};

/**
 * Get specific user details (works for VR and Dashboard users)
 */
export const getUserDetails = async (userId: string) => {
  return apiClient.get(API_ENDPOINTS.ADMIN_GET_USER(userId));
};

/**
 * Create new dashboard user
 */
export const createDashboardUser = async (data: {
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
}) => {
  return apiClient.post(API_ENDPOINTS.ADMIN_CREATE_USER, data);
};

/**
 * Update user information (type-aware on backend)
 * For VR users: only name, email, is_active will be updated
 * For Dashboard users: all fields can be updated
 */
export const updateUserInfo = async (
  userId: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    notes?: string;
    is_active?: boolean;
  }
) => {
  return apiClient.put(API_ENDPOINTS.ADMIN_UPDATE_USER(userId), data);
};

/**
 * Deactivate user (soft delete - works for VR and Dashboard users)
 */
export const deactivateUser = async (userId: string) => {
  return apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_USER(userId));
};

/**
 * Reactivate a deactivated user
 */
export const reactivateUser = async (userId: string) => {
  return apiClient.post(API_ENDPOINTS.ADMIN_REACTIVATE_USER(userId));
};