import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

import {
    Briefcase,
    DollarSign,
    PieChart,
    Clock,
    CheckCircle2,
    XCircle,
    MessageSquare,
    ChevronRight,
    ArrowUpRight,
    Search,
    Filter,
    TrendingUp,
    Shield,
    FileText,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useChatStore, SOCKET_URL } from '../../store/useChatStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    Upload,
    CreditCard,
    Wallet,
    Landmark,
    X,
    Check
} from 'lucide-react';

const Deals = () => {
    const { token, userId, role } = useAuthStore();
    const { startConversation } = useChatStore();
    const { theme } = useContext(ThemeContext);
    const isDark = theme === "dark";
    const navigate = useNavigate();


    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
    const [selectedPerson, setSelectedPerson] = useState(null);

    // Funding Modal State
    const [showFundingModal, setShowFundingModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [fundingData, setFundingData] = useState({
        transactionId: '',
        paymentMethod: 'Bank Transfer',
        notes: '',
        proofDocument: ''
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (token) {
            fetchDeals();
        }
    }, [token]);

    const fetchDeals = async () => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/deals`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDeals(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching deals', error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (dealId, status) => {
        try {
            await axios.put(`${SOCKET_URL}/api/deals/${dealId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Deal ${status}!`);
            fetchDeals();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update deal status';
            toast.error(msg);
            console.error('Update Status Error:', error);
        }
    };

    const handleChat = async (deal) => {
        const otherUser = role === 'investor' ? deal.founderId : deal.investorId;
        try {
            await startConversation(otherUser._id, token);
            navigate(`/${role}/communication`);
        } catch (error) {
            toast.error('Could not start chat');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);
            const uploadRes = await axios.post(`${SOCKET_URL}/api/upload/file`, uploadData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });

            setFundingData(prev => ({ ...prev, proofDocument: uploadRes.data.url }));
            toast.success('Document uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmitFunding = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...fundingData,
                dealId: selectedDeal._id,
                investorId: selectedDeal.investorId._id,
                founderId: selectedDeal.founderId._id,
                amount: selectedDeal.investmentAmount
            };

            await axios.post(`${SOCKET_URL}/api/funding/create`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update deal status to funding_in_progress if it wasn't already
            if (selectedDeal.status !== 'funding_in_progress') {
                await axios.put(`${SOCKET_URL}/api/deals/${selectedDeal._id}/status`, {
                    status: 'funding_in_progress'
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            toast.success('Funding record submitted!');
            setShowFundingModal(false);
            fetchDeals();
            navigate(`/${role}/funding`);
        } catch (error) {
            console.error('Funding submit error:', error);
            toast.error('Failed to submit funding record');
        }
    };

    const baseFilteredDeals = selectedPerson 
        ? deals.filter(d => d.investorId._id === selectedPerson._id || d.founderId._id === selectedPerson._id)
        : deals;

    const filteredDeals = filter === 'all'
        ? baseFilteredDeals
        : baseFilteredDeals.filter(d => d.status === filter);

    // Grouping for the user list view
    const peopleWithDeals = deals.reduce((acc, deal) => {
        const other = role === 'investor' ? deal.founderId : deal.investorId;
        if (!acc[other._id]) {
            acc[other._id] = {
                _id: other._id,
                name: other.name,
                role: role === 'investor' ? 'Founder' : 'Investor',
                image: other.profileImagePath,
                count: 0,
                pending: 0,
                totalValue: 0
            };
        }
        acc[other._id].count++;
        if (deal.status === 'pending') acc[other._id].pending++;
        acc[other._id].totalValue += deal.investmentAmount;
        return acc;
    }, {});

    const uniquePeople = Object.values(peopleWithDeals);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'funding_completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'accepted': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'funding_in_progress': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default: return 'bg-blue-700 text-blue-400 border-blue-600';
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 min-h-screen font-sans transition-colors duration-300 text-gray-100" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>



            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="p-10 rounded-2xl border transition-all bg-blue-900/20 border-blue-400/30 shadow-2xl">
                


                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {selectedPerson && (
                                <button 
                                    onClick={() => setSelectedPerson(null)}
                                    className="p-3 rounded-2xl transition-all border bg-blue-900/20 border-blue-400/30 text-blue-300 hover:text-blue-200"
                                >
                                    <ChevronRight className="rotate-180" size={32} />
                                </button>
                            )}

                            <div>
                                <h1 className="text-4xl font-black flex items-center gap-3 text-white">
                                    {selectedPerson ? `Deals with ${selectedPerson.name}` : 'Investment Pipeline'}
                                    <Shield className="text-blue-400" size={32} />
                                </h1>
                                <p className="mt-2 max-w-lg italic text-gray-400">
                                    {selectedPerson 
                                        ? `Reviewing all terms and funding status for ${selectedPerson.name}`
                                        : (role === 'investor' 
                                            ? "Track and manage your proposed investments in revolutionary startups." 
                                            : "Review investment proposals and secure funding for your growth.")}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="p-4 rounded-xl border text-center min-w-[120px] bg-blue-900/20 border-blue-400/30">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Deals</p>
                                <p className="text-2xl font-black text-blue-300">{deals.filter(d => !['rejected', 'funding_completed'].includes(d.status)).length}</p>
                            </div>
                            <div className="p-4 rounded-xl border text-center min-w-[120px] bg-emerald-900/20 border-emerald-400/30">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Secured Capital</p>
                                <p className="text-2xl font-black text-emerald-300">
                                    ${deals.filter(d => d.status === 'funding_completed').reduce((sum, d) => sum + d.investmentAmount, 0).toLocaleString()}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {['all', 'pending', 'accepted', 'funding_in_progress', 'funding_completed', 'rejected'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all capitalize border whitespace-nowrap ${filter === s
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95'
                                    : "bg-blue-900/20 border-blue-400/30 text-blue-300 hover:bg-blue-900/30"
                                }`}
                        >

                            {s.replace(/_/g, ' ')}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {!selectedPerson ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {uniquePeople.length > 0 ? (
                            uniquePeople.map(person => (
                                <div 
                                    key={person._id}
                                    onClick={() => setSelectedPerson(person)}
                                    className="p-10 rounded-2xl border transition-all cursor-pointer group text-center flex flex-col items-center bg-blue-900/20 border-blue-400/30 hover:bg-blue-900/30 hover:border-blue-400/50"
                                >


                                    <div className="relative mb-6">
                                        <div className="w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-blue-400 transition-all bg-blue-900/30">
                                            <img 
                                                src={person.image ? `${SOCKET_URL}${person.image}` : `https://ui-avatars.com/api/?name=${person.name}&background=random&size=128`} 
                                                alt={person.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {person.pending > 0 && (
                                            <span className="absolute -top-3 -right-3 bg-amber-500 text-white text-[10px] font-black w-8 h-8 rounded-full flex items-center justify-center border-4 shadow-xl border-blue-950">
                                                {person.pending}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-black text-xl group-hover:text-blue-400 transition-colors uppercase tracking-tight mb-1 text-white">
                                        {person.name}
                                    </h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">{person.role}</p>

                                    <div className="w-full space-y-3">
                                        <div className="p-4 rounded-xl border flex justify-between items-center bg-blue-900/20 border-blue-400/30 shadow-inner">
                                            <span className="text-[10px] text-blue-300 font-black uppercase">Active Deals</span>
                                            <span className="font-black text-white">{person.count}</span>
                                        </div>
                                        <div className="p-4 rounded-xl border flex justify-between items-center bg-emerald-900/20 border-emerald-400/30">
                                            <span className="text-[10px] text-emerald-400 font-black uppercase">Exposure</span>
                                            <span className="font-black text-emerald-300">${person.totalValue.toLocaleString()}</span>
                                        </div>
                                    </div>


                                    <div className="mt-6 flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                                        Open Portfolio <ArrowUpRight size={14} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 rounded-xl border border-dashed text-center transition-colors bg-blue-900/10 border-blue-400/20">
                                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-300 bg-blue-900/30">

                                    <Briefcase size={40} />
                                </div>
                                <h2 className="text-2xl font-black text-white">Empty Portfolio</h2>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto mt-2">Start pitching and negotiating to see your active deals here.</p>
                            </div>
                        )}

                    </div>
                ) : (
                    filteredDeals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDeals.map(deal => (
                            <div key={deal._id} className="rounded-2xl p-8 transition-all flex flex-col justify-between border bg-blue-900/20 border-blue-400/30 shadow-sm">


                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 font-black text-xl border bg-blue-900/30 border-blue-400/30">
                                                {deal.startupName.charAt(0)}
                                            </div>
                                            <div>
                                            <h3 className="font-black text-lg group-hover:text-blue-400 transition-colors truncate max-w-[150px] text-white">
                                                    {deal.startupName}
                                                </h3>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                    {role === 'investor' ? `To: ${deal.founderId.name}` : `From: ${deal.investorId.name}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase border ${getStatusStyle(deal.status)}`}>
                                            {deal.status.replace(/_/g, ' ')}
                                        </span>
                                    </div>


                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 rounded-xl border bg-blue-900/20 border-blue-400/20">
                                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <DollarSign size={10} /> Investment
                                            </p>
                                            <p className="text-xl font-black text-white">${deal.investmentAmount.toLocaleString()}</p>
                                        </div>
                                        <div className="p-4 rounded-xl border bg-blue-900/20 border-blue-400/20">
                                            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <PieChart size={10} /> Equity
                                            </p>
                                            <p className="text-xl font-black text-white">{deal.equityPercentage}%</p>
                                        </div>
                                    </div>


                                    {/* Progress Bar for Funding */}
                                    {(deal.status === 'funding_in_progress' || deal.status === 'funding_completed') && (
                                        <div className="mb-6 space-y-2">
                                            <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <span>Funding Progress</span>
                                                <span>{deal.status === 'funding_completed' ? '100%' : '60%'}</span>
                                            </div>
                                            <div className="h-2 w-full rounded-full overflow-hidden bg-blue-900/30">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${deal.status === 'funding_completed' ? 'bg-emerald-500 w-full' : 'bg-blue-400 w-[60%]'}`}
                                                ></div>
                                            </div>
                                        </div>

                                    )}

                                    <div className="p-4 rounded-xl border mb-6 bg-blue-900/20 border-blue-400/20">
                                        <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 flex items-center gap-1">
                                            <FileText size={10} /> Remarks
                                        </h4>
                                        <p className="text-sm italic text-gray-400">
                                            "{deal.message || 'No additional notes provided.'}"
                                        </p>
                                    </div>

                                </div>

                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleChat(deal)}
                                            className="flex-1 py-3 border rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-blue-900/20 border-blue-400/30 text-blue-300 hover:bg-blue-900/30"
                                        >
                                            <MessageSquare size={14} /> Message
                                        </button>

                                    </div>

                                    {/* Founder Actions */}
                                    {role === 'founder' && deal.status === 'pending' && (
                                        <div className="flex gap-2 animate-in slide-in-from-bottom-2 duration-300">
                                            <button
                                                onClick={() => handleUpdateStatus(deal._id, 'accepted')}
                                                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={14} /> Accept Deal
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(deal._id, 'rejected')}
                                                className="flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border bg-rose-900/20 border-rose-400/30 text-rose-300 hover:bg-rose-900/30"
                                            >
                                                <XCircle size={14} /> Decline
                                            </button>

                                        </div>
                                    )}

                                    {/* Investor Actions */}
                                    {role === 'investor' && deal.status === 'accepted' && (
                                        <button
                                            onClick={() => {
                                                setSelectedDeal(deal);
                                                setShowFundingModal(true);
                                            }}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                        >
                                            <TrendingUp size={14} /> Start Funding Process
                                        </button>
                                    )}

                                    {role === 'investor' && deal.status === 'funding_in_progress' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedDeal(deal);
                                                    setShowFundingModal(true);
                                                }}
                                                className="w-full py-3 border rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-blue-900/20 border-blue-400/30 text-blue-300 hover:bg-blue-900/30"
                                            >
                                                <Upload size={14} /> Add Receipt
                                            </button>
                                        </div>
                                    )}

                                </div>

                                <div className="mt-6 pt-4 border-t flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest border-blue-400/20">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} /> {new Date(deal.createdAt).toLocaleDateString()}
                                    </span>
                                    {deal.appointmentId && (
                                        <span className="text-blue-400">Linked to Meeting</span>
                                    )}
                                </div>

                            </div>
                        ))}
                        </div>
                     ) : (
                        <div className="flex flex-col items-center justify-center py-32 rounded-xl border border-dashed text-center space-y-4 bg-blue-900/10 border-blue-400/20">
                            <div className="w-20 h-20 rounded-full flex items-center justify-center text-blue-300 bg-blue-900/30">
                                <Briefcase size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">No deals found</h2>
                                <p className="text-sm max-w-xs mx-auto mt-2 text-gray-400">
                                    {role === 'investor'
                                        ? "You haven't proposed any deals yet with this founder."
                                        : "You haven't received any deal proposals from this investor yet."}
                                </p>
                            </div>
                        </div>
                    )

                )}
            </div>

            {/* Funding Form Modal */}
            {showFundingModal && selectedDeal && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setShowFundingModal(false)}></div>
                    <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl p-10 border transition-all animate-in zoom-in-95 duration-200 bg-blue-950 border-blue-400/30">

                        <button
                            onClick={() => setShowFundingModal(false)}
                            className="absolute top-8 right-8 text-gray-400 hover:text-blue-300 transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <DollarSign size={32} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Funding Details</h2>
                                <p className="text-gray-400 text-sm">Submit investment record for {selectedDeal.startupName}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitFunding} className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Investment Amount</label>
                                    <div className="w-full border rounded-xl px-6 py-5 font-black flex items-center gap-2 bg-blue-900/30 border-blue-400/20 text-blue-300">
                                        <DollarSign size={16} /> {selectedDeal.investmentAmount.toLocaleString()}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transaction ID</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="TXN12345678"
                                        className="w-full border rounded-xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold bg-blue-900/30 border-blue-400/20 text-white"
                                        value={fundingData.transactionId}
                                        onChange={(e) => setFundingData({ ...fundingData, transactionId: e.target.value })}
                                    />
                                </div>

                            </div>

                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Method</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Bank Transfer', 'Wallet', 'Card'].map(method => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setFundingData({ ...fundingData, paymentMethod: method })}
                                            className={`py-5 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2 ${fundingData.paymentMethod === method
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20'
                                                    : 'bg-blue-900/20 border-blue-400/20 text-blue-300 hover:border-blue-400/50'
                                                }`}
                                        >

                                            {method === 'Bank Transfer' && <Landmark size={16} />}
                                            {method === 'Wallet' && <Wallet size={16} />}
                                            {method === 'Card' && <CreditCard size={16} />}
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes / Remarks</label>
                                <textarea
                                    rows="2"
                                    placeholder="Any additional details about the transfer..."
                                    className="w-full border rounded-xl px-6 py-5 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-bold resize-none bg-blue-900/30 border-blue-400/20 text-white placeholder-blue-400/50"
                                    value={fundingData.notes}
                                    onChange={(e) => setFundingData({ ...fundingData, notes: e.target.value })}
                                ></textarea>
                            </div>


                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Proof of Investment (PDF/Image)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        id="proof-upload"
                                        onChange={handleFileUpload}
                                        accept=".pdf,image/*"
                                    />
                                    <label
                                        htmlFor="proof-upload"
                                        className={`w-full flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${fundingData.proofDocument
                                                ? 'border-emerald-500 bg-emerald-900/20'
                                                : 'border-blue-400/30 bg-blue-900/10 hover:border-blue-400/50'
                                            }`}
                                    >

                                        {uploading ? (
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                                        ) : fundingData.proofDocument ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                                    <Check size={20} />
                                                </div>
                                                <span className="text-emerald-400 font-bold text-sm">Document Ready</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="text-blue-300" />
                                                <span className="text-blue-300 text-sm font-bold">Click to upload proof</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={uploading || !fundingData.transactionId}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:bg-blue-600/50 mt-4"
                            >
                                Submit Funding Record
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Deals;
