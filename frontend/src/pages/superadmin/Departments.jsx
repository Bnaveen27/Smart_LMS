import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';
import { 
  Building2, Plus, Search, Users, BookOpen, GraduationCap, 
  Trash2, Edit2, CheckCircle2, ShieldCheck, Layers, Award
} from 'lucide-react';

export const DepartmentsTab = () => {
  const { users, courses, activeTenant, setupType } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const isCorporate = activeTenant?.type === 'CORPORATE' || setupType === 'CORPORATE' || localStorage.getItem('lms_setup_type') === 'CORPORATE';

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const tenantId = activeTenant?.id ? `?tenant_id=${activeTenant.id}` : '';
      const res = await fetch(`${API_URL}/api/departments${tenantId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setDepartments(json.data);
        } else if (Array.isArray(json)) {
          setDepartments(json);
        }
      }
    } catch (e) {
      console.warn('Error fetching departments from DB:', e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDepartments();
  }, [activeTenant?.id]);

  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    description: '',
    hod: '',
    established: new Date().getFullYear().toString(),
    programs: ''
  });

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) return;

    try {
      const res = await fetch(`${API_URL}/api/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: activeTenant?.id || null,
          name: newDept.name,
          code: newDept.code.toUpperCase(),
          description: newDept.description || ''
        })
      });

      if (res.ok) {
        await fetchDepartments();
        setShowAddModal(false);
        setNewDept({ name: '', code: '', description: '', hod: '', established: new Date().getFullYear().toString(), programs: '' });
      }
    } catch (err) {
      console.warn('Error creating department in DB:', err.message);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${isCorporate ? 'business unit' : 'department'}?`)) {
      setDepartments(prev => prev.filter(d => d.id !== id));
      try {
        await fetch(`${API_URL}/api/departments/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.warn('Error deleting department from DB:', err.message);
      }
    }
  };

  const filteredDepts = departments.filter(d => 
    (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isCorporate ? 'Business Units & Teams' : 'Academic Departments & Programs'}
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
              {departments.length} {isCorporate ? 'Units' : 'Departments'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCorporate 
              ? `Manage corporate divisions, project teams, department leads, and workforce training allocations for ${activeTenant?.name || 'Enterprise'}.`
              : 'Manage educational faculties, academic departments, degree curriculums, and Head of Department (HOD) assignments.'}
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          {isCorporate ? 'Add Business Unit' : 'Add Department'}
        </button>
      </div>

      {}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder={isCorporate ? 'Search unit, code, or team lead...' : 'Search department, code, or HOD...'} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Organization: <span className="text-indigo-600 font-bold">{activeTenant?.name || 'Enterprise'}</span>
        </div>
      </div>

      {}
      {filteredDepts.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            {isCorporate ? <Layers className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">
            {isCorporate ? 'No Business Units Found' : 'No Departments Found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm 
              ? `No unit matching "${searchTerm}"` 
              : isCorporate 
                ? 'No business units or teams registered yet in your organization database.' 
                : 'No departments registered yet in your database.'}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isCorporate ? 'Add First Business Unit' : 'Add First Department'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDepts.map((dept) => {
            const instructorCount = users.filter(u => (u.department === dept.name || u.department === dept.code) && ['INSTRUCTOR', 'TRAINER'].includes(u.role)).length;
            const learnerCount = users.filter(u => (u.department === dept.name || u.department === dept.code) && ['LEARNER', 'STUDENT', 'EMPLOYEE'].includes(u.role)).length;
            const studentCount = learnerCount;
            const programsList = Array.isArray(dept.programs) 
              ? dept.programs.map(p => typeof p === 'object' ? p.name : p) 
              : dept.description ? [dept.description] : [isCorporate ? 'General Skill Track' : 'General Academic Track'];

            return (
              <div 
                key={dept.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                      {dept.code || 'UNIT'}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{dept.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        {isCorporate ? <Layers className="w-3.5 h-3.5 text-indigo-500" /> : <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />}
                        Status: <span className="font-semibold text-emerald-600">{dept.status || 'ACTIVE'}</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteDepartment(dept.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title={isCorporate ? 'Delete Business Unit' : 'Delete Department'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {isCorporate ? 'Teams & Skill Modules' : 'Programs & Curriculum'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {programsList.map((prog, pIdx) => (
                      <span 
                        key={pIdx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                {}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{instructorCount} {isCorporate ? 'Trainers' : 'Instructors'}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      {isCorporate ? <Layers className="w-3.5 h-3.5 text-emerald-500" /> : <GraduationCap className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{learnerCount} {isCorporate ? 'Employees' : 'Learners'}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {dept.createdAt ? new Date(dept.createdAt).getFullYear() : '2026'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  {isCorporate ? <Layers className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {isCorporate ? 'Add Business Unit / Division' : 'Add Academic Department'}
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isCorporate ? 'Business Unit / Department Name *' : 'Department Name *'}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={isCorporate ? 'e.g. Cloud & DevOps Engineering' : 'e.g. Computer Science & Engineering'}
                  value={newDept.name}
                  onChange={(e) => setNewDept({...newDept, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isCorporate ? 'Unit Code *' : 'Dept Code *'}
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder={isCorporate ? 'e.g. CLOUD' : 'e.g. CSE'}
                    value={newDept.code}
                    onChange={(e) => setNewDept({...newDept, code: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Established Year</label>
                  <input 
                    type="number" 
                    placeholder="2024"
                    value={newDept.established}
                    onChange={(e) => setNewDept({...newDept, established: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isCorporate ? 'Department Lead / Manager' : 'Head of Department (HOD)'}
                </label>
                <input 
                  type="text" 
                  placeholder={isCorporate ? 'e.g. Rajesh Kumar (Senior Director)' : 'e.g. Dr. Rajesh Kumar, Ph.D.'}
                  value={newDept.hod}
                  onChange={(e) => setNewDept({...newDept, hod: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isCorporate ? 'Teams / Project Areas (comma separated)' : 'Programs Offered (comma separated)'}
                </label>
                <input 
                  type="text" 
                  placeholder={isCorporate ? 'e.g. Microservices, Multi-Cloud, Kubernetes, CI/CD' : 'e.g. B.Tech CSE, M.Tech Data Science'}
                  value={newDept.programs}
                  onChange={(e) => setNewDept({...newDept, programs: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/25 transition-all"
                >
                  {isCorporate ? 'Save Business Unit' : 'Save Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
