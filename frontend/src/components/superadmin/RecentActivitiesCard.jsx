import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, UserPlus, Award, BookOpen, CreditCard, HelpCircle } from 'lucide-react';

export const RecentActivitiesCard = () => {
  const navigate = useNavigate();

  const activities = [
    {
      title: 'New institute registered',
      desc: 'Green Valley Institute',
      time: '2 mins ago',
      icon: Building,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'New user registered',
      desc: 'John Doe (Instructor)',
      time: '21 mins ago',
      icon: UserPlus,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Subscription upgraded',
      desc: 'Bright Future Academy',
      time: '8 mins ago',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'New course published',
      desc: 'Data Science Essentials',
      time: '32 mins ago',
      icon: BookOpen,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Payment received',
      desc: '₹1,25,000 from Digital Institute',
      time: '15 mins ago',
      icon: CreditCard,
      color: 'bg-emerald-100 text-emerald-600'
    },
    {
      title: 'Support ticket created',
      desc: 'Issue with certificate download',
      time: '45 mins ago',
      icon: HelpCircle,
      color: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 className="font-extrabold text-base text-slate-900">Recent Activities</h3>
        <button 
          onClick={() => navigate('/superadmin/audit-logs')}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          View All
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
        {activities.map((a, idx) => {
          const Icon = a.icon;

          return (
            <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-slate-900 truncate">{a.title}</h4>
                  <span className="text-[9px] text-slate-400 shrink-0">{a.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{a.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
