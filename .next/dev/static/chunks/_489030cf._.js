(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_BASE_URL",
    ()=>API_BASE_URL,
    "API_ENDPOINTS",
    ()=>API_ENDPOINTS,
    "analyzeSession",
    ()=>analyzeSession,
    "apiClient",
    ()=>apiClient,
    "clearAuth",
    ()=>clearAuth,
    "createDashboardUser",
    ()=>createDashboardUser,
    "createSession",
    ()=>createSession,
    "deactivateUser",
    ()=>deactivateUser,
    "downloadSessionReport",
    ()=>downloadSessionReport,
    "generateSessionReport",
    ()=>generateSessionReport,
    "getAdminActivity",
    ()=>getAdminActivity,
    "getAdminStats",
    ()=>getAdminStats,
    "getAllSessions",
    ()=>getAllSessions,
    "getAllUsers",
    ()=>getAllUsers,
    "getAuthToken",
    ()=>getAuthToken,
    "getDashboardUsers",
    ()=>getDashboardUsers,
    "getMySessions",
    ()=>getMySessions,
    "getUserDetails",
    ()=>getUserDetails,
    "getUserHistory",
    ()=>getUserHistory,
    "getUserType",
    ()=>getUserType,
    "isAuthenticated",
    ()=>isAuthenticated,
    "reactivateUser",
    ()=>reactivateUser,
    "saveAuthToken",
    ()=>saveAuthToken,
    "triggerBrowserDownload",
    ()=>triggerBrowserDownload,
    "updateUser",
    ()=>updateUser,
    "updateUserInfo",
    ()=>updateUserInfo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://4dc9b0939958.ngrok-free.app") || 'http://localhost:8000';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
    }
});
// Request interceptor to add auth token
apiClient.interceptors.request.use((config)=>{
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor to handle errors
apiClient.interceptors.response.use((response)=>response, (error)=>{
    if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_type');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
const API_ENDPOINTS = {
    // Admin endpoints
    ADMIN_VERIFY_CODE: '/dashboard/api/v1/dashboard/admin/verify-code',
    ADMIN_LOGIN: '/dashboard/api/v1/dashboard/admin/login',
    ADMIN_CREATE_USER: '/dashboard/api/v1/dashboard/admin/users/create',
    ADMIN_GET_USERS: '/dashboard/api/v1/dashboard/admin/users',
    ADMIN_GET_ALL_USERS: '/dashboard/api/v1/dashboard/admin/all-users',
    ADMIN_GET_USER: (userId)=>`/dashboard/api/v1/dashboard/admin/users/${userId}`,
    ADMIN_UPDATE_USER: (userId)=>`/dashboard/api/v1/dashboard/admin/users/${userId}`,
    ADMIN_DELETE_USER: (userId)=>`/dashboard/api/v1/dashboard/admin/users/${userId}`,
    ADMIN_REACTIVATE_USER: (userId)=>`/dashboard/api/v1/dashboard/admin/users/${userId}/reactivate`,
    ADMIN_STATS: '/dashboard/api/v1/dashboard/admin/stats',
    ADMIN_ACTIVITY: '/dashboard/api/v1/dashboard/admin/activity',
    ADMIN_ALL_SESSIONS: '/dashboard/api/v1/dashboard/admin/sessions',
    ADMIN_USER_HISTORY: (userId)=>`/dashboard/api/v1/dashboard/admin/users/${userId}/history`,
    // User endpoints
    USER_LOGIN: '/dashboard/api/v1/dashboard/user/login',
    // Session endpoints
    SESSION_CREATE: '/dashboard/api/v1/dashboard/sessions/create',
    SESSION_MY_SESSIONS: '/dashboard/api/v1/dashboard/sessions/my-sessions',
    SESSION_ANALYZE: (sessionId)=>`/dashboard/api/v1/dashboard/sessions/${sessionId}/analyze`,
    // Chat endpoints
    CHAT_MESSAGE: '/dashboard/api/v1/dashboard/chat/message',
    CHAT_AUDIO: '/dashboard/api/v1/dashboard/chat/audio',
    // Report endpoints
    REPORT_GENERATE: (sessionId)=>`/dashboard/api/v1/dashboard/sessions/${sessionId}/report`,
    REPORT_DOWNLOAD: (sessionId)=>`/dashboard/api/v1/dashboard/reports/${sessionId}/download`
};
const saveAuthToken = (token, userType)=>{
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_type', userType);
};
const updateUser = async (userId, data)=>{
    return apiClient.put(`/dashboard/api/v1/dashboard/admin/users/${userId}`, data);
};
const getAuthToken = ()=>{
    return localStorage.getItem('auth_token');
};
const getUserType = ()=>{
    return localStorage.getItem('user_type');
};
const clearAuth = ()=>{
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_type');
};
const isAuthenticated = ()=>{
    return !!getAuthToken();
};
const downloadSessionReport = async (sessionId)=>{
    return apiClient.get(API_ENDPOINTS.REPORT_DOWNLOAD(sessionId), {
        responseType: 'blob'
    });
};
const triggerBrowserDownload = (blob, filename)=>{
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
const generateSessionReport = async (sessionId)=>{
    return apiClient.post(API_ENDPOINTS.REPORT_GENERATE(sessionId));
};
const getAllSessions = async (status)=>{
    const params = {};
    if (status) params.status = status;
    return apiClient.get(API_ENDPOINTS.ADMIN_ALL_SESSIONS, {
        params
    });
};
const getMySessions = async ()=>{
    return apiClient.get(API_ENDPOINTS.SESSION_MY_SESSIONS);
};
const createSession = async (data)=>{
    return apiClient.post(API_ENDPOINTS.SESSION_CREATE, data);
};
const analyzeSession = async (sessionId)=>{
    return apiClient.post(API_ENDPOINTS.SESSION_ANALYZE(sessionId));
};
const getUserHistory = async (userId)=>{
    return apiClient.get(API_ENDPOINTS.ADMIN_USER_HISTORY(userId));
};
const getAdminStats = async ()=>{
    return apiClient.get(API_ENDPOINTS.ADMIN_STATS);
};
const getAdminActivity = async ()=>{
    return apiClient.get(API_ENDPOINTS.ADMIN_ACTIVITY);
};
const getAllUsers = async (skip = 0, limit = 100, userType, includeInactive = false)=>{
    const params = new URLSearchParams({
        skip: skip.toString(),
        limit: limit.toString(),
        include_inactive: includeInactive.toString()
    });
    if (userType) {
        params.append('user_type', userType);
    }
    return apiClient.get(`${API_ENDPOINTS.ADMIN_GET_ALL_USERS}?${params.toString()}`);
};
const getDashboardUsers = async (skip = 0, limit = 100)=>{
    return apiClient.get(`${API_ENDPOINTS.ADMIN_GET_USERS}?skip=${skip}&limit=${limit}`);
};
const getUserDetails = async (userId)=>{
    return apiClient.get(API_ENDPOINTS.ADMIN_GET_USER(userId));
};
const createDashboardUser = async (data)=>{
    return apiClient.post(API_ENDPOINTS.ADMIN_CREATE_USER, data);
};
const updateUserInfo = async (userId, data)=>{
    return apiClient.put(API_ENDPOINTS.ADMIN_UPDATE_USER(userId), data);
};
const deactivateUser = async (userId)=>{
    return apiClient.delete(API_ENDPOINTS.ADMIN_DELETE_USER(userId));
};
const reactivateUser = async (userId)=>{
    return apiClient.post(API_ENDPOINTS.ADMIN_REACTIVATE_USER(userId));
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAuthenticated"])()) {
                const userType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserType"])();
                if (userType === 'admin') {
                    router.push('/admin/dashboard');
                } else if (userType === 'user') {
                    router.push('/user/dashboard');
                } else {
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
        }
    }["Home.useEffect"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen w-screen flex items-center justify-center bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-white text-xl",
            children: "Loading..."
        }, void 0, false, {
            fileName: "[project]/app/page.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(Home, "vQduR7x+OPXj6PSmJyFnf+hU7bg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_489030cf._.js.map