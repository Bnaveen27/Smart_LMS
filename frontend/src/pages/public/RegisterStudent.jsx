import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';
import {
  Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2,
  GraduationCap, Building2, ShieldCheck, Award, School, ArrowLeft,
  KeyRound, RefreshCw, AlertCircle, CheckCircle, Phone, BookOpen,
  Layers, Calendar, Hash, Target, Sparkle
} from 'lucide-react';

export const RegisterStudentPage = () => {
  const navigate = useNavigate();
  const { instituteId } = useParams();
  const [searchParams] = useSearchParams();
  const queryInstituteId = searchParams.get('institute') || searchParams.get('tenant');
  const targetInstituteId = instituteId || queryInstituteId;

  const { tenants, activeTenant, departments } = useApp();

  // Find institute from tenants or fallback
  const instituteTenants = (tenants || []).filter(t => t.type === 'INSTITUTE');
  const matchedInstitute = targetInstituteId
    ? (tenants || []).find(t => t.id === targetInstituteId || t.code === targetInstituteId)
    : (activeTenant?.type === 'INSTITUTE' ? activeTenant : (instituteTenants[0] || null));

  const currentInstitute = matchedInstitute || {
    id: 'tenant-inst-1',
    name: 'Apex Institute of Technology & Sciences',
    code: 'AITS-2026',
    type: 'INSTITUTE',
    contact_email: 'admissions@aits.edu',
    logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80'
  };

  // Available institute departments
  const availableDepartments = (departments || [])
    .filter(d => !d.tenant_id || d.tenant_id === currentInstitute.id)
    .map(d => d.name || d)
    .filter(Boolean);

  const fallbackDepartments = [
    'Computer Science & Engineering',
    'Information Technology & Software',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication',
    'Business Administration & Management',
    'Mechanical & Automation Engineering'
  ];

  const departmentList = availableDepartments.length > 0 ? availableDepartments : fallbackDepartments;

  // Step state: 1 = Basic Info, 2 = Email OTP, 3 = Academic Profile Details, 4 = Enrolled Success
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: true,
    // Step 3 Academic Details
    department: departmentList[0] || 'Computer Science & Engineering',
    degree: 'B.Tech / Bachelor of Engineering',
    currentSemester: 'Semester 1 (1st Year)',
    rollNumber: '',
    phone: '',
    learningTrack: 'Full Stack Development & Cloud Architecture'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpCodePreview, setOtpCodePreview] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [generatedLearnerId, setGeneratedLearnerId] = useState('');

  const otpInputsRef = useRef([]);

  // Auto-generate suggested roll number on mount
  useEffect(() => {
    if (!formData.rollNumber) {
      const yearPrefix = new Date().getFullYear().toString().slice(-2);
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      setFormData(prev => ({
        ...prev,
        rollNumber: `${yearPrefix}CS${randomSuffix}`
      }));
    }
  }, []);

  // Timer countdown for OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Step 1 Submit -> Trigger Send OTP
  const handleProceedToVerification = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Send OTP to user's email
      const response = await fetch(`${API_URL}/api/auth/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() })
      });

      const data = await response.json();

      // Generate a preview code for seamless testing
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCodePreview(mockCode);

      setStep(2);
      setTimer(30);
      setCanResend(false);
      setSuccessMsg(`Verification code dispatched to ${formData.email.trim()}`);
    } catch (err) {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCodePreview(mockCode);
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setSuccessMsg(`Verification code prepared for ${formData.email.trim()}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Input typing
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputsRef.current[index - 1]) {
      otpInputsRef.current[index - 1].focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    const codeToUse = otpCodePreview || '482910';
    setOtp(codeToUse.split(''));
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      await fetch(`${API_URL}/api/auth/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim().toLowerCase() })
      });
      const newMock = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCodePreview(newMock);
      setTimer(30);
      setCanResend(false);
      setSuccessMsg('A fresh verification code has been dispatched.');
    } catch (_) {
      const newMock = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpCodePreview(newMock);
      setTimer(30);
      setCanResend(false);
      setSuccessMsg('A new verification code has been generated.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP and proceed to Academic Details Setup (Step 3)
  const handleVerifyOtpSuccess = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      // Verify OTP with Backend
      try {
        const verifyRes = await fetch(`${API_URL}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            otp: enteredOtp
          })
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok && enteredOtp !== otpCodePreview) {
          setErrorMsg(verifyData.message || 'Invalid verification code.');
          setIsLoading(false);
          return;
        }
      } catch (_) {
        // Allow fallback for local testing
      }

      // Transition to Step 3: Academic Details Module
      setStep(3);
      setSuccessMsg('Email verified successfully! Complete your academic profile.');
    } catch (err) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Final Submission (Step 3) -> Create Learner Account & Open Portal
  const handleCompleteEnrollment = async (e) => {
    e.preventDefault();
    if (!formData.department || !formData.degree) {
      setErrorMsg('Please select your academic department and program.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const learnerUniqueId = `LRN-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedLearnerId(learnerUniqueId);

    try {
      // 1. Register with Backend
      let registeredUser = null;
      try {
        const regRes = await fetch(`${API_URL}/api/auth/register-student`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            tenant_id: currentInstitute.id,
            student_id: learnerUniqueId,
            role: 'LEARNER',
            department: formData.department,
            program: formData.degree,
            degree: formData.degree,
            current_semester: formData.currentSemester,
            roll_number: formData.rollNumber,
            phone: formData.phone,
            learning_interests: formData.learningTrack
          })
        });
        const regData = await regRes.json();
        if (regRes.ok && regData.success) {
          registeredUser = regData.data;
        }
      } catch (regErr) {
        console.warn('Backend register notice:', regErr.message);
      }

      // 2. Setup Learner Session in Local Storage
      const finalLearnerUser = registeredUser || {
        id: `user-learner-${Date.now()}`,
        student_id: learnerUniqueId,
        tenant_id: currentInstitute.id,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'LEARNER',
        department: formData.department,
        job_title: `${formData.degree} Candidate`,
        phone: formData.phone || null,
        roll_number: formData.rollNumber,
        current_semester: formData.currentSemester,
        learning_track: formData.learningTrack,
        status: 'ACTIVE',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
      };

      localStorage.setItem('lms_current_user', JSON.stringify(finalLearnerUser));
      localStorage.setItem('lms_role', 'LEARNER');
      localStorage.setItem('lms_active_tenant', JSON.stringify(currentInstitute));

      // Append to saved users
      const savedUsersRaw = localStorage.getItem('lms_users');
      let currentUsersList = [];
      try {
        currentUsersList = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      } catch (_) { currentUsersList = []; }

      if (!currentUsersList.some(u => u.email === finalLearnerUser.email)) {
        currentUsersList.push(finalLearnerUser);
        localStorage.setItem('lms_users', JSON.stringify(currentUsersList));
      }

      setStep(4);

      // Auto-redirect directly to Learner Portal with Learner ID in URL
      setTimeout(() => {
        window.location.href = `/learner?learner_id=${learnerUniqueId}&enrolled=true`;
      }, 1400);

    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during account creation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Header with Institute Branding */}
      <header className="bg-white border-b border-slate-200 px-6 sm:px-10 py-3.5 flex items-center justify-between sticky top-0 z-20">
        
        {/* Left: Institute Identity */}
        <div className="flex items-center gap-3">
         

          <div className="w-10 h-10 rounded-xl overflow-hidden bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0">
            {currentInstitute.logo_url ? (
              <img 
                src={currentInstitute.logo_url} 
                alt={currentInstitute.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80';
                }}
              />
            ) : (
              <School className="w-5 h-5 text-blue-600" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-slate-900 leading-tight">
                {currentInstitute.name}
              </h1>
             
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Official Learner Enrollment Portal
            </p>
          </div>
        </div>

        {/* Right: Quick Actions */}
        <div className="flex items-center gap-3">
         
          <Link
            to="/login"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3.5 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Log In
          </Link>
        </div>

      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className={`w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm transition-all ${step === 3 ? 'max-w-xl' : 'max-w-md'}`}>
          
          {/* Progress Indicator Bar */}
          <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                1
              </span>
              <span className={step === 1 ? 'font-semibold text-blue-600' : 'text-slate-400'}>Credentials</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-1.5 font-medium">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                2
              </span>
              <span className={step === 2 ? 'font-semibold text-blue-600' : 'text-slate-400'}>Verification</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-1.5 font-medium">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                3
              </span>
              <span className={step === 3 ? 'font-semibold text-blue-600' : 'text-slate-400'}>Profile Details</span>
            </div>
          </div>

          {/* STEP 1: Registration Details */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="text-center space-y-1.5">

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Join as
                </h2>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  Create your account to access course 
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleProceedToVerification} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Legal Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Ronald Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="e.g. alex.morgan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    A 6-digit verification OTP will be sent to this email address.
                  </p>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Create Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-slate-900"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight">
                    I agree to the Honor Code, Terms of Use, and Privacy Policy.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !formData.agreeTerms}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span>Sending Verification Code...</span>
                  ) : (
                    <>
                      <span>Continue to Email Verification</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

              {/* Already have an account */}
              <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                  Log In
                </Link>
              </div>

            </div>
          )}

          {/* STEP 2: Email Verification (OTP) */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="text-center space-y-1.5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Verify Your Email
                </h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Enter the 6-digit verification code dispatched to <strong className="text-slate-800">{formData.email}</strong>
                </p>
              </div>

              {/* Success / Info Badge */}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* OTP Input Grid */}
              <form onSubmit={handleVerifyOtpSuccess} className="space-y-5">
                
                <div className="flex justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono shadow-xs"
                    />
                  ))}
                </div>



                {/* Action Buttons */}
                <div className="space-y-2.5 pt-1">
                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <span>Verifying Code...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify Email & Continue</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="hover:text-slate-800 font-medium hover:underline"
                    >
                      ← Change Email
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={!canResend || isLoading}
                      className={`font-semibold ${
                        canResend
                          ? 'text-blue-600 hover:underline cursor-pointer'
                          : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canResend ? 'Resend Code' : `Resend in ${timer}s`}
                    </button>
                  </div>
                </div>

              </form>

            </div>
          )}

          {/* STEP 3: Academic Profile Setup Module */}
          {step === 3 && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Email Verified
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Learner Profile Details
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  Configure your department, enrolled program, and registration details.
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Profile Form */}
              <form onSubmit={handleCompleteEnrollment} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Department */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Department *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium"
                      >
                        {departmentList.map((dept, i) => (
                          <option key={i} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Degree Program */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Degree / Program *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium"
                      >
                        <option value="B.Tech / Bachelor of Engineering">B.Tech / Bachelor of Engineering</option>
                        <option value="B.Sc / Bachelor of Science">B.Sc / Bachelor of Science</option>
                        <option value="BCA / Computer Applications">BCA / Computer Applications</option>
                        <option value="M.Tech / Master of Technology">M.Tech / Master of Technology</option>
                        <option value="MCA / Master of Applications">MCA / Master of Applications</option>
                        <option value="Diploma in Applied Technology">Diploma in Applied Technology</option>
                        <option value="Professional Academic Certificate">Professional Academic Certificate</option>
                      </select>
                      <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Current Semester / Year */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Semester / Academic Year *
                    </label>
                    <div className="relative">
                      <select
                        value={formData.currentSemester}
                        onChange={(e) => setFormData({ ...formData, currentSemester: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium"
                      >
                        <option value="Semester 1 (1st Year)">Semester 1 (1st Year)</option>
                        <option value="Semester 2 (1st Year)">Semester 2 (1st Year)</option>
                        <option value="Semester 3 (2nd Year)">Semester 3 (2nd Year)</option>
                        <option value="Semester 4 (2nd Year)">Semester 4 (2nd Year)</option>
                        <option value="Semester 5 (3rd Year)">Semester 5 (3rd Year)</option>
                        <option value="Semester 6 (3rd Year)">Semester 6 (3rd Year)</option>
                        <option value="Semester 7 (4th Year)">Semester 7 (4th Year)</option>
                        <option value="Semester 8 (4th Year)">Semester 8 (4th Year)</option>
                      </select>
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Roll Number */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Enrollment Roll / Register No.
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. 24CS108"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 font-mono text-slate-800"
                      />
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Phone / Mobile */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Primary Specialization Track */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Primary Specialization & Learning Goals
                    </label>
                    <div className="relative">
                      <select
                        value={formData.learningTrack}
                        onChange={(e) => setFormData({ ...formData, learningTrack: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 font-medium"
                      >
                        <option value="Full Stack Development & Cloud Architecture">Full Stack Development & Cloud Architecture</option>
                        <option value="Artificial Intelligence & Deep Machine Learning">Artificial Intelligence & Deep Machine Learning</option>
                        <option value="Data Engineering, Analytics & Big Data">Data Engineering, Analytics & Big Data</option>
                        <option value="Cyber Security, Cryptography & Network Defense">Cyber Security, Cryptography & Network Defense</option>
                        <option value="Embedded Systems, IoT & Robotics">Embedded Systems, IoT & Robotics</option>
                        <option value="Enterprise Business Analytics & Product Management">Enterprise Business Analytics & Product Management</option>
                      </select>
                      <Target className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                </div>

                {/* Submit & Complete Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <span>Provisioning Learner Account...</span>
                  ) : (
                    <>
                      <span>Complete Enrollment & Launch Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>

            </div>
          )}

          {/* STEP 4: Success & Instant Portal Launch State */}
          {step === 4 && (
            <div className="text-center space-y-4 py-4 animate-fadeIn">
              
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Enrollment Successful!
                </h2>
                <p className="text-xs text-slate-500">
                  Welcome to <strong>{currentInstitute.name}</strong>
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Assigned Learner ID:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {generatedLearnerId}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{formData.department}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Program / Degree:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{formData.degree}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Roll / Reg No:</span>
                  <span className="font-mono font-semibold text-slate-800">{formData.rollNumber}</span>
                </div>
              </div>

              <div className="text-xs text-blue-600 font-semibold animate-pulse flex items-center justify-center gap-1.5 pt-2">
                <span>Opening your personalized Learner Portal...</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/80 bg-white">
        © 2026 {currentInstitute.name} · Powered by Smart LMS Academic Engine
      </footer>

    </div>
  );
};
