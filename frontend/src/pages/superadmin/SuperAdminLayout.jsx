import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SuperAdminSidebar } from '../../components/superadmin/Sidebar';
import { SuperAdminHeader } from '../../components/superadmin/Header';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SuperAdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex overflow-hidden">
      
      {}
      <SuperAdminSidebar 
        sidebarCollapsed={sidebarCollapsed} 
        setSidebarCollapsed={setSidebarCollapsed} 
      />

      {}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {}
        <SuperAdminHeader 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed} 
          onOpenSearch={() => setShowSearchModal(true)}
        />

        {}
        <main className="p-6 max-w-[1600px] w-full mx-auto flex-1">
          <Outlet />
        </main>

      </div>

      {}
      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="relative">
              <Search className="w-5 h-5 text-indigo-600 absolute left-4 top-3.5" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search institutes, courses, subscriptions, users..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
              />
              <button 
                onClick={() => setShowSearchModal(false)} 
                className="absolute right-4 top-3.5 text-xs text-slate-400 font-mono font-bold bg-slate-100 px-2 py-0.5 rounded-lg"
              >
                ESC
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Quick Navigation</p>
              
              <div 
                onClick={() => { navigate('/superadmin'); setShowSearchModal(false); }}
                className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between font-bold text-slate-700"
              >
                <span>Dashboard Overview</span>
                <span className="text-[10px] text-slate-400 font-mono">/superadmin</span>
              </div>

              <div 
                onClick={() => { navigate('/superadmin/institutes/all'); setShowSearchModal(false); }}
                className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between font-bold text-slate-700"
              >
                <span>All Institutes</span>
                <span className="text-[10px] text-slate-400 font-mono">/institutes/all</span>
              </div>

              <div 
                onClick={() => { navigate('/superadmin/departments'); setShowSearchModal(false); }}
                className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between font-bold text-slate-700"
              >
                <span>Academic Departments & Programs</span>
                <span className="text-[10px] text-slate-400 font-mono">/departments</span>
              </div>

              <div 
                onClick={() => { navigate('/superadmin/users'); setShowSearchModal(false); }}
                className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between font-bold text-slate-700"
              >
                <span>Users Directory</span>
                <span className="text-[10px] text-slate-400 font-mono">/users</span>
              </div>

              <div 
                onClick={() => { navigate('/superadmin/subscriptions'); setShowSearchModal(false); }}
                className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between font-bold text-slate-700"
              >
                <span>Subscriptions & Plans</span>
                <span className="text-[10px] text-slate-400 font-mono">/subscriptions</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
