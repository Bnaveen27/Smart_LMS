import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Building2, ShieldCheck, PlayCircle, Clock, CheckCircle, Award } from 'lucide-react';

export const EmployeePortal = () => {
  const { corporateAssignments, currentUser, activeTenant, setSelectedCourseForPlayer, courses } = useApp();

  const myAssignments = corporateAssignments.filter(a => a.assigned_to_user_id === currentUser.id || a.employee_name === currentUser.name);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" /> Enterprise Employee Training Portal • {activeTenant.name}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-slate-400 max-w-xl text-sm mt-1">
              Department: <span className="text-sky-300 font-semibold">{currentUser.department || 'Engineering'}</span> • Role: <span className="text-slate-200">{currentUser.job_title || 'Employee'}</span>
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-400" /> Mandatory & Skill Training Paths ({myAssignments.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myAssignments.map(assignment => {
            const courseObj = courses.find(c => c.id === assignment.course_id) || courses[0];
            return (
              <div key={assignment.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      {assignment.department}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-amber-400" /> Due: {assignment.due_date}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-lg">{assignment.course_title}</h4>
                  <p className="text-xs text-slate-400">Assigned by HR / Corporate Admin to ensure company security and skill compliance.</p>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Completion Status</span>
                      <span className="text-sky-400 font-mono">{assignment.progress_percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-400 h-full rounded-full" style={{ width: `${assignment.progress_percentage}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
                    assignment.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {assignment.status}
                  </span>

                  <button
                    onClick={() => setSelectedCourseForPlayer(courseObj)}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all"
                  >
                    <PlayCircle className="w-4 h-4" /> Start Training Video
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
