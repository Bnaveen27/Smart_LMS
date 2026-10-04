import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, Users, GraduationCap, ClipboardCheck, Award, 
  Video, FileText, Layers, Folder, CheckSquare, 
  Megaphone, Bell, MessageSquare, MessageCircle, BarChart2, 
  TrendingUp, DollarSign, CreditCard, Receipt, Wallet, 
  Settings, Key, Calendar, Palette, Zap, Clock, 
  Database, Activity, ExternalLink, ChevronDown, ChevronRight,
  Shield, UserCheck, CheckCircle2, ShieldCheck, HelpCircle, LogOut, Sparkles
} from 'lucide-react';

export const InstituteSidebar = ({ 
  sidebarCollapsed, 
  setSidebarCollapsed,
  activeItem,
  setActiveItem
}) => {
  const navigate = useNavigate();
  const { activeTenant, tenants, setActiveTenant, role, logout } = useApp();
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  const instituteTenants = tenants.filter(t => t.type === 'INSTITUTE');

  const [openSections, setOpenSections] = useState({
    courses: false,
    categories: false,
    instructors: false,
    learners: false,
    enrollments: false,
    assessments: false,
    certificates: false,
    live_classes: false,
    assignments: false,
    learning_materials: false,
    media_library: false,
    question_bank: false,
    announcements: false,
    notifications: false,
    messages: false,
    feedback: false,
    reports: false,
    analytics: false,
    student_performance: false,
    course_analytics: false,
    plans: false,
    transactions: false,
    invoices: false,
    payouts: false,
    general_settings: false,
    roles_permissions: false,
    academic_settings: false,
    integrations: false,
    activity_logs: false
  });

  const toggleSubmenu = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const menuGroups = [
    {
      groupTitle: 'ACADEMIC',
      items: [
        {
          id: 'courses',
          title: 'Courses',
          icon: BookOpen,
          hasSubmenu: true,
          subItems: [
            { id: 'courses-all', title: 'All Courses' },
            { id: 'courses-add', title: 'Add Course' },
            { id: 'courses-req', title: 'Course Requests' },
            { id: 'courses-rev', title: 'Course Reviews' }
          ]
        },
        {
          id: 'categories',
          title: 'Categories',
          icon: Layers,
          hasSubmenu: true,
          subItems: [
            { id: 'cat-all', title: 'All Categories' },
            { id: 'cat-add', title: 'Add Category' }
          ]
        },
        {
          id: 'instructors',
          title: 'Instructors',
          icon: Users,
          hasSubmenu: true,
          subItems: [
            { id: 'inst-all', title: 'All Instructors' },
            { id: 'inst-add', title: 'Add Instructor' },
            { id: 'inst-req', title: 'Instructor Requests' },
            { id: 'inst-rev', title: 'Instructor Reviews' }
          ]
        },
        {
          id: 'learners',
          title: 'Learners',
          icon: Users,
          hasSubmenu: true,
          subItems: [
            { id: 'stud-all', title: 'All Learners' },
            { id: 'stud-add', title: 'Add Learner' },
            { id: 'stud-bulk', title: 'Learner Bulk Upload' },
            { id: 'stud-cards', title: 'Learner ID Cards' }
          ]
        },
        {
          id: 'enrollments',
          title: 'Enrollments',
          icon: UserCheck,
          hasSubmenu: true,
          subItems: [
            { id: 'enr-all', title: 'All Enrollments' },
            { id: 'enr-req', title: 'Enrollment Requests' },
            { id: 'enr-bulk', title: 'Bulk Enroll' }
          ]
        },
        {
          id: 'assessments',
          title: 'Assessments',
          icon: ClipboardCheck,
          hasSubmenu: true,
          subItems: [
            { id: 'ass-quiz', title: 'Quizzes' },
            { id: 'ass-exam', title: 'Exams' },
            { id: 'ass-assign', title: 'Assignments' },
            { id: 'ass-create', title: 'Create Assessment' },
            { id: 'ass-attempts', title: 'Assessment Attempts' }
          ]
        },
        {
          id: 'certificates',
          title: 'Certificates',
          icon: Award,
          hasSubmenu: true,
          subItems: [
            { id: 'cert-all', title: 'All Certificates' },
            { id: 'cert-temp', title: 'Certificate Templates' },
            { id: 'cert-set', title: 'Certificate Settings' }
          ]
        },
        {
          id: 'live_classes',
          title: 'Live Classes',
          icon: Video,
          hasSubmenu: true,
          subItems: [
            { id: 'live-all', title: 'All Live Classes' },
            { id: 'live-sched', title: 'Schedule Live Class' },
            { id: 'live-req', title: 'Live Class Requests' },
            { id: 'live-rec', title: 'Recordings' }
          ]
        },
        {
          id: 'assignments',
          title: 'Assignments',
          icon: FileText,
          hasSubmenu: true,
          subItems: [
            { id: 'assign-all', title: 'All Assignments' },
            { id: 'assign-add', title: 'Add Assignment' },
            { id: 'assign-sub', title: 'Submissions' },
            { id: 'assign-grad', title: 'Grading' }
          ]
        }
      ]
    },
    {
      groupTitle: 'CONTENT',
      items: [
        {
          id: 'learning_materials',
          title: 'Learning Materials',
          icon: Folder,
          hasSubmenu: true,
          subItems: [
            { id: 'mat-all', title: 'All Materials' },
            { id: 'mat-add', title: 'Add Material' },
            { id: 'mat-req', title: 'Material Requests' }
          ]
        },
        {
          id: 'media_library',
          title: 'Media Library',
          icon: Video,
          hasSubmenu: true,
          subItems: [
            { id: 'med-all', title: 'All Files' },
            { id: 'med-add', title: 'Add New' },
            { id: 'med-fold', title: 'File Folders' },
            { id: 'med-store', title: 'Storage Usage' }
          ]
        },
        {
          id: 'question_bank',
          title: 'Question Bank',
          icon: CheckSquare,
          hasSubmenu: true,
          subItems: [
            { id: 'qb-all', title: 'All Questions' },
            { id: 'qb-add', title: 'Add Question' },
            { id: 'qb-cat', title: 'Question Categories' },
            { id: 'qb-imp', title: 'Import Questions' }
          ]
        }
      ]
    },
    {
      groupTitle: 'COMMUNICATION',
      items: [
        {
          id: 'announcements',
          title: 'Announcements',
          icon: Megaphone,
          hasSubmenu: true,
          subItems: [
            { id: 'ann-all', title: 'All Announcements' },
            { id: 'ann-add', title: 'Add Announcement' },
            { id: 'ann-cat', title: 'Categories' }
          ]
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: Bell,
          hasSubmenu: true,
          subItems: [
            { id: 'notif-all', title: 'All Notifications' },
            { id: 'notif-email', title: 'Email Templates' },
            { id: 'notif-sms', title: 'SMS Templates' },
            { id: 'notif-push', title: 'Push Notifications' }
          ]
        },
        {
          id: 'messages',
          title: 'Messages',
          icon: MessageSquare,
          hasSubmenu: true,
          subItems: [
            { id: 'msg-all', title: 'All Messages' },
            { id: 'msg-send', title: 'Send Message' },
            { id: 'msg-temp', title: 'Message Templates' }
          ]
        },
        {
          id: 'feedback',
          title: 'Feedback',
          icon: MessageCircle,
          hasSubmenu: true,
          subItems: [
            { id: 'fb-stud', title: 'Student Feedback' },
            { id: 'fb-crs', title: 'Course Feedback' },
            { id: 'fb-rep', title: 'Feedback Reports' }
          ]
        }
      ]
    },
    {
      groupTitle: 'REPORTS & ANALYTICS',
      items: [
        {
          id: 'reports',
          title: 'Reports',
          icon: FileText,
          hasSubmenu: true,
          subItems: [
            { id: 'rep-enr', title: 'Enrollment Reports' },
            { id: 'rep-crs', title: 'Course Reports' },
            { id: 'rep-inst', title: 'Instructor Reports' },
            { id: 'rep-stud', title: 'Student Reports' },
            { id: 'rep-ass', title: 'Assessment Reports' },
            { id: 'rep-fin', title: 'Financial Reports' },
            { id: 'rep-cust', title: 'Custom Reports' }
          ]
        },
        {
          id: 'analytics',
          title: 'Analytics',
          icon: BarChart2,
          hasSubmenu: true,
          subItems: [
            { id: 'an-dash', title: 'Dashboard Analytics' },
            { id: 'an-learn', title: 'Learning Analytics' },
            { id: 'an-user', title: 'User Analytics' },
            { id: 'an-eng', title: 'Engagement Analytics' }
          ]
        },
        {
          id: 'student_performance',
          title: 'Student Performance',
          icon: TrendingUp,
          hasSubmenu: true,
          subItems: [
            { id: 'sp-over', title: 'Performance Overview' },
            { id: 'sp-top', title: 'Top Performers' },
            { id: 'sp-risk', title: 'At Risk Students' },
            { id: 'sp-prog', title: 'Progress Reports' }
          ]
        },
        {
          id: 'course_analytics',
          title: 'Course Analytics',
          icon: Activity,
          hasSubmenu: true,
          subItems: [
            { id: 'ca-over', title: 'Course Overview' },
            { id: 'ca-prog', title: 'Course Progress' },
            { id: 'ca-pop', title: 'Popular Courses' },
            { id: 'ca-comp', title: 'Completion Rates' }
          ]
        }
      ]
    },
    {
      groupTitle: 'FINANCE & BILLING',
      items: [
        {
          id: 'plans',
          title: 'Plans & Pricing',
          icon: DollarSign,
          hasSubmenu: true,
          subItems: [
            { id: 'pl-all', title: 'All Plans' },
            { id: 'pl-add', title: 'Add Plan' },
            { id: 'pl-feat', title: 'Plan Features' }
          ]
        },
        {
          id: 'transactions',
          title: 'Transactions',
          icon: CreditCard,
          hasSubmenu: true,
          subItems: [
            { id: 'tx-all', title: 'All Transactions' },
            { id: 'tx-hist', title: 'Transaction History' },
            { id: 'tx-ref', title: 'Refunds' }
          ]
        },
        {
          id: 'invoices',
          title: 'Invoices',
          icon: Receipt,
          hasSubmenu: true,
          subItems: [
            { id: 'inv-all', title: 'All Invoices' },
            { id: 'inv-gen', title: 'Generate Invoice' },
            { id: 'inv-set', title: 'Invoice Settings' }
          ]
        },
        {
          id: 'payouts',
          title: 'Payouts',
          icon: Wallet,
          hasSubmenu: true,
          subItems: [
            { id: 'pay-inst', title: 'Instructor Payouts' },
            { id: 'pay-req', title: 'Payout Requests' },
            { id: 'pay-hist', title: 'Payout History' }
          ]
        }
      ]
    },
    {
      groupTitle: 'SETTINGS & CONFIGURATION',
      items: [
        {
          id: 'general_settings',
          title: 'General Settings',
          icon: Settings,
          hasSubmenu: true,
          subItems: [
            { id: 'gs-prof', title: 'Institute Profile' },
            { id: 'gs-cont', title: 'Contact Information' },
            { id: 'gs-soc', title: 'Social Links' },
            { id: 'gs-tz', title: 'Timezone & Language' }
          ]
        },
        {
          id: 'roles_permissions',
          title: 'Roles & Permissions',
          icon: Key,
          hasSubmenu: true,
          subItems: [
            { id: 'rp-roles', title: 'Roles' },
            { id: 'rp-perm', title: 'Permissions' },
            { id: 'rp-assign', title: 'Assign Roles' }
          ]
        },
        {
          id: 'academic_settings',
          title: 'Academic Settings',
          icon: Calendar,
          hasSubmenu: true,
          subItems: [
            { id: 'as-grad', title: 'Grading System' },
            { id: 'as-att', title: 'Attendance Settings' },
            { id: 'as-cal', title: 'Academic Calendar' },
            { id: 'as-subj', title: 'Subjects' }
          ]
        },
        {
          id: 'integrations',
          title: 'Integrations',
          icon: Zap,
          hasSubmenu: true,
          subItems: [
            { id: 'int-pg', title: 'Payment Gateways' },
            { id: 'int-email', title: 'Email Services' },
            { id: 'int-third', title: 'Third Party Apps' },
            { id: 'int-api', title: 'API Settings' }
          ]
        }
      ]
    },
    {
      groupTitle: 'SYSTEM',
      items: [
        {
          id: 'activity_logs',
          title: 'Activity Logs',
          icon: Clock,
          hasSubmenu: true,
          subItems: [
            { id: 'act-user', title: 'User Activity' },
            { id: 'act-sys', title: 'System Logs' },
            { id: 'act-login', title: 'Login History' }
          ]
        }
      ]
    }
  ];

  return (
    <aside className={`bg-[#0A0E1A] text-slate-300 h-screen sticky top-0 flex flex-col justify-between border-r border-[#151C2E] transition-all duration-300 z-30 shrink-0 select-none ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
      
      {}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 no-scrollbar">
        
        {}
        <div className={`flex items-center gap-2.5 py-1.5 ${sidebarCollapsed ? 'justify-center px-0' : 'px-2'}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0A0E1A] rounded-[9px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div>
              <h1 className="font-black text-sm text-white tracking-wider truncate max-w-[140px]">
                {activeTenant?.name || 'SMART LMS'}
              </h1>
              <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase block">Institute Admin</span>
            </div>
          )}
        </div>

        {}
        {!sidebarCollapsed && (
          <div className="relative">
            <div 
              onClick={() => setShowTenantDropdown(!showTenantDropdown)}
              className="bg-[#121829] border border-slate-800/80 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {activeTenant?.logo_url ? (
                  <img src={activeTenant.logo_url} alt="" className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700 shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 p-1 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-extrabold text-white text-xs leading-tight truncate">{activeTenant?.name || 'Apex Tech Institute'}</h4>
                  <p className="text-[10px] text-slate-400 truncate font-mono">{activeTenant?.domain || `${activeTenant?.slug}.smartlms.io`}</p>
                </div>
              </div>
              {instituteTenants.length > 1 && (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
            </div>

            {}
            {showTenantDropdown && instituteTenants.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#121829] border border-slate-700 rounded-2xl p-2 z-50 shadow-2xl space-y-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase px-2 block">Switch Institute View:</span>
                {instituteTenants.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => {
                      setActiveTenant(t);
                      setShowTenantDropdown(false);
                    }}
                    className={`p-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                      t.id === activeTenant.id ? 'bg-indigo-600/20 text-indigo-400 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <img src={t.logo_url} alt="" className="w-5 h-5 rounded-md object-cover" />
                    <span className="truncate">{t.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {}
        <div 
          onClick={() => setActiveItem('dashboard')}
          title={sidebarCollapsed ? 'Dashboard' : undefined}
          className={`p-2.5 rounded-xl font-extrabold text-xs flex items-center cursor-pointer transition-all ${
            sidebarCollapsed ? 'justify-center' : 'gap-2.5'
          } ${
            activeItem === 'dashboard' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30' 
              : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          {!sidebarCollapsed && <span>Dashboard</span>}
        </div>

        {}
        <div className="space-y-4 pt-1">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-0.5">
              {!sidebarCollapsed && (
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-2.5 py-1">
                  {group.groupTitle}
                </p>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isOpen = openSections[item.id];
                const isSelected = activeItem === item.id || item.subItems?.some(s => s.id === activeItem);

                return (
                  <div key={item.id} className="space-y-0.5">
                    
                    {}
                    <div 
                      onClick={() => {
                        if (item.hasSubmenu) {
                          toggleSubmenu(item.id);
                        } else {
                          setActiveItem(item.id);
                        }
                      }}
                      title={sidebarCollapsed ? item.title : undefined}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center cursor-pointer transition-colors ${
                        sidebarCollapsed ? 'justify-center' : 'justify-between'
                      } ${
                        isSelected 
                          ? 'bg-slate-800/80 text-white font-bold' 
                          : 'text-slate-400 hover:bg-slate-900/90 hover:text-slate-200'
                      }`}
                    >
                      <div className={`flex items-center min-w-0 ${sidebarCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                        <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                        {!sidebarCollapsed && <span className="truncate">{item.title}</span>}
                      </div>

                      {!sidebarCollapsed && item.hasSubmenu && (
                        <div className="text-slate-500 ml-1 shrink-0">
                          {isOpen ? (
                            <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                      )}
                    </div>

                    {}
                    {!sidebarCollapsed && item.hasSubmenu && isOpen && (
                      <div className="pl-8 pr-1 py-1 space-y-1 border-l border-slate-800 ml-4 animate-fadeIn">
                        {item.subItems.map((sub) => {
                          const isSubActive = activeItem === sub.id;
                          return (
                            <div
                              key={sub.id}
                              onClick={() => setActiveItem(sub.id)}
                              className={`py-1 px-2 rounded-lg text-[11px] font-medium cursor-pointer transition-colors flex items-center gap-2 ${
                                isSubActive 
                                  ? 'text-indigo-400 font-bold bg-indigo-500/10' 
                                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                              }`}
                            >
                              <span className={`w-1 h-1 rounded-full ${isSubActive ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                              <span className="truncate">{sub.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {}
      <div className="p-3 border-t border-[#151C2E] space-y-1.5 shrink-0 bg-[#0A0E1A]">
        <button 
          onClick={() => navigate('/learner')}
          className={`w-full bg-[#121829] hover:bg-[#1A2238] text-slate-300 font-bold text-xs py-2 px-3 rounded-xl border border-slate-800 flex items-center justify-center transition-colors ${sidebarCollapsed ? 'p-2' : 'gap-2'}`}
          title="View Student Portal"
        >
          {!sidebarCollapsed && <span>View Site</span>}
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button 
          onClick={() => {
            if (logout) logout();
            navigate('/login');
          }}
          className={`w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs py-2 px-3 rounded-xl border border-rose-500/20 flex items-center justify-center transition-colors ${sidebarCollapsed ? 'p-2' : 'gap-2'}`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
          {!sidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>

    </aside>
  );
};
