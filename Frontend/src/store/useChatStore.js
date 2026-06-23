import { create } from 'zustand';
import io from 'socket.io-client';
import axios from 'axios';

export const SOCKET_URL = 'http://localhost:5000';

export const useChatStore = create((set, get) => ({
    socket: null,
    conversations: [],
    messages: [],
    activeConversation: null,
    onlineUsers: [],
    notifications: [],
    unreadCount: 0,
    connections: [],

    initSocket: (userId) => {
        if (get().socket?.connected) return;

        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to socket');
            socket.emit('join', userId);
        });

        socket.on('receiveMessage', (message) => {
            const { activeConversation, conversations, messages } = get();

            // Check if message already exists in state to prevent double rendering
            const isDuplicate = messages.some(m => m._id === message._id);
            if (isDuplicate) return;

            if (activeConversation && activeConversation._id === message.conversationId) {
                set((state) => ({
                    messages: [...state.messages, message]
                }));
            } else {
                // Update conversation last message and highlight unread
                const updatedConversations = conversations.map(conv => {
                    if (conv._id === message.conversationId) {
                        return { ...conv, lastMessage: message, unread: true };
                    }
                    return conv;
                });
                set({ conversations: updatedConversations });
            }
        });

        socket.on('onlineUsers', (users) => {
            set({ onlineUsers: users });
        });

        socket.on('notification', (notif) => {
            set((state) => ({
                notifications: [notif, ...state.notifications],
                unreadCount: state.unreadCount + 1
            }));
        });

        set({ socket });
    },

    fetchConversations: async (token) => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/chat/conversations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ conversations: res.data });
        } catch (error) {
            console.error('Fetch conversations error:', error);
        }
    },

    setActiveConversation: async (conversation, token) => {
        set({ activeConversation: conversation });
        if (conversation) {
            try {
                const res = await axios.get(`${SOCKET_URL}/api/chat/messages/${conversation._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                set({ messages: res.data });
            } catch (error) {
                console.error('Fetch messages error:', error);
            }
        }
    },

    sendMessage: async (messageData, token) => {
        try {
            const res = await axios.post(`${SOCKET_URL}/api/chat/send`, messageData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newMessage = res.data;
            const tempId = messageData.tempId;

            set((state) => {
                if (tempId) {
                    // Replace the local/temporary message with the server's confirmed message
                    return {
                        messages: state.messages.map(m => m.tempId === tempId ? newMessage : m)
                    };
                } else {
                    return {
                        messages: [...state.messages, newMessage]
                    };
                }
            });

            const { socket } = get();
            if (socket) {
                socket.emit('sendMessage', {
                    receiverId: messageData.receiverId,
                    message: newMessage
                });
            }
        } catch (error) {
            console.error('Send message error:', error);
        }
    },

    fetchConnections: async (token) => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/connections`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            set({ connections: res.data });
        } catch (error) {
            console.error('Fetch connections error:', error);
        }
    },

    startConversation: async (targetUserId, token) => {
        try {
            // Check if conversation already exists in loaded conversations
            const { conversations } = get();
            const existing = conversations.find(c =>
                c.participants.some(p => p._id === targetUserId)
            );

            if (existing) {
                get().setActiveConversation(existing, token);
                return;
            }

            // Otherwise tell backend to find or create
            const res = await axios.post(`${SOCKET_URL}/api/chat/conversation`, { receiverId: targetUserId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const newConv = res.data;
            set(state => ({
                conversations: [newConv, ...state.conversations],
                activeConversation: newConv
            }));

            // Load messages for the new conversation
            get().setActiveConversation(newConv, token);
        } catch (error) {
            console.error('Start conversation error:', error);
        }
    },

    addLocalMessage: (message) => {
        set((state) => ({
            messages: [...state.messages, message]
        }));
    },

    updateMessage: (tempId, updates) => {
        set((state) => ({
            messages: state.messages.map(m => m.tempId === tempId ? { ...m, ...updates } : m)
        }));
    }
}));
