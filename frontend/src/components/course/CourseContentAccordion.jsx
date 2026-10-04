import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  Eye
} from 'lucide-react';

export const formatSectionDuration = (totalMins) => {
  const mins = Number(totalMins) || 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}hr ${m}min`;
  if (h > 0) return `${h}hr`;
  return `${m}min`;
};

export const formatTotalCourseDuration = (totalMins) => {
  const mins = Number(totalMins) || 0;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m total length`;
  if (h > 0) return `${h}h total length`;
  return `${m}m total length`;
};

export default function CourseContentAccordion({
  modules = [],
  onSelectLesson,
  activeLessonId,
  isEnrolled = false,
  allowPreview = true
}) {
  
  const totalSections = modules.length;
  const totalLectures = modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0);
  const totalMins = modules.reduce((acc, mod) => {
    return acc + (mod.lessons?.reduce((lAcc, l) => lAcc + (Number(l.duration_mins) || 15), 0) || 0);
  }, 0);

  const [expandedSections, setExpandedSections] = useState(() => {
    
    const init = {};
    if (modules.length > 0) {
      init[modules[0].id || 'sec-0'] = true;
    }
    return init;
  });

  const allExpanded = modules.length > 0 && modules.every(m => expandedSections[m.id || 'sec-0']);

  const toggleAllSections = () => {
    if (allExpanded) {
      setExpandedSections({});
    } else {
      const all = {};
      modules.forEach((m, idx) => {
        all[m.id || `sec-${idx}`] = true;
      });
      setExpandedSections(all);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <div className="w-full bg-white font-['Plus_Jakarta_Sans',sans-serif] text-slate-800">
      {}
      <div className="mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Course content
        </h3>
        
        <div className="flex items-center justify-between mt-2 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <span>{totalSections} {totalSections === 1 ? 'section' : 'sections'}</span>
            <span>&bull;</span>
            <span>{totalLectures} {totalLectures === 1 ? 'lecture' : 'lectures'}</span>
            <span>&bull;</span>
            <span>{formatTotalCourseDuration(totalMins)}</span>
          </div>

          <button
            type="button"
            onClick={toggleAllSections}
            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer text-xs sm:text-sm hover:underline"
          >
            {allExpanded ? 'Collapse all sections' : 'Expand all sections'}
          </button>
        </div>
      </div>

      {}
      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 shadow-2xs">
        {modules.map((section, secIdx) => {
          const sectionId = section.id || `sec-${secIdx}`;
          const isOpen = Boolean(expandedSections[sectionId]);
          const sectionLessons = section.lessons || [];
          const sectionLectureCount = sectionLessons.length;
          const sectionMins = sectionLessons.reduce((acc, l) => acc + (Number(l.duration_mins) || 15), 0);

          const displayTitle = section.title || `Week ${secIdx + 1}`;

          return (
            <div key={sectionId} className="bg-white">
              {}
              <button
                type="button"
                onClick={() => toggleSection(sectionId)}
                className="w-full px-4 sm:px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 text-left cursor-pointer select-none group"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="text-slate-500 group-hover:text-slate-900 transition-colors shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                    )}
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {displayTitle}
                  </span>
                </div>

                <div className="text-right text-xs text-slate-500 font-medium shrink-0 flex items-center gap-1.5">
                  <span>{sectionLectureCount} {sectionLectureCount === 1 ? 'lecture' : 'lectures'}</span>
                  <span>&bull;</span>
                  <span>{formatSectionDuration(sectionMins)}</span>
                </div>
              </button>

              {}
              {isOpen && (
                <div className="divide-y divide-slate-100 bg-white">
                  {sectionLessons.length > 0 ? (
                    sectionLessons.map((lesson, lesIdx) => {
                      const isCurrentActive = activeLessonId === lesson.id;
                      const hasPreview = allowPreview && (lesson.preview || lesIdx === 0);

                      return (
                        <div
                          key={lesson.id || `les-${secIdx}-${lesIdx}`}
                          onClick={() => {
                            if (onSelectLesson && (isEnrolled || hasPreview)) {
                              onSelectLesson(lesson, section);
                            }
                          }}
                          className={`px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                            isCurrentActive 
                              ? 'bg-indigo-50/60 text-indigo-900 font-semibold' 
                              : (isEnrolled || hasPreview) 
                                ? 'hover:bg-slate-50/80 cursor-pointer text-slate-700' 
                                : 'text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="shrink-0 text-slate-400">
                              {lesson.type === 'reading' ? (
                                <FileText className="w-4 h-4 text-amber-500" />
                              ) : lesson.type === 'quiz' ? (
                                <HelpCircle className="w-4 h-4 text-emerald-500" />
                              ) : lesson.type === 'scorm' ? (
                                <Layers className="w-4 h-4 text-purple-500" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-indigo-600" />
                              )}
                            </div>

                            <span className="truncate text-xs sm:text-[13px] font-medium text-slate-800">
                              {lesson.title || `Lesson ${lesIdx + 1}`}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-[11px] sm:text-xs text-slate-400">
                            {hasPreview && !isEnrolled && (
                              <span className="text-indigo-600 font-bold underline flex items-center gap-1 hover:text-indigo-800">
                                <Eye className="w-3 h-3" /> Preview
                              </span>
                            )}
                            {!hasPreview && !isEnrolled && (
                              <Lock className="w-3 h-3 text-slate-300" />
                            )}
                            <span className="font-mono text-slate-500">
                              {lesson.duration_mins ? `${lesson.duration_mins} min` : '15 min'}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-6 py-4 text-center text-xs text-slate-400 italic">
                      No lectures added to this section yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
