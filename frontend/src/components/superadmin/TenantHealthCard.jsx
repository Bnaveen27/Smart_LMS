import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const TenantHealthCard = () => {
  const navigate = useNavigate();

  const tenantHealthData = [
    { name: 'Excellent (80-100)', value: 72, pct: '56.3%', color: '#10B981' },
    { name: 'Healthy (60-79)', value: 31, pct: '24.2%', color: '#3B82F6' },
    { name: 'Attention (40-59)', value: 18, pct: '14.1%', color: '#F59E0B' },
    { name: 'Critical (0-39)', value: 7, pct: '5.4%', color: '#EF4444' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 flex flex-col justify-between h-full group">
      
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 leading-tight">Tenant Health</h3>
            <p className="text-[10px] text-slate-400 font-medium">Uptime & engagement scores</p>
          </div>
        </div>
      </div>

      {}
      <div className="relative h-44 my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tenantHealthData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {tenantHealthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-slate-900 tracking-tight">128</span>
          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">TOTAL TENANTS</span>
        </div>
      </div>

      {}
      <div className="space-y-1.5 text-xs">
        {tenantHealthData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-1 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-semibold text-slate-700">{item.name}</span>
            </div>
            <span className="font-extrabold text-slate-900 text-xs">
              {item.value} <span className="text-[10px] text-slate-400 font-normal">({item.pct})</span>
            </span>
          </div>
        ))}
      </div>

      {}
      <button 
        onClick={() => navigate('/superadmin/institutes/all')}
        className="w-full mt-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-extrabold transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 group-hover:bg-indigo-600"
      >
        <span>View All Tenants</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </button>

    </div>
  );
};
