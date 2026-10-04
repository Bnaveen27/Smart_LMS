import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, Server, Database, HardDrive, 
  Key, CreditCard, Mail, Cpu, Activity, ArrowUpRight
} from 'lucide-react';

export const SystemHealthCard = () => {
  const navigate = useNavigate();

  const services = [
    { name: 'API Services', icon: Server, status: 'Operational', pct: '99.8%', color: 'bg-emerald-500', barW: 'w-[99.8%]' },
    { name: 'Database (MySQL)', icon: Database, status: 'Operational', pct: '99.8%', color: 'bg-emerald-500', barW: 'w-[99.8%]' },
    { name: 'Storage (S3 / CDN)', icon: HardDrive, status: 'Operational', pct: '98.7%', color: 'bg-emerald-500', barW: 'w-[98.7%]' },
    { name: 'Authentication / SSO', icon: Key, status: 'Operational', pct: '99.9%', color: 'bg-emerald-500', barW: 'w-[99.9%]' },
    { name: 'Payment Gateway', icon: CreditCard, status: 'Operational', pct: '99.5%', color: 'bg-emerald-500', barW: 'w-[99.5%]' },
    { name: 'Email & Webhooks', icon: Mail, status: 'Operational', pct: '99.7%', color: 'bg-emerald-500', barW: 'w-[99.7%]' },
    { name: 'Background Workers', icon: Cpu, status: 'Operational', pct: '98.9%', color: 'bg-emerald-500', barW: 'w-[98.9%]' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200/80 flex flex-col justify-between h-full">
      
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 leading-tight">System Health</h3>
            <p className="text-[10px] text-slate-400 font-medium">Cluster infrastructure SLA</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/superadmin/system')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 hover:underline"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {}
      <div className="space-y-2.5 my-3">
        {services.map((s, idx) => {
          const Icon = s.icon;

          return (
            <div key={idx} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-[130px] truncate">
                <Icon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800 text-[11px] truncate">{s.name}</span>
              </div>

              <div className="flex items-center gap-2 flex-1 justify-end">
                <span className="text-[10px] font-extrabold text-emerald-600 hidden sm:inline">{s.status}</span>
                <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${s.color} ${s.barW} h-full rounded-full`} />
                </div>
                <span className="font-extrabold text-slate-900 text-[11px] w-9 text-right">{s.pct}</span>
              </div>
            </div>
          );
        })}
      </div>

      {}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-500 font-bold block text-[11px]">Overall Uptime</span>
          <span className="text-[10px] text-slate-400">Last 30 days active SLA</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-emerald-600 text-sm">99.99%</span>
          {}
          <div className="flex items-end gap-0.5 h-4">
            <span className="w-1 h-3 bg-emerald-400 rounded-full" />
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            <span className="w-1 h-2.5 bg-emerald-400 rounded-full" />
            <span className="w-1 h-4 bg-emerald-500 rounded-full" />
            <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
            <span className="w-1 h-4 bg-emerald-600 rounded-full" />
          </div>
        </div>
      </div>

    </div>
  );
};
