import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            userId: null,
            role: null,
            status: null,
            meetingLink: null,
            isAuthenticated: false,

            login: (token, userId, role, status, meetingLink) =>
                set({
                    token,
                    userId,
                    role,
                    status,
                    meetingLink,
                    isAuthenticated: true,
                }),

            updateMeetingLink: (meetingLink) => set({ meetingLink }),

            logout: () =>
                set({
                    token: null,
                    userId: null,
                    role: null,
                    status: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: "auth-storage",
        }
    )
);
export default useAuthStore;