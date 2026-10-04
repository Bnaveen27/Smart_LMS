import React, { useState } from 'react';
import {
  X,
  PlayCircle,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Users,
  ShieldCheck,
  Sparkles,
  Share2,
  Heart,
  ShoppingCart
} from 'lucide-react';
import CourseContentAccordion, { formatTotalCourseDuration } from './CourseContentAccordion';

export default function CoursePreviewModal({
  isOpen,
  onClose,
  course,
  onEnroll,
  isEnrolled = false,
  onContinueLearning
}) {
  if (!isOpen || !course) return null;

  const [previewLesson, setPreviewLesson] = useState(
    course.modules?.[0]?.lessons?.[0] || null
  );

  const totalSections = course.modules?.length || 0;
  const totalLectures = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
  const totalMins = course.modules?.reduce((acc, m) => {
    return acc + (m.lessons?.reduce((lAcc, l) => lAcc + (Number(l.duration_mins) || 15), 0) || 0);
  }, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-800">
        
        {}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
              {course.category || 'Development'}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-semibold">{course.level || 'Beginner'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
          
          {}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {course.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {course.subtitle || course.description || 'Master industry-relevant skills with structured academic modules, hands-on lab exercises, and verified certification.'}
              </p>

              {}
              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-slate-900 font-black">{course.rating || 5.0}</span>
                  <span className="text-slate-400 font-medium">({course.enrolled_count || 0} learners)</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Created by <strong className="text-slate-800">{course.instructor_name || 'Course Instructor'}</strong></span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{formatTotalCourseDuration(totalMins)}</span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900">
                {previewLesson?.video_url ? (
                  <video
                    src={previewLesson.video_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                )}
                {!previewLesson?.video_url && (
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white drop-shadow-md" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline gap-2">
                  {course.price === 0 ? (
                    <span className="font-black text-2xl text-emerald-600">FREE</span>
                  ) : (
                    <>
                      <span className="font-black text-2xl text-slate-900">₹{course.price}</span>
                      {course.original_price && (
                        <span className="text-sm text-slate-400 line-through">₹{course.original_price}</span>
                      )}
                    </>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onContinueLearning) onContinueLearning(course);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4" /> Continue Learning
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onEnroll) onEnroll(course);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {course.price === 0 ? 'Enroll in Free Course' : `Buy Now for ₹${course.price}`}
                  </button>
                )}

                <div className="pt-2 text-[11px] text-slate-500 space-y-1.5 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Full Lifetime Access on Mobile and Web</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Verified Academic Certificate of Completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="pt-4 border-t border-slate-100">
            <CourseContentAccordion
              modules={course.modules || []}
              isEnrolled={isEnrolled}
              allowPreview={true}
              onSelectLesson={(lesson) => setPreviewLesson(lesson)}
              activeLessonId={previewLesson?.id}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
