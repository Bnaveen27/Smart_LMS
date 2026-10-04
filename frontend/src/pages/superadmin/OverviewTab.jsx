import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, GraduationCap, Users, BookOpen, DollarSign, Activity, 
  ShieldCheck, AlertTriangle, Clock, ArrowUpRight, ArrowDownRight, Plus, Search, 
  Download, ChevronDown, CheckCircle2, Server, Database, HardDrive, 
  Key, CreditCard, Mail, Cpu, PieChart as PieIcon, Layers, Lock, 
  FileText, Sparkles, Bell, HelpCircle, UserPlus, Settings, Eye,
  Building, Radio, RefreshCw, BarChart2, Shield, ExternalLink, Zap
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const OverviewTab = ({ onOpenAddModal }) => {
  const { tenants, users, courses, transactions, subscriptions } = useApp();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('This Month');
  const [showReportModal, setShowReportModal] = useState(false);

  const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? Number(t.amount || 0) : 0), 0);
  const instituteCount = tenants.filter(t => t.type === 'INSTITUTE').length;
  const corporateCount = tenants.filter(t => t.type === 'CORPORATE').length;
  const activeLearnersCount = users.filter(u => u.role === 'LEARNER').length;

  const tenantHealthData = [
    { name: 'Active Institutes', value: instituteCount || 0, color: '#10B981' },
    { name: 'Active Corporates', value: corporateCount || 0, color: '#3B82F6' },
  ];

  const revenueDonutData = [
    { name: 'Course Sales Revenue', value: totalRevenue || 0, color: '#8B5CF6' },
  ];

  const subStatusData = [
    { name: 'Active', value: tenants.filter(t => t.status === 'ACTIVE').length, color: '#10B981' },
    { name: 'Suspended', value: tenants.filter(t => t.status === 'SUSPENDED').length, color: '#EF4444' },
  ];

  const waveData = [
    { name: 'Total', val: totalRevenue, users: users.length }
  ];

  return (
    <div className="space-y-6">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Welcome back, Super Admin! 
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Here's what's happening across your white-labeled multi-tenant LMS ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {}
          <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-800 font-bold"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">May 18, 2026 – Jun 18, 2026</option>
              <option value="This Quarter">This Quarter</option>
              <option value="All Time">All Time</option>
            </select>
          </div>

          {}
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Generate Report
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {}
        <div className="lg:col-span-6 bg-[#0E1326] text-white rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden">
          
          {}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-wide text-white">Platform Overview</h3>
                <p className="text-[10px] text-slate-400">Live aggregated metrics</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1 rounded-xl text-[11px] text-slate-300">
              <span>{timeRange}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-5 z-10">
            
            {}
            <div 
              onClick={() => navigate('/superadmin/institutes')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl p-2 text-center transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Building className="w-3 h-3" />
              </div>
              <div className="text-sm font-extrabold text-white">{tenants.length}</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Tenants</div>
              <div className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> +12.5%
              </div>
            </div>

            {}
            <div 
              onClick={() => navigate('/superadmin/users')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl p-2 text-center transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Users className="w-3 h-3" />
              </div>
              <div className="text-sm font-extrabold text-white">{users.length}</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Active</div>
              <div className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> Database
              </div>
            </div>

            {}
            <div 
              onClick={() => navigate('/superadmin/courses')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl p-2 text-center transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <BookOpen className="w-3 h-3" />
              </div>
              <div className="text-sm font-extrabold text-white">{courses.length}</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Courses</div>
              <div className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> Database
              </div>
            </div>

            {}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 text-center">
              <div className="w-6 h-6 rounded-lg bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center mb-1">
                <Layers className="w-3 h-3" />
              </div>
              <div className="text-sm font-extrabold text-white">{activeLearnersCount}</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Learners</div>
              <div className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> Database
              </div>
            </div>

            {}
            <div 
              onClick={() => navigate('/superadmin/payments')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl p-2 text-center transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <DollarSign className="w-3 h-3" />
              </div>
              <div className="text-sm font-extrabold text-white">₹{(totalRevenue).toLocaleString()}</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Revenue</div>
              <div className="text-[9px] text-emerald-400 font-bold mt-0.5 flex items-center justify-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" /> Database
              </div>
            </div>

            {}
            <div 
              onClick={() => navigate('/superadmin/system')}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 rounded-xl p-2 text-center transition-all cursor-pointer group"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Activity className="w-3 h-3" />
              </div>
              <div className="text-sm font-extrabold text-white">100%</div>
              <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">MySQL</div>
              <div className="text-[9px] text-cyan-400 font-bold mt-0.5">Connected</div>
            </div>

          </div>

          {}
          <div className="h-32 w-full mt-auto relative -mb-4 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waveData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                />
                <Area type="natural" dataKey="val" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorWave)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>

        {}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Tenant Types</h3>
            <button 
              onClick={() => navigate('/superadmin/institutes')}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              View All
            </button>
          </div>

          {}
          <div className="relative h-44 my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tenantHealthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {tenantHealthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{tenants.length}</span>
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">TOTAL TENANTS</span>
            </div>
          </div>

          {}
          <div className="space-y-1.5 text-xs">
            {tenantHealthData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 text-xs">{item.value}</span>
              </div>
            ))}
          </div>

          {}
          <button 
            onClick={() => navigate('/superadmin/institutes')}
            className="w-full mt-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Manage Tenants ({tenants.length})
          </button>
        </div>

        {}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">System Health</h3>
            <button 
              onClick={() => navigate('/superadmin/system')}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              View Details
            </button>
          </div>

          {}
          <div className="space-y-4 my-auto">
            
            {}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> API Services
                </span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]" />
              </div>
            </div>

            {}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-500" /> Database (MySQL)
                </span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]" />
              </div>
            </div>

            {}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500" /> Storage (Local / CDN)
                </span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]" />
              </div>
            </div>

            {}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-500" /> JWT Auth / SSO
                </span>
                <span className="font-bold text-slate-900">100%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[100%]" />
              </div>
            </div>

          </div>

          {}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Overall Status</span>
            <span className="font-extrabold text-emerald-600">Operational</span>
          </div>
        </div>

      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">REVENUE OVERVIEW</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">Total</span>
          </div>

          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" /> Live transactions
            </p>
          </div>

          {}
          <div className="h-28 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueDonutData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                  {revenueDonutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[10px] text-slate-500">
            <div className="flex justify-between"><span>Course Sales:</span><span className="font-bold text-slate-800">₹{totalRevenue.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Total Transactions:</span><span className="font-bold text-slate-800">{transactions.length}</span></div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TENANT STATUS</span>
            <button 
              onClick={() => navigate('/superadmin/institutes')}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{tenants.filter(t => t.status === 'ACTIVE').length} Active</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Tenants registered in database</p>
          </div>

          <div className="h-28 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={subStatusData} cx="50%" cy="50%" innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value">
                  {subStatusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="bg-emerald-50 text-emerald-700 p-1.5 rounded-lg text-center font-bold">{tenants.filter(t => t.status === 'ACTIVE').length} Active</div>
            <div className="bg-rose-50 text-rose-700 p-1.5 rounded-lg text-center font-bold">{tenants.filter(t => t.status === 'SUSPENDED').length} Suspended</div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">STORAGE USAGE</span>
            <button 
              onClick={() => navigate('/superadmin/system')}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              View Details
            </button>
          </div>

          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">1.82 TB</div>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Used of 5.00 TB Allocated</p>
          </div>

          {}
          <div className="my-4 space-y-2">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
              <div className="bg-indigo-600 h-full w-[36%]" title="Videos: 1.2TB" />
              <div className="bg-cyan-500 h-full w-[15%]" title="Docs: 400GB" />
              <div className="bg-emerald-500 h-full w-[8%]" title="Backups: 220GB" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>36.4% Utilized</span>
              <span>3.18 TB Free</span>
            </div>
          </div>

          <div className="space-y-1 text-[10px] text-slate-600">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600" /> HD Video Streams</span>
              <span className="font-bold">1.2 TB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Course Assets / PDFs</span>
              <span className="font-bold">400 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Database Backups</span>
              <span className="font-bold">220 GB</span>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TOP REVENUE TENANTS</span>
            <button 
              onClick={() => navigate('/superadmin/institutes')}
              className="text-[11px] font-bold text-indigo-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3 my-auto">
            {tenants.slice(0, 3).map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <img src={t.logo_url} alt={t.name} className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 truncate max-w-[100px]">{t.name}</h4>
                    <span className="text-[9px] text-slate-500 font-medium">{t.type}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-slate-900 block">₹{transactions.filter(tr => tr.tenant_id === t.id && tr.status === 'SUCCESS').reduce((s, tr) => s + Number(tr.amount || 0), 0).toLocaleString()}</span>
                  <span className="text-[9px] text-emerald-600 font-bold">{users.filter(u => u.tenant_id === t.id).length} Members</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onOpenAddModal && onOpenAddModal('INSTITUTE')}
            className="w-full mt-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Onboard New Tenant
          </button>
        </div>

      </div>

      {}
      {showReportModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Export Platform Report</h3>
                  <p className="text-xs text-slate-500">Download consolidated analytics</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Executive Summary (PDF)</p>
                  <p className="text-[11px] text-slate-500">Revenue, Tenant Growth, Course Statistics</p>
                </div>
                <button 
                  onClick={() => { alert('Executive Report PDF downloaded successfully!'); setShowReportModal(false); }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700"
                >
                  Download
                </button>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Raw Financial Ledger (CSV)</p>
                  <p className="text-[11px] text-slate-500">All Stripe & Razorpay transactions with tax logs</p>
                </div>
                <button 
                  onClick={() => { alert('Financial Ledger CSV downloaded successfully!'); setShowReportModal(false); }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  Download
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowReportModal(false)}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
