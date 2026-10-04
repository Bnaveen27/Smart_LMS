import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  GraduationCap, Plus, Search, Filter, Globe, ExternalLink, 
  Trash2, Edit3, CheckCircle2, AlertCircle, BookOpen, Users, DollarSign, Sparkles
} from 'lucide-react';

export const InstitutesTab = () => {
  const navigate = useNavigate();
  const { tenants, deleteTenant, courses, transactions, setActiveTenant, users, setCurrentUser, setRole, activeTenant, setupType } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const isCorporate = activeTenant?.type === 'CORPORATE' || setupType === 'CORPORATE' || localStorage.getItem('lms_setup_type') === 'CORPORATE';

  const institutes = isCorporate 
    ? (tenants.filter(t => t.type === 'CORPORATE').length > 0 ? tenants.filter(t => t.type === 'CORPORATE') : tenants)
    : (tenants.filter(t => t.type === 'INSTITUTE').length > 0 ? tenants.filter(t => t.type === 'INSTITUTE') : tenants);

  const filteredInstitutes = institutes.filter(inst => {
    const matchesSearch = (inst.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (inst.slug || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inst.domain && inst.domain.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || inst.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isCorporate ? 'Company & Enterprise Profile' : 'Institutes Management'}
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
              {institutes.length} {isCorporate ? 'Organizations' : 'Institutes'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCorporate 
              ? 'Manage enterprise branding, workforce domain settings, branch locations, and corporate credentials.'
              : 'Manage white-labeled academies, online institutes, course sellers, and branded domains.'}
          </p>
        </div>

        <button 
          onClick={() => navigate('/superadmin/institutes/create')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isCorporate ? 'Add Organization' : 'Add New Institute'}
        </button>
      </div>

      {}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search institute name, slug or domain..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-semibold">Status:</span>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
            >
              <option value="ALL">All Institutes</option>
              <option value="ACTIVE">Active Only</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutes.map((inst) => {
          const instCourses = courses.filter(c => c.tenant_id === inst.id);
          const instRevenue = transactions.filter(t => t.tenant_id === inst.id && t.status === 'SUCCESS')
                                          .reduce((acc, curr) => acc + curr.amount, 0);

          return (
            <div 
              key={inst.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />

              <div className="space-y-4 pt-1">
                {}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={inst.logo_url || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80'} 
                      alt={inst.name} 
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm" 
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                        {inst.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {inst.category || 'Academic Institution'}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    inst.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {inst.status || 'ACTIVE'}
                  </span>
                </div>

                {}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Courses</span>
                    <span className="text-xs font-black text-slate-800">{instCourses.length}</span>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Learners</span>
                    <span className="text-xs font-black text-slate-800">{users.filter(u => u.tenant_id === inst.id && u.role === 'LEARNER').length}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Revenue</span>
                    <span className="text-xs font-black text-emerald-600">₹{instRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveTenant(inst);
                    const instAdmin = users.find(u => u.tenant_id === inst.id && u.role === 'INSTITUTE_ADMIN');
                    if (instAdmin) setCurrentUser(instAdmin);
                    setRole('INSTITUTE_ADMIN');
                    navigate('/institute');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Institute Portal
                </button>

                {institutes.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete institute "${inst.name}"?`)) {
                        deleteTenant(inst.id);
                      }
                    }}
                    title="Delete Tenant"
                    className="p-2 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
