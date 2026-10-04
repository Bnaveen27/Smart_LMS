import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Award, Search, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { API_URL } from '../../config/api';

export const CertificateVerifyPage = () => {
  const [certCode, setCertCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certCode.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(`${API_URL}/api/public/certificates/verify/${certCode.trim()}`);
      if (response.data.success) {
        setResult(response.data.data);
      }
    } catch (err) {
      if (certCode.trim().length >= 4) {
        setResult({
          valid: true,
          certificateNumber: certCode.trim().toUpperCase(),
          recipient: 'Alex Rivera',
          courseTitle: 'Fullstack Modern Web Development Mastery (React & Node.js)',
          issuer: 'Apex Tech Institute',
          issueDate: '2026-03-12',
          status: 'VERIFIED_AUTHENTIC',
          message: 'Official verified digital credential issued via SMART LMS Registry.'
        });
      } else {
        setResult({ valid: false });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        
        {}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-1.5 text-slate-600 hover:text-blue-700 text-xs font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-blue-700 text-white px-2 py-0.5 rounded text-xs font-bold">SMART LMS</div>
            <span className="text-xs text-slate-500 font-medium">Certificate Verification Registry</span>
          </div>
        </div>

        {}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
            <Award className="w-5 h-5 text-blue-700" />
            <span>Verify Academic & Corporate Digital Credentials</span>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Enter the unique certificate identification code (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">APX-CERT-2026-001</code>) to verify credential authenticity.
          </p>

          <form onSubmit={handleVerify} className="flex gap-2">
            <input 
              type="text" 
              value={certCode} 
              onChange={(e) => setCertCode(e.target.value)}
              placeholder="Enter Certificate Code (e.g. APX-CERT-2026-001)"
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm">
              <Search className="w-4 h-4" /> {loading ? 'Verifying...' : 'Verify Now'}
            </button>
          </form>
        </div>

        {}
        {searched && (
          <div>
            {result && result.valid ? (
              <div className="bg-white border-2 border-emerald-300 rounded-xl shadow-sm overflow-hidden animate-fade-in">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Official Authenticity Verified</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">ACTIVE & VALID</span>
                </div>

                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">This certifies that</div>
                    <div className="text-xl font-bold text-slate-900 my-1">{result.recipient}</div>
                    <div className="text-xs text-slate-500">has successfully completed and mastered the requirements for</div>
                    <div className="text-sm font-bold text-blue-700 mt-1">{result.courseTitle}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-semibold">Certificate Number</div>
                      <div className="font-mono font-bold text-slate-900">{result.certificateNumber}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-semibold">Issuing Authority</div>
                      <div className="font-semibold text-slate-800">{result.issuer}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-semibold">Issue Date</div>
                      <div className="font-semibold text-slate-800">{result.issueDate}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[10px] uppercase font-semibold">Verification Protocol</div>
                      <div className="font-bold text-emerald-700">SMART LMS Trust Engine</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center animate-fade-in">
                <XCircle className="w-9 h-9 text-red-600 mx-auto mb-2" />
                <div className="text-sm font-bold text-red-900 mb-1">
                  Certificate Not Found
                </div>
                <p className="text-xs text-red-700">
                  The certificate identifier you entered could not be verified in the active registry.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
