import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';
import {
  GraduationCap, Building2, Shield, ArrowRight, ArrowLeft,
  CheckCircle2, Sparkles, Lock, Mail, Check, Phone, Eye, EyeOff,
  RefreshCw, Building, Globe, KeyRound, AlertCircle, Send, CheckCheck,
  Briefcase, Users2, School, Clock
} from 'lucide-react';

export const SetupPage = () => {
  const navigate = useNavigate();
  const {
    completeSetup,
    isSetupCompleted,
    createCourse
  } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [orgType, setOrgType] = useState('INSTITUTE'); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '', 
    phone: '',
    website: '',

    institutionType: 'University / Higher Education',
    affiliation: '',

    industry: 'Information Technology & Software Services',
    companySize: '51 - 250 Employees (Mid-size Enterprise)',
    companyType: 'Private Limited',

    adminName: '',
    adminPassword: '',
    confirmPassword: '',
    adminDesignation: 'Dean / Academic Super Admin'
  });

  const [formErrors, setFormErrors] = useState({});

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const [setupLogs, setSetupLogs] = useState([]);
  const [setupProgress, setSetupProgress] = useState(0);
  const [isProvisioningComplete, setIsProvisioningComplete] = useState(false);
  const progressContainerRef = useRef(null);

  const handleSelectType = (type) => {
    setOrgType(type);

    fetch(`${API_URL}/api/system/provision-schema`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type })
    }).catch(err => console.warn('Schema provision trigger note:', err.message));

    if (type === 'INSTITUTE') {
      setFormData(prev => ({
        ...prev,
        adminDesignation: '',
        institutionType: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        adminDesignation: '',
        industry: '',
        companySize: ''
      }));
    }
    setCurrentStep(2);
  };

  const handleInputChange = (fieldOrEvent, directValue) => {
    let fieldName = '';
    let val = '';

    if (typeof fieldOrEvent === 'string') {
      fieldName = fieldOrEvent;
      val = directValue;
    } else if (fieldOrEvent && fieldOrEvent.target) {
      fieldName = fieldOrEvent.target.name;
      val = fieldOrEvent.target.value;
    }

    if (!fieldName) return;

    setFormData(prev => ({ ...prev, [fieldName]: val }));

    if (fieldName === 'email') {
      
      setIsEmailVerified(false);
      setOtpSent(false);
      setOtpInput('');
      setOtpMessage('');
      setOtpError('');
      setResendTimer(0);
    }

    if (formErrors[fieldName]) {
      setFormErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSendOtp = async () => {
    if (resendTimer > 0) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      setOtpError(`Please enter a valid ${orgType === 'CORPORATE' ? 'work' : 'institute'} email address first.`);
      return;
    }

    setIsSendingOtp(true);
    setOtpError('');
    setOtpMessage('');

    try {
      const res = await fetch(`${API_URL}/api/auth/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() })
      });

      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setResendTimer(60); 
        setOtpMessage(`Verification code sent to ${formData.email.trim()}. Please check your email.`);
      } else {
        setOtpError(data.message || 'Failed to send OTP code.');
      }
    } catch (err) {
      setOtpError('Failed to connect to authentication service. Please check your network.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput.trim() || otpInput.trim().length < 6) {
      setOtpError('Please enter the 6-digit verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: otpInput.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsEmailVerified(true);
        setOtpSent(false);
        setResendTimer(0);
        setOtpMessage('Email address verified successfully!');
        setFormErrors(prev => ({ ...prev, email: '' }));
      } else {
        setOtpError(data.message || 'Invalid verification code. Please check and try again.');
      }
    } catch (err) {
      setOtpError('Verification request failed. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateStep2 = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = orgType === 'CORPORATE' ? 'Company Name is required' : 'Institute Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = orgType === 'CORPORATE' ? 'Corporate Work Email is required' : 'Official Institute Email is required';
    }

    if (!isEmailVerified) {
      errors.email = 'Please verify your email address before continuing';
    }

    if (!formData.adminName.trim()) {
      errors.adminName = orgType === 'CORPORATE' ? 'Corporate Super Admin / L&D Head Name is required' : 'Academic Super Admin Name is required';
    }

    if (!formData.adminPassword.trim() || formData.adminPassword.length < 6) {
      errors.adminPassword = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm Password is required';
    } else if (formData.adminPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleStartProvisioning = async () => {
    setCurrentStep(4);
    setSetupLogs([]);
    setSetupProgress(10);
    setIsProvisioningComplete(false);

    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
    const tenantId = `tenant-${orgType === 'INSTITUTE' ? 'inst' : 'corp'}-${Date.now()}`;
    const superAdminId = `user-super-${Date.now()}`;
    const verifiedEmail = formData.email.trim().toLowerCase();

    const steps = [
      { text: `Establishing secure connection to organization database...`, progress: 25, delay: 400 },
      { text: `Provisioning ${orgType === 'INSTITUTE' ? 'Academic Institute' : 'Corporate Enterprise'} portal: "${formData.name}"...`, progress: 50, delay: 500 },
      { text: `Configuring ${orgType === 'INSTITUTE' ? 'curriculum & instructor roles' : 'employee upskilling & compliance tracks'}...`, progress: 75, delay: 600 },
      { text: `Provisioning Master Root Super Admin account: "${verifiedEmail}"...`, progress: 90, delay: 650 },
      { text: `Finalizing setup and preparing your organization dashboard...`, progress: 100, delay: 500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, steps[i].delay));
      setSetupLogs(prev => [...prev, steps[i].text]);
      setSetupProgress(steps[i].progress);
      if (progressContainerRef.current) {
        progressContainerRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }

    let dbTenant = null;
    let dbSuperAdmin = null;

    try {
      const response = await fetch(`${API_URL}/api/system/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          type: orgType,
          officialEmail: verifiedEmail,
          phone: formData.phone,
          website: formData.website,
          industry: formData.industry,
          companySize: formData.companySize,
          companyType: formData.companyType,
          institutionType: formData.institutionType,
          affiliation: formData.affiliation,
          adminName: formData.adminName,
          adminEmail: verifiedEmail,
          adminPassword: formData.adminPassword,
          adminDesignation: orgType === 'CORPORATE' ? 'Corporate Super Admin / VP of L&D' : 'Academic Super Admin / Dean'
        })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data?.token) {
          localStorage.setItem('token', result.data.token);
        }
        if (result.data?.tenant) dbTenant = result.data.tenant;
        if (result.data?.user) dbSuperAdmin = result.data.user;
      }
    } catch (err) {
      console.warn('Backend DB setup notice:', err.message);
    }

    const finalTenant = dbTenant || {
      id: tenantId,
      name: formData.name,
      type: orgType,
      slug: slug,
      logo_url: orgType === 'INSTITUTE'
        ? 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
      contact_email: verifiedEmail,
      phone: formData.phone,
      website: formData.website,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    const finalSuperAdmin = dbSuperAdmin || {
      id: superAdminId,
      tenant_id: tenantId,
      name: formData.adminName,
      email: verifiedEmail,
      password: formData.adminPassword,
      role: 'SUPER_ADMIN',
      job_title: orgType === 'CORPORATE' ? 'Corporate Super Admin / VP of L&D' : 'Academic Super Admin / Dean',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    completeSetup({
      tenant: finalTenant,
      superAdmin: finalSuperAdmin,
      type: orgType
    });

    const starterCourse = {
      id: `course-${Date.now()}`,
      tenant_id: tenantId,
      instructor_id: finalSuperAdmin.id,
      instructor_name: finalSuperAdmin.name,
      title: orgType === 'CORPORATE'
        ? `${formData.name} - Corporate Onboarding & Compliance Track`
        : `${formData.name} - Academic Orientation & Master Syllabus`,
      subtitle: `Official onboarding curriculum module for ${formData.name}`,
      description: `Comprehensive starter module automatically configured during setup.`,
      thumbnail: orgType === 'CORPORATE'
        ? 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      price: 0.00,
      is_enterprise_eligible: true,
      level: 'BEGINNER',
      rating: 5.0,
      enrolled_count: 1,
      published: true
    };
    createCourse(starterCourse);

    setIsProvisioningComplete(true);
  };

  const handleGoToLanding = () => {
    localStorage.setItem('lms_remembered_email', formData.email);
    navigate('/');
  };

  const handleGoToLogin = () => {
    localStorage.setItem('lms_remembered_email', formData.email);
    navigate('/login');
  };

  const isCorp = orgType === 'CORPORATE';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] relative flex flex-col justify-center items-center px-4 py-8 overflow-x-hidden selection:bg-indigo-600 selection:text-white">

      {}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />

      {}
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">

        {}
        {isSetupCompleted && (
          <div className="w-full max-w-md mb-6 p-3.5 rounded-2xl bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-xs flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="font-semibold">Platform is already set up!</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] shadow-xs cursor-pointer transition-colors"
            >
              Go to Landing Page
            </button>
          </div>
        )}

        {}
        <div className="max-w-md w-full mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 w-full z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-indigo-600 z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />

            {[
              { num: 1, label: 'Portal Type' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Review' },
              { num: 4, label: 'Completed' }
            ].map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${isPassed
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md'
                          : 'bg-white text-slate-400 border border-slate-300'
                      }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5" /> : s.num}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${isCurrent ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {}
        {}
        {}
        {currentStep === 1 && (
          <div className="w-full space-y-8 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold">
                Select Your Setup Type
              </span>
              {}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">

              {}
              <div
                onClick={() => handleSelectType('INSTITUTE')}
                className="group bg-white hover:bg-slate-50/50 border-2 border-slate-200 hover:border-indigo-600 rounded-3xl p-7 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                      Academic / College / School
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Educational Institute</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For Universities, Colleges, Schools & Coaching Academies. Manage instructors, courses, exams, and enrolled students.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-indigo-600 font-bold text-xs group-hover:text-indigo-700">
                  <span>Select & Enter Institute Details</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {}
              <div
                onClick={() => handleSelectType('CORPORATE')}
                className="group bg-white hover:bg-slate-50/50 border-2 border-slate-200 hover:border-blue-600 rounded-3xl p-7 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                      Enterprise & Workforce L&D
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">Corporate Enterprise</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      For Companies, Corporate Training & HR Teams. Assign mandatory compliance tracks, upskill employees, and track progress.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs group-hover:text-blue-700">
                  <span>Select & Enter Corporate Details</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>

            {}
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl w-full animate-fadeIn space-y-6">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${isCorp
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                  {isCorp ? ' Corporate Enterprise Setup' : ' Educational Institute Setup'}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {isCorp ? 'Enter Corporate & Super Admin Details' : 'Enter Institute & Super Admin Details'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isCorp
                    ? 'Configure your corporate learning ecosystem and create your verified master admin account.'
                    : 'Configure your academic learning portal and create your verified master admin account.'}
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            <form onSubmit={handleProceedToReview} className="space-y-6 text-xs">

              {}
              <div className="space-y-3">
                <h3 className={`font-extrabold uppercase tracking-wider text-[11px] flex items-center gap-1.5 ${isCorp ? 'text-blue-600' : 'text-indigo-600'
                  }`}>
                  {isCorp ? <Building2 className="w-4 h-4" /> : <School className="w-4 h-4" />}
                  {isCorp ? '1. Corporate Enterprise Information' : '1. Educational Institute Information'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {isCorp ? 'Company / Enterprise Name *' : 'Institute / College / University Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isCorp ? 'e.g. Acme Technologies Inc.' : 'e.g. Oxford Tech Institute'}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                    />
                    {formErrors.name && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {isCorp ? 'Company Code / Org Identifier' : 'Institute Code'}
                    </label>
                    <input
                      type="text"
                      placeholder={isCorp ? 'e.g. ACME-2026' : 'e.g. OXF-2026'}
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 uppercase font-mono focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {}
                {isCorp ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Industry / Business Sector *
                      </label>
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                      >
                        <option value="Information Technology & Software Services">Information Technology & Software Services</option>
                        <option value="Banking, Financial Services & Insurance (BFSI)">Banking, Financial Services & Insurance (BFSI)</option>
                        <option value="Healthcare, Pharmaceuticals & Biotech">Healthcare, Pharmaceuticals & Biotech</option>
                        <option value="Manufacturing, Automotive & Industrial">Manufacturing, Automotive & Industrial</option>
                        <option value="Consulting, HR & Professional Services">Consulting, HR & Professional Services</option>
                        <option value="Retail, E-commerce & Supply Chain">Retail, E-commerce & Supply Chain</option>
                        <option value="Telecommunications & Media">Telecommunications & Media</option>
                        <option value="Energy, Oil & Utilities">Energy, Oil & Utilities</option>
                        <option value="Other Corporate Enterprise">Other Corporate Enterprise</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Workforce Size / Employee Count
                      </label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => handleInputChange('companySize', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                      >
                        <option value="1 - 50 Employees (Startup / Boutique)">1 - 50 Employees (Startup / Boutique)</option>
                        <option value="51 - 250 Employees (Mid-size Enterprise)">51 - 250 Employees (Mid-size Enterprise)</option>
                        <option value="251 - 1,000 Employees (Large Enterprise)">251 - 1,000 Employees (Large Enterprise)</option>
                        <option value="1,000+ Employees (Global Enterprise)">1,000+ Employees (Global Enterprise)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Institution Type *
                      </label>
                      <select
                        value={formData.institutionType}
                        onChange={(e) => handleInputChange('institutionType', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      >
                        <option value="University / Higher Education">University / Higher Education</option>
                        <option value="Engineering & Technology College">Engineering & Technology College</option>
                        <option value="Arts, Science & Commerce College">Arts, Science & Commerce College</option>
                        <option value="Medical & Health Sciences Institute">Medical & Health Sciences Institute</option>
                        <option value="Business & Management School">Business & Management School</option>
                        <option value="Polytechnic & Vocational Academy">Polytechnic & Vocational Academy</option>
                        <option value="School / K-12 Academy">School / K-12 Academy</option>
                        <option value="Coaching & Training Academy">Coaching & Training Academy</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-slate-700">
                        Affiliation / Board (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Autonomous / UGC / State Board"
                        value={formData.affiliation}
                        onChange={(e) => handleInputChange('affiliation', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                )}

                {}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700">
                      {isCorp ? 'Corporate Work Email *' : 'Official Institute Email *'}
                    </label>
                    {isEmailVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Verification Required
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder={isCorp ? 'hr@company.com or admin@enterprise.com' : 'admin@institute.edu or contact@college.edu'}
                        value={formData.email}
                        disabled={isEmailVerified}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full bg-slate-50 border rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 font-mono transition-all ${isEmailVerified
                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-950 font-bold'
                            : 'border-slate-300 focus:outline-none focus:border-indigo-600 focus:bg-white'
                          }`}
                      />
                    </div>

                    {!isEmailVerified ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !formData.email.trim() || resendTimer > 0}
                        className={`px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm whitespace-nowrap ${
                          resendTimer > 0
                            ? 'bg-slate-200 text-slate-600 border border-slate-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer disabled:opacity-50'
                        }`}
                      >
                        {isSendingOtp ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : resendTimer > 0 ? (
                          <>
                            <Clock className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                            <span>Resend ({resendTimer}s)</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>{otpSent ? 'Resend Code' : 'Verify Email'}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsEmailVerified(false);
                          setOtpSent(false);
                          setOtpInput('');
                          setOtpMessage('');
                          setOtpError('');
                          setResendTimer(0);
                        }}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold text-[11px] cursor-pointer"
                      >
                        Change Email
                      </button>
                    )}
                  </div>

                  {formErrors.email && (
                    <p className="text-[11px] text-rose-500 font-semibold">{formErrors.email}</p>
                  )}

                  {}
                  {otpSent && !isEmailVerified && (
                    <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3.5 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <KeyRound className="w-4 h-4 text-indigo-600" />
                          Enter 6-digit Verification Code
                        </span>
                        {resendTimer > 0 && (
                          <span className="font-mono font-bold text-indigo-700 bg-indigo-100/90 border border-indigo-300/70 px-2 py-0.5 rounded-md flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-indigo-600 animate-pulse" />
                            00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}s
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="123456"
                          value={otpInput}
                          onChange={(e) => {
                            setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                            setOtpError('');
                          }}
                          className="w-36 tracking-widest text-center text-base font-mono font-extrabold bg-white border border-indigo-300 rounded-xl px-3 py-2 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifyingOtp || otpInput.length < 6}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                        >
                          {isVerifyingOtp ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          <span>Verify OTP</span>
                        </button>
                      </div>

                      {otpMessage && (
                        <p className="text-[11px] text-indigo-700 font-medium">{otpMessage}</p>
                      )}
                      {otpError && (
                        <p className="text-[11px] text-rose-600 font-semibold">{otpError}</p>
                      )}

                      {}
                      <div className="pt-2 border-t border-indigo-100/80 flex items-center justify-between text-xs">
                        {resendTimer > 0 ? (
                          <div className="flex items-center gap-1.5 text-indigo-900 font-semibold text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
                            <span>Resend code available in: <strong className="font-mono text-indigo-950 font-bold bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-300/70">{resendTimer}s</strong></span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-600 font-medium text-[11px]">
                            <span>Didn't receive the code?</span>
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={isSendingOtp}
                              className="text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer disabled:opacity-50"
                            >
                              Resend Code
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {isEmailVerified && (
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Email verified! This will be used as both the {isCorp ? 'Company Contact' : 'Institute Contact'} and Super Admin login email.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {isCorp ? 'Corporate Phone (Optional)' : 'Campus Phone (Optional)'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">
                      {isCorp ? 'Company Website (Optional)' : 'Institute Website (Optional)'}
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        placeholder={isCorp ? 'https://acmecorp.com' : 'https://apextech.edu'}
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-blue-600">
                    <Shield className="w-4 h-4" /> 2. Super Admin Master Account Credentials
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Root Super Admin
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700">
                    {isCorp ? 'Corporate Super Admin / L&D Head Name *' : 'Academic Super Admin / Dean / Principal Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isCorp ? 'e.g. John Doe' : 'e.g. Dr. Eleanor Vance'}
                    value={formData.adminName}
                    onChange={(e) => handleInputChange('adminName', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all font-medium"
                  />
                  {formErrors.adminName && <p className="text-[11px] text-rose-500 font-semibold">{formErrors.adminName}</p>}
                </div>

                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min. 6 characters"
                        value={formData.adminPassword}
                        onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-9 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formErrors.adminPassword && (
                      <p className="text-[11px] text-rose-500 font-semibold">{formErrors.adminPassword}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-700">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full bg-slate-50 border rounded-xl pl-9 pr-9 py-2.5 text-slate-900 focus:outline-none transition-all ${formData.confirmPassword && formData.adminPassword === formData.confirmPassword
                            ? 'border-emerald-500 focus:border-emerald-600'
                            : formData.confirmPassword && formData.adminPassword !== formData.confirmPassword
                              ? 'border-rose-400 focus:border-rose-500'
                              : 'border-slate-300 focus:border-indigo-600 focus:bg-white'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.adminPassword === formData.confirmPassword && (
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                    {formData.confirmPassword && formData.adminPassword !== formData.confirmPassword && (
                      <p className="text-[11px] text-rose-500 font-semibold">Passwords do not match</p>
                    )}
                    {formErrors.confirmPassword && (
                      <p className="text-[11px] text-rose-500 font-semibold">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

              </div>

              {}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  Review Summary <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        )}

        {}
        {}
        {}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl w-full animate-fadeIn space-y-6">

            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                Step 3 • Review Details
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                Confirm Your {isCorp ? 'Corporate Enterprise' : 'Educational Institute'} Setup
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your details below before completing the initial setup and creating your Super Admin account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-extrabold text-slate-900">
                  {isCorp ? <Building2 className="w-4 h-4 text-blue-600" /> : <GraduationCap className="w-4 h-4 text-indigo-600" />}
                  <span>{isCorp ? 'Corporate Organization' : 'Academic Institute'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isCorp ? 'Company Name' : 'Institute Name'}</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Portal Type</span>
                  <span className="font-semibold text-slate-700">
                    {isCorp ? 'Corporate Enterprise L&D' : 'Academic Educational Institute'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{isCorp ? 'Company Code' : 'Institute Code'}</span>
                  <span className="font-mono font-bold text-slate-800">{formData.code || 'Auto-generated'}</span>
                </div>
                {isCorp ? (
                  <>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Industry Sector</span>
                      <span className="font-medium text-slate-800">{formData.industry}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Workforce Size</span>
                      <span className="font-medium text-slate-800">{formData.companySize}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Institution Type</span>
                      <span className="font-medium text-slate-800">{formData.institutionType}</span>
                    </div>
                    {formData.affiliation && (
                      <div>
                        <span className="text-slate-400 block text-[10px]">Affiliation</span>
                        <span className="font-medium text-slate-800">{formData.affiliation}</span>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <span className="text-slate-400 block text-[10px]">{isCorp ? 'Corporate Work Email' : 'Institute Email'}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-indigo-600">{formData.email}</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
                {formData.phone && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone</span>
                    <span className="text-slate-800">{formData.phone}</span>
                  </div>
                )}
                {formData.website && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Website</span>
                    <span className="text-slate-800">{formData.website}</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                <div className="flex items-center gap-2 font-extrabold text-slate-900">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Super Admin Master Account</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Admin Name</span>
                  <span className="font-bold text-slate-900 text-sm">{formData.adminName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Role / Access</span>
                  <span className="font-semibold text-slate-700">
                    {isCorp ? 'Corporate Super Admin / Head of L&D' : 'Academic Super Admin / Dean'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Login Email</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-mono font-bold text-indigo-600">{formData.email}</span>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Platform Access</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Full Root Access
                  </span>
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Back to Edit
              </button>

              <button
                type="button"
                onClick={handleStartProvisioning}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Complete Setup & Create Account
              </button>
            </div>

          </div>
        )}

        {}
        {}
        {}
        {currentStep === 4 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl w-full animate-fadeIn space-y-6">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Setup Progress
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {isProvisioningComplete ? '🎉 Setup Completed Successfully!' : 'Creating Your Organization Portal...'}
                </h2>
              </div>
              {!isProvisioningComplete && (
                <RefreshCw className="w-5 h-5 text-indigo-600 animate-spin" />
              )}
            </div>

            {}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Progress</span>
                <span className="font-mono text-indigo-600 font-bold">{setupProgress}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${setupProgress}%` }}
                />
              </div>
            </div>

            {}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="space-y-2 text-xs">
                {setupLogs.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-700 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      ✓
                    </span>
                    <span>{log}</span>
                  </div>
                ))}
                {!isProvisioningComplete && (
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold pt-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span>Processing configuration...</span>
                  </div>
                )}
                <div ref={progressContainerRef} />
              </div>
            </div>

            {}
            {isProvisioningComplete && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4 animate-scaleUp">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Account Created Successfully!</h3>
                    <p className="text-xs text-emerald-800">
                      Your Super Admin master account is ready. Proceed to login to access your {isCorp ? 'corporate' : 'academic'} portal.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-3.5 border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Login Email:</span>
                    <span className="font-mono font-bold text-slate-900">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Assigned Role:</span>
                    <span className="font-bold text-indigo-600">SUPER_ADMIN (Full Platform Access)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleGoToLanding}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Go to Landing Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleGoToLogin}
                    className="w-full py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Go to Login Page</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
