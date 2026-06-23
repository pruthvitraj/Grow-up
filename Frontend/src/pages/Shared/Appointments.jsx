import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

import {
    Calendar,
    Clock,
    Video,
    Phone,
    MapPin,
    Check,
    X,
    Plus,
    AlertCircle,
    ChevronRight,
    Search,
    User,
    MessageSquare,
    LinkIcon,
    RefreshCw,
    Settings,
    Shield,
    DollarSign,
    Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore, SOCKET_URL } from '../../store/useChatStore';
import toast from 'react-hot-toast';

const Appointments = () => {
    const { token, userId, role, meetingLink: globalLink, updateMeetingLink } = useAuthStore();
    const { connections, fetchConnections, startConversation } = useChatStore();
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const navigate = useNavigate();

    // States
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dealtAppointmentIds, setDealtAppointmentIds] = useState(new Set());
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showGlobalModal, setShowGlobalModal] = useState(false);
    const [showDealModal, setShowDealModal] = useState(false);

    const [newLink, setNewLink] = useState('');
    const [tempGlobalLink, setTempGlobalLink] = useState(globalLink || '');

    // Form States
    const [formData, setFormData] = useState({
        title: '',
        participantId: '',
        date: '',
        time: '',
        duration: 30,
        type: 'Video Call',
        agenda: '',
        meetingLink: ''
    });

    const [dealData, setDealData] = useState({
        startupName: '',
        investmentAmount: '',
        equityPercentage: '',
        message: ''
    });

    useEffect(() => {
        if (token) {
            fetchAppointments();
            fetchConnections(token);
            fetchDealtAppointments();
        }
    }, [token]);

    const fetchAppointments = async () => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/appointments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointments', error);
            setLoading(false);
        }
    };

    const fetchDealtAppointments = async () => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/deals`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const ids = new Set(
                res.data
                    .filter(d => d.appointmentId)
                    .map(d => typeof d.appointmentId === 'object' ? d.appointmentId._id : d.appointmentId)
            );
            setDealtAppointmentIds(ids);
        } catch {
            // silently ignore
        }
    };

    const isExpired = (appt) => {
        const meetingDate = new Date(appt.date);
        const [hours, minutes] = appt.time.split(':');
        meetingDate.setHours(parseInt(hours), parseInt(minutes), 0);
        const expiryTime = new Date(meetingDate.getTime() + (appt.duration || 30) * 60000);
        return new Date() > expiryTime;
    };

    const isLinkOutdated = (appt) => {
        if (!appt.linkSetAt) return false;
        const setAt = new Date(appt.linkSetAt);
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
        return setAt < fiveDaysAgo;
    };

    const handleJoinMeeting = (appt) => {
        if (isExpired(appt)) {
            toast.error('This meeting has already concluded');
            return;
        }

        if (isLinkOutdated(appt)) {
            setSelectedAppt(appt);
            setNewLink(appt.meetingLink || '');
            setShowLinkModal(true);
            return;
        }

        let link = appt.meetingLink;
        if (!link && appt.type === 'Video Call') {
            const mongoId = appt._id.toString();
            const map = { '0': 'g', '1': 'h', '2': 'i', '3': 'j', '4': 'k', '5': 'l', '6': 'm', '7': 'n', '8': 'o', '9': 'p' };
            const chars = mongoId.split('').map(c => map[c] || c).join('');
            link = `https://meet.google.com/${chars.substring(0, 3)}-${chars.substring(3, 7)}-${chars.substring(7, 10)}`;
            toast.success('Using secure meeting room');
        }

        if (link) {
            window.open(link.startsWith('http') ? link : `https://${link}`, '_blank');
        } else {
            setSelectedAppt(appt);
            setNewLink('');
            setShowLinkModal(true);
            toast.error('No meeting link found. Please add one.');
        }
    };

    const handleUpdateLink = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${SOCKET_URL}/api/appointments/${selectedAppt._id}/meeting-link`, {
                meetingLink: newLink
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Meeting link updated!');
            setShowLinkModal(false);
            fetchAppointments();
            if (newLink) {
                window.open(newLink.startsWith('http') ? newLink : `https://${newLink}`, '_blank');
            }
        } catch (error) {
            toast.error('Failed to update link');
        }
    };

    const handleUpdateGlobalLink = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${SOCKET_URL}/api/profile/update-meeting-link`, {
                meetingLink: tempGlobalLink
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Permanent meeting link updated!');
            updateMeetingLink(tempGlobalLink);
            setShowGlobalModal(false);
        } catch (error) {
            toast.error('Failed to update permanent link');
        }
    };

    const handleCreateDeal = async (e) => {
        e.preventDefault();
        try {
            const otherUser = selectedAppt.host._id === userId ? selectedAppt.participant : selectedAppt.host;
            const payload = {
                ...dealData,
                appointmentId: selectedAppt._id
            };
            if (role === 'investor') {
                payload.investorId = userId;
                payload.founderId = otherUser._id;
            } else {
                payload.founderId = userId;
                payload.investorId = otherUser._id;
            }
            await axios.post(`${SOCKET_URL}/api/deals/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Deal proposal sent!');
            setShowDealModal(false);
            setDealtAppointmentIds(prev => new Set([...prev, selectedAppt._id]));
            navigate(`/${role}/deals`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create deal');
        }
    };

    const handleChat = async (appt) => {
        const otherUser = appt.host._id === userId ? appt.participant : appt.host;
        try {
            await startConversation(otherUser._id, token);
            navigate(`/${role}/communication`);
        } catch (error) {
            toast.error('Could not start chat');
        }
    };

    const handleRequestMeeting = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${SOCKET_URL}/api/appointments/request`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Meeting request sent!');
            setShowModal(false);
            fetchAppointments();
        } catch (error) {
            toast.error('Failed to send request');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`${SOCKET_URL}/api/appointments/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Meeting ${status}`);
            fetchAppointments();
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const filteredAppointments = selectedPerson
        ? appointments.filter(a => a.host._id === selectedPerson._id || a.participant._id === selectedPerson._id)
        : appointments;

    const upcomingMeetings = filteredAppointments.filter(a => a.status === 'accepted' && !isExpired(a));
    const pendingRequests = filteredAppointments.filter(a => a.status === 'pending' && a.participant._id === userId);
    const pastMeetings = filteredAppointments.filter(a => a.status === 'completed' || (a.status === 'accepted' && isExpired(a)) || a.status === 'rejected');

    const peopleWithMeetings = appointments.reduce((acc, appt) => {
        const other = appt.host._id === userId ? appt.participant : appt.host;
        if (!acc[other._id]) {
            acc[other._id] = { _id: other._id, name: other.name, role: other.role, image: other.profileImagePath, count: 0, upcoming: 0 };
        }
        acc[other._id].count++;
        if (appt.status === 'accepted' && !isExpired(appt)) acc[other._id].upcoming++;
        return acc;
    }, {});

    const uniquePeople = Object.values(peopleWithMeetings);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Phone Call': return <Phone size={18} />;
            case 'In Person': return <MapPin size={18} />;
            default: return <Video size={18} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Phone Call': return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: 'bg-cyan-500/20' };
            case 'In Person': return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'bg-purple-500/20' };
            default: return { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', icon: 'bg-indigo-500/20' };
        }
    };

    const getStatusColor = (status, isExpired = false) => {
        if (isExpired) return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', label: 'Expired' };
        switch (status) {
            case 'pending': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'Pending', icon: 'Clock' };
            case 'accepted': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', label: 'Confirmed' };
            case 'rejected': return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', label: 'Declined' };
            case 'completed': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'Completed' };
            default: return { bg: 'bg-gray-500/10', border: 'border-gray-500/30', text: 'text-gray-400', label: status };
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen text-white" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>Loading...</div>;

    return (
        <div className="p-4 md:p-8 min-h-screen font-sans" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-[2.5rem] border shadow-sm transition-all bg-blue-900/20 border-blue-400/30">
                    <div className="flex items-center gap-6">
                        {selectedPerson && (
                            <button onClick={() => setSelectedPerson(null)} className="p-3 rounded-2xl border transition-all bg-blue-900/20 border-blue-400/30 text-blue-300 hover:text-blue-100">
                                <ChevronRight className="rotate-180" size={24} />
                            </button>
                        )}
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-white">
                                Your <span className="text-blue-400">Schedule</span>
                            </h1>
                            <p className="text-lg font-medium italic mt-1 text-gray-400">
                                {selectedPerson ? `Meetings with ${selectedPerson.name}` : 'Manage your investment interactions'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowGlobalModal(true)} className="p-4 rounded-2xl border transition-all bg-blue-900/20 border-blue-400/30 text-blue-300 hover:text-blue-100">
                            <Settings size={24} />
                        </button>
                        <button onClick={() => { if (!globalLink) { toast.error('Set permanent link first!'); setShowGlobalModal(true); } else { setShowModal(true); } }}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                            <Plus size={20} />
                            <span>Schedule</span>
                        </button>
                    </div>
                </div>

                {!selectedPerson ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {uniquePeople.length > 0 ? uniquePeople.map(person => (
                            <div key={person._id} onClick={() => setSelectedPerson(person)}
                                className={`p-6 rounded-[2.5rem] border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center text-center ${isDark ? "bg-gray-800/40 border-gray-700" : "bg-white border-gray-100"}`}>
                                <div className="relative mb-6">
                                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-indigo-500 transition-all ${isDark ? "bg-indigo-900/20" : "bg-indigo-50"}`}>
                                        <img src={person.image ? `${SOCKET_URL}${person.image}` : `https://ui-avatars.com/api/?name=${person.name}&background=random&size=128`}
                                            alt={person.name} className="w-full h-full object-cover" />
                                    </div>
                                    {person.upcoming > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center border-4 shadow-lg border-white dark:border-gray-800">{person.upcoming}</span>}
                                </div>
                                <h3 className={`font-black text-xl mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>{person.name}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{person.role}</p>
                                <div className="w-full grid grid-cols-2 gap-2">
                                    <div className={`p-4 rounded-xl border ${isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50 border-gray-100"}`}>
                                        <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Total</p>
                                        <p className={`text-lg font-black ${isDark ? "text-white" : "text-gray-900"}`}>{person.count}</p>
                                    </div>
                                    <div className={`p-4 rounded-xl border ${isDark ? "bg-indigo-500/5 border-indigo-500/20" : "bg-indigo-50 border-indigo-100"}`}>
                                        <p className="text-[10px] text-indigo-400 font-black uppercase mb-1">Upcoming</p>
                                        <p className={`text-lg font-black ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>{person.upcoming}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                    View interactions <ChevronRight size={12} />
                                </div>
                            </div>
                        )) : (
                            <div className={`col-span-full py-32 rounded-[3.5rem] border border-dashed text-center flex flex-col items-center gap-4 transition-colors ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-gray-400 ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
                                    <User size={40} />
                                </div>
                                <div>
                                    <h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>No active interactions</h2>
                                    <p className="text-gray-500 text-sm mt-3 max-w-sm mx-auto">Connect with users to schedule meetings and discuss deals.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-8">
                            {pendingRequests.length > 0 && (
                                <section className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-amber-500/20 to-orange-500/10 dark:from-amber-500/10 dark:to-orange-500/5 flex items-center gap-3">
                                        <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                                            <AlertCircle size={24} />
                                        </div>
                                        <h2 className="text-xl font-bold text-amber-600 dark:text-amber-400">📥 Pending Requests</h2>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {pendingRequests.map(appt => (
                                            <div key={appt._id} className={`p-6 rounded-xl border bg-gradient-to-r transition-all hover:shadow-lg ${isDark ? "from-gray-900/60 to-gray-900/30 border-gray-800 hover:border-amber-500/30" : "from-amber-50/30 to-transparent border-amber-100/50 hover:border-amber-300"}`}>
                                                <h3 className={`font-black text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{appt.title}</h3>
                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-6">
                                                    <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-400" />{new Date(appt.date).toLocaleDateString()}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-purple-400" />{appt.time}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateStatus(appt._id, 'accepted')} className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50">✓ Accept</button>
                                                    <button onClick={() => handleUpdateStatus(appt._id, 'rejected')} className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm hover:shadow-md ${isDark ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20" : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"}`}>✕ Decline</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                            <section className={`rounded-xl border overflow-hidden shadow-sm ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-slate-500/10 to-slate-400/5">
                                    <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>📊 Past Interactions</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {pastMeetings.length > 0 ? pastMeetings.map(appt => {
                                        const statusColor = getStatusColor(appt.status, isExpired(appt));
                                        return (
                                        <div key={appt._id} className={`p-6 rounded-[2rem] border transition-all hover:shadow-lg group ${isDark ? "bg-gray-900/40 border-gray-800 hover:border-blue-500/30" : "bg-gray-50 border-gray-100 hover:bg-white"}`}>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border flex items-center gap-1.5 ${statusColor.bg} ${statusColor.border} ${statusColor.text}`}>
                                                    {statusColor.label === 'Completed' && '✓'} 
                                                    {statusColor.label === 'Pending' && '⏱'} 
                                                    {statusColor.label === 'Confirmed' && '🎯'} 
                                                    {statusColor.label === 'Declined' && '✕'} 
                                                    {statusColor.label === 'Expired' && '⏰'} 
                                                    {statusColor.label}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(appt.date).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className={`font-bold mb-4 line-clamp-1 text-lg ${isDark ? "text-gray-200" : "text-gray-800"}`}>{appt.title}</h4>
                                            {appt.status === 'completed' && role === 'investor' && (
                                                <button disabled={dealtAppointmentIds.has(appt._id)}
                                                    onClick={() => { setSelectedAppt(appt); setDealData({ ...dealData, startupName: selectedPerson.name }); setShowDealModal(true); }}
                                                    className={`w-full py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 border ${dealtAppointmentIds.has(appt._id) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 opacity-60' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30 border-indigo-500/30'}`}>
                                                    {dealtAppointmentIds.has(appt._id) ? <><Check size={14} /> Proposal Sent</> : <><DollarSign size={14} /> Propose Deal</>}
                                                </button>
                                            )}
                                        </div>
                                        );
                                    }) : <p className="text-center py-10 text-gray-400 text-sm italic">No past interactions</p>}
                                </div>
                            </section>
                        </div>

                        <div className="lg:col-span-2">
                            <section className={`rounded-[2.5rem] border overflow-hidden shadow-sm min-h-[600px] ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                                <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-indigo-50/10 dark:bg-indigo-500/5">
                                    <h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Upcoming Schedule</h2>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-wider shadow-lg shadow-indigo-500/20">
                                        <Calendar size={16} /> {upcomingMeetings.length} Meetings
                                    </div>
                                </div>
                                <div className="p-8 space-y-8">
                                    {upcomingMeetings.length > 0 ? upcomingMeetings.map((appt) => {
                                        const typeColor = getTypeColor(appt.type);
                                        return (
                                        <div key={appt._id} className={`p-8 rounded-[2.5rem] border group transition-all duration-300 relative overflow-hidden before:absolute before:inset-0 before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-300 ${isDark ? "bg-gray-900/40 border-gray-700 hover:border-indigo-500/50 before:bg-gradient-to-r before:from-indigo-500/5 before:to-transparent" : "bg-gradient-to-br from-white to-gray-50/50 border-gray-100 hover:shadow-2xl before:from-indigo-500/2"}`}>
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-5 rounded-2xl shadow-inner border ${typeColor.icon} border-opacity-30 text-white`} style={{background: typeColor.icon.replace('/10', '/15')}}>
                                                        {getTypeIcon(appt.type)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${typeColor.bg} ${typeColor.border} ${typeColor.text}`}>{appt.type}</span>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"></span>
                                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-gray-300" : "text-gray-600"}`}>{appt.time} • {appt.duration} Min</span>
                                                        </div>
                                                        <h3 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>{appt.title}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex -space-x-3">
                                                    {[appt.host, appt.participant].map(u => (
                                                        <div key={u._id} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-xl" title={u.name}>
                                                            {u.name.charAt(0)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`p-6 rounded-xl border mb-6 bg-gradient-to-r ${isDark ? "from-gray-800/60 to-gray-800/30 border-gray-700" : "from-white to-gray-50 border-gray-100 shadow-inner"}`}>
                                                <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>📋 Meeting Agenda</h4>
                                                <p className={`text-sm italic leading-relaxed font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>"{appt.agenda || 'High-level strategy and planning session.'}"</p>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                <button onClick={() => handleJoinMeeting(appt)} className={`flex-1 min-w-[160px] py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 hover:shadow-xl ${isLinkOutdated(appt) ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-indigo-500/30'}`}>
                                                    <Video size={18} /> {isLinkOutdated(appt) ? 'Verify & Join' : 'Join Room'}
                                                </button>
                                                <button onClick={() => { setSelectedAppt(appt); setNewLink(appt.meetingLink || ''); setShowLinkModal(true); }}
                                                    className={`flex-1 min-w-[160px] py-4 rounded-2xl font-black text-sm uppercase tracking-wider border transition-all flex items-center justify-center gap-2 hover:shadow-lg ${isDark ? "bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm"}`}>
                                                    <RefreshCw size={18} /> Update Link
                                                </button>
                                                <button onClick={() => handleChat(appt)} className={`px-8 py-4 rounded-2xl font-black text-sm uppercase transition-all flex items-center justify-center border shadow-md hover:shadow-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30 text-cyan-400 hover:from-cyan-500/20 hover:to-blue-500/20`}>
                                                    <MessageSquare size={18} />
                                                </button>
                                                <button onClick={() => handleUpdateStatus(appt._id, 'completed')} className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-2xl transition-all shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 font-black"><Check size={20} /></button>
                                            </div>
                                        </div>
                                        );
                                    }): (
                                        <div className="flex flex-col items-center justify-center py-32 text-center">
                                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${isDark ? "bg-gray-800 text-gray-700" : "bg-gray-100 text-gray-300"}`}><Calendar size={48} /></div>
                                            <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>All Caught Up</h3>
                                            <p className="text-gray-500 text-sm max-w-xs mx-auto italic">No upcoming sessions. Time to connect and grow!</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals are theme-aware by using isDark for background classes */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className={`relative w-full max-w-xl rounded-[2.5rem] shadow-2xl p-10 border overflow-hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                        <div className="flex items-center justify-between mb-8">
                            <div><h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Schedule Request</h2><p className="text-gray-500 text-sm italic">Propose a new meeting interaction</p></div>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-400"}`}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleRequestMeeting} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            <input required type="text" placeholder="Meeting Title" className={`w-full border rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400"}`} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <select required className={`w-full border rounded-2xl px-6 py-4 focus:outline-none appearance-none font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={formData.participantId} onChange={(e) => setFormData({ ...formData, participantId: e.target.value })}>
                                    <option value="">Select Connection</option>
                                    {connections.map(c => <option key={c.userId._id} value={c.userId._id}>{c.userId.name}</option>)}
                                </select>
                                <select className={`w-full border rounded-2xl px-6 py-4 appearance-none font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                    <option>Video Call</option><option>Phone Call</option><option>In Person</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required type="date" className={`w-full border rounded-2xl px-6 py-4 font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                <input required type="time" className={`w-full border rounded-2xl px-6 py-4 font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                            </div>
                            <textarea rows="3" placeholder="Agenda / Notes" className={`w-full border rounded-[2rem] px-6 py-5 focus:outline-none font-bold resize-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400"}`} value={formData.agenda} onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}></textarea>
                            <div className="flex gap-4 pt-4 sticky bottom-0 bg-inherit pb-2">
                                <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-4 font-black uppercase tracking-widest text-sm rounded-2xl transition-all ${isDark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>Cancel</button>
                                <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-500/20 active:scale-95">Send Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showGlobalModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowGlobalModal(false)}></div>
                    <div className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border ${isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-100"}`}>
                        <div className="text-center mb-8">
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 ${isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}><Shield size={40} /></div>
                            <h2 className="text-3xl font-black mb-3">Room Settings</h2>
                            <p className="text-gray-500 text-sm italic leading-relaxed">Ensure a seamless experience by setting your permanent meeting URL.</p>
                        </div>
                        <form onSubmit={handleUpdateGlobalLink} className="space-y-6">
                            <div className="relative">
                                <Video className="absolute left-6 top-5 text-gray-400" size={20} />
                                <input type="url" placeholder="https://meet.google.com/..." className={`w-full border rounded-2xl pl-16 pr-6 py-5 focus:outline-none font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={tempGlobalLink} onChange={(e) => setTempGlobalLink(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95">Save Settings</button>
                            <button type="button" onClick={() => setShowGlobalModal(false)} className="w-full text-gray-500 font-bold text-sm">Dismiss</button>
                        </form>
                    </div>
                </div>
            )}

            {showDealModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" onClick={() => setShowDealModal(false)}></div>
                    <div className={`relative w-full max-w-xl rounded-[3rem] shadow-2xl p-10 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                        <div className="text-center mb-10">
                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 ${isDark ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}><Briefcase size={40} /></div>
                            <h2 className={`text-3xl font-black mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Investment Proposal</h2>
                            <p className="text-gray-500 text-sm font-medium italic">Finalize your terms for {dealData.startupName}</p>
                        </div>
                        <form onSubmit={handleCreateDeal} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Capital Amount ($)</label>
                                    <input required type="number" className={`w-full border rounded-2xl px-6 py-4 font-black ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={dealData.investmentAmount} onChange={(e) => setDealData({ ...dealData, investmentAmount: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Equity Stake (%)</label>
                                    <input required type="number" step="0.1" className={`w-full border rounded-2xl px-6 py-4 font-black ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={dealData.equityPercentage} onChange={(e) => setDealData({ ...dealData, equityPercentage: e.target.value })} />
                                </div>
                            </div>
                            <textarea rows="3" placeholder="Additional remarks or conditions..." className={`w-full border rounded-[2rem] px-6 py-5 font-bold resize-none ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-100 text-gray-800 placeholder-gray-400"}`} value={dealData.message} onChange={(e) => setDealData({ ...dealData, message: e.target.value })}></textarea>
                            <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-500/30 active:scale-95">Shoot Proposal</button>
                        </form>
                    </div>
                </div>
            )}

            {showLinkModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowLinkModal(false)}></div>
                    <div className={`relative w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                        <div className="text-center mb-8">
                            <div className={`w-20 h-20 rounded-xl flex items-center justify-center mx-auto mb-6 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600`}><Video size={40} /></div>
                            <h2 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Update Meeting URL</h2>
                            <p className="text-gray-500 text-sm mt-3">Provide a secure link for this specific session.</p>
                        </div>
                        <form onSubmit={handleUpdateLink} className="space-y-6">
                            <div className="relative">
                                <LinkIcon className="absolute left-6 top-5 text-gray-400" size={20} />
                                <input required type="url" placeholder="https://meet.google.com/..." className={`w-full border rounded-2xl pl-16 pr-6 py-5 font-bold ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-50 border-gray-100 text-gray-800"}`} value={newLink} onChange={(e) => setNewLink(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95">Save & Attend</button>
                            <button type="button" onClick={() => setShowLinkModal(false)} className="w-full text-gray-500 font-bold text-sm">Back</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Appointments;
