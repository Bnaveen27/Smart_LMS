import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const RevenueOverviewCard = () => {
  const navigate = useNavigate();

  const revenueData = [
    { name: 'Subscription Revenue', amount: '₹15,62,430', pct: '62.9%', value: 1562430, color: '#8B5CF6' },
    { name: 'Course Revenue', amount: '₹5,21,800', pct: '21.0%', value: 521800, color: '#3B82F6' },
    { name: 'Corporate Revenue', amount: '₹3,67,000', pct: '14.8%', value: 367000, color: '#06B6D4' },
    { name: 'Refunds', amount: '-₹65,000', pct: '-2.6%', value: 65000, color: '#EC4899' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">REVENUE OVERVIEW</span>
          <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">₹24,85,230</div>
          <p className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5" /> +22.4% vs last month
          </p>
        </div>

        <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded-full self-start">
          This Month ▾
        </span>
      </div>

      {}
      <div className="grid grid-cols-12 gap-3 items-center my-3">
        
        {}
        <div className="col-span-5 h-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={revenueData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={48}
                paddingAngle={3}
                dataKey="value"
              >
                {revenueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {}
        <div className="col-span-7 space-y-1.5 text-xs">
          {revenueData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium truncate">{item.name}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-slate-900 ml-2">{item.amount}</span>
                <span className="text-[10px] text-slate-400 ml-1">({item.pct})</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <button 
        onClick={() => navigate('/superadmin/payments')}
        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
      >
        View Financial Ledger
      </button>

    </div>
  );
};
