import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  Building2,
  ShieldCheck,
  Users,
  CheckCircle,
  Clock,
  Plus,
  AlertCircle,
  Award,
  FileCheck,
  Layers,
  ArrowRight,
  TrendingUp,
  Search
} from 'lucide-react';

export const CorporateHRDashboard = () => {
  const navigate = useNavigate();
  const { corporateAssignments, assignCorporateTraining, activeTenant, courses, users, currentUser } = useApp();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const tenantEmployees = users.filter(u => (!activeTenant?.id || !u.tenant_id || u.tenant_id === activeTenant.id) && (u.role === 'EMPLOYEE' || u.role === 'LEARNER'));

  const [form, setForm] = useState({
    employee_id: '',
    employee_name: '',
    department: '',
    course_id: courses[0]?.id || '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const tenantAssignments = corporateAssignments.filter(a => !activeTenant?.id || !a.tenant_id || a.tenant_id === activeTenant.id);
  const completedCount = tenantAssignments.filter(a => a.status === 'COMPLETED').length;
  const inProgressCount = tenantAssignments.filter(a => a.status === 'IN_PROGRESS').length;
  const overdueCount = tenantAssignments.filter(a => {
    const isOverdue = new Date(a.due_date) < new Date() && a.status !== 'COMPLETED';
    return isOverdue;
  }).length;

  const compliancePercentage = tenantAssignments.length > 0 ? Math.round((completedCount / tenantAssignments.length) * 100) : 0;

  const departmentBreakdown = useMemo(() => {
    const deptMap = {};
    tenantEmployees.forEach(emp => {
      const dept = emp.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, total: 0, completed: 0, employeesCount: 0 };
      }
      deptMap[dept].employeesCount += 1;
    });

    tenantAssignments.forEach(assign => {
      const dept = assign.department || 'General';
      if (!deptMap[dept]) {
        deptMap[dept] = { name: dept, total: 0, completed: 0, employeesCount: 0 };
      }
      deptMap[dept].total += 1;
      if (assign.status === 'COMPLETED') {
        deptMap[dept].completed += 1;
      }
    });

    return Object.values(deptMap);
  }, [tenantEmployees, tenantAssignments]);

  const filteredAssignments = tenantAssignments.filter(a => {
    const matchesSearch = (a.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.department?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && a.status === filterStatus;
  });

  const handleSelectEmployee = (empId) => {
    const emp = tenantEmployees.find(u => u.id === empId);
    if (emp) {
      setForm(prev => ({
        ...prev,
        employee_id: emp.id,
        employee_name: emp.name,
        department: emp.department || prev.department || 'General'
      }));
    } else {
      setForm(prev => ({ ...prev, employee_id: '', employee_name: '', department: '' }));
    }
  };

  const handleAssign = (e) => {
    e.preventDefault();
    const selectedCourse = courses.find(c => c.id === form.course_id) || courses[0];
    if (!selectedCourse) return;

    const newAssignment = {
      id: `corp-assign-${Date.now()}`,
      tenant_id: activeTenant?.id,
      assigned_by_user_id: currentUser?.id || 'hr-admin',
      assigned_to_user_id: form.employee_id || `emp-${Date.now()}`,
      employee_name: form.employee_name || 'Assigned Employee',
      department: form.department || 'General',
      course_id: selectedCourse.id,
      course_title: selectedCourse.title,
      due_date: form.due_date,
      status: 'NOT_STARTED',
      progress_percentage: 0,
      assigned_at: new Date().toISOString().split('T')[0]
    };
    assignCorporateTraining(newAssignment);
    setShowAssignModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> B2B Corporate HR & L&D Management
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {activeTenant?.name || 'Corporate'} HR & Compliance Portal
            </h1>
            <p className="text-slate-400 max-w-xl text-sm mt-1">
              Assign mandatory training paths, track real-time employee compliance, and monitor departmental completion audits.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/corporate/admin')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <Layers className="w-4 h-4 text-indigo-400" /> Admin Console
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all"
            >
              <Plus className="w-4 h-4" /> Assign Training
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-sky-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Compliance</span>
            <ShieldCheck className="w-5 h-5 text-sky-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{compliancePercentage}%</span>
            <span className="text-xs text-emerald-600 font-semibold">Passed Audit</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full transition-all duration-500" style={{ width: `${compliancePercentage}%` }} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{completedCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Certified Employee Completions</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{inProgressCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active Employee Learners</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Workforce Enrolled</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{tenantEmployees.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Total Managed Employees</p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Department Compliance Audit</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departmentBreakdown.map((dept, idx) => {
            const deptComp = dept.total > 0 ? Math.round((dept.completed / dept.total) * 100) : 0;
            return (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>{dept.name}</span>
                  <span className="text-sky-600 font-mono text-xs">{deptComp}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${deptComp}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>{dept.employeesCount} Employees</span>
                  <span>{dept.completed}/{dept.total} Completed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Employee Training Roster</h3>
            <p className="text-xs text-slate-500">Live tracker of mandatory & elective training programs assigned to employees.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search employee or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NOT_STARTED">Not Started</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Training Path</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-all">
                  <td className="py-3 px-4 font-bold text-slate-900">{a.employee_name}</td>
                  <td className="py-3 px-4 text-slate-600">{a.department}</td>
                  <td className="py-3 px-4 font-medium text-slate-800">{a.course_title}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{a.due_date}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full" style={{ width: `${a.progress_percentage}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">{a.progress_percentage}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      a.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      a.status === 'IN_PROGRESS' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Assign Mandatory Training</h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Employee</label>
                <select
                  value={form.employee_id}
                  onChange={(e) => handleSelectEmployee(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Choose existing employee or custom --</option>
                  {tenantEmployees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.department || 'General'})</option>
                  ))}
                </select>
              </div>

              {!form.employee_id && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={form.employee_name}
                    onChange={(e) => setForm({ ...form, employee_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Business Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sales & BD"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course / Training Module</label>
                <select
                  value={form.course_id}
                  onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Compliance Due Date</label>
                <input
                  type="date"
                  required
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm"
                >
                  Confirm & Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateHRDashboard;
