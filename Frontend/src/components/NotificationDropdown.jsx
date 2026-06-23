import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, UserPlus, Calendar, Check, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import { ThemeContext } from '../context/ThemeContext';

const NotificationDropdown = () => {
    const { token, userId } = useAuthStore();
    const { socket } = useChatStore();
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
            setUnreadCount(res.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchNotifications();
        }
    }, [token]);

    useEffect(() => {
        if (socket) {
            socket.on('notification', (notif) => {
                setNotifications(prev => [notif, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }
        return () => {
            if (socket) socket.off('notification');
        };
    }, [socket]);

    const markAsRead = async (id) => {
        try {
            await axios.patch(`http://localhost:5000/api/notifications/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'message': return <MessageSquare size={16} className="text-indigo-400" />;
            case 'connection': return <UserPlus size={16} className="text-green-400" />;
            case 'meeting': return <Calendar size={16} className="text-purple-400" />;
            default: return <Bell size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-[1rem] transition-all relative border ${isDark ? "bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white border-gray-700/50" : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 border-gray-200"
                    }`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 shadow-lg animate-bounce ${isDark ? "border-gray-900" : "border-white"}`}>
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        ></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className={`absolute right-0 mt-3 w-80 md:w-96 border rounded-xl shadow-2xl z-50 overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
                                }`}
                        >
                            <div className={`p-4 border-b flex justify-between items-center ${isDark ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-100"
                                }`}>
                                <h3 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Notifications</h3>
                                <button className="text-xs text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">Mark all as read</button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif._id}
                                            onClick={() => markAsRead(notif._id)}
                                            className={`p-4 flex gap-4 cursor-pointer transition-all border-b ${!notif.isRead
                                                    ? (isDark ? 'bg-indigo-500/5 border-l-2 border-l-indigo-500 border-b-gray-800/50' : 'bg-indigo-50/50 border-l-2 border-l-indigo-500 border-b-gray-100')
                                                    : (isDark ? 'hover:bg-gray-800/50 border-b-gray-800/50' : 'hover:bg-gray-50 border-b-gray-100')
                                                }`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200 shadow-sm"
                                                }`}>
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm line-clamp-2 leading-relaxed ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                                                    {notif.content}
                                                </p>
                                                <span className={`text-[10px] mt-1 block font-medium ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                                                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            {!notif.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0"></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${isDark ? "bg-gray-800 text-gray-600" : "bg-indigo-50 text-indigo-400"
                                            }`}>
                                            <Bell size={24} />
                                        </div>
                                        <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>No notifications yet</p>
                                    </div>
                                )}
                            </div>

                            <div className={`p-3 text-center border-t transition-colors ${isDark ? "border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white" : "border-gray-100 bg-gray-50 text-gray-500 hover:text-gray-900"
                                }`}>
                                <button className="text-xs font-semibold w-full h-full">View all notifications</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
