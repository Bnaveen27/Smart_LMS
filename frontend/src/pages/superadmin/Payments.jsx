import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CreditCard, DollarSign, Download, Search, Filter, 
  CheckCircle2, ArrowUpRight, Clock, ShieldCheck, FileText
} from 'lucide-react';

export const PaymentsTab = () => {
  const { transactions, tenants } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [gatewayFilter, setGatewayFilter] = useState('ALL');

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.learner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.transaction_ref.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGateway = gatewayFilter === 'ALL' || t.gateway === gatewayFilter;
    return matchesSearch && matchesGateway;
  });

  const totalVolume = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? Number(t.amount || 0) : 0), 0);

  return (
    <div className="space-y-6">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Payments & Invoices</h2>
            <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full">
              ₹{totalVolume.toLocaleString()} Processed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime transaction ledger for paid institute course sales, corporate annual licenses, and automated Stripe/Razorpay payouts.
          </p>
        </div>

        <button 
          onClick={() => alert('Exporting all transaction invoices as CSV...')}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export All Invoices (CSV)
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TOTAL PLATFORM GROSS VOLUME</span>
          <div className="text-2xl font-black text-slate-900 mt-1">₹{totalVolume.toLocaleString()}</div>
          <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> +22.4% vs last month
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">ACTIVE PAYMENT GATEWAYS</span>
          <div className="text-2xl font-black text-slate-900 mt-1">Stripe & Razorpay</div>
          <p className="text-[10px] text-indigo-600 font-bold mt-1">Zero-downtime webhook sync</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">PLATFORM COMMISSION SPLIT</span>
          <div className="text-2xl font-black text-slate-900 mt-1">5.0% Fixed Cut</div>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Direct payout to tenant merchant accounts</p>
        </div>
      </div>

      {}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search learner, transaction ref or course..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">Gateway:</span>
            <select 
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Gateways</option>
              <option value="STRIPE">Stripe</option>
              <option value="RAZORPAY">Razorpay</option>
            </select>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Transaction Ref</th>
                <th className="py-4 px-6">Learner / Buyer</th>
                <th className="py-4 px-6">Course / Item</th>
                <th className="py-4 px-6">Amount (₹)</th>
                <th className="py-4 px-6">Gateway</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-[11px] font-bold text-indigo-600">{t.transaction_ref}</td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{t.learner_name}</td>
                  <td className="py-3.5 px-6 text-slate-600 truncate max-w-[200px]">{t.course_title}</td>
                  <td className="py-3.5 px-6 font-black text-slate-900">₹{t.amount.toFixed(2)}</td>
                  <td className="py-3.5 px-6">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                      t.gateway === 'STRIPE' 
                        ? 'bg-purple-50 text-purple-700 border-purple-200' 
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {t.gateway}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-500">{t.created_at}</td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button 
                      onClick={() => alert(`Downloaded Invoice #${t.transaction_ref}`)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                    >
                      <FileText className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
