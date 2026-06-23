import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

import {
    DollarSign,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    ExternalLink,
    TrendingUp,
    Activity,
    Landmark,
    ShieldCheck,
    ArrowUpRight,
    Users,
    Briefcase,
    Plus,
    X,
    Upload,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { SOCKET_URL } from '../../store/useChatStore';
import toast from 'react-hot-toast';

const Funding = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const { token, role, user } = useAuthStore();

    const [fundings, setFundings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deals, setDeals] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        dealId: '',
        amount: '',
        transactionId: '',
        paymentMethod: 'Bank Transfer',
        notes: '',
        interest: '',
        term: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (token) fetchFundings();
    }, [token]);

    const fetchFundings = async () => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/funding`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFundings(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching fundings', error);
            setLoading(false);
        }
    };

    const fetchDeals = async () => {
        try {
            const res = await axios.get(`${SOCKET_URL}/api/deals`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter deals that are accepted or in progress
            const activeDeals = res.data.filter(d => ['accepted', 'funding_in_progress'].includes(d.status));
            setDeals(activeDeals);
        } catch (error) {
            console.error('Error fetching deals', error);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
        fetchDeals();
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.dealId || !formData.amount || !formData.transactionId) {
            return toast.error("Please fill in all required fields");
        }

        setSubmitting(true);
        try {
            let proofDocumentUrl = '';
            if (selectedFile) {
                const uploadData = new FormData();
                uploadData.append('file', selectedFile);
                const uploadRes = await axios.post(`${SOCKET_URL}/api/upload/file`, uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });
                proofDocumentUrl = uploadRes.data.url;
            }

            const selectedDeal = deals.find(d => d._id === formData.dealId);
            const investorId = typeof selectedDeal.investorId === 'object' ? selectedDeal.investorId._id : selectedDeal.investorId;
            const founderId = typeof selectedDeal.founderId === 'object' ? selectedDeal.founderId._id : selectedDeal.founderId;

            await axios.post(`${SOCKET_URL}/api/funding/create`, {
                ...formData,
                amount: Number(formData.amount),
                investorId,
                founderId,
                proofDocument: proofDocumentUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Funding record created successfully!");
            setIsModalOpen(false);
            fetchFundings();
            setFormData({
                dealId: '',
                amount: '',
                transactionId: '',
                paymentMethod: 'Bank Transfer',
                notes: '',
                interest: '',
                term: ''
            });
            setSelectedFile(null);
        } catch (error) {
            console.error('Error creating funding', error);
            const serverMsg = error.response?.data?.message;
            const validationErrors = error.response?.data?.errors;
            const fullMsg = validationErrors ? `${serverMsg}: ${validationErrors.join(', ')}` : serverMsg;
            toast.error(fullMsg || "Failed to create funding record");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.put(`${SOCKET_URL}/api/funding/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Record marked as ${newStatus}`);
            fetchFundings();
        } catch (error) {
            console.error('Error updating status', error);
            toast.error("Failed to update status");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'verified': return 'text-emerald-400';
            case 'rejected': return 'text-rose-400';
            case 'pending': return 'text-amber-400';
            default: return 'text-blue-400';
        }
    };

    const StatCard = ({ title, value, icon, gradient, isDark }) => (
    <div className={`relative overflow-hidden p-8 rounded-xl transition-all duration-500 hover:-translate-y-2 group ${isDark ? 'bg-gray-900/40 border-slate-800 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-bl-full group-hover:opacity-10 transition-opacity`}></div>
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
                <h3 className="text-5xl font-black tracking-tight">{value}</h3>
            </div>
            <div className={`p-4 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
            <TrendingUp size={12} /> Live Metrics
        </div>
    </div>
);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-white" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
    );


    const totalValue = fundings.reduce((sum, f) => sum + (f.amount || 0), 0);
    const activeInvestments = fundings.filter(f => f.status === 'verified').length;

    return (
        <div className="min-h-screen p-6 md:p-8 font-sans" style={{ background: 'radial-gradient(circle at 20% 20%, #0f2a5a 0%, #081a3a 40%, #050f24 100%)', color: '#ffffff' }}>
            <div className="max-w-[1600px] mx-auto space-y-8">

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-8 bg-blue-600 rounded-sm"></div>
                            <span className="text-blue-400 font-bold uppercase tracking-[0.2em] text-[10px]">Financial Ledger</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight leading-none uppercase">
                            Capital <span className="text-blue-400">Flow</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-md">Comprehensive tracking of verified capital injections and investment history.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            Live Repository
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-[#1E40AF] to-[#1D4ED8] p-8 rounded-xl shadow-xl border border-white/10 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300">
                        <div>
                            <p className="text-blue-200 text-sm font-semibold mb-1 uppercase tracking-wider">Total Bond Value</p>
                            <h3 className="text-4xl font-black">${totalValue.toLocaleString()}</h3>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <DollarSign size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#581C87] to-[#6B21A8] p-8 rounded-xl shadow-xl border border-white/10 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300">
                        <div>
                            <p className="text-purple-200 text-sm font-semibold mb-1 uppercase tracking-wider">Verified Investments</p>
                            <h3 className="text-4xl font-black">{activeInvestments}</h3>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <CheckCircle2 size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#9F1239] to-[#BE123C] p-8 rounded-xl shadow-xl border border-white/10 flex items-center justify-between group hover:scale-[1.02] transition-all duration-300">
                        <div>
                            <p className="text-rose-200 text-sm font-semibold mb-1 uppercase tracking-wider">Total Records</p>
                            <h3 className="text-4xl font-black">{fundings.length}</h3>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                            <Activity size={32} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Investment Details Table Section */}
                <div className={`${isDark ? 'bg-[#0F172A]/40 border-slate-800' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-2xl rounded-xl border overflow-hidden`}>
                    <div className={`p-10 border-b ${isDark ? 'border-slate-800 bg-slate-900/20' : 'bg-gray-50/50 border-gray-100'} flex justify-between items-center`}>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight uppercase flex items-center gap-3">
                                Investment Ledger
                            </h2>
                            <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-widest">Detail view of all capital events</p>
                        </div>
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                             <Briefcase className="text-indigo-500" />
                        </div>
                    </div>


                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`text-[#38BDF8] text-sm font-black border-b ${isDark ? 'border-gray-800 bg-gray-900/20' : 'border-gray-100 bg-gray-50/30'}`}>

                                    <th className="px-8 py-5">Request No.</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Interest</th>
                                    <th className="px-8 py-5">Term</th>
                                    <th className="px-8 py-5">Investor</th>
                                    <th className="px-8 py-5">Date</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-gray-800/50' : 'divide-gray-100'}`}>

                                {fundings.map((f) => (
                                    <tr key={f._id} className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-all duration-200`}>
                                        <td className="px-8 py-6 font-mono font-medium text-blue-400">{f.requestNo}</td>
                                        <td className="px-8 py-6 text-lg font-black">{isDark ? <span className="text-white">${(f.amount || 0).toLocaleString()}</span> : <span className="text-gray-900">${(f.amount || 0).toLocaleString()}</span>}</td>

                                        <td className="px-8 py-6 text-gray-400 font-semibold">{f.interest || 'N/A'}</td>
                                        <td className="px-8 py-6 text-gray-400 font-semibold">{f.term || 'N/A'}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="relative group">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden ring-2 ring-indigo-500/20 transition-all group-hover:ring-indigo-500">
                                                        <img 
                                                            src={f.investorId?.profileImagePath ? `${SOCKET_URL}${f.investorId?.profileImagePath}` : `https://ui-avatars.com/api/?name=${f.investorId?.name || 'Partner'}&background=random`} 
                                                            alt="" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-200">{f.investorId?.name || 'Investor'}</span>
                                                    <span className="text-[10px] text-gray-500 font-mono italic">Verified Investor</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-gray-400 font-medium whitespace-nowrap">
                                            {new Date(f.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`flex items-center gap-2 font-black uppercase text-xs ${getStatusStyle(f.status)}`}>
                                                <span className={`w-2 h-2 rounded-full animate-pulse ${f.status === 'verified' ? 'bg-emerald-400' : f.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                                                {f.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col md:flex-row items-center justify-end gap-2">
                                                {role === 'admin' && f.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(f._id, 'verified')}
                                                            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-all"
                                                        >
                                                            Verify
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(f._id, 'rejected')}
                                                            className="px-3 py-1.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase hover:bg-rose-500 hover:text-white transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {f.proofDocument && (
                                                    <a
                                                        href={f.proofDocument}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] hover:scale-105 active:scale-95 text-white rounded-lg text-sm font-black transition-all shadow-lg shadow-blue-600/20"
                                                    >
                                                        <FileText size={16} /> View Proof
                                                    </a>
                                                )}
                                                {!f.proofDocument && f.status === 'verified' && (
                                                    <span className="text-gray-600 text-[10px] italic">No document attached</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {fundings.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-8 py-20 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-4">
                                                <AlertCircle size={48} className="text-gray-700" />
                                                <p className="text-lg font-semibold">No financing records found</p>
                                                <p className="text-sm">Submit your first investment record using the button below</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Snapshot Footer Card */}
                <div className="bg-gradient-to-r from-[#0369A1] to-[#075985] p-8 rounded-xl flex items-center justify-between shadow-2xl border border-white/10 ring-1 ring-white/5">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center animate-pulse">
                            <TrendingUp className="text-white" size={36} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tight">Financial Growth Engine</h3>
                            <p className="text-blue-100/80 font-medium">Monitoring investment performance in real-time</p>
                        </div>
                    </div>
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-xs font-black text-blue-200 uppercase tracking-widest mb-1">Status</span>
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <span className="text-emerald-400 font-black text-sm uppercase">Active Node</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Investment Floating Button */}
            {role === 'investor' && (
                <div className="fixed bottom-10 right-10 z-40">
                    <button
                        onClick={handleOpenModal}
                        className="flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white rounded-xl font-black text-xl shadow-[0_20px_50px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-2 active:scale-95 group border-2 border-white/20"
                    >
                        <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
                        New Investment
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <div className="bg-[#111827] w-full max-w-2xl rounded-2xl border border-gray-800 shadow-2xl relative animate-in fade-in zoom-in duration-300 my-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-10">
                            <header className="mb-10">
                                <h3 className="text-3xl font-black mb-2">Create Record</h3>
                                <p className="text-gray-400 font-medium">Log a new financial injection for a secured deal</p>
                            </header>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Select Deal <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold"
                                                value={formData.dealId}
                                                onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                                                required
                                            >
                                                <option value="">Choose active deal...</option>
                                                {deals.map(deal => (
                                                    <option key={deal._id} value={deal._id}>
                                                        {deal.startupName} (${deal.investmentAmount.toLocaleString()})
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Investment Amount <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <DollarSign size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Transaction ID <span className="text-rose-500">*</span></label>
                                        <input
                                            type="text"
                                            placeholder="UTR / Ref Number"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold font-mono"
                                            value={formData.transactionId}
                                            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Payment Method</label>
                                        <select
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none font-bold"
                                            value={formData.paymentMethod}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        >
                                            <option>Bank Transfer</option>
                                            <option>Equity Swap</option>
                                            <option>Safe Note</option>
                                            <option>Cheque</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Interest Rate (%)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 4.5%"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold"
                                            value={formData.interest}
                                            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Term / Duration</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. 12 Months"
                                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold"
                                            value={formData.term}
                                            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Notes & Internal Comments</label>
                                    <textarea
                                        rows="3"
                                        placeholder="Any additional details regarding this capital infusion..."
                                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold"
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-wider">Proof of Capital (Attachment)</label>
                                    <div className="relative group/upload">
                                        <input
                                            type="file"
                                            id="proof-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <label
                                            htmlFor="proof-upload"
                                            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer group-hover/upload:scale-[0.99]"
                                        >
                                            {selectedFile ? (
                                                <div className="flex items-center gap-3 text-emerald-400 font-bold">
                                                    <CheckCircle2 size={24} />
                                                    <span>{selectedFile.name}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-gray-500">
                                                    <Upload size={32} />
                                                    <span className="font-bold">Click to upload transfer receipt</span>
                                                    <span className="text-xs uppercase">PDF, PNG, JPG supported</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-black text-xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {submitting ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <ShieldCheck size={28} />
                                            Submit Financing Record
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Funding;

