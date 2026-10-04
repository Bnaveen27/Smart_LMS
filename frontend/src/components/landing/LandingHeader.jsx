import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, Laptop, Menu, X } from 'lucide-react';

export const LandingHeader = ({
  currentInstitute,
  instituteTenants = [],
  selectedInstituteId,
  setSelectedInstituteId,
  searchQuery,
  setSearchQuery,
  currentUser,
  getDashboardUrl,
  logout
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>

      {/* 2. Crisp Light Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Institute Brand Crest */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => navigate('/')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {currentInstitute?.name}
                </h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                    {currentInstitute?.code || 'INST-2026'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Digital Learning Academy
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, curriculum, professors..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Nav Links & CTAs */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-600 mr-2">
              <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
              <a href="#features" className="hover:text-blue-600 transition-colors">Infrastructure</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(getDashboardUrl())}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>My Portal</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-xs transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate(currentInstitute?.id ? `/enroll/${currentInstitute.id}` : '/enroll')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95"
                >
                  Enroll Now
                </button>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 bg-white border-t border-slate-100 space-y-3 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search curriculum..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a 
                href="#courses"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 text-xs font-medium rounded-xl bg-blue-50 text-blue-700 text-center"
              >
                View Courses
              </a>
              <button 
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="py-2 px-3 text-xs font-medium rounded-xl bg-slate-100 text-slate-700 text-center"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
