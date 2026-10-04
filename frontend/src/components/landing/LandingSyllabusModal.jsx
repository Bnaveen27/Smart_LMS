import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

export const LandingSyllabusModal = ({ previewCourse, onClose }) => {
  const navigate = useNavigate();

  if (!previewCourse) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-xl border border-slate-200 overflow-hidden my-8 animate-scaleUp text-slate-800">
        
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <img
            src={previewCourse.thumbnail}
            alt={previewCourse.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            {previewCourse.type} · {previewCourse.credits}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs font-semibold text-blue-600">{previewCourse.department}</span>
            <h3 className="text-lg font-semibold text-slate-800 mt-0.5">
              {previewCourse.title}
            </h3>
          </div>

          {/* Faculty Card */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={previewCourse.instructorAvatar}
              alt={previewCourse.instructor}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80';
              }}
              className="w-10 h-10 rounded-full object-cover border border-white shadow-sm"
            />
            <div>
              <h4 className="font-semibold text-sm text-slate-800">{previewCourse.instructor}</h4>
              <p className="text-xs text-slate-500">{previewCourse.instructorTitle || 'Course Lead & Senior Faculty'}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
              Syllabus Overview
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {previewCourse.description}
            </p>
          </div>

          {/* Weekly Modules */}
          {previewCourse.modules && (
            <div className="space-y-1.5">
              <h4 className="font-semibold text-xs text-slate-700 uppercase tracking-wider">
                Module Breakdown
              </h4>
              <div className="space-y-1">
                {previewCourse.modules.map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate('/register');
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Enroll in this Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
