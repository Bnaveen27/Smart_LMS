import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  X, Mail, Phone, Globe, Upload, Check, ChevronRight, ChevronLeft,
  Building2, User, Award, Layers, ShieldCheck, Sparkles, CheckCircle2,
  Lock, RefreshCw, AlertCircle
} from 'lucide-react';

export const CreateInstituteModal = ({ isOpen, onClose }) => {
  const { addTenant, addUser } = useApp();
  
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

  if (!isOpen) return null;

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

  const handleCreateInstitute = () => {
    const tenantId = `tenant-inst-${Date.now()}`;
    const slug = formData.subdomain || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const newTenant = {
      id: tenantId,
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

    if (formData.adminEmail || formData.contactEmail) {
      const adminEmail = formData.adminEmail || formData.contactEmail;
      const adminUser = {
        id: `user-${Date.now()}`,
        tenant_id: tenantId,
        name: `${formData.adminFirstName || 'Institute'} ${formData.adminLastName || 'Super Admin'}`.trim(),
        email: adminEmail,
        role: 'INSTITUTE_ADMIN',
        department: null,
        job_title: formData.adminDesignation || 'Institute Super Admin & Director',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      };
      addUser(adminUser);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col my-8 animate-scaleUp">
        
        {}
        <div className="p-6 sm:p-8 pb-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create New Institute
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Step {currentStep} of 6: {steps[currentStep - 1].subtitle}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors text-sm font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/70 border-b border-slate-100">
          <div className="flex items-center justify-between relative">
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
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
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
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto max-h-[60vh] custom-scrollbar text-xs">
          
          {}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fadeIn">
              
              {}
              <div className="space-y-1.5">
                <label className="block text-slate-800 font-extrabold">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Global Tech Academy" 
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                />
              </div>

              {}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-800 font-extrabold">Institute Code</label>
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
                  <label className="block text-slate-800 font-extrabold">Institute Type</label>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {}
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold">Contact Email</label>
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
                  <label className="block text-slate-800 font-extrabold">Phone Number</label>
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
                <label className="block text-slate-800 font-extrabold">Website URL</label>
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
                <label className="block text-slate-800 font-extrabold">Institute Logo</label>
                <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-6 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer group flex flex-col items-center justify-center space-y-2">
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
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 text-xs">Tenant Super Administrator</h4>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    This account will receive full administrative access to manage courses, instructors, students, and billing for {formData.name || 'this institute'}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold">First Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Marcus" 
                    value={formData.adminFirstName}
                    onChange={(e) => setFormData({ ...formData, adminFirstName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold">Last Name</label>
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
                <label className="block text-slate-800 font-extrabold">Admin Official Email</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold">Temporary Password</label>
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
                  <label className="block text-slate-800 font-extrabold">Designation / Role</label>
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
                  id="sendInvite"
                  checked={formData.sendInvite}
                  onChange={(e) => setFormData({ ...formData, sendInvite: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="sendInvite" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Send welcome email with login credentials automatically upon creation
                </label>
              </div>

            </div>
          )}

          {}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <label className="block text-slate-800 font-extrabold">Select SaaS Plan</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
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
                        <div className="text-lg font-black text-slate-900 mt-1">{p.price}</div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-blue-600">
                        <span>{isSelected ? '✓ Selected' : 'Choose Plan'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-slate-800 font-extrabold">Billing Cycle</label>
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
                  <label className="block text-slate-800 font-extrabold">Student Seat Capacity</label>
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
            <div className="space-y-3 animate-fadeIn">
              <label className="block text-slate-800 font-extrabold">Enable Platform Features</label>
              
              <div className="space-y-2">
                {[
                  { key: 'advancedAnalytics', title: 'Advanced Learning Analytics', desc: 'Real-time student progress tracking, completion rates & insights.' },
                  { key: 'videoStreaming', title: 'HLS Video Transcoding & CDN', desc: 'Adaptive streaming and DRM video protection powered by CloudFront.' },
                  { key: 'certificates', title: 'Verifiable Digital Certificates', desc: 'Auto-generates student completion certificates with QR verification.' },
                  { key: 'multiInstructor', title: 'Multi-Instructor Revenue Split', desc: 'Enables instructor applications, course rev-share & automatic payouts.' },
                  { key: 'liveWebinars', title: 'Live Video Classes & Zoom Integration', desc: 'Schedule live streaming lectures with real-time attendee tracking.' },
                  { key: 'mobileApp', title: 'Mobile App API Access (iOS / Android)', desc: 'Provides API endpoints for white-labeled mobile applications.' }
                ].map((feat) => {
                  const isChecked = formData.features[feat.key];
                  return (
                    <div 
                      key={feat.key}
                      onClick={() => handleToggleFeature(feat.key)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isChecked ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs">{feat.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{feat.desc}</p>
                      </div>
                      <div className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 shrink-0 ${isChecked ? 'bg-blue-600' : 'bg-slate-300'}`}>
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
            <div className="space-y-4 animate-fadeIn">
              
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-xs">Ready for Instant Deployment</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Review your institute configuration. Click "Create Institute" to provision this tenant workspace immediately.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Institute Details</span>
                  <div className="font-extrabold text-slate-900 text-sm">{formData.name || 'Unnamed Institute'}</div>
                  <div className="text-xs text-slate-600 font-mono">Code: {formData.code}</div>
                  <div className="text-xs text-slate-600">Type: {formData.type}</div>
                  <div className="text-xs text-slate-600 font-mono">{formData.subdomain || 'custom'}.smartlms.io</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Admin Account</span>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {formData.adminFirstName || 'Admin'} {formData.adminLastName || ''}
                  </div>
                  <div className="text-xs text-slate-600">{formData.adminEmail || formData.contactEmail || 'admin@institute.edu'}</div>
                  <div className="text-xs text-slate-600">Role: {formData.adminDesignation}</div>
                  <div className="text-xs text-emerald-600 font-bold">Auto-Invite: Enabled</div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1.5">
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
        <div className="p-6 sm:p-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 transition-colors"
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
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all transform active:scale-95"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCreateInstitute}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Institute</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
