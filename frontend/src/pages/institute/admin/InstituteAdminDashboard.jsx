import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen, Users, GraduationCap, ClipboardCheck, Award,
  Calendar, Bell, Mail, Search, Download, ExternalLink,
  ChevronDown, ChevronRight, Menu, Layers, Settings,
  FileText, CheckCircle2, Clock, Plus, MessageSquare,
  Folder, HelpCircle, Activity, Video, ShieldCheck,
  TrendingUp, Sparkles, Upload, UserCheck, AlertCircle,
  Megaphone, Database, CheckSquare, BarChart2, Shield,
  ArrowUpRight, ArrowDownRight, MoreVertical, LogOut, Eye, Trash2, Palette, Globe, DollarSign,
  Edit3
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import { InstituteSidebar } from '../../../components/institute/InstituteSidebar';
import CourseCurriculumModal from '../../../components/course/CourseCurriculumModal';
import EnrollmentReportsHub from '../../../components/enrollment/EnrollmentReportsHub';
import ManualEnrollmentModal from '../../../components/enrollment/ManualEnrollmentModal';

export const InstituteDashboard = () => {
  const navigate = useNavigate();
  const {
    activeTenant,
    currentUser,
    courses,
    courseProgress,
    createCourse,
    deleteCourse,
    toggleCoursePublish,
    users,
    addUser,
    inviteFacultyMember,
    deleteUser,
    transactions,
    certificates,
    enrollmentRecords,
    updateTenantBranding,
    setSelectedCourseForPlayer
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedRange, setSelectedRange] = useState('This Month');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [editingCourseForCurriculum, setEditingCourseForCurriculum] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserRole, setNewUserRole] = useState('INSTRUCTOR');

  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 99.99,
    level: 'BEGINNER',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  });

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    job_title: '',
    department: ''
  });

  const tenantCourses = courses.filter(c => c.tenant_id === activeTenant.id);
  const tenantUsers = users.filter(u => u.tenant_id === activeTenant.id);
  const tenantStudents = tenantUsers.filter(u => u.role === 'LEARNER');
  const tenantInstructors = tenantUsers.filter(u => u.role === 'INSTRUCTOR' || u.role === 'INSTITUTE_ADMIN');
  const tenantTxns = transactions.filter(t => t.tenant_id === activeTenant.id && t.status === 'SUCCESS');
  const tenantRevenue = tenantTxns.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const tenantCerts = certificates.filter(c => c.tenant_id === activeTenant.id);

  const activityData = [
    { date: '18 Apr', enrollments: Math.max(12, tenantCourses.length * 15), completions: 8, assessments: 10, certificates: 4 },
    { date: '25 Apr', enrollments: Math.max(25, tenantCourses.length * 28), completions: 18, assessments: 16, certificates: 9 },
    { date: '02 May', enrollments: Math.max(38, tenantCourses.length * 42), completions: 26, assessments: 24, certificates: 15 },
    { date: '09 May', enrollments: Math.max(52, tenantCourses.length * 56), completions: 39, assessments: 32, certificates: 22 },
    { date: '16 May', enrollments: Math.max(70, tenantCourses.length * 75), completions: 50, assessments: 41, certificates: 31 }
  ];

  const publishedCount = tenantCourses.filter(c => c.published !== false).length;
  const draftCount = tenantCourses.filter(c => c.published === false).length;
  const courseStatusData = [
    { name: 'Published', value: publishedCount || 1, percentage: `${publishedCount ? Math.round((publishedCount / (tenantCourses.length || 1)) * 100) : 100}%`, color: '#10B981' },
    { name: 'Draft / In-Review', value: draftCount || 0, percentage: `${draftCount ? Math.round((draftCount / (tenantCourses.length || 1)) * 100) : 0}%`, color: '#3B82F6' },
  ];

  const engagementWaveData = [
    { day: '18 Apr', score: 62 },
    { day: '25 Apr', score: 71 },
    { day: '02 May', score: 68 },
    { day: '09 May', score: 75 },
    { day: '16 May', score: 84 }
  ];

  const sparklineData1 = [{ v: 10 }, { v: 14 }, { v: 12 }, { v: 18 }, { v: 15 }, { v: 22 }, { v: 28 }];
  const sparklineData2 = [{ v: 20 }, { v: 25 }, { v: 22 }, { v: 35 }, { v: 30 }, { v: 42 }, { v: 48 }];
  const sparklineData3 = [{ v: 15 }, { v: 18 }, { v: 24 }, { v: 20 }, { v: 32 }, { v: 38 }, { v: 45 }];
  const sparklineData4 = [{ v: 12 }, { v: 15 }, { v: 14 }, { v: 20 }, { v: 18 }, { v: 25 }, { v: 30 }];
  const sparklineData5 = [{ v: 8 }, { v: 12 }, { v: 10 }, { v: 18 }, { v: 16 }, { v: 24 }, { v: 32 }];

  const CustomActivityTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0F172A] text-white p-3 rounded-2xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[170px]">
          <div className="font-extrabold text-[11px] text-slate-300 border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{label}, 2026</span>
          </div>
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between gap-3 text-purple-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Enrollments:
              </span>
              <span className="font-mono font-bold text-white">{payload[0]?.value}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-emerald-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completions:
              </span>
              <span className="font-mono font-bold text-white">{payload[1]?.value}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-amber-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Assessments:
              </span>
              <span className="font-mono font-bold text-white">{payload[2]?.value}</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-blue-300">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Certificates:
              </span>
              <span className="font-mono font-bold text-white">{payload[3]?.value}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const courseId = `course-${Date.now()}`;
    const newCourse = {
      id: courseId,
      tenant_id: activeTenant.id,
      instructor_id: currentUser.id,
      instructor_name: currentUser.name,
      title: newCourseForm.title,
      subtitle: newCourseForm.subtitle,
      description: newCourseForm.description,
      price: Number(newCourseForm.price || 0),
      level: newCourseForm.level,
      thumbnail: newCourseForm.thumbnail,
      rating: 5.0,
      enrolled_count: 0,
      published: true,
      modules: [
        {
          id: `mod-${Date.now()}`,
          title: 'Module 1: Introduction & Foundations',
          lessons: [
            { id: `les-${Date.now()}-1`, title: 'Lesson 1: Getting Started', duration_mins: 15, video_url: 'https://www.w3schools.com/html/mov_bbb.mp4' }
          ]
        }
      ]
    };
    createCourse(newCourse);
    setShowAddCourseModal(false);
    setNewCourseForm({
      title: '',
      subtitle: '',
      description: '',
      price: 99.99,
      level: 'BEGINNER',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    });
  };

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsAddingUser(true);
    setAddUserError('');

    if (newUserRole === 'INSTRUCTOR') {
      const inviteRes = await inviteFacultyMember({
        name: newUserForm.name,
        email: newUserForm.email,
        department: newUserForm.department || 'Academics & Technology',
        tenant_id: activeTenant?.id || null,
        job_title: 'Instructor'
      });

      setIsAddingUser(false);

      if (inviteRes && inviteRes.success === false) {
        setAddUserError(inviteRes.error || 'Failed to send instructor invitation.');
        return;
      }

      setShowAddUserModal(false);
      setNewUserForm({ name: '', email: '', job_title: '', department: '' });

      Swal.fire({
        icon: 'success',
        title: 'Instructor Invitation Dispatched!',
        html: `
          <div style="text-align: left; font-size: 13px; color: #475569; line-height: 1.6;">
            <p>An official onboarding link has been sent from <b>smartlms2026@gmail.com</b> to:</p>
            <p style="font-weight: bold; color: #4f46e5; font-family: monospace; font-size: 14px;">${newUserForm.email}</p>
            <p>The instructor can click the link to configure their specialization, designation, bio, and <b>set their own password</b>.</p>
            ${inviteRes?.inviteLink ? `
              <div style="margin-top: 12px; padding: 10px; background: #f1f5f9; border-radius: 8px; font-size: 11px; word-break: break-all;">
                <b>Direct Activation Link:</b><br/>
                <a href="${inviteRes.inviteLink}" target="_blank" style="color: #4f46e5;">${inviteRes.inviteLink}</a>
              </div>
            ` : ''}
          </div>
        `,
        confirmButtonText: 'Great, Done',
        confirmButtonColor: '#4f46e5'
      });
      return;
    }

    const createdUser = {
      tenant_id: activeTenant?.id || null,
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserRole,
      job_title: newUserForm.job_title || 'Enrolled Student',
      department: newUserForm.department || 'Academic Department',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    };

    const res = await addUser(createdUser);
    setIsAddingUser(false);

    if (res && res.success === false) {
      setAddUserError(res.error || 'Failed to save user in database');
      return;
    }

    setShowAddUserModal(false);
    setNewUserForm({ name: '', email: '', job_title: '', department: '' });
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex overflow-hidden">

      {}
      <InstituteSidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activeItem={activeMenu}
        setActiveItem={setActiveMenu}
      />

      {}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">

        {}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">

          {}
          <div className="flex items-center gap-3.5 flex-1 max-w-lg">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${activeTenant?.name} courses, students, instructors...`}
                className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-10 pr-16 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <span className="absolute right-3 top-2 text-[10px] text-slate-400 font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded-md">
                Ctrl + K
              </span>
            </div>
          </div>

          {}
          <div className="flex items-center gap-4">

            {}
            <div className="hidden md:flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-xl text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{activeTenant?.name}</span>
            </div>

            {}
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {tenantCourses.length + 3}
              </span>
            </button>

            {}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <img
                src={currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-xs"
              />
              <div className="hidden sm:block text-left">
                <div className="font-extrabold text-xs text-slate-900 leading-tight">{currentUser?.name || 'Institute Admin'}</div>
                <div className="text-[10px] text-slate-400 font-mono">{currentUser?.email || 'admin@apextech.edu'}</div>
              </div>

              <button
                onClick={() => navigate('/login')}
                title="Sign Out to Login"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </header>

        {}
        <main className="p-6 max-w-[1600px] w-full mx-auto space-y-6 flex-1">

          {}
          {}
          {}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">

              {}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    Welcome back, {currentUser?.name?.split(' ')[0] || 'Admin'}! 
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Here is what's happening at <strong className="text-indigo-600">{activeTenant?.name}</strong> today.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Course</span>
                  </button>

                  <button
                    onClick={() => alert(`Consolidated report generated for ${activeTenant.name}.`)}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-2 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* 5 KPI Cards Isolated to this Institute */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">

                {/* 1. Total Courses */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Institute Courses</span>
                      <div className="text-xl font-black text-slate-900 leading-tight">{tenantCourses.length}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Live & Published
                  </div>
                  <div className="h-7 -mx-4 -mb-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData1}>
                        <defs>
                          <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#8B5CF6" strokeWidth={2} fill="url(#pGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. Total Students */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Learners / Students</span>
                      <div className="text-xl font-black text-slate-900 leading-tight">{tenantStudents.length}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Active Enrolled
                  </div>
                  <div className="h-7 -mx-4 -mb-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData2}>
                        <defs>
                          <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2} fill="url(#bGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 3. Instructors */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Instructors</span>
                      <div className="text-xl font-black text-slate-900 leading-tight">{tenantInstructors.length}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Certified Instructors
                  </div>
                  <div className="h-7 -mx-4 -mb-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData3}>
                        <defs>
                          <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2} fill="url(#eGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 4. Total Institute Revenue */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-black text-base">
                      ₹
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Direct Sales Revenue</span>
                      <div className="text-xl font-black text-slate-900 leading-tight">₹{tenantRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Stripe & Razorpay
                  </div>
                  <div className="h-7 -mx-4 -mb-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData4}>
                        <defs>
                          <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#F59E0B" strokeWidth={2} fill="url(#aGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 5. Certificates Issued */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-500">Certificates Issued</span>
                      <div className="text-xl font-black text-slate-900 leading-tight">{tenantCerts.length || 1}</div>
                    </div>
                  </div>
                  <div className="mt-2.5 text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" /> Verifiable QR Codes
                  </div>
                  <div className="h-7 -mx-4 -mb-4 mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparklineData5}>
                        <defs>
                          <linearGradient id="pkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EC4899" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#EC4899" strokeWidth={2} fill="url(#pkGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* 3-Column Detailed Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

                {/* Column 1: Learning Activity Trends + Institute Courses */}
                <div className="lg:col-span-5 space-y-5">

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900">Institute Activity Trends</h3>
                      <select
                        value={selectedRange}
                        onChange={(e) => setSelectedRange(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 font-bold text-slate-700 cursor-pointer focus:outline-none"
                      >
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="This Year">This Year</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3.5 text-[11px] font-bold text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-600" /> Enrollments</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completions</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Assessments</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Certificates</span>
                    </div>

                    <div className="h-60 w-full pt-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                          <Tooltip content={<CustomActivityTooltip />} />
                          <Line type="monotone" dataKey="enrollments" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3.5, fill: '#8B5CF6' }} />
                          <Line type="monotone" dataKey="completions" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3.5, fill: '#10B981' }} />
                          <Line type="monotone" dataKey="assessments" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3.5, fill: '#F59E0B' }} />
                          <Line type="monotone" dataKey="certificates" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3.5, fill: '#3B82F6' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Courses for this Institute */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900">{activeTenant?.name} Courses</h3>
                      <button
                        onClick={() => setActiveMenu('courses')}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        Manage All ({tenantCourses.length})
                      </button>
                    </div>

                    <div className="space-y-3">
                      {tenantCourses.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                          No courses created yet. Click "Create Course" to publish your first institute syllabus!
                        </div>
                      ) : (
                        tenantCourses.slice(0, 4).map((c) => (
                          <div key={c.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                              <div className="min-w-0">
                                <h4 className="font-bold text-xs text-slate-900 truncate">{c.title}</h4>
                                <p className="text-[10px] text-slate-400 font-mono">{c.price > 0 ? `₹${c.price}` : 'Free'} • {c.instructor_name || 'Instructor'}</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedCourseForPlayer(c)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold shrink-0 flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Preview
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Column 2: Course Progress Breakdown + Student Engagement */}
                <div className="lg:col-span-4 space-y-5">

                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Publishing Breakdown</h3>

                    <div className="relative h-44 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={courseStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {courseStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-black text-slate-900">{tenantCourses.length}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Courses</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs pt-1">
                      {courseStatusData.map(item => (
                        <div key={item.name} className="flex items-center justify-between text-slate-600 font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900">{item.value} <span className="text-slate-400 font-normal">({item.percentage})</span></span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Engagement Ring */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-slate-900">Student Retention</h3>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">94% Active</span>
                    </div>

                    <div className="grid grid-cols-12 gap-3 items-center pt-1">
                      <div className="col-span-5 flex flex-col items-center justify-center text-center">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-100"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-emerald-500 stroke-current"
                              strokeWidth="3.5"
                              strokeDasharray="88, 100"
                              strokeLinecap="round"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-base font-black text-slate-900">88%</span>
                            <span className="text-[7px] font-bold text-slate-400 uppercase">Score</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-7 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px] flex items-center gap-1.5"><Users className="w-3 h-3 text-blue-500" /> Students</span>
                          <span className="font-black text-slate-900 font-mono text-[11px]">{Math.max(tenantStudents.length, 1)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px] flex items-center gap-1.5"><BookOpen className="w-3 h-3 text-cyan-500" /> Syllabus</span>
                          <span className="font-black text-slate-900 font-mono text-[11px]">{tenantCourses.length} Active</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px] flex items-center gap-1.5"><Clock className="w-3 h-3 text-emerald-500" /> Avg. Time</span>
                          <span className="font-black text-slate-900 font-mono text-[11px]">4h 12m</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-14 w-full -mx-2 -mb-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={engagementWaveData}>
                          <defs>
                            <linearGradient id="engGrad2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#engGrad2)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* Column 3: Administration Tasks & Quick Summary */}
                <div className="lg:col-span-3 space-y-5">

                  {/* Tasks */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-3">
                    <h3 className="font-extrabold text-sm text-slate-900">Administration Tasks</h3>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Course Reviews</span>
                        <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">1 Pending</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Learner Enrollments</span>
                        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{tenantStudents.length} Active</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Certificate Issues</span>
                        <span className="font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md">{tenantCerts.length} Issued</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: COURSES MANAGEMENT */}
          {/* ========================================================= */}
          {(activeMenu.startsWith('courses') || activeMenu === 'courses-all' || activeMenu === 'courses-add') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    {activeTenant?.name} - Course Catalog
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Create, publish, price, and deliver course curriculums exclusively under your institute's brand.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add New Course
                </button>
              </div>

              {}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tenantCourses.map((c) => (
                  <div key={c.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                          {c.level || 'BEGINNER'}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${c.published !== false ? 'bg-emerald-500/80 text-white border-emerald-400' : 'bg-amber-500/80 text-white border-amber-400'}`}>
                          {c.published !== false ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-extrabold text-xs line-clamp-1">{c.title}</p>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {c.description || c.subtitle}
                      </p>
                      <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-100">
                        <span className="text-indigo-600 font-extrabold text-sm">{c.price > 0 ? `₹${c.price}` : 'Free'}</span>
                        <span className="text-slate-500">{c.instructor_name || 'Instructor'}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedCourseForPlayer(c)}
                        className="flex-1 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Player
                      </button>
                      <button
                        onClick={() => setEditingCourseForCurriculum(c)}
                        className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        title="Edit Course Modules, Video, SCORM, Reading & Quizzes"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Syllabus
                      </button>
                      <button
                        onClick={() => toggleCoursePublish(c.id)}
                        className={`p-2 rounded-xl border text-xs font-bold ${c.published !== false ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}
                      >
                        {c.published !== false ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete course "${c.title}"?`)) deleteCourse(c.id);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {(activeMenu.startsWith('inst') || activeMenu === 'instructors') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                    {activeTenant?.name} - Instructors & Mentors
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instructors, lecturers, and course creators registered under your institute.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewUserRole('INSTRUCTOR');
                    setShowAddUserModal(true);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Instructor
                </button>
              </div>

              {}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                      <th className="py-4 px-6">Instructor Name</th>
                      <th className="py-4 px-6">Department / Subject</th>
                      <th className="py-4 px-6">Assigned Role</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tenantInstructors.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-extrabold text-slate-900">{u.name}</p>
                              <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-slate-700">
                          {u.department || 'Computer Science & Technology'}
                        </td>
                        <td className="py-3.5 px-6">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-6">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ACTIVE
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right">
                          {u.id !== currentUser.id && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove instructor "${u.name}"?`)) deleteUser(u.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {}
          {}
          {}
          {(activeMenu.startsWith('stud') || activeMenu === 'students') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    {activeTenant?.name} - Enrolled Students
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage student roster, admissions, and course access for {activeTenant?.name}.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setActiveMenu('enrollments')}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-slate-500" /> View All Admissions & Receipts
                  </button>
                  <button
                    onClick={() => {
                      setNewUserRole('LEARNER');
                      setShowAddUserModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Enroll New Student
                  </button>
                </div>
              </div>

              {}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                    Student User Directory ({tenantStudents.length})
                  </h4>
                </div>
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                      <th className="py-4 px-6">Student Name</th>
                      <th className="py-4 px-6">Email / Student ID</th>
                      <th className="py-4 px-6">Batch / Specialization</th>
                      <th className="py-4 px-6">Enrolled Courses</th>
                      <th className="py-4 px-6">Syllabus Progress</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tenantStudents.map((u) => {
                      const studentAvgProgress = tenantCourses.length > 0 
                        ? Math.round(
                            tenantCourses.reduce((acc, c) => acc + (courseProgress[c.id]?.progressPercent || 0), 0) / tenantCourses.length
                          )
                        : 0;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                              <div>
                                <p className="font-extrabold text-slate-900">{u.name}</p>
                                <p className="text-[10px] text-slate-400">{u.job_title || 'Enrolled Student'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 font-mono text-slate-600">
                            {u.email}
                          </td>
                          <td className="py-3.5 px-6 font-medium text-slate-700">
                            {u.department || 'B.Tech Software Track 2026'}
                          </td>
                          <td className="py-3.5 px-6 font-bold text-indigo-600">
                            {tenantCourses.length} Courses Enrolled
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-indigo-600 rounded-full transition-all"
                                  style={{ width: `${studentAvgProgress}%` }}
                                />
                              </div>
                              <span className="font-bold text-[11px] text-slate-700 font-mono">{studentAvgProgress}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Remove student "${u.name}"?`)) deleteUser(u.id);
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {}
          {}
          {}
          {(activeMenu.startsWith('enr') || activeMenu.startsWith('rep') || activeMenu.startsWith('transactions') || activeMenu.startsWith('pay') || activeMenu.startsWith('inv')) && (
            <div className="animate-fadeIn">
              <EnrollmentReportsHub 
                initialTab={
                  activeMenu.startsWith('enr-req') ? 'pending' 
                  : activeMenu.startsWith('tx-') ? 'online' 
                  : activeMenu.startsWith('rep-fin') ? 'course_revenue' 
                  : activeMenu.startsWith('enr-bulk') ? 'offline'
                  : 'all'
                } 
              />
            </div>
          )}

          {}
          {}
          {}
          {activeMenu !== 'dashboard' &&
           !activeMenu.startsWith('courses') &&
           !activeMenu.startsWith('inst') &&
           !activeMenu.startsWith('stud') &&
           activeMenu !== 'students' &&
           !activeMenu.startsWith('enr') &&
           !activeMenu.startsWith('rep') &&
           !activeMenu.startsWith('transactions') &&
           !activeMenu.startsWith('pay') &&
           !activeMenu.startsWith('inv') && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight capitalize flex items-center gap-2">
                    <Layers className="w-6 h-6 text-indigo-600" />
                    {activeMenu.replace(/[-_]/g, ' ')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Managing <strong>{activeMenu.replace(/[-_]/g, ' ')}</strong> configurations and records for <strong>{activeTenant?.name}</strong>.
                  </p>
                </div>

                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all self-start sm:self-auto"
                >
                  ← Back to Dashboard
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900 capitalize">
                    {activeMenu.replace(/[-_]/g, ' ')} Management
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    This module is active and connected to your institute tenant <strong>({activeTenant?.name})</strong>.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/20"
                  >
                    Manage Course Catalog
                  </button>
                  <button
                    onClick={() => setActiveMenu('enrollments')}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Open Enrollments & Reports
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

      {}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Create Course</h3>
                <p className="text-xs text-slate-500">Publishing for <strong>{activeTenant.name}</strong></p>
              </div>
              <button onClick={() => setShowAddCourseModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Artificial Intelligence & Robotics"
                  value={newCourseForm.title}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Subtitle</label>
                <input
                  type="text"
                  placeholder="Short tagline"
                  value={newCourseForm.subtitle}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">Price (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCourseForm.price}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-700 font-bold">Level</label>
                  <select
                    value={newCourseForm.level}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={newCourseForm.thumbnail}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, thumbnail: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-600/25"
                >
                  Publish to Institute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Add {newUserRole === 'INSTRUCTOR' ? 'Instructor' : 'Student'}
                </h3>
                <p className="text-xs text-slate-500">For <strong>{activeTenant.name}</strong></p>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Robert Langdon"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder={`user@${activeTenant.slug}.edu`}
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Department / Program</label>
                <input
                  type="text"
                  placeholder="e.g. Electrical Engineering"
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {newUserRole === 'INSTRUCTOR' && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-[11px] text-indigo-900 leading-relaxed space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-700">
                    <Mail className="w-3.5 h-3.5" /> Automated Email Invitation
                  </div>
                  <p>An activation link will be sent to the instructor's email allowing them to fill their profile details and <strong>set their own password</strong>.</p>
                </div>
              )}

              {addUserError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  ⚠️ {addUserError}
                </div>
              )}

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  disabled={isAddingUser}
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingUser}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAddingUser ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Dispatching Link...
                    </>
                  ) : (
                    newUserRole === 'INSTRUCTOR' ? 'Send Invitation Link' : 'Save Member'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Curriculum & Multi-Content Builder Modal */}
      {editingCourseForCurriculum && (
        <CourseCurriculumModal
          course={editingCourseForCurriculum}
          isOpen={!!editingCourseForCurriculum}
          onClose={() => setEditingCourseForCurriculum(null)}
          onSave={(updated) => {
            updateCourse(updated);
            setEditingCourseForCurriculum(null);
          }}
        />
      )}

    </div>
  );
};
