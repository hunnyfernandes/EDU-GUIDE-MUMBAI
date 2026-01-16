import axios from 'axios';

// Default to backend's server port (5002) if REACT_APP_API_URL is not provided
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Allow cookies to be sent with requests
});

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    isRefreshing = false;
    failedQueue = [];
};

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized responses
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Prevent duplicate refresh requests
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            // Try to refresh the token
            return api.post('/auth/refresh-token')
                .then((response) => {
                    const { accessToken } = response.data;
                    localStorage.setItem('accessToken', accessToken);
                    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    
                    processQueue(null, accessToken);
                    return api(originalRequest);
                })
                .catch((err) => {
                    // Refresh failed - clear auth and redirect to login
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    processQueue(err, null);
                    window.location.href = '/';
                    return Promise.reject(err);
                });
        }

        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    refreshToken: () => api.post('/auth/refresh-token'),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    changePassword: (data) => api.put('/auth/change-password', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

// College API
export const collegeAPI = {
    getColleges: (params) => {
        // Filter out empty values from params
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
        );
        return api.get('/colleges', { params: filteredParams });
    },
    getCollegeById: (id) => api.get(`/colleges/${id}`),
    getFeatured: () => api.get('/colleges/featured'),
    getStreams: () => api.get('/colleges/streams/all'),
    compare: (collegeIds) => api.post('/colleges/compare', { college_ids: collegeIds }),
    autocomplete: (query) => api.get('/colleges/search/autocomplete', { params: { q: query } }),
};

// Review API
export const reviewAPI = {
    getCollegeReviews: (collegeId, params) => api.get(`/reviews/college/${collegeId}`, { params }),
    createReview: (data) => api.post('/reviews', data),
    updateReview: (id, data) => api.put(`/reviews/${id}`, data),
    deleteReview: (id) => api.delete(`/reviews/${id}`),
    markHelpful: (id) => api.put(`/reviews/${id}/helpful`),
    getMyReviews: () => api.get('/reviews/my-reviews'),
};

// User API
export const userAPI = {
    getDashboard: () => api.get('/user/dashboard'),
    saveCollege: (collegeId) => api.post('/user/saved-colleges', { college_id: collegeId }),
    getSavedColleges: () => api.get('/user/saved-colleges'),
    removeSavedCollege: (collegeId) => api.delete(`/user/saved-colleges/${collegeId}`),
    checkSavedCollege: (collegeId) => api.get(`/user/saved-colleges/check/${collegeId}`),
    logSearch: (searchData) => api.post('/user/search-history', searchData),
    getSearchHistory: (limit = 10) => api.get('/user/search-history', { params: { limit } }),
    getPopularSearches: (limit = 10) => api.get('/user/popular-searches', { params: { limit } }),
    clearSearchHistory: () => api.delete('/user/search-history'),
    logView: (collegeId, collegeName) => api.post('/user/view-history', { college_id: collegeId, college_name: collegeName }),
    getViewHistory: (limit = 10) => api.get('/user/view-history', { params: { limit } }),
    getCombinedHistory: (limit = 20) => api.get('/user/history', { params: { limit } }),
    clearViewHistory: () => api.delete('/user/view-history'),
};

// Admin API
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getPendingReviews: () => api.get('/admin/reviews/pending'),
    updateReviewStatus: (id, status) => api.put(`/admin/reviews/${id}/status`, { status }),
    createCollege: (data) => api.post('/admin/colleges', data),
    updateCollege: (id, data) => api.put(`/admin/colleges/${id}`, data),
    deleteCollege: (id) => api.delete(`/admin/colleges/${id}`),
    getUsers: (params) => api.get('/admin/users', { params }),
    getStreams: () => api.get('/admin/streams'),
};

// Chatbot API
export const chatbotAPI = {
    sendMessage: (message, conversationId, conversationHistory = []) => api.post('/chatbot/message', { 
        message, 
        conversation_id: conversationId,
        conversation_history: conversationHistory,
    }),
    getHistory: () => api.get('/chatbot/history'),
};

export default api;
