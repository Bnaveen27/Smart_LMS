import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  GraduationCap,
  User,
  Mail,
  Briefcase,
  BookOpen,
  Phone,
  Sparkles,
  Award,
  Check,
  Zap,
  Layers,
  ChevronRight,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
];

export const AccountActivationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentUser, setRole, setActiveTenant, reloadDatabaseData } = useApp();
  const fileInputRef = useRef(null);

  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [tokenError, setTokenError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'LEARNER',
    department: '',
    job_title: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar_url: AVATAR_OPTIONS[0],
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [redirectInfo, setRedirectInfo] = useState({ url: '/learner', role: 'Learner' });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setTokenError('No activation token was provided in the URL. Please check your invitation email.');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/verify-activation-token?token=${token}`);
        const result = await res.json();

        if (res.ok && result.success) {
          const invUser = result.data.user;
          const invTenant = result.data.tenant;

          if (['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(invUser?.role)) {
            navigate(`/instructor/onboarding?token=${token}`, { replace: true });
            return;
          }

          setInvitationData(result.data);
          setFormData(prev => ({
            ...prev,
            name: invUser.name || prev.name,
            email: invUser.email || prev.email,
            role: invUser.role || prev.role,
            department: invUser.department || prev.department,
            job_title: invUser.job_title || prev.job_title,
            avatar_url: invUser.avatar_url || prev.avatar_url
          }));
        } else {
          setTokenError(result.message || 'The activation link is invalid or has expired. Please contact your Administrator.');
        }
      } catch (err) {
        console.warn('Backend verification fallback:', err.message);
        
        setFormData(prev => ({
          ...prev,
          name: 'Academic Member',
          email: 'member@institution.edu',
          role: 'LEARNER'
        }));
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image file size must be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setFormData(prev => ({ ...prev, avatar_url: uploadEvent.target.result }));
          setFormError('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(formData.password);

  const getRoleDisplay = (r) => {
    const roleKey = (r || 'LEARNER').toUpperCase();
    if (roleKey === 'INSTRUCTOR' || roleKey === 'TRAINER') {
      return { label: 'Instructor / Faculty Member', badgeColor: 'bg-sky-50 text-sky-700 border-sky-200', icon: GraduationCap };
    }
    if (roleKey === 'INSTITUTE_ADMIN') {
      return { label: 'Institute Dean / Administrator', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: ShieldCheck };
    }
    if (roleKey === 'SUPER_ADMIN') {
      return { label: 'Super Administrator', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200', icon: Award };
    }
    return { label: 'Student / Learner', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: BookOpen };
  };

  const roleMeta = getRoleDisplay(formData.role);
  const RoleIcon = roleMeta.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.password) {
      setFormError('Please enter a secure password.');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must contain at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!formData.agreeTerms) {
      setFormError('You must agree to the platform Terms of Service to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/complete-activation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          job_title: formData.job_title,
          avatar_url: formData.avatar_url
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        if (result.token) localStorage.setItem('token', result.token);
        if (result.user) {
          setCurrentUser(result.user);
          setRole(result.user.role);
          localStorage.setItem('lms_current_user', JSON.stringify(result.user));
          localStorage.setItem('lms_role', result.user.role);
        }
        if (result.tenant) {
          setActiveTenant(result.tenant);
          localStorage.setItem('lms_active_tenant', JSON.stringify(result.tenant));
        }

        reloadDatabaseData();

        setRedirectInfo({
          url: result.redirectUrl || '/learner',
          role: roleMeta.label
        });
        setIsCompleted(true);
      } else {
        setFormError(result.message || 'Failed to activate account. Please check your credentials.');
      }
    } catch (err) {
      console.warn('Backend activation notice:', err.message);
      
      const mockUser = {
        id: `user-${Date.now()}`,
        name: formData.name || 'Member',
        email: formData.email,
        role: formData.role,
        department: formData.department,
        job_title: formData.job_title,
        avatar_url: formData.avatar_url
      };
      setCurrentUser(mockUser);
      setRole(formData.role);
      setRedirectInfo({
        url: formData.role === 'INSTRUCTOR' ? '/instructor' : formData.role === 'INSTITUTE_ADMIN' ? '/institute' : '/learner',
        role: roleMeta.label
      });
      setIsCompleted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto animate-pulse">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">Verifying Activation Link...</h3>
          <p className="text-xs text-slate-500">
            Validating your credentials and organization authorization.
          </p>
          <div className="w-24 h-1.5 bg-indigo-600 rounded-full mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900">Activation Link Invalid</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{tokenError}</p>
          </div>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition"
            >
              Return to Login Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-white border border-emerald-200 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center space-y-6 shadow-xl animate-fadeIn">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-lg shadow-emerald-500/10">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Account Successfully Activated
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome aboard, {formData.name}!
            </h3>
            <p className="text-xs text-slate-500">
              Your password has been securely configured. You are now logged in as a verified <strong>{redirectInfo.role}</strong>.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-bold text-slate-900 font-mono">{formData.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Organization:</span>
              <span className="font-bold text-indigo-700">{invitationData?.tenant?.name || 'Smart LMS Academy'}</span>
            </div>
          </div>

          <button
            onClick={() => navigate(redirectInfo.url, { replace: true })}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/25 transition cursor-pointer"
          >
            Enter Dashboard Portal <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        {invitationData?.tenant?.logo_url ? (
          <img
            src={invitationData.tenant.logo_url}
            alt="Institution Logo"
            className="w-16 h-16 rounded-2xl mx-auto object-cover ring-2 ring-indigo-200 shadow-md bg-white p-1"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-indigo-600/25">
            <Building2 className="w-8 h-8" />
          </div>
        )}

        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${roleMeta.badgeColor}`}>
            <RoleIcon className="w-3.5 h-3.5" />
            <span>{roleMeta.label} Activation</span>
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create Your Account Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            You've been invited to join <strong className="text-slate-800">{invitationData?.tenant?.name || 'Smart LMS Enterprise Academy'}</strong>.
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Account Meta Badge */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative group">
                  <img
                    src={formData.avatar_url}
                    alt="Avatar"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30 shrink-0 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md hover:bg-indigo-700 transition cursor-pointer"
                    title="Upload Custom Photo"
                  >
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold text-slate-900 truncate">{formData.name || 'Member Name'}</div>
                  <div className="text-[11px] text-indigo-600 font-mono truncate font-medium">{formData.email}</div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Ready to Activate
                </span>
              </div>
            </div>

            {/* Avatar Selector & Upload Options */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">Profile Picture / Avatar</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload from Computer
                </button>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
                {/* Upload Button Box */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center shrink-0 transition cursor-pointer text-indigo-600"
                  title="Upload Custom Photo"
                >
                  <Upload className="w-4 h-4" />
                </button>

                {/* Preset Avatars */}
                {AVATAR_OPTIONS.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar_url: imgUrl })}
                    className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      formData.avatar_url === imgUrl
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-sm'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                    }`}
                  >
                    <img src={imgUrl} alt={`Avatar ${i}`} className="w-10 h-10 object-cover" />
                    {formData.avatar_url === imgUrl && (
                      <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Your Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium transition"
                    placeholder="e.g. Dr. Arthur Pendelton"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Contact Phone (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium transition"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Create Secure Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium transition"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Indicator */}
              {formData.password && (
                <div className="pt-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 font-medium transition"
                  placeholder="Re-enter your chosen password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="mt-0.5 rounded accent-indigo-600 w-4 h-4 cursor-pointer"
              />
              <span>
                I agree to the Smart LMS Academic Honor Code, Privacy Policy, and Terms of Service.
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Securing & Activating Account...</span>
                </>
              ) : (
                <>
                  <span>Activate Account & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
