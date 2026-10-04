import React from 'react';

export const SuperAdminFooter = () => {
  return (
    <footer className="pt-6 pb-2 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-200/80 mt-8">
      <p>© 2025 SMART LMS. All rights reserved.</p>
      <div className="flex items-center gap-4 text-[11px] font-medium">
        <span>Version 2.5.0</span>
        <span>•</span>
        <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
        <span>•</span>
        <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-indigo-600 transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
};
