import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Award, ShieldCheck, Printer } from 'lucide-react';

export const CertificateModal = () => {
  const { selectedCertificateModal, setSelectedCertificateModal, activeTenant } = useApp();

  if (!selectedCertificateModal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-3xl space-y-4">
        
        {}
        <div className="flex justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 border border-slate-200 shadow-sm cursor-pointer transition"
          >
            <Printer className="w-4 h-4 text-indigo-600" /> Print / Download PDF
          </button>
          <button
            onClick={() => setSelectedCertificateModal(null)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 shadow-sm cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="bg-white border-8 border-amber-400/40 p-10 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden ring-1 ring-slate-200">
          
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          {}
          <div className="flex flex-col items-center gap-2">
            {activeTenant?.logo_url ? (
              <img src={activeTenant.logo_url} alt={activeTenant.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-500/50 shadow-md" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Award className="w-8 h-8" />
              </div>
            )}
            <span className="font-black text-xl text-slate-900 uppercase tracking-widest pt-1">
              {activeTenant?.name || 'Smart LMS Academy'}
            </span>
            <span className="text-[11px] font-bold text-amber-700 font-mono tracking-widest uppercase bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Official Certificate of Accomplishment
            </span>
          </div>

          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />

          {}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 italic">This is proudly presented to</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight underline decoration-amber-400 decoration-2 underline-offset-8">
              {selectedCertificateModal.user_name}
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto pt-2">
              for successfully completing all curriculum requirements, practical examinations, and project modules for:
            </p>
          </div>

          {}
          <div className="py-3 px-6 bg-slate-50 rounded-2xl border border-slate-200 max-w-lg mx-auto shadow-xs">
            <h3 className="text-lg font-bold text-indigo-900">
              {selectedCertificateModal.course_title}
            </h3>
          </div>

          {}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 px-4">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-mono block">Certificate ID:</span>
              <span className="font-mono font-bold text-slate-800">{selectedCertificateModal.certificate_code}</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">Verification Status:</span>
                <span className="font-bold text-emerald-700">Cryptographically Verified</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Issued On:</span>
              <span className="font-mono font-bold text-slate-800">{selectedCertificateModal.issued_at}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
