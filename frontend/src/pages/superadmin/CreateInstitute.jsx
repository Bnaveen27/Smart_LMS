import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';
import { 
  X, Mail, Phone, Globe, Upload, Check, ChevronRight, ChevronLeft,
  Building2, User, Award, Layers, ShieldCheck, Sparkles, CheckCircle2,
  Lock, ArrowLeft
} from 'lucide-react';

export const CreateInstitutePage = () => {
  const navigate = useNavigate();
  const { addTenant, addUser, createCourse, setActiveTenant, setCurrentUser, setRole, reloadDatabaseData } = useApp();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [autoCode, setAutoCode] = useState(true);

  const [formData, setFormData] = useState({
    
    name: '',
    code: 'GTA-2026-XQ',
    type: 'Higher Education',
    contactEmail: '',
    phone: '',
    website: '',
    logoUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    logoFile: null,

    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: 'TempPassword@2026',
    adminDesignation: 'Dean / Academic Director',
    sendInvite: true,

    plan: 'Professional',
    billingCycle: 'Annually',
    studentLimit: '5,000',
    paymentMethod: 'Credit Card (Stripe)',

    features: {
      advancedAnalytics: true,
      videoStreaming: true,
      certificates: true,
      multiInstructor: true,
      liveWebinars: false,
      mobileApp: true,
      aiTutor: false
    },
    subdomain: ''
  });

  const steps = [
    { number: 1, label: 'Basic Info', subtitle: 'Basic Information' },
    { number: 2, label: 'Admin', subtitle: 'Primary Admin Account' },
    { number: 3, label: 'Subscription', subtitle: 'Subscription & Tier' },
    { number: 4, label: 'Features', subtitle: 'Platform Features & Addons' },
    { number: 5, label: 'Review', subtitle: 'Review & Launch' }
  ];

  const generateCode = (name) => {
    if (!name) return 'INST-2026-01';
    const words = name.trim().split(/\s+/);
    let initials = words.map(w => w[0]).join('').toUpperCase();
    if (initials.length < 2) initials = name.slice(0, 3).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${initials}-2026-${randomSuffix}`;
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    const autoSubdomain = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    setFormData(prev => ({
      ...prev,
      name: val,
      code: autoCode ? generateCode(val) : prev.code,
      subdomain: prev.subdomain ? prev.subdomain : autoSubdomain
    }));
  };

  const handleToggleFeature = (key) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [key]: !prev.features[key]
      }
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && !formData.name.trim()) {
      alert('Please enter the Institute Name.');
      return;
    }
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const [createdInstituteModal, setCreatedInstituteModal] = useState(null);

  const handleCreateInstitute = async () => {
    const slug = formData.subdomain || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const adminEmail = formData.adminEmail || formData.contactEmail || `admin@${slug}.edu`;

    let createdTenantId = `tenant-inst-${Date.now()}`;
    let createdAdminId = `user-${Date.now()}`;

    try {
      const response = await fetch(`${API_URL}/api/auth/register/institute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instituteName: formData.name,
          institutionCode: formData.code,
          instituteType: formData.type || 'Higher Education',
          officialEmail: formData.contactEmail || adminEmail,
          phone: formData.phone,
          website: formData.website,
          departments: 'School of Computer Science & Engineering',
          firstName: formData.adminFirstName || 'Institute',
          lastName: formData.adminLastName || 'Admin',
          email: adminEmail,
          password: formData.adminPassword || 'Admin@2026'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.tenant?.id) createdTenantId = result.tenant.id;
        if (result.user?.id) createdAdminId = result.user.id;
      }
    } catch (err) {
      console.warn('Backend MySQL institute registration notice:', err.message);
    }

    const newTenant = {
      id: createdTenantId,
      name: formData.name,
      type: 'INSTITUTE',
      code: formData.code,
      slug: slug,
      logo_url: formData.logoUrl,
      contact_email: formData.contactEmail,
      phone: formData.phone,
      plan: formData.plan,
      features: formData.features,
      status: 'ACTIVE',
      created_at: new Date().toISOString()
    };

    addTenant(newTenant);

    const adminUser = {
      id: createdAdminId,
      tenant_id: createdTenantId,
      name: `${formData.adminFirstName || 'Institute'} ${formData.adminLastName || 'Super Admin'}`.trim(),
      email: adminEmail,
      password: formData.adminPassword || 'Admin@2026',
      role: 'INSTITUTE_ADMIN',
      department: null,
      job_title: formData.adminDesignation || 'Institute Super Admin & Director',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    addUser(adminUser);

    const starterCourse = {
      id: `course-${Date.now()}`,
      tenant_id: createdTenantId,
      instructor_id: adminUser.id,
      instructor_name: adminUser.name,
      title: `Welcome to ${formData.name} - Orientation & Core Curriculum`,
      subtitle: `Official introductory course for students and instructors at ${formData.name}`,
      description: `Comprehensive onboarding and foundational learning modules tailored exclusively for ${formData.name} learners.`,
      thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
      price: 0.00,
      is_enterprise_eligible: true,
      level: 'BEGINNER',
      rating: 5.0,
      enrolled_count: 1,
      published: true
    };
    createCourse(starterCourse);

    if (reloadDatabaseData) reloadDatabaseData();

    setCreatedInstituteModal({
      tenant: newTenant,
      adminUser: adminUser,
      password: formData.adminPassword || 'Admin@2026'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 animate-fadeIn">
      
      {}
      <div className="mb-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/superadmin/institutes')}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Institutes</span>
        </button>

        <span className="text-xs text-slate-400 font-bold">
          Step {currentStep} of 6
        </span>
      </div>

      {}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        
        {}
        <div className="p-6 sm:p-8 pb-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Create New Institute
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Step {currentStep} of 6: {steps[currentStep - 1].subtitle}
            </p>
          </div>
          <button 
            onClick={() => navigate('/superadmin/institutes')}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            {steps.map((step) => {
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;

              return (
                <div 
                  key={step.number}
                  onClick={() => {
                    if (isCompleted) setCurrentStep(step.number);
                  }}
                  className={`flex flex-col items-center gap-1 z-10 cursor-pointer ${isCompleted ? 'hover:opacity-80' : ''}`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md' 
                        : isCompleted 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-white border border-slate-200 text-slate-400 font-bold'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span className={`text-[11px] font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {}
        <div className="p-6 sm:p-10 space-y-6 text-xs max-w-3xl mx-auto">
          
          {}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              
              {}
              <div className="space-y-1.5">
                <label className="block text-slate-800 font-extrabold text-xs">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Global Tech Academy" 
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                />
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-800 font-extrabold text-xs">Institute Code</label>
                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setAutoCode(!autoCode)}>
                      <span className="text-[11px] font-semibold text-slate-500">Auto-generate</span>
                      <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center px-0.5 ${autoCode ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${autoCode ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                  <input 
                    type="text" 
                    value={formData.code}
                    disabled={autoCode}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500 disabled:opacity-80"
                  />
                </div>

                {}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Institute Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Higher Education">Higher Education (University / College)</option>
                    <option value="Online Academy">Online Academy / K-12</option>
                    <option value="Vocational Training">Vocational & Skill Development</option>
                    <option value="Language School">Language School</option>
                    <option value="Technical Bootcamp">Technical & Coding Bootcamp</option>
                    <option value="Test Preparation">Competitive Exam & Test Prep</option>
                  </select>
                </div>

              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Contact Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="email" 
                      placeholder="admin@institute.edu" 
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                    />
                  </div>
                </div>

              </div>

              {}
              <div className="space-y-1.5">
                <label className="block text-slate-800 font-extrabold text-xs">Website URL</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="url" 
                    placeholder="https://www.institute.edu" 
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {}
              <div className="space-y-1.5">
                <label className="block text-slate-800 font-extrabold text-xs">Institute Logo</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-8 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer group flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 text-xs">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      SVG, PNG, JPG or GIF (max. 800×400px)
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-xs">Tenant Administrator Account</h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    This account will receive full administrative access to manage courses, instructors, students, and billing for {formData.name || 'this institute'}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">First Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marcus" 
                    value={formData.adminFirstName}
                    onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vance" 
                    value={formData.adminLastName}
                    onChange={(e) => setFormData({ ...formData, adminLastName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-800 font-extrabold text-xs">Admin Official Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="email" 
                    placeholder="marcus.vance@institute.edu" 
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Temporary Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="text" 
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Designation / Role</label>
                  <input 
                    type="text" 
                    value={formData.adminDesignation}
                    onChange={(e) => setFormData({ ...formData, adminDesignation: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="pageSendInvite"
                  checked={formData.sendInvite}
                  onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="pageSendInvite" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Send welcome email with login credentials automatically upon creation
                </label>
              </div>

            </div>
          )}

          {}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <label className="block text-slate-800 font-extrabold text-xs">Select SaaS Plan</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Starter', price: '₹3,999/mo', desc: 'Up to 500 Students, 10 Courses, Standard Support' },
                  { name: 'Professional', price: '₹11,999/mo', desc: 'Up to 5,000 Students, Unlimited Courses, Custom CNAME', popular: true },
                  { name: 'Enterprise', price: '₹39,999/mo', desc: 'Unlimited Students, Dedicated CDN, SSO SAML, 24/7 SLA' }
                ].map((p) => {
                  const isSelected = formData.plan === p.name;
                  return (
                    <div 
                      key={p.name}
                      onClick={() => setFormData({ ...formData, plan: p.name })}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2.5 right-3 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recommended
                        </span>
                      )}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">{p.name}</h4>
                        <div className="text-xl font-black text-slate-900 mt-1">{p.price}</div>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                        <span>{isSelected ? '✓ Selected' : 'Choose Plan'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Billing Cycle</label>
                  <select 
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Monthly">Monthly Recurring</option>
                    <option value="Annually">Annually (Save 20%)</option>
                    <option value="Trial">14-Day Free Trial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold text-xs">Student Seat Capacity</label>
                  <select 
                    value={formData.studentLimit}
                    onChange={(e) => setFormData({ ...formData, studentLimit: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500"
                  >
                    <option value="500">500 Active Students</option>
                    <option value="2,000">2,000 Active Students</option>
                    <option value="5,000">5,000 Active Students</option>
                    <option value="15,000">15,000 Active Students</option>
                    <option value="Unlimited">Unlimited Enterprise Capacity</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-slate-800 font-extrabold text-xs">Enable Platform Features</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'advancedAnalytics', title: 'Advanced Learning Analytics', desc: 'Real-time student progress tracking, completion rates & insights.' },
                  { key: 'videoStreaming', title: 'HLS Video Transcoding & CDN', desc: 'Adaptive streaming and DRM video protection powered by CloudFront.' },
                  { key: 'certificates', title: 'Verifiable Digital Certificates', desc: 'Auto-generates student completion certificates with QR verification.' },
                  { key: 'multiInstructor', title: 'Multi-Instructor Revenue Split', desc: 'Enables instructor applications, course rev-share & automatic payouts.' },
                  { key: 'liveWebinars', title: 'Live Video Classes & Zoom', desc: 'Schedule live streaming lectures with real-time attendee tracking.' },
                  { key: 'mobileApp', title: 'Mobile App API Access', desc: 'Provides API endpoints for white-labeled mobile applications.' }
                ].map((feat) => {
                  const isChecked = formData.features[feat.key];
                  return (
                    <div 
                      key={feat.key}
                      onClick={() => handleToggleFeature(feat.key)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isChecked ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{feat.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{feat.desc}</p>
                      </div>
                      <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 mt-0.5 ${isChecked ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isChecked ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {}
          {currentStep === 5 && (
            <div className="space-y-5 animate-fadeIn">
              
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-xs">Ready for Instant Deployment</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Review your institute configuration. Click "Create Institute" to provision this tenant workspace immediately.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Institute Details</span>
                  <div className="font-extrabold text-slate-900 text-sm">{formData.name || 'Unnamed Institute'}</div>
                  <div className="text-xs text-slate-600 font-mono">Code: {formData.code}</div>
                  <div className="text-xs text-slate-600">Type: {formData.type}</div>
                  <div className="text-xs text-slate-600 font-mono">{formData.subdomain || 'custom'}.smartlms.io</div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Admin Account</span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {formData.adminFirstName || 'Admin'} {formData.adminLastName || ''}
                  </div>
                  <div className="text-xs text-slate-600">{formData.adminEmail || formData.contactEmail || 'admin@institute.edu'}</div>
                  <div className="text-xs text-slate-600">Role: {formData.adminDesignation}</div>
                  <div className="text-xs text-emerald-600 font-bold">Auto-Invite: Enabled</div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Plan & Limits</span>
                  <div className="font-extrabold text-slate-900 text-sm">{formData.plan} Plan</div>
                  <div className="text-xs text-slate-600">Billing: {formData.billingCycle}</div>
                  <div className="text-xs text-slate-600">Capacity: {formData.studentLimit} Students</div>
                </div>

              </div>

            </div>
          )}

        </div>

        {}
        <div className="p-6 sm:p-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <button
            type="button"
            onClick={() => navigate('/superadmin/institutes')}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-4 py-2.5 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all transform active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateInstitute}
                className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Institute</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {}
      {createdInstituteModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 animate-scaleUp border border-slate-100">
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Institute & Super Admin Created!
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                <strong className="text-slate-800">{createdInstituteModal.tenant.name}</strong> has been configured with an isolated tenant instance and designated Institute Super Admin account.
              </p>
            </div>

            {}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Admin Login Credentials
                </span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200">
                  INSTITUTE_ADMIN
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Admin Name:</span>
                  <span className="font-bold text-slate-900">{createdInstituteModal.adminUser.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Login Email:</span>
                  <span className="font-mono font-bold text-indigo-600 bg-indigo-50/60 px-2 py-0.5 rounded">{createdInstituteModal.adminUser.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Temporary Password:</span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-200/70 px-2 py-0.5 rounded">{createdInstituteModal.password}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                When logging in as this Admin, only <strong>{createdInstituteModal.tenant.name}</strong>'s courses, students, instructors, and transactions will be accessible.
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreatedInstituteModal(null);
                  navigate('/superadmin/institutes');
                }}
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
              >
                Back to All Institutes
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTenant(createdInstituteModal.tenant);
                  setCurrentUser(createdInstituteModal.adminUser);
                  setRole('INSTITUTE_ADMIN');
                  setCreatedInstituteModal(null);
                  navigate('/institute');
                }}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Login as this Admin Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
