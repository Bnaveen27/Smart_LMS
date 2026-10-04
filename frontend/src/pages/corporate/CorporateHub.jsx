import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CorporateAdminDashboard } from './admin/CorpAdmin';
import { CorporateHRDashboard } from './hr/CorpHR';
import { TrainerDashboard } from './trainer/CorpTrainer';
import { EmployeePortal } from './employee/CorpEmployee';
import { Building2, Shield, Users, Award, PlayCircle } from 'lucide-react';

export const CorporateDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'hr';

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-6">
      {}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Corporate Suite</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setTab('admin')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'admin'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" /> Super Admin
          </button>

          <button
            onClick={() => setTab('hr')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'hr'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> HR & Compliance
          </button>

          <button
            onClick={() => setTab('trainer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'trainer'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Course Trainers
          </button>

          <button
            onClick={() => setTab('employee')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              currentTab === 'employee'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" /> Employee Portal
          </button>
        </div>
      </div>

      {}
      {currentTab === 'admin' && <CorporateAdminDashboard />}
      {currentTab === 'hr' && <CorporateHRDashboard />}
      {currentTab === 'trainer' && <TrainerDashboard />}
      {currentTab === 'employee' && <EmployeePortal />}
    </div>
  );
};

export default CorporateDashboard;
