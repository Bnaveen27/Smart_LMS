import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { roleService } from '../../services';
import { 
  Users, UserPlus, Search, Filter, Shield, GraduationCap, 
  BookOpen, Building2, UserCheck, Trash2, Edit2, CheckCircle2, XCircle, Mail,
  KeyRound, Save, Sliders, Settings, Briefcase, Award, ClipboardCheck, Layers,
  RefreshCw, Check, AlertCircle, Sparkles
} from 'lucide-react';

export const UsersTab = () => {
  const location = useLocation();
  const { users, addUser, deleteUser, toggleUserStatus, tenants, activeTenant, setupType } = useApp();
  
  const isCorporate = activeTenant?.type === 'CORPORATE' || setupType === 'CORPORATE' || localStorage.getItem('lms_setup_type') === 'CORPORATE';

  const isRolesRoute = location.pathname.includes('roles-permissions');
  const isInstructorsRoute = location.pathname.includes('instructors');
  const isLearnersRoute = location.pathname.includes('learners') || location.pathname.includes('students');
  const isAdminsRoute = location.pathname.includes('admins');

  const [activeSubTab, setActiveSubTab] = useState(isRolesRoute ? 'roles-permissions' : 'users');
  const [searchTerm, setSearchTerm] = useState('');
  
  const getInitialRoleFilter = () => {
    if (isInstructorsRoute) return isCorporate ? 'TRAINER' : 'INSTRUCTOR';
    if (isLearnersRoute) return isCorporate ? 'EMPLOYEE' : 'LEARNER';
    if (isAdminsRoute) return isCorporate ? 'CORPORATE_ADMIN' : 'ADMINS';
    return 'ALL';
  };

  const [roleFilter, setRoleFilter] = useState(getInitialRoleFilter);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('roles-permissions')) {
      setActiveSubTab('roles-permissions');
    } else {
      setActiveSubTab('users');
      if (location.pathname.includes('instructors')) setRoleFilter(isCorporate ? 'TRAINER' : 'INSTRUCTOR');
      else if (location.pathname.includes('learners') || location.pathname.includes('students')) setRoleFilter(isCorporate ? 'EMPLOYEE' : 'LEARNER');
      else if (location.pathname.includes('admins')) setRoleFilter('ADMINS');
      else setRoleFilter('ALL');
    }
  }, [location.pathname, isCorporate]);

  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: isInstructorsRoute ? (isCorporate ? 'TRAINER' : 'INSTRUCTOR') : isLearnersRoute ? (isCorporate ? 'EMPLOYEE' : 'LEARNER') : (isCorporate ? 'EMPLOYEE' : 'LEARNER'),
    tenant_id: activeTenant?.id || tenants[0]?.id || '',
    department: '',
    job_title: '',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
  });

  const [dbRoles, setDbRoles] = useState([]);
  const [dbPermissions, setDbPermissions] = useState([]);
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(isCorporate ? 'CORPORATE_ADMIN' : 'INSTITUTE_ADMIN');
  const [rolePermissions, setRolePermissions] = useState({});
  const [isLoadingRBAC, setIsLoadingRBAC] = useState(false);
  const [isSavingPerms, setIsSavingPerms] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [saveErrorMsg, setSaveErrorMsg] = useState('');

  const fetchRBACData = async () => {
    try {
      setIsLoadingRBAC(true);
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getAllRoles().catch(() => ({ data: [] })),
        roleService.getAllPermissions().catch(() => ({ data: [] }))
      ]);

      const fetchedRoles = rolesRes.data || [];
      const fetchedPerms = permsRes.data || [];

      setDbRoles(fetchedRoles);
      setDbPermissions(fetchedPerms);

      const matrixMap = {};
      fetchedRoles.forEach(r => {
        const activeCodes = new Set((r.Permissions || []).map(p => p.code));
        matrixMap[r.code] = {};
        fetchedPerms.forEach(p => {
          matrixMap[r.code][p.code] = activeCodes.has(p.code);
        });
      });

      setRolePermissions(matrixMap);

      const validRoles = isCorporate
        ? ['SUPER_ADMIN', 'CORPORATE_ADMIN', 'HR_ADMIN', 'TRAINER', 'EMPLOYEE']
        : ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'INSTRUCTOR', 'LEARNER'];

      if (!validRoles.includes(selectedRoleForPerms)) {
        setSelectedRoleForPerms(isCorporate ? 'CORPORATE_ADMIN' : 'INSTITUTE_ADMIN');
      }
    } catch (err) {
      console.error('Error fetching RBAC from DB:', err);
    } finally {
      setIsLoadingRBAC(false);
    }
  };

  useEffect(() => {
    fetchRBACData();
  }, [isCorporate]);

  const togglePermission = (roleCode, permCode) => {
    setRolePermissions(prev => ({
      ...prev,
      [roleCode]: {
        ...prev[roleCode],
        [permCode]: !prev[roleCode]?.[permCode]
      }
    }));
  };

  const handleSavePermissions = async () => {
    try {
      setIsSavingPerms(true);
      setSaveSuccessMsg('');
      setSaveErrorMsg('');

      const activePermCodes = Object.entries(rolePermissions[selectedRoleForPerms] || {})
        .filter(([_, isEnabled]) => Boolean(isEnabled))
        .map(([code]) => code);

      const res = await roleService.updateRolePermissions(selectedRoleForPerms, activePermCodes);

      if (res.success) {
        setSaveSuccessMsg(`Permissions for "${selectedRoleForPerms}" saved successfully!`);
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      } else {
        setSaveErrorMsg(res.message || 'Failed to update permissions');
      }
    } catch (err) {
      console.error('Error saving role permissions:', err);
      setSaveErrorMsg(err.message || 'Failed to save changes');
    } finally {
      setIsSavingPerms(false);
    }
  };

  const roleBadges = {
    SUPER_ADMIN: { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Shield },
    INSTITUTE_ADMIN: { label: 'Dean / Academic Admin', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: GraduationCap },
    INSTRUCTOR: { label: 'Instructor / Faculty', color: 'bg-sky-100 text-sky-800 border-sky-200', icon: BookOpen },
    LEARNER: { label: 'Academic Learner', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Users },
    CORPORATE_ADMIN: { label: 'Corporate Admin', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Building2 },
    HR_ADMIN: { label: 'HR / L&D Admin', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: Briefcase },
    TRAINER: { label: 'Corporate Trainer', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: UserCheck },
    EMPLOYEE: { label: 'Corporate Employee', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: Users }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [invitationSuccessData, setInvitationSuccessData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.email || !newUserForm.email.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const isAdmin = ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'HR_ADMIN'].includes(newUserForm.role);
    const trimmedEmail = newUserForm.email.trim().toLowerCase();
    const defaultName = trimmedEmail.split('@')[0];

    const created = {
      name: defaultName,
      email: trimmedEmail,
      role: newUserForm.role,
      tenant_id: activeTenant?.id || tenants[0]?.id || null,
      department: newUserForm.department || (isCorporate ? 'Engineering' : 'Computer Science'),
      job_title: newUserForm.job_title || (
        newUserForm.role === 'EMPLOYEE' ? 'Associate Software Engineer' :
        newUserForm.role === 'LEARNER' ? 'Enrolled Student' :
        newUserForm.role === 'TRAINER' ? 'Senior Technical Trainer' :
        newUserForm.role === 'INSTRUCTOR' ? 'Assistant Professor' :
        isAdmin ? 'Administrator' : 'Member'
      ),
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    };

    const res = await addUser(created);
    setIsSubmitting(false);

    if (res && res.success === false) {
      setErrorMessage(res.error || 'Failed to save member in database');
      return;
    }

    const isInstructorRole = ['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(created.role);
    const fallbackPath = isInstructorRole ? '/instructor/onboarding' : '/activate-account';
    const inviteLink = res?.inviteLink || res?.user?.inviteLink || res?.data?.inviteLink || `${window.location.origin}${fallbackPath}?token=mock_demo_${Date.now()}`;

    setInvitationSuccessData({
      name: created.name,
      email: created.email,
      role: created.role,
      inviteLink
    });

    setShowAddUserModal(false);
    setNewUserForm({
      name: '',
      email: '',
      role: isInstructorsRoute ? (isCorporate ? 'TRAINER' : 'INSTRUCTOR') : isLearnersRoute ? (isCorporate ? 'EMPLOYEE' : 'LEARNER') : (isCorporate ? 'EMPLOYEE' : 'LEARNER'),
      tenant_id: activeTenant?.id || tenants[0]?.id || '',
      department: '',
      job_title: '',
      avatar_url: ''
    });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesRole = true;
    if (roleFilter === 'ADMINS') {
      matchesRole = ['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'HR_ADMIN', 'DEAN'].includes(u.role);
    } else if (roleFilter !== 'ALL') {
      matchesRole = u.role === roleFilter;
    }

    return matchesSearch && matchesRole;
  });

  const domainFilteredPermissions = dbPermissions.filter(p => {
    if (isCorporate) {
      return p.module !== 'institute' && p.module !== 'enrollments';
    } else {
      return p.module !== 'corporate';
    }
  });

  const permissionsByModule = domainFilteredPermissions.reduce((acc, p) => {
    const mod = p.module || 'general';
    if (!acc[mod]) acc[mod] = [];
    acc[mod].push(p);
    return acc;
  }, {});

  const academicRolesList = [
    { code: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield },
    { code: 'INSTITUTE_ADMIN', label: 'Dean / Academic Admin', icon: GraduationCap },
    { code: 'INSTRUCTOR', label: 'Instructor', icon: BookOpen },
    { code: 'LEARNER', label: 'Learner', icon: Users }
  ];

  const corporateRolesList = [
    { code: 'SUPER_ADMIN', label: 'Super Admin', icon: Shield },
    { code: 'CORPORATE_ADMIN', label: 'Corporate Admin', icon: Building2 },
    { code: 'HR_ADMIN', label: 'HR / L&D Admin', icon: Briefcase },
    { code: 'TRAINER', label: 'Corporate Trainer', icon: UserCheck },
    { code: 'EMPLOYEE', label: 'Employee', icon: Users }
  ];

  const currentRolesList = isCorporate ? corporateRolesList : academicRolesList;

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isInstructorsRoute ? (isCorporate ? 'Corporate Trainers & Mentors' : 'Instructors & Mentors') : 
               isLearnersRoute ? (isCorporate ? 'Employees & Workforce Directory' : 'Learners & Admissions') :
               isAdminsRoute ? (isCorporate ? 'HR & Enterprise Administrators' : 'Deans & Administrators') :
               isRolesRoute ? 'Roles & Permissions (RBAC)' : (isCorporate ? 'Workforce Directory & Access' : 'Institute Users & Access')}
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
              {filteredUsers.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCorporate 
              ? `Manage enterprise employees, L&D trainers, and corporate administrators for ${activeTenant?.name || 'this organization'}.`
              : `Manage instructors, learners, and academic administrators for ${activeTenant?.name || 'this educational institution'}.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'users' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Members Roster
            </button>
            <button
              onClick={() => setActiveSubTab('roles-permissions')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeSubTab === 'roles-permissions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Role Permissions Matrix
            </button>
          </div>

          {activeSubTab === 'users' && (
            <button 
              onClick={() => setShowAddUserModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              {isCorporate 
                ? (isInstructorsRoute ? 'Add Trainer' : isLearnersRoute ? 'Add Employee' : 'Add Member') 
                : (isInstructorsRoute ? 'Add Instructor' : isLearnersRoute ? 'Add Learner' : 'Add Member')}
            </button>
          )}
        </div>
      </div>

      {}
      {}
      {}
      {activeSubTab === 'users' && (
        <div className="space-y-4">
          
          {}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search by name, email or department..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Role:</span>
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMINS">All Administrators</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  {isCorporate ? (
                    <>
                      <option value="CORPORATE_ADMIN">Corporate Admin</option>
                      <option value="HR_ADMIN">HR / Training Admin</option>
                      <option value="TRAINER">Corporate Trainer</option>
                      <option value="EMPLOYEE">Employee</option>
                    </>
                  ) : (
                    <>
                      <option value="INSTITUTE_ADMIN">Institute Dean / Admin</option>
                      <option value="INSTRUCTOR">Instructor</option>
                      <option value="LEARNER">Learner</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <th className="py-4 px-6">Member Name</th>
                    <th className="py-4 px-6">Role & Status</th>
                    <th className="py-4 px-6">Department / Unit</th>
                    <th className="py-4 px-6">Designation / Title</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-500">No members found matching your search</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const badge = roleBadges[u.role] || roleBadges.LEARNER;
                      const RoleIcon = badge.icon;

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                          
                          {}
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <img 
                                src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                                alt={u.name} 
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 shadow-sm" 
                              />
                              <div>
                                <p className="font-extrabold text-slate-900 leading-tight">{u.name}</p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{u.email}</p>
                              </div>
                            </div>
                          </td>

                          {}
                          <td className="py-3.5 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.color}`}>
                              <RoleIcon className="w-3 h-3" />
                              {badge.label}
                            </span>
                          </td>

                          {}
                          <td className="py-3.5 px-6 font-semibold text-slate-700">
                            {['SUPER_ADMIN'].includes(u.role) ? (
                              <span className="text-slate-400 font-mono text-[11px]">System-Wide</span>
                            ) : (
                              u.department || 'General'
                            )}
                          </td>

                          {}
                          <td className="py-3.5 px-6 text-slate-600">
                            <span className="font-medium text-slate-900 block">{u.job_title || (u.role === 'LEARNER' ? 'Learner' : u.role === 'EMPLOYEE' ? 'Employee' : 'Member')}</span>
                          </td>

                          {}
                          <td className="py-3.5 px-6">
                            <button 
                              onClick={() => toggleUserStatus(u.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                u.status === 'INACTIVE' 
                                  ? 'bg-rose-50 text-rose-700 border-rose-200' 
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                              title="Click to toggle status"
                            >
                              {u.status === 'INACTIVE' ? <XCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              {u.status || 'ACTIVE'}
                            </button>
                          </td>

                          {}
                          <td className="py-3.5 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {u.role === 'SUPER_ADMIN' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200" title="Primary System Administrator cannot be deleted">
                                  <Shield className="w-3 h-3 text-purple-600" />
                                  Root Admin
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to remove "${u.name}"?`)) {
                                      deleteUser(u.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                  title="Delete Member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {}
      {}
      {}
      {activeSubTab === 'roles-permissions' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-6">
          
          {}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold text-lg text-slate-900">
                  {isCorporate ? 'Corporate Enterprise Role-Based Access Control (RBAC)' : 'Institute Role-Based Access Control (RBAC)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure module privileges and action grants across your organization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {saveSuccessMsg && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {saveSuccessMsg}
                </span>
              )}
              {saveErrorMsg && (
                <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" /> {saveErrorMsg}
                </span>
              )}
              <button
                onClick={handleSavePermissions}
                disabled={isSavingPerms}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSavingPerms ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Permission Matrix
                  </>
                )}
              </button>
            </div>
          </div>

          {}
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto">
              {currentRolesList.map(r => {
                const Icon = r.icon;
                const isSelected = selectedRoleForPerms === r.code;
                return (
                  <button
                    key={r.code}
                    onClick={() => setSelectedRoleForPerms(r.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-500 shadow-sm' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {r.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={fetchRBACData}
              title="Refresh Roles"
              className="text-xs text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition shrink-0 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRBAC ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                Configuring Access Grants For: <span className="text-indigo-600 font-black text-sm">{selectedRoleForPerms}</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">
                Click any permission tile to grant or revoke access
              </span>
            </div>

            {}
            {Object.keys(permissionsByModule).length > 0 ? (
              <div className="space-y-6">
                {Object.entries(permissionsByModule).map(([moduleName, perms]) => (
                  <div key={moduleName} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                        {moduleName} Module ({perms.length} Actions)
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {perms.map(p => {
                        const isGranted = Boolean(rolePermissions[selectedRoleForPerms]?.[p.code]);
                        return (
                          <div 
                            key={p.code}
                            onClick={() => togglePermission(selectedRoleForPerms, p.code)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between select-none ${
                              isGranted
                                ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-sm hover:border-indigo-300'
                                : 'bg-slate-50/60 border-slate-200/80 text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-0.5 min-w-0 pr-2">
                              <p className={`text-xs font-bold truncate ${isGranted ? 'text-slate-900' : 'text-slate-500'}`}>
                                {p.description || p.code}
                              </p>
                              <p className="text-[10px] font-mono text-slate-400 truncate">
                                {p.code}
                              </p>
                            </div>

                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isGranted ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-400'
                            }`}>
                              {isGranted ? '✓' : '✕'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              
              <div className="py-10 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
                <p className="text-xs font-semibold">Loading permissions...</p>
              </div>
            )}

          </div>

        </div>
      )}

      {}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {isCorporate ? 'Add Corporate Member' : 'Add Academic Member'}
                  </h3>
                  <p className="text-xs text-slate-500">Create new credentials and assign role</p>
                </div>
              </div>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input 
                    type="email" 
                    required
                    placeholder={isCorporate ? 'e.g. employee@acmecorp.com' : 'e.g. member@apextech.edu'}
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Assign Role *</label>
                <select 
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-bold cursor-pointer"
                >
                  {isCorporate ? (
                    <>
                      <option value="EMPLOYEE">Corporate Employee / Trainee</option>
                      <option value="TRAINER">Corporate Trainer / L&D Faculty</option>
                      <option value="HR_ADMIN">HR / Training Manager</option>
                      <option value="CORPORATE_ADMIN">Corporate Enterprise Admin</option>
                      <option value="SUPER_ADMIN">Super Administrator</option>
                    </>
                  ) : (
                    <>
                      <option value="LEARNER">Academic Learner / Student</option>
                      <option value="INSTRUCTOR">Course Instructor / Faculty</option>
                      <option value="INSTITUTE_ADMIN">Dean / Academic Administrator</option>
                      <option value="SUPER_ADMIN">Super Administrator</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Department / Business Unit</label>
                <input 
                  type="text" 
                  placeholder={isCorporate ? 'e.g. Engineering, AI Labs, Cloud Infrastructure' : 'e.g. Computer Science, AI & Robotics, Physics'}
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed">
                ℹ️ <strong>Passwordless Invitation:</strong> An official account activation link will be automatically sent to the email address above. The member will set their own full name, password, and profile during activation.
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>Sending Invitation...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>Send Activation Invite</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {}
      {invitationSuccessData && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Activation Link Sent!</h3>
                  <p className="text-xs text-slate-500">Member account successfully created</p>
                </div>
              </div>
              <button onClick={() => setInvitationSuccessData(null)} className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer">✕</button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Invited Member:</span>
                <strong className="text-slate-800">{invitationSuccessData.name}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Email Address:</span>
                <strong className="text-indigo-600 font-mono">{invitationSuccessData.email}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Assigned Role:</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-[10px]">
                  {invitationSuccessData.role}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              An invitation email has been dispatched with a secure link allowing <strong>{invitationSuccessData.name}</strong> to create their own password. You can also copy the activation link directly below:
            </p>

            <div className="bg-slate-100 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={invitationSuccessData.inviteLink}
                className="bg-transparent text-slate-700 text-xs font-mono select-all focus:outline-none flex-1 truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(invitationSuccessData.inviteLink);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copiedLink ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 flex gap-3">
              <a
                href={invitationSuccessData.inviteLink}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition"
              >
                <span>Test Activation Link &rarr;</span>
              </a>
              <button
                onClick={() => setInvitationSuccessData(null)}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs cursor-pointer transition shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default UsersTab;
