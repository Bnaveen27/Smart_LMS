import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Laptop } from 'lucide-react';
import { LandingCourseCard } from './LandingCourseCard';

export const LandingCurriculum = ({
  currentInstitute,
  dynamicDepartments = [],
  selectedDepartment,
  setSelectedDepartment,
  selectedLevel,
  setSelectedLevel,
  filteredCourses = [],
  onPreviewCourse
}) => {
  const navigate = useNavigate();

  return (
    <section id="courses" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
      
      
      <div className="space-y-3 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-blue-600 tracking-wide">
              ACADEMIC DISCIPLINES
            </span>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 tracking-tight mt-0.5">
              Explore Curriculum by Department
            </h3>
          </div>
        </div>

      
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {dynamicDepartments.map((dept) => {
            const isSelected = selectedDepartment === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span>{dept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Cards Grid or Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <BookOpen className="w-10 h-10 text-blue-500 mx-auto" />
          <h4 className="text-base font-semibold text-slate-800">No Courses Available Yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {currentInstitute?.name} has not published courses in this section yet. Please check back soon or sign in to your faculty portal to create new curriculum modules.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-medium hover:bg-blue-100 transition-colors inline-flex items-center gap-1.5"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Faculty Studio Login</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <LandingCourseCard
              key={course.id}
              course={course}
              onPreview={onPreviewCourse}
            />
          ))}
        </div>
      )}

    </section>
  );
};
