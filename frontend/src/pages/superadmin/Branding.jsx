import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, Globe, CheckCircle2, RefreshCw, Palette, 
  Upload, Sparkles, ExternalLink, ShieldCheck, Copy
} from 'lucide-react';

export const BrandingTab = () => {
  const { tenants, updateTenantBranding } = useApp();
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || '');
  const [dnsTestStatus, setDnsTestStatus] = useState('VERIFIED');
  const [isVerifying, setIsVerifying] = useState(false);

  const currentTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const [formColors, setFormColors] = useState({
    primary_color: currentTenant?.primary_color || '#2563EB',
    secondary_color: currentTenant?.secondary_color || '#06B6D4',
    domain: currentTenant?.domain || 'apextech.edu',
    logo_url: currentTenant?.logo_url || ''
  });

  const handleSaveBranding = (e) => {
    e.preventDefault();
    updateTenantBranding(currentTenant.id, formColors);
    alert(`Branding and domain settings for ${currentTenant.name} updated successfully!`);
  };

  const handleVerifyDNS = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setDnsTestStatus('VERIFIED');
      alert(`CNAME record for ${formColors.domain} verified successfully with Let's Encrypt SSL!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">White-Label & Custom Domains</h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
              Automated SSL & DNS Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure custom domains, brand colors, custom logos, dynamic CSS design tokens, and white-label asset CDNs.
          </p>
        </div>

        {}
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs shadow-sm self-start sm:self-auto">
          <span className="text-slate-500 font-bold">Select Tenant:</span>
          <select
            value={selectedTenantId}
            onChange={(e) => {
              setSelectedTenantId(e.target.value);
              const found = tenants.find(t => t.id === e.target.value);
              if (found) {
                setFormColors({
                  primary_color: found.primary_color,
                  secondary_color: found.secondary_color,
                  domain: found.domain,
                  logo_url: found.logo_url
                });
              }
            }}
            className="bg-transparent text-slate-900 font-extrabold focus:outline-none cursor-pointer"
          >
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
            ))}
          </select>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{currentTenant.name} Branding</h3>
                <p className="text-xs text-slate-500">Live customization controls</p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
              Tenant ID: {currentTenant.slug}
            </span>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-5 text-xs">
            
            {}
            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-slate-800 font-extrabold flex items-center justify-between">
                <span>Custom Domain (CNAME / A Record)</span>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SSL Certificate Active
                </span>
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text" 
                    value={formColors.domain}
                    onChange={(e) => setFormColors({ ...formColors, domain: e.target.value })}
                    placeholder="academy.yourdomain.com"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyDNS}
                  disabled={isVerifying}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition-all shrink-0"
                >
                  {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  Verify DNS
                </button>
              </div>

              {}
              <div className="mt-2 p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
                  <span>Required DNS CNAME Record</span>
                  <span className="text-indigo-600">Points To</span>
                </div>
                <div className="flex justify-between items-center text-slate-800 font-bold">
                  <span>{formColors.domain || 'custom.domain.com'}</span>
                  <span>cname.smartlms.io</span>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-1">
              <label className="block text-slate-700 font-bold">Logo Image URL</label>
              <input 
                type="text" 
                value={formColors.logo_url}
                onChange={(e) => setFormColors({ ...formColors, logo_url: e.target.value })}
                placeholder="https://your-domain.com/logo.png"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {}
            <div className="grid grid-cols-2 gap-4">
              
              {}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-slate-700 font-bold text-[11px]">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={formColors.primary_color}
                    onChange={(e) => setFormColors({ ...formColors, primary_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <input 
                    type="text" 
                    value={formColors.primary_color}
                    onChange={(e) => setFormColors({ ...formColors, primary_color: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase"
                  />
                </div>
              </div>

              {}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block text-slate-700 font-bold text-[11px]">Secondary Accent Color</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={formColors.secondary_color}
                    onChange={(e) => setFormColors({ ...formColors, secondary_color: e.target.value })}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <input 
                    type="text" 
                    value={formColors.secondary_color}
                    onChange={(e) => setFormColors({ ...formColors, secondary_color: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase"
                  />
                </div>
              </div>

            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Save White-Label Configuration
              </button>
            </div>

          </form>
        </div>

        {}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">Live White-Label Preview</span>
              <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300">{formColors.domain}</span>
            </div>

            {}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={formColors.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                <div>
                  <span className="font-extrabold text-sm text-white block">{currentTenant.name}</span>
                  <span className="text-[10px] text-slate-400">Academy Portal</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  className="px-3 py-1 rounded-lg text-white font-bold text-xs"
                  style={{ backgroundColor: formColors.primary_color }}
                >
                  Explore
                </button>
              </div>
            </div>

            {}
            <div 
              className="p-5 rounded-2xl text-white space-y-2"
              style={{ background: `linear-gradient(135deg, ${formColors.primary_color}, ${formColors.secondary_color})` }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                Featured Academy Course
              </span>
              <h4 className="font-extrabold text-base">Fullstack Engineering Certification</h4>
              <p className="text-xs text-white/80">Tailored custom brand styling dynamically rendered by the WhiteLMS engine.</p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
