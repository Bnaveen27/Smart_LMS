import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, Building, Award } from 'lucide-react';

export const TopRevenueTenantsCard = () => {
  const navigate = useNavigate();

  const topTenants = [
    { rank: 1, name: 'Arul Anandar College', revenue: '₹4,85,230', icon: GraduationCap, type: 'Institute', color: 'text-indigo-600' },
    { rank: 2, name: 'Digital Institute', revenue: '₹3,45,600', icon: GraduationCap, type: 'Institute', color: 'text-blue-600' },
    { rank: 3, name: 'Corporate Training Ltd', revenue: '₹2,15,430', icon: Building2, type: 'Corporate', color: 'text-sky-600' },
    { rank: 4, name: 'XYZ Academy', revenue: '₹1,78,900', icon: Building, type: 'Academy', color: 'text-purple-600' },
    { rank: 5, name: 'Bright Future Academy', revenue: '₹1,25,400', icon: Award, type: 'Institute', color: 'text-amber-600' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900 leading-tight">
          Top Revenue Generating Tenants
        </h3>
        <button 
          onClick={() => navigate('/superadmin/institutes/all')}
          className="text-xs font-bold text-indigo-600 hover:underline shrink-0 ml-2"
        >
          View All
        </button>
      </div>

      {}
      <div className="space-y-2.5 my-3">
        {topTenants.map((t) => {
          const Icon = t.icon;

          return (
            <div 
              key={t.rank}
              onClick={() => navigate('/superadmin/institutes/all')}
              className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] flex items-center justify-center shrink-0 border border-indigo-100">
                  {t.rank}
                </span>
                <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
                  <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{t.name}</h4>
                  <span className="text-[9px] text-slate-400 font-medium block">{t.type}</span>
                </div>
              </div>

              <div className="text-right shrink-0 ml-2">
                <span className="text-xs font-extrabold text-slate-900 block">{t.revenue}</span>
                <span className="text-[9px] text-emerald-600 font-bold">+18.4%</span>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={() => navigate('/superadmin/revenue-reports')}
        className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors"
      >
        View Full Revenue Statements
      </button>

    </div>
  );
};
