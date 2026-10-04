import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Building2, Plus, Globe } from 'lucide-react';

export const CreateOrgModal = ({ isOpen, onClose }) => {
  const { addTenant } = useApp();
  const [form, setForm] = useState({
    name: '',
    slug: '',
    domain: '',
    logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const newOrg = {
      id: `tenant-corp-${Date.now()}`,
      name: form.name,
      type: 'CORPORATE',
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      logo_url: form.logo_url,
      domain: form.domain || `${form.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.smartlms.com`,
      status: 'ACTIVE',
      created_at: new Date()
    };
    addTenant(newOrg);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">Create Corporate Organization</h3>
              <p className="text-xs text-slate-500">Launch a B2B Enterprise Workforce Training instance</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="space-y-1">
            <label className="block text-slate-700 font-bold">Company / Organization Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Acme Global Enterprises"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-slate-700 font-bold">URL Slug</label>
              <input 
                type="text" 
                placeholder="e.g. acme-global"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-700 font-bold">Enterprise SSO Domain</label>
              <input 
                type="text" 
                placeholder="e.g. learn.acme.com"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-mono font-medium"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold shadow-lg shadow-sky-500/25"
            >
              Create Organization
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
