import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BarChart2, GraduationCap, Building2, Users, Shield, BookOpen,
  Layers, ChevronDown, ChevronRight, CheckCircle2, PlusCircle, AlertTriangle, Clock,
  Settings, UserCheck, Key, HardDrive, Activity, HelpCircle, Headphones,
  Megaphone, Bell, MessageSquare, MessageCircle, ExternalLink
} from 'lucide-react';

export const SuperAdminSidebar = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeTenant, setupType } = useApp();

  const [expandedMenus, setExpandedMenus] = useState({
    announcements: true,
    notifications: false,
    messages: false
  });

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const isCorporate = activeTenant?.type === 'CORPORATE' || setupType === 'CORPORATE' || localStorage.getItem('lms_setup_type') === 'CORPORATE';

  const menuGroups = isCorporate ? [
    {
      groupTitle: 'ENTERPRISE WORKFORCE L&D',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard Overview',
          icon: BarChart2,
          path: '/superadmin',
          exact: true
        },
        {
          id: 'institutes',
          title: 'Company Profile',
          icon: Building2,
          path: '/superadmin/institutes',
        },
        {
          id: 'departments',
          title: 'Business Units & Teams',
          icon: Layers,
          path: '/superadmin/departments',
        },
        {
          id: 'courses',
          title: 'Training Tracks & Upskilling',
          icon: BookOpen,
          path: '/superadmin/courses',
        }
      ]
    },
    {
      groupTitle: 'WORKFORCE & TRAINERS',
      items: [
        {
          id: 'instructors',
          title: 'Trainers & Mentors',
          icon: UserCheck,
          path: '/superadmin/instructors',
        },
        {
          id: 'students',
          title: 'Employees & Trainees',
          icon: Users,
          path: '/superadmin/students',
        },
        {
          id: 'admins',
          title: 'HR & Enterprise Admins',
          icon: Shield,
          path: '/superadmin/admins',
        },
        {
          id: 'roles',
          title: 'Roles & Security',
          icon: Key,
          path: '/superadmin/roles-permissions',
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
          path: '/superadmin/announcements',
          hasSubItems: true,
          subItems: [
            { title: 'All Announcements', path: '/superadmin/announcements' },
            { title: 'Add Announcement', path: '/superadmin/announcements/create' },
            { title: 'Categories', path: '/superadmin/announcements/categories' }
          ]
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: Bell,
          path: '/superadmin/notifications',
          hasSubItems: true,
          subItems: [
            { title: 'All Notifications', path: '/superadmin/notifications' },
            { title: 'Email Templates', path: '/superadmin/notifications/email-templates' },
            { title: 'SMS Templates', path: '/superadmin/notifications/sms-templates' },
            { title: 'Push Notifications', path: '/superadmin/notifications/push' }
          ]
        },
        {
          id: 'messages',
          title: 'Messages',
          icon: MessageSquare,
          path: '/superadmin/messages',
          hasSubItems: true,
          subItems: [
            { title: 'All Messages', path: '/superadmin/messages' },
            { title: 'Send Message', path: '/superadmin/messages/compose' },
            { title: 'Message Templates', path: '/superadmin/messages/templates' }
          ]
        },
        {
          id: 'feedback',
          title: 'Feedback',
          icon: MessageCircle,
          path: '/superadmin/feedback'
        }
      ]
    }
  ] : [
    {
      groupTitle: 'ACADEMIC MANAGEMENT',
      items: [
        {
          id: 'dashboard',
          title: 'Dashboard Overview',
          icon: BarChart2,
          path: '/superadmin',
          exact: true
        },
        {
          id: 'institutes',
          title: 'Institute Profile',
          icon: GraduationCap,
          path: '/superadmin/institutes',
        },
        {
          id: 'departments',
          title: 'Departments & Programs',
          icon: Building2,
          path: '/superadmin/departments',
        },
        {
          id: 'courses',
          title: 'Courses & Curriculum',
          icon: BookOpen,
          path: '/superadmin/courses',
        }
      ]
    },
    {
      groupTitle: 'INSTRUCTORS & STUDENTS',
      items: [
        {
          id: 'instructors',
          title: 'Instructors & Mentors',
          icon: UserCheck,
          path: '/superadmin/instructors',
        },
        {
          id: 'students',
          title: 'Students & Learners',
          icon: Users,
          path: '/superadmin/students',
        },
        {
          id: 'admins',
          title: 'Admins',
          icon: Shield,
          path: '/superadmin/admins',
        },
        {
          id: 'roles',
          title: 'Roles & Permissions',
          icon: Key,
          path: '/superadmin/roles-permissions',
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
          path: '/superadmin/announcements',
          hasSubItems: true,
          subItems: [
            { title: 'All Announcements', path: '/superadmin/announcements' },
            { title: 'Add Announcement', path: '/superadmin/announcements/create' },
            { title: 'Categories', path: '/superadmin/announcements/categories' }
          ]
        },
        {
          id: 'notifications',
          title: 'Notifications',
          icon: Bell,
          path: '/superadmin/notifications',
          hasSubItems: true,
          subItems: [
            { title: 'All Notifications', path: '/superadmin/notifications' },
            { title: 'Email Templates', path: '/superadmin/notifications/email-templates' },
            { title: 'SMS Templates', path: '/superadmin/notifications/sms-templates' },
            { title: 'Push Notifications', path: '/superadmin/notifications/push' }
          ]
        },
        {
          id: 'messages',
          title: 'Messages',
          icon: MessageSquare,
          path: '/superadmin/messages',
          hasSubItems: true,
          subItems: [
            { title: 'All Messages', path: '/superadmin/messages' },
            { title: 'Send Message', path: '/superadmin/messages/compose' },
            { title: 'Message Templates', path: '/superadmin/messages/templates' }
          ]
        },
        {
          id: 'feedback',
          title: 'Feedback',
          icon: MessageCircle,
          path: '/superadmin/feedback'
        }
      ]
    }
  ];

  const BrandIcon = isCorporate ? Building2 : GraduationCap;
  const brandTitle = isCorporate ? 'CORPORATE SUPER ADMIN' : 'INSTITUTE SUPER ADMIN';

  return (
    <aside className={`bg-white text-slate-700 h-screen sticky top-0 flex flex-col justify-between border-r border-slate-200 transition-all duration-300 z-30 shrink-0 shadow-sm select-none font-['Plus_Jakarta_Sans',sans-serif] ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>

      {}
      <div className="p-3.5 space-y-4 overflow-y-auto flex-1 no-scrollbar">

        {}
        <div
          onClick={() => navigate('/superadmin')}
          className="flex items-center gap-3 px-2 py-1.5 cursor-pointer group bg-slate-50 hover:bg-indigo-50/60 rounded-2xl border border-slate-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <BrandIcon className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-sm text-slate-900 tracking-tight truncate">
                {activeTenant?.name || 'SMART LMS'}
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 block">
                {brandTitle}
              </span>
            </div>
          )}
        </div>

        {}
        <nav className="space-y-4 pt-1">
          {menuGroups.map((group, gIdx) => {
            return (
              <div key={gIdx} className="space-y-1">
                {!sidebarCollapsed && (
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1">
                    {group.groupTitle}
                  </p>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const hasSubItems = Boolean(item.hasSubItems && item.subItems);
                  const isExpanded = expandedMenus[item.id];
                  const isParentActive = location.pathname.startsWith(item.path);

                  if (hasSubItems && !sidebarCollapsed) {
                    return (
                      <div key={item.id} className="space-y-1">
                        <div
                          onClick={() => toggleMenu(item.id)}
                          className={`
                            flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none
                            ${isParentActive
                              ? 'bg-indigo-50/80 text-indigo-700'
                              : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-4 h-4 ${isParentActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                            <span className="truncate">{item.title}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>

                        {}
                        {isExpanded && (
                          <div className="pl-7 pr-2 py-1 space-y-1 border-l-2 border-slate-100 ml-4">
                            {item.subItems.map((sub, sIdx) => {
                              const isSubActive = location.pathname === sub.path;
                              return (
                                <NavLink
                                  key={sIdx}
                                  to={sub.path}
                                  className={`
                                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                    ${isSubActive
                                      ? 'text-indigo-600 font-extrabold bg-indigo-50/50'
                                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                                  `}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isSubActive ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                                  <span>{sub.title}</span>
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isItemActive = item.exact
                    ? (location.pathname === item.path || location.pathname === item.path + '/')
                    : location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) => `
                        flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all
                        ${(isActive || isItemActive)
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                          : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${(location.pathname === item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
                        {!sidebarCollapsed && <span className="truncate">{item.title}</span>}
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

      </div>

    </aside>
  );
};
