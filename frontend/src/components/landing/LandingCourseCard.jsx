import React from 'react';
import { BookMarked, Clock, Star, ChevronRight } from 'lucide-react';

export const LandingCourseCard = ({ course, onPreview }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
      <div>
        {/* Thumbnail Container with Error Fallback */}
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <img
            src={course.thumbnail}
            alt={course.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-700 shadow-sm flex items-center gap-1">
            <BookMarked className="w-3 h-3 text-blue-600" />
            <span>{course.type}</span>
          </div>
          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/70 backdrop-blur-md text-white px-2 py-0.5 rounded text-[10px] font-normal flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-200" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-2.5">
          
          {/* Credits & Department */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {course.credits}
            </span>
            <span className="text-slate-500 truncate max-w-[180px]">
              {course.department}
            </span>
          </div>

          {/* Course Title */}
          <h4 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
          </h4>

          {/* Instructor Preview */}
          <div className="flex items-center gap-2 pt-1">
            <img
              src={course.instructorAvatar}
              alt={course.instructor}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
              }}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="text-xs truncate">
              <div className="font-medium text-slate-700">{course.instructor}</div>
              <div className="text-[10px] text-slate-400">{course.level}</div>
            </div>
          </div>

          {/* Curriculum Topics */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
            <span className="text-slate-700 font-medium">Topics:</span> {course.skills}
          </p>

        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 pt-0">
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-slate-700">{course.rating}</span>
            <span className="text-slate-400 text-[11px]">({course.reviews})</span>
          </div>
          
          <button
            onClick={() => onPreview(course)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>View Syllabus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
