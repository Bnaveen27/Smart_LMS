import React from 'react';

export const LandingStats = () => {
  return (
    <section className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              50,000+
            </div>
            <div className="text-xs text-slate-500 font-medium">Active Students</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600">
              120+
            </div>
            <div className="text-xs text-slate-500 font-medium">Syllabus Courses</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
              45+
            </div>
            <div className="text-xs text-slate-500 font-medium">Faculty Members</div>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold text-amber-600">
              99.4%
            </div>
            <div className="text-xs text-slate-500 font-medium">Verification Rate</div>
          </div>

        </div>
      </div>
    </section>
  );
};
