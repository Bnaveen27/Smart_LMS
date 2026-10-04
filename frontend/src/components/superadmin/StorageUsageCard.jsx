import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StorageUsageCard = () => {
  const navigate = useNavigate();

  const storageCategories = [
    { name: 'Videos', size: '850 GB', pct: '35.7%', color: '#8B5CF6' },
    { name: 'Documents', size: '420 GB', pct: '23.1%', color: '#3B82F6' },
    { name: 'SCORM', size: '210 GB', pct: '11.5%', color: '#06B6D4' },
    { name: 'Images', size: '320 GB', pct: '17.6%', color: '#EC4899' },
    { name: 'Other', size: '220 GB', pct: '12.1%', color: '#94A3B8' }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
      
      {}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-base text-slate-900">Storage Usage</h3>
        <button 
          onClick={() => navigate('/superadmin/storage')}
          className="text-xs font-bold text-indigo-600 hover:underline"
        >
          View Details
        </button>
      </div>

      {}
      <div className="flex items-center justify-center my-3">
        <div className="relative w-28 h-28 rounded-full border-[8px] border-slate-100 border-t-indigo-600 border-r-indigo-500 border-b-cyan-500 flex flex-col items-center justify-center shadow-inner">
          <span className="text-sm font-black text-slate-900 leading-tight">1.82 TB</span>
          <span className="text-[9px] text-slate-400 font-bold">Used</span>
          <span className="text-[9px] text-slate-500 font-mono">of 2.5 TB</span>
        </div>
      </div>

      {}
      <div className="text-center -mt-1 mb-2">
        <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-xs">
          72.8% Used
        </span>
      </div>

      {}
      <div className="space-y-1 text-xs">
        {storageCategories.map((c, idx) => (
          <div key={idx} className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-slate-600 font-medium">{c.name}</span>
            </div>
            <span className="font-bold text-slate-900">
              {c.size} <span className="text-[10px] text-slate-400 font-normal">({c.pct})</span>
            </span>
          </div>
        ))}
      </div>

    </div>
  );
};
