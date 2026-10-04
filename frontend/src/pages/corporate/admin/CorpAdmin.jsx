import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  Building2,
  Shield,
  Users,
  Layers,
  Award,
  Settings,
  Plus,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle2,
  Mail,
  Sliders,
  DollarSign
} from 'lucide-react';

export const CorporateAdminDashboard = () => {
  const navigate = useNavigate();
  const {
    activeTenant,
    users,
    courses,
    departments,
    addDepartment,
    corporateAssignments,
    updateTenantBranding
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitHead, setNewUnitHead] = useState('');

  const tenantDepartments = departments.filter(d => !activeTenant?.id || !d.tenant_id || d.tenant_id === activeTenant.id);
  const tenantEmployees = users.filter(u => (!activeTenant?.id || !u.tenant_id || u.tenant_id === activeTenant.id) && (u.role === 'EMPLOYEE' || u.role === 'LEARNER'));
  const trainersCount = users.filter(u => (!activeTenant?.id || !u.tenant_id || u.tenant_id === activeTenant.id) && (u.role === 'INSTRUCTOR' || u.role === 'TRAINER')).length;
  const totalCourses = courses.filter(c => !activeTenant?.id || !c.tenant_id || c.tenant_id === activeTenant.id).length;

  const handleAddUnit = async (e) => {
    e.preventDefault();
    if (!newUnitName) return;

    if (addDepartment) {
      await addDepartment({
        id: `dept-${Date.now()}`,
        name: newUnitName,
        head: newUnitHead || 'Unassigned',
        tenant_id: activeTenant?.id
      });
    }

    setNewUnitName('');
    setNewUnitHead('');
    setShowAddUnitModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> Corporate Enterprise Super Admin
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {activeTenant?.name || 'Corporate Enterprise'} Administration
            </h1>
            <p className="text-slate-400 max-w-xl text-sm mt-1">
              Enterprise management console for organization hierarchy, business units, employee seats, corporate domains, and training budgets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/corporate/hr')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <Users className="w-4 h-4 text-sky-400" /> HR Training Portal <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => navigate('/corporate/trainer')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Sliders className="w-4 h-4" /> Trainer Studio <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-indigo-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Units</span>
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{tenantDepartments.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Active Divisions & Teams in DB</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Workforce</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{tenantEmployees.length}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Enrolled Corporate Employees</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Internal Trainers</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{trainersCount}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Course Instructors & Coaches</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500 bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enterprise Catalog</span>
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{totalCourses}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Mandatory & Skill Courses</p>
        </div>
      </div>

      {}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Corporate Business Units & Divisions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage departmental divisions, unit heads, and training allocations fetched from database.</p>
          </div>
          <button
            onClick={() => setShowAddUnitModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Add Business Unit
          </button>
        </div>

        {tenantDepartments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">No Business Units Added in Database Yet</p>
            <p className="text-[11px] text-slate-400 mt-1">Click "Add Business Unit" to create your first corporate division.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tenantDepartments.map(unit => {
              const unitEmployees = tenantEmployees.filter(e => e.department === unit.name).length;
              const unitAssignments = corporateAssignments.filter(a => a.department === unit.name).length;

              return (
                <div key={unit.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50 hover:border-indigo-200 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{unit.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Team Lead: <span className="font-semibold text-slate-700">{unit.head || 'Unassigned'}</span></p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                      {unitEmployees} Members
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                    <span>Active Track: <strong className="text-slate-800">{unitAssignments} modules</strong></span>
                    <button
                      onClick={() => navigate('/corporate/hr')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                    >
                      Manage Training <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {}
      {showAddUnitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900">Add New Business Unit</h3>
            <form onSubmit={handleAddUnit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Business Unit / Division Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Data Analytics & AI Strategy"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Division Lead / Head</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newUnitHead}
                  onChange={(e) => setNewUnitHead(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUnitModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm"
                >
                  Save Business Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateAdminDashboard;
