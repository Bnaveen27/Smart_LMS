import React from 'react';
import { 
  Users, CheckCircle2, Award, Video, Headphones, ArrowUpRight
} from 'lucide-react';

export const BottomMetricsBar = () => {
  const metrics = [
    {
      title: 'Daily Active Users',
      value: '12,842',
      change: '+16.5%',
      icon: Users,
      iconBg: 'bg-purple-100 text-purple-600',
      sparkColor: '#8B5CF6'
    },
    {
      title: 'Courses Completed',
      value: '2,980',
      change: '+12.3%',
      icon: CheckCircle2,
      iconBg: 'bg-indigo-100 text-indigo-600',
      sparkColor: '#6366F1'
    },
    {
      title: 'Certificates Issued',
      value: '12,482',
      change: '+18.6%',
      icon: Award,
      iconBg: 'bg-amber-100 text-amber-600',
      sparkColor: '#F59E0B'
    },
    {
      title: 'Live Classes Conducted',
      value: '432',
      change: '+9.4%',
      icon: Video,
      iconBg: 'bg-emerald-100 text-emerald-600',
      sparkColor: '#10B981'
    },
    {
      title: 'Support Tickets',
      value: '48',
      change: '+8.2%',
      icon: Headphones,
      iconBg: 'bg-pink-100 text-pink-600',
      sparkColor: '#EC4899'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((m, idx) => {
        const Icon = m.icon;

        return (
          <div key={idx} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl ${m.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block leading-tight">{m.title}</span>
                <div className="text-base font-black text-slate-900 leading-tight mt-0.5">{m.value}</div>
                <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-0.5 mt-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" /> {m.change}
                </span>
              </div>
            </div>

            {}
            <div className="w-14 h-7 shrink-0 flex items-center">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 50 20">
                <path
                  d="M0 15 Q 12 5, 25 12 T 50 4"
                  fill="none"
                  stroke={m.sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};
