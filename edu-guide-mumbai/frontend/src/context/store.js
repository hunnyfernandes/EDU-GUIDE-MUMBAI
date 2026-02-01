import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth store
export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken) => set({
                user,
                accessToken,
                isAuthenticated: true
            }),

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false
                });
            },

            updateUser: (userData) => set((state) => ({
                user: { ...state.user, ...userData }
            })),

            setAccessToken: (accessToken) => set({
                accessToken,
                isAuthenticated: !!accessToken
            }),
        }),
        {
            name: 'auth-storage',
        }
    )
);

// College filter store
export const useFilterStore = create((set) => ({
    filters: {
        search: '',
        stream: '',
        college_type: '',
        min_rating: '',
        max_fees: '',
        state: '',
        city: '',
        sort_by: 'college_name',
        order: 'ASC',
    },

    setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
    })),

    setFilters: (filters) => set({ filters }),

    resetFilters: () => set({
        filters: {
            search: '',
            stream: '',
            college_type: '',
            min_rating: '',
            max_fees: '',
            state: '',
            city: '',
            sort_by: 'college_name',
            order: 'ASC',
        }
    }),
}));

// Comparison store
export const useComparisonStore = create((set) => ({
    selectedColleges: [],

    addCollege: (college) => set((state) => {
        if (state.selectedColleges.length >= 4) {
            return state; // Max 4 colleges
        }
        if (state.selectedColleges.find(c => c.college_id === college.college_id)) {
            return state; // Already added
        }
        return {
            selectedColleges: [...state.selectedColleges, college]
        };
    }),

    removeCollege: (collegeId) => set((state) => ({
        selectedColleges: state.selectedColleges.filter(c => c.college_id !== collegeId)
    })),

    clearComparison: () => set({ selectedColleges: [] }),

    isSelected: (collegeId) => (state) =>
        state.selectedColleges.some(c => c.college_id === collegeId),
}));

// UI store for modals and loading states
export const useUIStore = create((set) => ({
    isLoginModalOpen: false,
    isSignupModalOpen: false,
    isForgotPasswordModalOpen: false,
    isLoading: false,

    openLoginModal: () => set({ isLoginModalOpen: true, isSignupModalOpen: false, isForgotPasswordModalOpen: false }),
    closeLoginModal: () => set({ isLoginModalOpen: false }),

    openSignupModal: () => set({ isSignupModalOpen: true, isLoginModalOpen: false, isForgotPasswordModalOpen: false }),
    closeSignupModal: () => set({ isSignupModalOpen: false }),

    openForgotPasswordModal: () => set({ isForgotPasswordModalOpen: true, isLoginModalOpen: false, isSignupModalOpen: false }),
    closeForgotPasswordModal: () => set({ isForgotPasswordModalOpen: false }),

    setLoading: (isLoading) => set({ isLoading }),
}));
