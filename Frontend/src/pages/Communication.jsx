import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Paperclip,
    Calendar,
    Check,
    CheckCircle2,
    Search,
    MoreVertical,
    User,
    Phone,
    Info,
    ArrowLeft,
    Clock,
    Plus,
    Users,
    RefreshCcw,
    AlertCircle,
    FileText,
    Download
} from 'lucide-react';
import { useChatStore, SOCKET_URL } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';

const Communication = () => {
    const { token, userId, role } = useAuthStore();
    const {
        initSocket,
        conversations,
        fetchConversations,
        activeConversation,
        setActiveConversation,
        messages,
        sendMessage,
        onlineUsers,
        connections,
        fetchConnections,
        startConversation,
        addLocalMessage,
        updateMessage
    } = useChatStore();

    const [messageInput, setMessageInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [favorites, setFavorites] = useState(new Set());
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const [view, setView] = useState('chats'); // 'chats' or 'connections'

    const messagesEndRef = useRef(null);


    useEffect(() => {
        if (userId) {
            initSocket(userId);
            fetchConversations(token);
            fetchConnections(token);
        }
    }, [userId, token]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeConversation) return;

        const otherUser = activeConversation.participants.find(p => p._id !== userId);

        sendMessage({
            conversationId: activeConversation._id,
            receiverId: otherUser?._id,
            content: messageInput,
            messageType: 'text'
        }, token);

        setMessageInput('');
    };

    const handleScheduleMeeting = () => {
        const rolePath = role === 'founder' ? 'founder' : 'investor';
        window.location.href = `/${rolePath}/appointments`;
    };

    const performUpload = async (file, tempId) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            updateMessage(tempId, { status: 'uploading' });

            const res = await axios.post(`${SOCKET_URL}/api/upload/file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    updateMessage(tempId, { progress });
                }
            });

            const otherUser = activeConversation.participants.find(p => p._id !== userId);

            // Finalize message by sending it via socket/api
            await sendMessage({
                conversationId: activeConversation._id,
                receiverId: otherUser?._id,
                content: `Shared a file: ${file.name}`,
                messageType: 'file',
                fileUrl: res.data.url,
                fileType: res.data.type,
                tempId: tempId
            }, token);

        } catch (error) {
            console.error('File upload failed:', error);
            updateMessage(tempId, { status: 'failed', error: 'Upload failed' });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file || !activeConversation) return;

        const tempId = Date.now().toString();

        // WhatsApp-like: Add to UI immediately
        addLocalMessage({
            _id: tempId,
            tempId: tempId,
            sender: userId,
            content: `Shared a file: ${file.name}`,
            messageType: 'file',
            fileUrl: null, // Pending
            fileType: file.type,
            status: 'pending',
            progress: 0,
            createdAt: new Date().toISOString(),
            isMe: true,
            fileObj: file // Keep reference for retry
        });

        performUpload(file, tempId);
    };

    const handleRetryUpload = (msg) => {
        if (!msg.fileObj) return;
        performUpload(msg.fileObj, msg.tempId);
    };

    const isUserOnline = (otherUserId) => onlineUsers.includes(otherUserId);

    const toggleFavorite = (conversationId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(conversationId)) {
                newFavorites.delete(conversationId);
            } else {
                newFavorites.add(conversationId);
            }
            return newFavorites;
        });
    };

    const filteredConversations = conversations.filter(conv => {
        const otherUser = conv.participants.find(p => p._id !== userId);
        return otherUser?.name.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => {
        const aIsFav = favorites.has(a._id);
        const bIsFav = favorites.has(b._id);
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
        return 0;
    });

    const filteredConnections = connections.filter(conn => {
        return conn.userId?.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="h-[calc(100vh-80px)] flex overflow-hidden font-sans p-4 gap-4 transition-colors duration-300" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>




            {/* Conversations List Sidebar */}
            <div className="hidden md:flex w-full md:w-80 lg:w-96 backdrop-blur-xl border rounded-xl flex flex-col overflow-hidden shadow-sm bg-blue-900/20 border-blue-400/30">
                <div className="p-6 border-b border-blue-400/30">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>Messages</h2>

                        <button
                            onClick={() => setView(view === 'chats' ? 'connections' : 'chats')}
                            className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-all border border-indigo-500/10"
                            title={view === 'chats' ? 'View Connections' : 'View Chats'}
                        >
                            {view === 'chats' ? <Users size={20} /> : <Plus size={20} />}
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder={view === 'chats' ? "Search chats..." : "Search connections..."}
                            className={`w-full border rounded-2xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${isDark ? "bg-gray-900/50 border-gray-600 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>


                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {view === 'chats' ? (
                        filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => {
                                const otherUser = conv.participants.find(p => p._id !== userId);
                                const isOnline = isUserOnline(otherUser?._id);
                                const isActive = activeConversation?._id === conv._id;
                                const isFavorite = favorites.has(conv._id);

                                return (
                                    <motion.div
                                        key={conv._id}
                                        whileHover={{ backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(243, 244, 246, 1)' }}
                                        onClick={() => setActiveConversation(conv, token)}
                                        className={`p-4 cursor-pointer border-l-4 transition-all group relative ${isActive ? 'bg-indigo-600/10 border-indigo-500 shadow-lg' : 'border-transparent hover:border-indigo-400/50'}`}
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(conv._id);
                                            }}
                                            className={`absolute right-3 top-3 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${isFavorite ? 'bg-amber-500/20 text-amber-400' : isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-400'}`}
                                        >
                                            <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>

                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg border-2 ${isFavorite ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-300' : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400'}`}>
                                                    {otherUser?.name.charAt(0)}
                                                </div>
                                                {isOnline && (
                                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg pulse-green"></span>
                                                )}
                                                {isFavorite && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 flex items-center justify-center rounded-full text-white text-xs font-bold shadow-lg">⭐</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className={`font-bold truncate ${isDark ? "text-gray-100" : "text-gray-800"}`}>{otherUser?.name}</h3>

                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                        {conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                                                    {conv.lastMessage?.sender === userId && <Check className="inline flex-shrink-0 text-indigo-500" size={12} />}
                                                    <span className="truncate">{conv.lastMessage?.content || 'No messages yet'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center flex flex-col items-center gap-4">
                                <div className={`p-4 rounded-full text-gray-400 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
                                    <Search size={24} />
                                </div>

                                <p className="text-sm text-gray-500">No conversations found. Start one from your connections!</p>
                                <button
                                    onClick={() => setView('connections')}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-500 underline"
                                >
                                    View Connections
                                </button>
                            </div>
                        )
                    ) : (
                        filteredConnections.length > 0 ? (
                            filteredConnections.map((conn) => {
                                const user = conn.userId;
                                if (!user) return null;
                                const isOnline = isUserOnline(user._id);

                                return (
                                    <motion.div
                                        key={user._id}
                                        whileHover={{ backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(243, 244, 246, 1)' }}
                                        onClick={() => {

                                            startConversation(user._id, token);
                                            setView('chats');
                                        }}
                                        className="p-4 cursor-pointer border-l-4 border-cyan-400/50 transition-all hover:border-cyan-400 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex-shrink-0">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg border-2 bg-gradient-to-br ${isDark ? "from-cyan-500 to-blue-600 border-cyan-400" : "from-cyan-400 to-blue-500 border-cyan-300"}`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                {isOnline && (
                                                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg pulse-green"></span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`font-bold truncate ${isDark ? "text-gray-100" : "text-gray-800"}`}>{user.name}</h3>
                                                <p className="text-xs text-gray-500 capitalize font-medium">{user.role} • {isOnline ? '🟢 Online' : '⚫ Offline'}</p>
                                            </div>
                                            <button className={`p-2 rounded-lg transition-all ${isDark ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20" : "bg-cyan-50 text-cyan-600 hover:bg-cyan-100"}`}>
                                                <Send size={16} />
                                            </button>

                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="p-10 text-center flex flex-col items-center gap-4">
                                <div className={`p-4 rounded-full bg-gradient-to-br ${isDark ? "from-gray-700 to-gray-800 text-gray-400" : "from-gray-100 to-gray-50 text-gray-400"}`}>
                                    <Users size={24} />
                                </div>
                                <p className="text-sm text-gray-500">No connections found. Connect with {role === 'investor' ? 'Founders' : 'Investors'} to start chatting!</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 backdrop-blur-xl border rounded-xl flex flex-col overflow-hidden relative shadow-sm ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-200"
                }`}>

                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className={`p-4 md:p-6 border-b flex items-center justify-between ${isDark ? "border-gray-700 bg-gray-900/30" : "border-gray-100 bg-gray-50/50"}`}>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/20">
                                        {activeConversation.participants.find(p => p._id !== userId)?.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <h3 className={`font-bold text-lg md:text-xl truncate ${isDark ? "text-white" : "text-gray-800"}`}>
                                        {activeConversation.participants.find(p => p._id !== userId)?.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isUserOnline(activeConversation.participants.find(p => p._id !== userId)?._id) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}></span>
                                        <span className="text-xs text-gray-500 font-medium">
                                            {isUserOnline(activeConversation.participants.find(p => p._id !== userId)?._id) ? 'Online' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleScheduleMeeting}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    <Calendar size={18} />
                                    <span>Schedule Meeting</span>
                                </button>
                                <button className={`p-2.5 rounded-xl border hover:text-indigo-600 transition-all ${isDark ? "bg-gray-800 border-gray-700 text-gray-400 hover:text-white" : "bg-gray-100 border-gray-200 text-gray-500"}`}>
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className={`flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b ${isDark ? "from-gray-900/20 via-transparent to-gray-900/20" : "from-gray-50/50 via-transparent to-gray-50/50"}`}>

                            <AnimatePresence>
                                {messages.map((msg, idx) => {
                                    const isMe = msg.sender === userId;
                                    const isPending = msg.status === 'pending' || msg.status === 'uploading';
                                    const isFailed = msg.status === 'failed';

                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            key={msg._id || idx}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[85%] md:max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                                                <div className={`p-4 rounded-xl relative shadow-sm border ${isMe
                                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none border-indigo-500/30 shadow-indigo-500/20'
                                                    : `rounded-tl-none border ${isDark ? "bg-gray-800/80 text-gray-100 border-gray-700 shadow-gray-900/50" : "bg-white text-gray-800 border-gray-200 shadow-gray-100/50"}`
                                                    }`}>

                                                    {msg.messageType === 'file' ? (
                                                        <div className={`flex flex-col gap-2 min-w-[200px]`}>
                                                            <div className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${isMe ? 'bg-black/20 border-white/20 shadow-inner' : `bg-gradient-to-r ${isDark ? 'from-gray-700/50 to-gray-600/30 border-gray-600' : 'from-indigo-50 to-blue-50 border-indigo-200'}`}`}>
                                                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${isMe ? 'bg-white/20' : `bg-gradient-to-r ${isDark ? 'from-indigo-500/30 to-blue-500/30' : 'from-indigo-100 to-blue-100'}`}`}>
                                                                    <FileText size={24} className={isMe ? 'text-white' : isDark ? 'text-indigo-400' : 'text-indigo-600'} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-bold truncate">{msg.content.replace('Shared a file: ', '')}</p>
                                                                    <p className={`text-[10px] uppercase font-black tracking-widest ${isMe ? 'text-white/70' : isDark ? 'text-gray-400' : 'text-indigo-600/70'}`}>{msg.fileType?.split('/')[1] || 'FILE'}</p>
                                                                </div>

                                                                {isPending && (
                                                                    <div className="relative w-8 h-8 flex items-center justify-center">
                                                                        <svg className="w-8 h-8 transform -rotate-90 opacity-70">
                                                                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" className={`${isMe ? 'text-white/30' : 'text-indigo-300'}`} />
                                                                            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="3" fill="transparent" strokeDasharray={88} strokeDashoffset={88 - (88 * (msg.progress || 0)) / 100} className={`${isMe ? 'text-white' : 'text-indigo-500'} transition-all duration-300`} />
                                                                        </svg>
                                                                    </div>
                                                                )}

                                                                {isFailed && (
                                                                    <button
                                                                        onClick={() => handleRetryUpload(msg)}
                                                                        className={`p-2 rounded-lg transition-all flex-shrink-0 ${isMe ? 'bg-rose-500/20 text-rose-200 hover:bg-rose-500/30' : 'bg-rose-100 text-rose-600 hover:bg-rose-200'}`}
                                                                    >
                                                                        <RefreshCcw size={16} />
                                                                    </button>
                                                                )}

                                                                {msg.fileUrl && (
                                                                    <a href={msg.fileUrl} target="_blank" className={`p-2 rounded-lg transition-all flex-shrink-0 ${isMe ? 'hover:bg-white/10 text-white/80 hover:text-white' : `hover:bg-indigo-100 dark:hover:bg-gray-700 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}`}>
                                                                        <Download size={18} />
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {isFailed && (
                                                                <div className={`flex items-center gap-1.5 text-[10px] font-bold px-1 ${isMe ? 'text-rose-200' : 'text-rose-600'}`}>
                                                                    <AlertCircle size={12} />
                                                                    <span>Upload failed. Tap to retry.</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-[15px] leading-relaxed font-normal">{msg.content}</p>
                                                    )}
                                                    <div className={`flex items-center justify-end gap-1.5 mt-2 flex-wrap`}>
                                                        <span className={`text-[10px] font-medium ${isMe ? 'text-indigo-100' : 'text-gray-400'}`}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isMe && !isPending && !isFailed && (
                                                            msg.isSeen
                                                                ? <CheckCircle2 size={12} className="text-white drop-shadow-lg" />
                                                                : <Check size={12} className="text-indigo-200" />
                                                        )}
                                                        {isPending && <Clock size={10} className="text-white/60 animate-pulse" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className={`p-4 md:p-6 border-t backdrop-blur-md ${isDark ? "bg-gray-800/80 border-gray-700" : "bg-white border-gray-100"}`}>
                            <div className="flex items-end gap-3 max-w-5xl mx-auto">
                                <div className="flex gap-2 pb-1 flex-shrink-0">
                                    <label className={`p-3 rounded-2xl border cursor-pointer shadow-sm transition-all hover:text-indigo-600 ${isDark ? "bg-gray-900 border-gray-600 text-gray-400 hover:bg-gray-700" : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"}`}>
                                        <Paperclip size={20} />
                                        <input type="file" className="hidden" onChange={handleFileUpload} />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleScheduleMeeting}
                                        className="sm:hidden p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg"
                                    >
                                        <Calendar size={20} />
                                    </button>
                                </div>
                                <div className="flex-1 relative group">
                                    <textarea
                                        placeholder="Type your message here..."
                                        className={`w-full border rounded-2xl px-5 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none max-h-32 shadow-inner ${isDark ? "bg-gray-900/50 border-gray-600 text-gray-200 placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                                            }`}
                                        rows="1"

                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2.5 bottom-2.5 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!messageInput.trim()}
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 ${isDark ? "bg-gray-900/10" : "bg-gray-50/20"}`}>
                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center border shadow-xl relative ${isDark ? "from-gray-800 to-gray-900 border-gray-700" : "from-white to-gray-100 border-gray-100"
                            } bg-gradient-to-br`}>
                            <Send size={40} className="text-indigo-50" />
                            <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full"></div>
                        </div>
                        <div>
                            <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>Connect and Collaborate</h2>
                            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">

                                Select a conversation from the list or browse your connections to start discussing your next big opportunity.
                            </p>
                            <button
                                onClick={() => setView('connections')}
                                className="mt-6 px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2 mx-auto"
                            >
                                <Users size={18} />
                                <span>Browse Connections</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                @keyframes pulse-green {
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }
                .pulse-green { animation: pulse-green 2s infinite; }
            ` }} />
        </div>
    );
};

export default Communication;
