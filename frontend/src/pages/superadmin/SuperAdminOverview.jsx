import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap, Building2, Users, BookOpen,
  Award, Layers, ShieldCheck, ArrowRight,
  Sparkles, Plus, ExternalLink, Activity,
  Clock, UserCheck, Key, RefreshCw, CreditCard,
  DollarSign, TrendingUp, Calendar, CheckCircle2,
  AlertCircle, ChevronRight, Search, Filter,
  Play, CheckCircle, ArrowUpRight, Wallet
} from 'lucide-react';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const {
    activeTenant, users, courses, tenants, setupType,
    reloadDatabaseData, transactions = [], enrollmentRecords = [], timetable = []
  } = useApp();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (reloadDatabaseData) await reloadDatabaseData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isCorporate = activeTenant?.type === 'CORPORATE' || setupType === 'CORPORATE' || localStorage.getItem('lms_setup_type') === 'CORPORATE';

  const currentInst = activeTenant || tenants.find(t => isCorporate ? t.type === 'CORPORATE' : t.type === 'INSTITUTE') || {
    id: 'inst-default',
    name: isCorporate ? 'Enterprise Corporate Academy' : 'Arul Anandar College',
    slug: isCorporate ? 'corp-tech' : 'aac-edu',
    code: isCorporate ? 'CORP-2026' : 'AAC-2026',
    email: 'admin@aactni.edu.in',
    phone: '+91 98765 43210'
  };

  const tenantUsers = activeTenant ? users.filter(u => !u.tenant_id || u.tenant_id === activeTenant.id) : users;
  const tenantCourses = activeTenant ? courses.filter(c => !c.tenant_id || c.tenant_id === activeTenant.id) : courses;
  const tenantTxns = activeTenant ? transactions.filter(t => !t.tenant_id || t.tenant_id === activeTenant.id) : transactions;

  const learners = tenantUsers.filter(u => ['LEARNER', 'STUDENT', 'EMPLOYEE'].includes(u.role));
  const learnerCount = learners.length;
  const instructorCount = tenantUsers.filter(u => ['INSTRUCTOR', 'TRAINER'].includes(u.role)).length;
  const adminCount = tenantUsers.filter(u => ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'CORP_ADMIN', 'DEAN'].includes(u.role)).length;

  const ongoingCourses = tenantCourses.filter(c => c.published !== false);
  const upcomingCourses = tenantCourses.filter(c => c.published === false || (c.subtitle && c.subtitle.toLowerCase().includes('upcoming')));

  const paidCourses = tenantCourses.filter(c => Number(c.price || 0) > 0);
  const freeCourses = tenantCourses.filter(c => Number(c.price || 0) === 0);

  const totalRevenue = tenantTxns.reduce((sum, t) => sum + (t.status === 'SUCCESS' ? Number(t.amount || 0) : 0), 0);
  const pendingTxns = tenantTxns.filter(t => t.status === 'PENDING' || t.status === 'PENDING_APPROVAL');
  const successTxns = tenantTxns.filter(t => t.status === 'SUCCESS');

  const filteredOngoing = ongoingCourses.filter(c =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    (c.category && c.category.toLowerCase().includes(courseSearch.toLowerCase())) ||
    (c.instructor_name && c.instructor_name.toLowerCase().includes(courseSearch.toLowerCase()))
  );

  const menuSections = isCorporate ? [
    {
      id: 'institutes',
      title: 'Company Profile',
      description: 'Manage corporate profile, headquarters, domain settings, compliance policies, and branch offices.',
      icon: Building2,
      path: '/superadmin/institutes',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Enterprise'
    },
    {
      id: 'departments',
      title: 'Business Units & Teams',
      description: 'Organize enterprise divisions (Engineering, Cloud, QA, AI Ops, Sales, HR), team leads, and project assignments.',
      icon: Layers,
      path: '/superadmin/departments',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Division'
    },
    {
      id: 'instructors',
      title: 'Trainers & Mentors',
      description: 'Directory of technical mentors, certified corporate instructors, skill tracks allocations, and certifications.',
      icon: UserCheck,
      path: '/superadmin/instructors',
      color: 'from-sky-600 to-cyan-600',
      badge: 'Trainers'
    },
    {
      id: 'students',
      title: 'Employees & Workforce',
      description: 'Employee directory, employee IDs, department batch enrollments, skill matrix, and upskilling progress.',
      icon: Users,
      path: '/superadmin/students',
      color: 'from-emerald-600 to-teal-600',
      badge: 'Workforce'
    },
    {
      id: 'courses',
      title: 'Training Tracks & Upskilling',
      description: 'Browse skill pathways, compliance videos, hands-on projects, assignments, and curriculum moderation.',
      icon: BookOpen,
      path: '/superadmin/courses',
      color: 'from-amber-500 to-orange-600',
      badge: 'Upskilling'
    },
    {
      id: 'roles',
      title: 'Roles & Security',
      description: 'RBAC security matrix for Super Admins, HR Leads, Team Managers, Trainers, and Employees.',
      icon: Key,
      path: '/superadmin/roles-permissions',
      color: 'from-rose-500 to-pink-600',
      badge: 'Security'
    }
  ] : [
    {
      id: 'institutes',
      title: 'Institute Profile',
      description: 'Manage institution profile, accreditation details, campus contacts, and domain settings.',
      icon: GraduationCap,
      path: '/superadmin/institutes',
      color: 'from-blue-600 to-indigo-600',
      badge: 'Institution'
    },
    {
      id: 'departments',
      title: 'Departments & Programs',
      description: 'Organize academic departments (CSE, ECE, Mech, MBA), degree programs, and HOD assignments.',
      icon: Building2,
      path: '/superadmin/departments',
      color: 'from-purple-600 to-indigo-600',
      badge: 'Academic'
    },
    {
      id: 'instructors',
      title: 'Instructors & Mentors',
      description: 'Directory of instructors, lecturers, course allocations, and teaching credentials.',
      icon: UserCheck,
      path: '/superadmin/instructors',
      color: 'from-sky-600 to-cyan-600',
      badge: 'Instructors'
    },
    {
      id: 'students',
      title: 'Learners & Admissions',
      description: 'Learner directory, registration numbers, department batch enrollments, and academic progress.',
      icon: Users,
      path: '/superadmin/students',
      color: 'from-emerald-600 to-teal-600',
      badge: 'Learners'
    },
    {
      id: 'courses',
      title: 'Courses & Curriculum',
      description: 'Browse syllabus, lesson modules, video lectures, assignments, and curriculum moderation.',
      icon: BookOpen,
      path: '/superadmin/courses',
      color: 'from-amber-500 to-orange-600',
      badge: 'Curriculum'
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      description: 'RBAC security matrix for Super Admins, Deans, HODs, Instructors, and Learners.',
      icon: Key,
      path: '/superadmin/roles-permissions',
      color: 'from-rose-500 to-pink-600',
      badge: 'Security'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-['Plus_Jakarta_Sans',sans-serif]">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time institute academic metrics, running courses, payment ledger & learner enrollments.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 transition-all border border-slate-200 shadow-xs active:scale-95 cursor-pointer"
            title="Sync latest live database stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Stats</span>
          </button>
          {}
          {}
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {}
        <div
          onClick={() => navigate('/superadmin/students')}
          className="bg-white border border-slate-200/80 hover:border-emerald-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-700 transition-colors">
                {isCorporate ? 'Total Employees' : 'Total Enrolled Learners'}
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono tracking-tight">{learnerCount}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Registered in active courses
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {learnerCount} Active
            </span>
            <span className="text-slate-400 group-hover:text-emerald-700 font-bold flex items-center gap-0.5 transition-colors">
              Directory <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {}
        <div
          onClick={() => navigate('/superadmin/courses')}
          className="bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-700 transition-colors">
                Ongoing / Running Courses
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono tracking-tight">{ongoingCourses.length}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Active published syllabus
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-blue-600 font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> {paidCourses.length} Paid • {freeCourses.length} Free
            </span>
            <span className="text-slate-400 group-hover:text-blue-700 font-bold flex items-center gap-0.5 transition-colors">
              Courses <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {}
        <div
          onClick={() => navigate('/superadmin/courses')}
          className="bg-white border border-slate-200/80 hover:border-amber-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-700 transition-colors">
                Upcoming Courses & Batches
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono tracking-tight">{upcomingCourses.length || (timetable.length > 0 ? timetable.length : 1)}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Scheduled for next intake/cycle
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-amber-600 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Scheduled launch
            </span>
            <span className="text-slate-400 group-hover:text-amber-700 font-bold flex items-center gap-0.5 transition-colors">
              Schedule <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {}
        <div
          onClick={() => navigate('/superadmin/payments')}
          className="bg-white border border-slate-200/80 hover:border-indigo-300 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-700 transition-colors">
                Payment Revenue Status
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center shadow-xs">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2 font-mono tracking-tight">₹{totalRevenue.toLocaleString()}</div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Gross collections processed
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="text-indigo-600 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {successTxns.length} Paid {pendingTxns.length > 0 ? `• ${pendingTxns.length} Pending` : ''}
            </span>
            <span className="text-slate-400 group-hover:text-indigo-700 font-bold flex items-center gap-0.5 transition-colors">
              Ledger <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {}
        <div className="lg:col-span-2 space-y-6">

          {}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Ongoing & Running Courses</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[11px] border border-blue-200">
                    {ongoingCourses.length} Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live courses currently being taught, enrolled learners count, and pricing status.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search course..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 w-full sm:w-48"
                />
              </div>
            </div>

            {}
            {filteredOngoing.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No ongoing courses found</p>
                <button
                  onClick={() => navigate('/superadmin/courses/create')}
                  className="mt-3 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                >
                  + Add New Course
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOngoing.map((course) => {
                  const isPaid = Number(course.price || 0) > 0;
                  return (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                          {course.title ? course.title.charAt(0) : 'C'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                              {course.category || 'General'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Ongoing
                            </span>
                            {isPaid ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                                Paid • ₹{Number(course.price).toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Free Enrollment
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 mt-1 line-clamp-1">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Instructor: <span className="font-semibold text-slate-700">{course.instructor_name || 'Assigned Faculty'}</span> • Level: <span className="font-semibold text-slate-700">{course.level || 'All Levels'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                        <div className="text-left sm:text-right">
                          <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{course.enrolled_count || 1} Learners</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">Enrolled in batch</div>
                        </div>

                        <button
                          onClick={() => navigate(`/superadmin/courses/${course.id}/edit`)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-extrabold text-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Manage <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Upcoming Courses & Scheduled Programs</h3>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-extrabold text-[11px] border border-amber-200">
                    Upcoming Releases
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curriculum drafts, scheduled course modules, and upcoming academic semester sessions.
                </p>
              </div>

              <button
                onClick={() => navigate('/superadmin/courses/create')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule New
              </button>
            </div>

            {upcomingCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingCourses.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {c.category || 'Upcoming'}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Scheduled
                      </span>
                    </div>
                    <h5 className="font-extrabold text-sm text-slate-900">{c.title}</h5>
                    <p className="text-xs text-slate-600 line-clamp-2">{c.description || 'Curriculum under preparation for the upcoming academic cycle.'}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">₹{c.price ? Number(c.price).toLocaleString() : 'Free'}</span>
                      <button
                        onClick={() => navigate(`/superadmin/courses/${c.id}/edit`)}
                        className="text-indigo-600 font-bold hover:underline cursor-pointer"
                      >
                        Edit Syllabus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-xs text-slate-900">Advanced Full-Stack Engineering & AI Module 2026</h5>
                    <p className="text-[11px] text-slate-500">Scheduled for Next Academic Batch • 4 Semesters</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/superadmin/courses/create')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 transition-all self-start sm:self-auto cursor-pointer"
                >
                  Publish Now
                </button>
              </div>
            )}
          </div>

        </div>

        {}
        <div className="space-y-6">

          {}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Payment Status & Collections</h3>
                <p className="text-xs text-slate-500 mt-0.5">Real-time revenue ledger</p>
              </div>
              <button
                onClick={() => navigate('/superadmin/payments')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
              >
                All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wide">SUCCESSFUL</div>
                <div className="text-lg font-black text-emerald-900 mt-0.5">₹{totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-700 font-semibold">{successTxns.length} transactions</div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                <div className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wide">PENDING / DUE</div>
                <div className="text-lg font-black text-amber-900 mt-0.5">
                  ₹{pendingTxns.reduce((s, t) => s + Number(t.amount || 0), 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-amber-700 font-semibold">{pendingTxns.length} pending review</div>
              </div>
            </div>

            {}
            <div className="space-y-2.5">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Recent Transactions</div>
              {tenantTxns.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No payment transactions recorded yet.</p>
              ) : (
                tenantTxns.slice(0, 4).map((t) => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-slate-900 truncate">{t.learner_name || 'Learner'}</div>
                      <div className="text-[10px] text-slate-500 truncate">{t.course_title || 'Course Enrollment'}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-xs text-slate-900">₹{Number(t.amount || 0).toLocaleString()}</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${t.status === 'SUCCESS' ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'
                        }`}>
                        {t.status || 'PAID'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {isCorporate ? 'Workforce Enrollment' : 'Enrolled Learners & Admissions'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Active learner distribution</p>
              </div>
              <button
                onClick={() => navigate('/superadmin/students')}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
              >
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Total Enrolled Learners</div>
                    <div className="text-[10px] text-slate-500">Across all academic programs</div>
                  </div>
                </div>
                <div className="text-xl font-black text-indigo-600 font-mono">{learnerCount}</div>
              </div>

              {}
              <div className="space-y-2">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Recent Registrations</div>
                {learners.slice(0, 3).map((u) => (
                  <div key={u.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                        {u.name ? u.name.charAt(0) : 'L'}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-xs text-slate-800 truncate">{u.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200 shrink-0">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {}
      {}

    </div>
  );
};
