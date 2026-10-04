import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Mail, Sun, Moon, LogOut, Sparkles,
  CheckCircle2, Shield, User, ExternalLink, X, ChevronDown, Building2
} from 'lucide-react';

export const SuperAdminHeader = ({ sidebarCollapsed, setSidebarCollapsed, onOpenSearch }) => {
  const { currentUser, role, switchRole, tenants, activeTenant, setActiveTenant, users, logout } = useApp();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const notifications = [];
  const messages = [];

  return (
    <header className="bg-white border-b border-slate-200/90 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm font-['Plus_Jakarta_Sans',sans-serif]">

      {}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="Toggle Sidebar"
        >
          <span className="text-xl leading-none">≡</span>
        </button>

        {}
        <div
          onClick={onOpenSearch}
          className="relative w-72 lg:w-80 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-400 flex items-center justify-between cursor-pointer transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-500">Search anything...</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 shadow-sm">
            Ctrl + K
          </span>
        </div>
      </div>

      {}
      <div className="flex items-center gap-3">

        {}
        {}

        {}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMessages(false);
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center shadow-sm">
              8
            </span>
          </button>

          {}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 text-xs space-y-3 animate-scaleUp">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-extrabold text-slate-900">Notifications (8)</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-2xl border transition-colors ${n.alert ? 'bg-rose-50/70 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-100 text-slate-800'}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[11px]">{n.title}</p>
                      <span className="text-[9px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  navigate('/superadmin/notifications');
                  setShowNotifications(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>

        {}
        <div className="relative">
          <button
            onClick={() => {
              setShowMessages(!showMessages);
              setShowNotifications(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Messages"
          >
            <Mail className="w-4 h-4" />
          </button>

          {}
          {showMessages && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 text-xs space-y-3 animate-scaleUp">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-extrabold text-slate-900">Tenant Messages</span>
                <button onClick={() => setShowMessages(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-2">
                {messages.map(m => (
                  <div key={m.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="flex justify-between font-bold text-[11px] text-slate-900">
                      <span>{m.from}</span>
                      <span className="text-[9px] text-slate-400">{m.time}</span>
                    </div>
                    <p className="text-[10px] text-slate-600 truncate">{m.subject}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt="Super Admin"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-sm"
          />
          <div className="text-left hidden sm:block">
            <span className="text-xs font-extrabold text-slate-900 block leading-tight">
              {currentUser?.name || users.find(u => u.role === 'SUPER_ADMIN')?.name || (activeTenant?.name ? `${activeTenant.name} Super Admin` : 'Super Admin')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentUser?.email || users.find(u => u.role === 'SUPER_ADMIN')?.email || activeTenant?.contact_email || localStorage.getItem('lms_remembered_email') || ''}
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign Out"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

    </header>
  );
};
