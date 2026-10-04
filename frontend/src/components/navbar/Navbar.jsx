import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, Shield, UserCheck, Sparkles, BookOpen, Layers, LogOut } from 'lucide-react';

export const Navbar = ({ onSignOut }) => {
  const { role, switchRole, currentUser, activeTenant, tenants, setActiveTenant } = useApp();
  const navigate = useNavigate();

  const roleLabels = {
    SUPER_ADMIN: { name: 'Super Admin', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Shield },
    INSTITUTE_ADMIN: { name: 'Institute Admin', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: GraduationCap },
    INSTRUCTOR: { name: 'Instructor', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: BookOpen },
    LEARNER: { name: 'Individual Learner', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: UserCheck },
    CORPORATE_ADMIN: { name: 'Corporate HR / Admin', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30', icon: Building2 },
    EMPLOYEE: { name: 'Corporate Employee', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: Layers }
  };

  const CurrentRoleIcon = roleLabels[role]?.icon || Shield;

  const handleRoleChange = (newRole) => {
    switchRole(newRole);
    if (newRole === 'SUPER_ADMIN') navigate('/superadmin');
    else if (newRole === 'INSTITUTE_ADMIN' || newRole === 'INSTRUCTOR') navigate('/institute');
    else if (newRole === 'CORPORATE_ADMIN') navigate('/corporate');
    else if (newRole === 'LEARNER') navigate('/learner');
    else if (newRole === 'EMPLOYEE') navigate('/employee');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {}
        <div className="flex items-center gap-3">
          {role === 'SUPER_ADMIN' ? (
            <div 
              className="flex items-center gap-2.5 cursor-pointer" 
              onClick={() => navigate('/superadmin')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-300">
                  WhiteLMS<span className="text-cyan-400 text-xs ml-1 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">PRO</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Multi-Tenant Platform Owner</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {activeTenant?.logo_url ? (
                <img 
                  src={activeTenant.logo_url} 
                  alt={activeTenant.name} 
                  className="w-9 h-9 rounded-lg object-cover ring-2 ring-indigo-500/30" 
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  {activeTenant?.name?.[0] || 'L'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white tracking-tight">
                    {activeTenant?.name || 'White-Label Portal'}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${activeTenant?.type === 'CORPORATE' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                    {activeTenant?.type === 'CORPORATE' ? 'Corporate Training' : 'Institute Academy'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {activeTenant?.domain || `${activeTenant?.slug}.lms.com`}
                </p>
              </div>
            </div>
          )}
        </div>

        {}
        {role === 'SUPER_ADMIN' && (
          <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">View Tenant:</span>
            <select
              value={activeTenant?.id || ''}
              onChange={(e) => {
                const found = tenants.find(t => t.id === e.target.value);
                if (found) setActiveTenant(found);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                  {t.name} ({t.type})
                </option>
              ))}
            </select>
          </div>
        )}

        {}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1.5 hidden sm:flex">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> Role View:
            </span>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-slate-950 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700/60 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
            >
              <option value="SUPER_ADMIN">⚡ Super Admin (Platform Owner)</option>
              <option value="INSTITUTE_ADMIN">🎓 Institute Admin (Course Seller)</option>
              <option value="INSTRUCTOR">📚 Instructor (Course Builder)</option>
              <option value="LEARNER">👤 Learner / Student (Paid Buyer)</option>
              <option value="CORPORATE_ADMIN">🏢 Corporate HR / Manager (B2B)</option>
              <option value="EMPLOYEE">💼 Corporate Employee (Trainee)</option>
            </select>
          </div>

          {}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <img 
              src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
              alt={currentUser?.name || 'User'} 
              className="w-8 h-8 rounded-full ring-2 ring-slate-700 object-cover" 
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-200">{currentUser?.name || activeTenant?.name || 'User'}</p>
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded border ${roleLabels[role]?.badge}`}>
                <CurrentRoleIcon className="w-2.5 h-2.5" />
                {roleLabels[role]?.name}
              </span>
            </div>

            {}
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Sign Out to Login Page"
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
