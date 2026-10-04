import React, { useState } from 'react';
import { X, Star, MessageSquare, Award, CheckCircle2, Sparkles, Send } from 'lucide-react';
import Swal from 'sweetalert2';

const RATING_LABELS = {
  1: { label: 'Poor / Needs Improvement', color: 'text-rose-500' },
  2: { label: 'Fair / Average Course', color: 'text-amber-500' },
  3: { label: 'Good / Informative', color: 'text-amber-600' },
  4: { label: 'Very Good / High Quality', color: 'text-emerald-500' },
  5: { label: 'Masterclass / Exceptional', color: 'text-emerald-600' }
};

export default function CourseFeedbackModal({ isOpen, onClose, course, onSubmitReview, currentUser }) {
  if (!isOpen || !course) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStarCount = hoverRating || rating;
  const activeRatingInfo = RATING_LABELS[activeStarCount] || RATING_LABELS[5];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      Swal.fire('Notice', 'Please select a star rating (1 to 5 stars).', 'info');
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmitReview) {
        await onSubmitReview(course.id, {
          rating,
          feedback,
          user_id: currentUser?.id,
          user_name: currentUser?.name || 'Student Learner'
        });
      }

      Swal.fire({
        icon: 'success',
        title: 'Thank You for Your Feedback!',
        text: `Your ${rating}-star rating for "${course.title}" has been saved to the database.`,
        timer: 2000,
        showConfirmButton: false
      });
      onClose();
    } catch (err) {
      Swal.fire('Error', 'Failed to submit feedback: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">Rate & Review Course</h3>
              <p className="text-[11px] text-slate-500 font-medium">Your feedback updates the course rating in the database.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <img
              src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80'}
              alt={course.title}
              className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-extrabold text-xs text-slate-900 truncate">{course.title}</h4>
              <p className="text-[11px] text-slate-500 truncate">Instructor: {course.instructor_name || 'Course Instructor'}</p>
            </div>
          </div>

          {}
          <div className="text-center py-2 space-y-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
              How would you rate your learning experience?
            </label>
            
            <div className="flex items-center justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((starVal) => {
                const isFilled = starVal <= activeStarCount;
                return (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-200 hover:scale-125 transition-transform duration-150 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                        isFilled
                          ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                          : 'text-slate-200 hover:text-amber-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {}
            <div className={`text-xs font-bold ${activeRatingInfo.color} pt-0.5`}>
              {activeStarCount} Star{activeStarCount > 1 ? 's' : ''} &bull; {activeRatingInfo.label}
            </div>
          </div>

          {}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Write your Review / Feedback (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Tell other students what you liked about the syllabus, lectures, instructor teaching, or labs..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>

          {}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving Review...' : 'Submit Rating & Review'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
