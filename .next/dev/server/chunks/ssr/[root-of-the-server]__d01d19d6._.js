module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://4dc9b0939958.ngrok-free.app") || 'http://localhost:8000';
const apiClient = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
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
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function Home() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAuthenticated"])()) {
            const userType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserType"])();
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
    }, [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen w-screen flex items-center justify-center bg-black",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d01d19d6._.js.map