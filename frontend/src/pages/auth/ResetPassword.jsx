import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeTenant } = useApp();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setErrorMsg('No password reset token provided. Please request a new recovery link from the login page.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setErrorMsg('Missing password reset token. Please request a new link.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.message || 'Failed to reset password. The link might have expired.');
      }
    } catch (err) {
      setErrorMsg('Network error: Unable to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isCorporate = activeTenant?.type === 'CORPORATE';
  const orgName = activeTenant?.name || 'Smart LMS Portal';

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] relative overflow-x-hidden">
      {}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 bg-blue-600" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      {}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeTenant?.logo_url ? (
            <img
              src={activeTenant.logo_url}
              alt={orgName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 shadow-sm"
            />
          ) : (
            <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-md ${isCorporate ? 'bg-sky-600' : 'bg-indigo-600'}`}>
              {isCorporate ? <Building2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
          )}
          <div>
            <h1 className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">{orgName}</h1>
            <p className="text-[11px] text-slate-500 font-medium">Account Security Recovery</p>
          </div>
        </div>

        <Link
          to="/login"
          className="text-xs font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>
      </div>

      {}
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-8 flex items-center justify-center relative z-10">
        <div className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-200/50">
          {isSuccess ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-9 h-9" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Password Reset Complete!</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Your password has been successfully updated. You can now log into your account using your new credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all mt-4"
              >
                Proceed to Sign In
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create New Password</h2>
                <p className="text-xs text-slate-500">
                  Please choose a strong and secure password for your account.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {}
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold text-[11px]">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {}
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold text-[11px]">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating Password...
                    </span>
                  ) : (
                    'Set New Password & Sign In'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white/80 backdrop-blur-md py-4 px-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {orgName}. All Rights Reserved. • Powered by Smart LMS
      </footer>
    </div>
  );
};

export default ResetPasswordPage;
