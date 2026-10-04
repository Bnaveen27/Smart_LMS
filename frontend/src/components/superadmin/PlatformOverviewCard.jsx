import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Users, BookOpen, Layers, IndianRupee, 
  Activity, ArrowUpRight, ChevronDown, Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';

export const PlatformOverviewCard = ({ timeRange, setTimeRange }) => {
  const navigate = useNavigate();

  const waveData = [
    { name: '01 Jun', val: 120000, users: 2400 },
    { name: '02 Jun', val: 165000, users: 3100 },
    { name: '03 Jun', val: 140000, users: 2800 },
    { name: '04 Jun', val: 210000, users: 3900 },
    { name: '05 Jun', val: 245000, users: 4200 },
    { name: '06 Jun', val: 195000, users: 3700 },
    { name: '07 Jun', val: 280000, users: 4800 },
    { name: '08 Jun', val: 320000, users: 5400 }
  ];

  return (
    <div className="bg-gradient-to-br from-[#0B0F19] via-[#0E1528] to-[#11182E] text-white rounded-3xl p-6 shadow-xl border border-slate-800/80 flex flex-col justify-between relative overflow-hidden group">
      
      {}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base tracking-wide text-white flex items-center gap-2">
              Platform Overview
            </h3>
            <p className="text-[11px] text-slate-400">Live multi-tenant telemetry & revenue trajectory</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 p-1 rounded-xl text-xs text-slate-200">
          {['This Month', 'Last Month', 'All Time'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === t 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 my-5 z-10">
        
        {}
        <div 
          onClick={() => navigate('/superadmin/institutes/all')}
          className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 rounded-2xl p-2.5 text-center transition-all cursor-pointer group/item shadow-sm hover:scale-[1.03] hover:border-purple-500/40"
        >
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center mb-1 group-hover/item:scale-110 transition-transform">
            <Building className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-white">128</div>
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Total Tenants</div>
          <div className="text-[9px] text-emerald-400 font-extrabold mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +12.5%
          </div>
        </div>

        {}
        <div 
          onClick={() => navigate('/superadmin/users')}
          className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 rounded-2xl p-2.5 text-center transition-all cursor-pointer group/item shadow-sm hover:scale-[1.03] hover:border-blue-500/40"
        >
          <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-1 group-hover/item:scale-110 transition-transform">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-white">48,291</div>
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Active Users</div>
          <div className="text-[9px] text-emerald-400 font-extrabold mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +18.7%
          </div>
        </div>

        {}
        <div 
          onClick={() => navigate('/superadmin/courses')}
          className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 rounded-2xl p-2.5 text-center transition-all cursor-pointer group/item shadow-sm hover:scale-[1.03] hover:border-emerald-500/40"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-1 group-hover/item:scale-110 transition-transform">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-white">3,842</div>
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Total Courses</div>
          <div className="text-[9px] text-emerald-400 font-extrabold mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +8.9%
          </div>
        </div>

        {}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-2.5 text-center shadow-sm">
          <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center mb-1">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-white">1.28M</div>
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Enrollments</div>
          <div className="text-[9px] text-emerald-400 font-extrabold mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +15.6%
          </div>
        </div>

        {}
        <div 
          onClick={() => navigate('/superadmin/payments')}
          className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 rounded-2xl p-2.5 text-center transition-all cursor-pointer group/item shadow-sm hover:scale-[1.03] hover:border-amber-500/40"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-1 group-hover/item:scale-110 transition-transform">
            <IndianRupee className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-white">₹24.85L</div>
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Revenue</div>
          <div className="text-[9px] text-emerald-400 font-extrabold mt-0.5 flex items-center justify-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +22.4%
          </div>
        </div>

        {}
        <div 
          onClick={() => navigate('/superadmin/system')}
          className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 rounded-2xl p-2.5 text-center transition-all cursor-pointer group/item shadow-sm hover:scale-[1.03] hover:border-cyan-500/40"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-1 group-hover/item:scale-110 transition-transform">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div className="text-base font-black text-white">99.99%</div>
          <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Uptime</div>
          <div className="text-[9px] text-cyan-400 font-extrabold mt-0.5">Pulse OK</div>
        </div>

      </div>

      {}
      <div className="h-36 w-full relative -mb-4 -mx-2">
        
        {}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#171F36]/90 backdrop-blur-md border border-indigo-500/40 px-3 py-1 rounded-xl text-xs font-black text-white shadow-xl flex items-center gap-2 z-10 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span>₹2,45,000</span>
          <span className="text-[10px] text-slate-400 font-normal font-mono">Peak (05 Jun, 2025)</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={waveData} margin={{ top: 15, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="glowingWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.7}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#3730A3', borderRadius: '14px', fontSize: '11px', color: '#fff', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}
              formatter={(val) => [`₹${val.toLocaleString()}`, 'Daily Gross Volume']}
            />
            <Area type="natural" dataKey="val" stroke="#818CF8" strokeWidth={3.5} fillOpacity={1} fill="url(#glowingWave)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
