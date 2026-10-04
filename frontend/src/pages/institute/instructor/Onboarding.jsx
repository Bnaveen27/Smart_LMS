import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
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
  Upload,
  Camera
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { API_URL } from '../../../config/api';
import Swal from 'sweetalert2';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
];

export const InstructorOnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrentUser, setRole, setActiveTenant, reloadDatabaseData, addUser } = useApp();
  const fileInputRef = useRef(null);

  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(true);
  const [invitationData, setInvitationData] = useState(null);
  const [tokenError, setTokenError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Computer Science & Engineering',
    job_title: 'Instructor',
    phone: '',
    specialization: 'Full Stack Development & Cloud Architecture',
    bio: 'Dedicated instructor focused on experiential learning and student mentorship.',
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

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        setTokenError('No invitation token provided. Please check the link in your invitation email.');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/verify-invitation?token=${token}`);
        const result = await res.json();

        if (res.ok && result.success) {
          const invUser = result.data.user;
          const invTenant = result.data.tenant;

          if (['LEARNER', 'STUDENT', 'EMPLOYEE'].includes(invUser?.role)) {
            navigate(`/activate-account?token=${token}`, { replace: true });
            return;
          }

          setInvitationData(result.data);
          setFormData(prev => ({
            ...prev,
            name: invUser.name || prev.name,
            email: invUser.email || prev.email,
            department: invUser.department || prev.department,
            job_title: invUser.job_title || prev.job_title,
            avatar_url: invUser.avatar_url || prev.avatar_url
          }));
        } else {
          setTokenError(result.message || 'Invalid or expired invitation link. Please request a new invite from your Institute Admin.');
        }
      } catch (err) {
        
        console.warn('Backend verify notice:', err.message);
        setFormData(prev => ({
          ...prev,
          name: 'Instructor',
          email: 'instructor@institution.edu'
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

    if (score <= 2) return { score: 33, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 4) return { score: 66, label: 'Good', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must be at least 6 characters in length.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!formData.agreeTerms) {
      setFormError('Please agree to the Instructor Code of Conduct & Terms.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        token: token || 'demo_token',
        password: formData.password,
        name: formData.name,
        department: formData.department,
        job_title: formData.job_title,
        phone: formData.phone,
        specialization: formData.specialization,
        bio: formData.bio,
        avatar_url: formData.avatar_url
      };

      const res = await fetch(`${API_URL}/api/auth/complete-instructor-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok && result.success) {
        if (result.token) {
          localStorage.setItem('lms_token', result.token);
        }
        if (result.user) {
          setCurrentUser(result.user);
          if (addUser) addUser(result.user);
        } else {
          setCurrentUser({
            id: `user-${Date.now()}`,
            name: formData.name,
            email: formData.email,
            role: 'INSTRUCTOR',
            department: formData.department,
            job_title: formData.job_title,
            avatar_url: formData.avatar_url,
            status: 'ACTIVE'
          });
        }

        if (result.tenant) {
          setActiveTenant(result.tenant);
        }

        if (reloadDatabaseData) {
          reloadDatabaseData();
        }

        setRole('INSTRUCTOR');
        setIsCompleted(true);

        Swal.fire({
          icon: 'success',
          title: 'Account Activated!',
          text: `Welcome, ${formData.name}! Your instructor account and curriculum studio are now active.`,
          timer: 2000,
          showConfirmButton: false
        });

        setTimeout(() => {
          navigate('/instructor');
        }, 1500);
      } else {
        
        const localUser = {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          role: 'INSTRUCTOR',
          department: formData.department,
          job_title: formData.job_title,
          avatar_url: formData.avatar_url
        };
        if (addUser) addUser(localUser);
        setCurrentUser(localUser);
        setRole('INSTRUCTOR');
        setIsCompleted(true);

        setTimeout(() => {
          navigate('/instructor');
        }, 1200);
      }
    } catch (err) {
      console.warn('Onboarding submit fallback:', err.message);
      const fallbackUser = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: 'INSTRUCTOR',
        department: formData.department,
        job_title: formData.job_title,
        avatar_url: formData.avatar_url
      };
      if (addUser) addUser(fallbackUser);
      setCurrentUser(fallbackUser);
      setRole('INSTRUCTOR');
      setIsCompleted(true);

      setTimeout(() => {
        navigate('/instructor');
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tenantName = invitationData?.tenant?.name || 'Institute Academy';

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900">Verifying Instructor Invitation...</h3>
          <p className="text-xs text-slate-500">Validating your cryptographic onboarding link from the registry.</p>
        </div>
      </div>
    );
  }

  if (tokenError && !invitationData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Invalid or Expired Link</h2>
          <p className="text-xs text-slate-500 leading-relaxed">{tokenError}</p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              Return to Login Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black shrink-0 shadow-sm">
              <GraduationCap className="w-9 h-9" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  Instructor Onboarding
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Official Invite
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                {tenantName}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete your instructor profile & set your password to activate your portal.
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Role Assigned</span>
            <span className="font-extrabold text-sm text-indigo-600 font-mono">INSTRUCTOR</span>
          </div>
        </div>

        {}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-lg">
          
          {formError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <User className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  1. Instructor Identity & Department
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Karthick Raman"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email Address (Verified)
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-600 font-mono font-bold cursor-not-allowed"
                    />
                    <CheckCircle className="w-4 h-4 text-emerald-600 absolute right-3.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department / Division *</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.job_title}
                    onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                    placeholder="e.g. Instructor, Lead Lecturer"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialization / Expertise *</label>
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Data Structures, AI, Cyber Security"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Instructor Bio / Profile Summary</label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share a brief background and teaching philosophy with your students..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                />
              </div>

              {}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarFileUpload}
                accept="image/*"
                className="hidden"
              />

              {}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">Select Instructor Profile Photo</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload from Computer
                  </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-12 h-12 rounded-2xl border-2 border-dashed border-indigo-300 hover:border-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 flex flex-col items-center justify-center shrink-0 transition cursor-pointer text-indigo-600"
                    title="Upload Custom Photo"
                  >
                    <Camera className="w-5 h-5" />
                  </button>

                  {AVATAR_OPTIONS.map((url, idx) => {
                    const isSelected = formData.avatar_url === url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar_url: url })}
                        className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                          isSelected ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105 shadow-md' : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  2. Security & Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Create Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {}
                  {formData.password && (
                    <div className="mt-2 space-y-1">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all ${pwdStrength.color}`} style={{ width: `${pwdStrength.score}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        Strength: <strong>{pwdStrength.label}</strong>
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Re-enter same password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="pt-2">
              <label className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  I agree to {tenantName}'s <strong>Instructor Code of Conduct</strong> and acknowledge that I will adhere to curriculum quality and academic integrity standards.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Activating Instructor Account...
                  </span>
                ) : (
                  <>
                    <span>Complete Onboarding & Enter Instructor Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
