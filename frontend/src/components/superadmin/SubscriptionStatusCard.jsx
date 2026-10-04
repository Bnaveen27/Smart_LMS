import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const SubscriptionStatusCard = () => {
  const navigate = useNavigate();

  const subData = [
    { name: 'Active', value: 96, pct: '73.8%', color: '#10B981' },
    { name: 'Expiring Soon', value: 12, pct: '9.2%', color: '#F59E0B' },
    { name: 'Expired', value: 8, pct: '6.2%', color: '#EF4444' },
    { name: 'Trial', value: 14, pct: '10.8%', color: '#3B82F6' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900">Subscription Status</h3>
        <button 
          onClick={() => navigate('/superadmin/subscriptions')}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          View All
        </button>
      </div>

      {}
      <div className="relative h-32 my-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={subData}
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={52}
              paddingAngle={3}
              dataKey="value"
            >
              {subData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[9px] uppercase font-bold text-slate-400">Total</span>
          <span className="text-xl font-black text-slate-900 leading-none">130</span>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {subData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] font-semibold text-slate-700">{item.name}</span>
            </div>
            <span className="font-bold text-slate-900 text-xs">
              {item.value} <span className="text-[10px] text-slate-400 font-normal">({item.pct})</span>
            </span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/superadmin/plans')}
        className="w-full mt-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
      >
        Configure SaaS Tiers
      </button>

    </div>
  );
};
