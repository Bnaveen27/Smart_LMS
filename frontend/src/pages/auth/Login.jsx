import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Building2, Sparkles, Quote, CheckCircle, X, KeyRound } from 'lucide-react';

export const LoginPage = ({ onLoginSuccess }) => {
  const { loginUserByEmail, activeTenant } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState(() => localStorage.getItem('lms_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('lms_remember_me') !== 'false');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotErrorMsg, setForgotErrorMsg] = useState('');

  const navigateByRole = (userRole) => {
    const roleUpper = (userRole || '').toUpperCase();
    if (roleUpper === 'SUPER_ADMIN') {
      navigate('/superadmin');
    } else if (roleUpper === 'INSTITUTE_ADMIN') {
      navigate('/institute');
    } else if (roleUpper === 'INSTRUCTOR') {
      navigate('/instructor');
    } else if (roleUpper === 'TRAINER') {
      navigate('/trainer');
    } else if (roleUpper === 'CORPORATE_ADMIN' || roleUpper === 'MANAGER') {
      navigate('/corporate');
    } else if (roleUpper === 'EMPLOYEE') {
      navigate('/employee');
    } else if (roleUpper === 'LEARNER' || roleUpper === 'STUDENT') {
      navigate('/learner');
    } else {
      navigate('/learner');
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await loginUserByEmail(email, password);
      setIsLoading(false);
      if (res && res.success) {
        if (rememberMe) {
          localStorage.setItem('lms_remembered_email', email);
          localStorage.setItem('lms_remember_me', 'true');
        } else {
          localStorage.removeItem('lms_remembered_email');
          localStorage.setItem('lms_remember_me', 'false');
        }
        if (onLoginSuccess) onLoginSuccess();
        const role = res.user?.role;
        navigateByRole(role);
      } else {
        setErrorMsg(res.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('Login failed. Please verify your credentials.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    setForgotErrorMsg('');

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setForgotSent(true);
      } else {
        setForgotErrorMsg(data.message || 'No account found with this email address.');
      }
    } catch (err) {
      setForgotErrorMsg('Network error: Unable to send password recovery email.');
    } finally {
      setForgotLoading(false);
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
            <p className="text-[11px] text-slate-500 font-medium">
              {isCorporate ? 'Corporate Learning Portal' : 'Academic Learning Portal'}
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 py-8 sm:py-12 flex items-center relative z-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {}
          <div className="space-y-8 pr-0 lg:pr-6">

            <div className="space-y-4">

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Learn. Grow. <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                  Succeed.
                </span>
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg font-normal">
                {isCorporate
                  ? `Access company training programs, department skill paths, and compliance tracking for ${orgName}.`
                  : `Access verified curriculum, interactive lectures, course assignments, and accredited certifications for ${orgName}.`
                }
              </p>
            </div>

            {}
            <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm space-y-3 max-w-md">
              <Quote className="w-7 h-7 text-blue-500/40" />
              <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
              <p className="text-[11px] font-bold text-slate-900">— Nelson Mandela</p>
            </div>

          </div>

          {}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 space-y-6 relative">

              {}
              <div className="flex justify-center -mt-3">
                <div
                  className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg ${isCorporate ? 'bg-sky-600 shadow-sky-500/30' : 'bg-indigo-600 shadow-indigo-500/30'
                    }`}
                >
                  {isCorporate ? <Building2 className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
                </div>
              </div>

              {}
              <div className="text-center space-y-1">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome to {orgName}
                </h3>
                <p className="text-xs text-slate-500 font-small">
                  Sign in with your credentials to access
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {}
              <form onSubmit={handleLogin} className="space-y-4 text-xs">

                {}
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold text-[11px]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                  </div>
                </div>

                {}
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold text-[11px]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <label className="flex items-center gap-2 text-slate-600 font-semibold cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    />
                    <span>Remember Me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email || '');
                      setForgotSent(false);
                      setShowForgotModal(true);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                {}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Authenticating...
                    </span>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" /> Login
                    </>
                  )}
                </button>

              </form>

            </div>
          </div>
        </div>
      </div>

      {}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border border-slate-100 relative space-y-6">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md bg-indigo-600">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Reset Password</h4>
                <p className="text-xs text-slate-500 font-medium">Enter your registered email to get recovery steps</p>
              </div>
            </div>

            {forgotSent ? (
              <div className="space-y-4 py-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Recovery Link Dispatched!</p>
                    <p className="text-emerald-700 mt-1 leading-relaxed">
                      We have sent password reset instructions to <strong>{forgotEmail}</strong>. Please check your inbox or spam folder.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                {forgotErrorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <span className="font-medium">{forgotErrorMsg}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold text-[11px]">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. superadmin@apextech.edu"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition font-medium"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={forgotLoading}
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      'Send Recovery Link'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {}
      <footer className="relative z-10 w-full border-t border-slate-200 bg-white/80 backdrop-blur-md py-4 px-6 sm:px-12 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium text-center sm:text-left">
            <span>© {new Date().getFullYear()} <strong className="font-bold text-slate-900">{orgName}</strong>. All Rights Reserved.</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="hidden sm:inline text-slate-500">Powered by Smart LMS</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">

            <button
              type="button"
              onClick={() => alert(`Support assistance is available for ${orgName}.`)}
              className="hover:text-blue-600 hover:underline transition cursor-pointer"
            >
              Help & Support
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => alert(`Terms of Service & Privacy Policy for ${orgName}`)}
              className="hover:text-blue-600 hover:underline transition cursor-pointer"
            >
              Privacy & Terms
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
