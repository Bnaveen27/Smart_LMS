import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building, Building2, UserPlus, DollarSign, 
  Megaphone, Download, Clock, Activity
} from 'lucide-react';

export const QuickActionsCard = ({ onActionClick }) => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create Institute',
      icon: Building,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700',
      action: () => onActionClick ? onActionClick('CREATE_INSTITUTE') : navigate('/superadmin/institutes/create')
    },
    {
      title: 'Create Organization',
      icon: Building2,
      color: 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700',
      action: () => onActionClick ? onActionClick('CREATE_ORG') : navigate('/superadmin/organizations')
    },
    {
      title: 'Create Admin',
      icon: UserPlus,
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700',
      action: () => onActionClick ? onActionClick('CREATE_ADMIN') : navigate('/superadmin/admins')
    },
    {
      title: 'Create Plan',
      icon: DollarSign,
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-700',
      action: () => onActionClick ? onActionClick('CREATE_PLAN') : navigate('/superadmin/plans')
    },
    {
      title: 'Send Announcement',
      icon: Megaphone,
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700',
      action: () => onActionClick ? onActionClick('ANNOUNCEMENT') : navigate('/superadmin/announcements')
    },
    {
      title: 'Generate Report',
      icon: Download,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
      action: () => onActionClick ? onActionClick('REPORT') : navigate('/superadmin/reports')
    },
    {
      title: 'View Audit Logs',
      icon: Clock,
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700',
      action: () => navigate('/superadmin/audit-logs')
    },
    {
      title: 'System Monitoring',
      icon: Activity,
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-700',
      action: () => navigate('/superadmin/system')
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="pb-2 border-b border-slate-100 mb-3">
        <h3 className="font-extrabold text-base text-slate-900">Quick Actions</h3>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {actions.map((act, idx) => {
          const Icon = act.icon;

          return (
            <button
              key={idx}
              onClick={act.action}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center gap-1.5 transition-all transform active:scale-95 group shadow-xs ${act.color}`}
            >
              <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-extrabold leading-tight">{act.title}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
};
