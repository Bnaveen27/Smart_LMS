import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  Building2, Plus, Search, Filter, Globe, ExternalLink, 
  Trash2, Users, Shield, Award, CheckCircle2, TrendingUp, Briefcase
} from 'lucide-react';

export const OrganizationsTab = ({ onOpenAddModal }) => {
  const navigate = useNavigate();
  const { tenants, deleteTenant, corporateAssignments, setActiveTenant, users, setCurrentUser, setRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const corporates = tenants.filter(t => t.type === 'CORPORATE');

  const filteredCorporates = corporates.filter(corp => 
    corp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    corp.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (corp.domain && corp.domain.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Corporate Organizations</h2>
            <span className="px-2.5 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold rounded-full">
              {corporates.length} B2B Enterprise Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage enterprise company instances, employee seats, compliance training tracks, and department structures.
          </p>
        </div>

        <button 
          onClick={() => onOpenAddModal('CORPORATE')}
          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-600/25 flex items-center gap-2 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Corporate Enterprise
        </button>
      </div>

      {}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Search corporate name, slug or domain..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Shield className="w-4 h-4 text-emerald-500" /> SOC2 & ISO 27001 Multi-Tenant Tenant Isolation Enabled
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCorporates.map((corp) => {
          const assignments = corporateAssignments.filter(a => a.tenant_id === corp.id);

          return (
            <div 
              key={corp.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-sky-600" />

              <div className="space-y-4 pt-1">
                {}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={corp.logo_url || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'} 
                      alt={corp.name} 
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-sm" 
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                        {corp.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {corp.category || 'Corporate Enterprise'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-sky-50 text-sky-700 border-sky-200">
                    B2B Enterprise
                  </span>
                </div>

                {}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Employees</span>
                    <span className="text-xs font-black text-slate-800">450</span>
                  </div>
                  <div className="text-center border-x border-slate-200">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Compliance</span>
                    <span className="text-xs font-black text-emerald-600">94.2%</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Depts</span>
                    <span className="text-xs font-black text-slate-800">8</span>
                  </div>
                </div>

                {}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">Mandatory Training Track:</span>
                    <span className="font-bold text-slate-900">Active</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full w-[85%]" />
                  </div>
                </div>
              </div>

              {}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveTenant(corp);
                    const corpAdmin = users.find(u => u.tenant_id === corp.id && u.role === 'CORPORATE_ADMIN');
                    if (corpAdmin) setCurrentUser(corpAdmin);
                    setRole('CORPORATE_ADMIN');
                    navigate('/corporate');
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Corporate Portal
                </button>

                {corporates.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete corporate organization "${corp.name}"?`)) {
                        deleteTenant(corp.id);
                      }
                    }}
                    title="Delete Organization"
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
