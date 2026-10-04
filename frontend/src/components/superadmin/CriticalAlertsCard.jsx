import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, HardDrive, Clock, CreditCard } from 'lucide-react';

export const CriticalAlertsCard = () => {
  const navigate = useNavigate();

  const alerts = [
    {
      title: '3 Failed login attempts detected',
      time: '2 mins ago',
      severity: 'High',
      icon: AlertTriangle,
      color: 'bg-rose-50 border-rose-200 text-rose-700'
    },
    {
      title: 'Storage usage above 80%',
      time: '15 mins ago',
      severity: 'High',
      icon: HardDrive,
      color: 'bg-rose-50 border-rose-200 text-rose-700'
    },
    {
      title: '12 Subscriptions expiring soon',
      time: '30 mins ago',
      severity: 'Medium',
      icon: Clock,
      color: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    {
      title: 'Payment gateway latency high',
      time: '45 mins ago',
      severity: 'High',
      icon: CreditCard,
      color: 'bg-rose-50 border-rose-200 text-rose-700'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-extrabold text-base text-slate-900">Critical Alerts</h3>
        <button 
          onClick={() => navigate('/superadmin/security-center')}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          View All
        </button>
      </div>

      {}
      <div className="space-y-2.5 my-3">
        {alerts.map((al, idx) => {
          const Icon = al.icon;

          return (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2.5 truncate">
                <Icon className="w-4 h-4 text-rose-500 shrink-0" />
                <div className="truncate">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{al.title}</h4>
                  <span className="text-[9px] text-slate-400">{al.time}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border shrink-0 ${al.color}`}>
                {al.severity}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
