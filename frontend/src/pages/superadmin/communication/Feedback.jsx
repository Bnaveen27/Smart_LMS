import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MessageCircle, Star, ThumbsUp, TrendingUp,
  Search, Filter, CheckCircle2, AlertCircle,
  Users, BookOpen, Award, BarChart3, ChevronRight
} from 'lucide-react';

export const FeedbackTab = () => {
  const { courses, feedbackList, deleteFeedback } = useApp();
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const feedbacks = feedbackList?.length > 0 ? feedbackList.map(f => {
    const course = courses.find(c => c.id === f.course_id);
    return {
      id: f.id,
      studentName: f.user_name || 'Student Learner',
      studentEmail: f.user_id ? `${f.user_id}@student.edu` : 'learner@smartlms.io',
      courseTitle: course ? course.title : (f.course_id || 'General Course Feedback'),
      instructorName: course ? course.instructor_name : 'Faculty Mentor',
      rating: Math.round(Number(f.rating) || 5),
      comment: f.feedback || 'Great learning experience!',
      submittedAt: f.createdAt ? new Date(f.createdAt).toISOString().split('T')[0] : '2026-09-21',
      status: 'APPROVED'
    };
  }) : [
    {
      id: 'fb-001',
      studentName: 'Naveen Bala',
      studentEmail: 'naveenbala2701@gmail.com',
      courseTitle: 'Python Full-Stack & Cloud Architecture',
      instructorName: 'Dr. S. Karthik',
      rating: 5,
      comment: 'Exceptional course structure! The Docker and REST API modules were extremely clear and practical for real-world projects.',
      submittedAt: '2026-09-20',
      status: 'APPROVED'
    },
    {
      id: 'fb-002',
      studentName: 'Anitha Sundaram',
      studentEmail: 'anitha.s@student.edu.in',
      courseTitle: 'Java Enterprise & Spring Boot Microservices',
      instructorName: 'Prof. M. Priya',
      rating: 5,
      comment: 'Very thorough explanation of Spring Security and JPA mappings. Highly recommended for 3rd and 4th year students.',
      submittedAt: '2026-09-19',
      status: 'APPROVED'
    },
    {
      id: 'fb-003',
      studentName: 'Vijay Raghavan',
      studentEmail: 'vijay.r@student.edu.in',
      courseTitle: 'Foundations of Database Systems & MySQL',
      instructorName: 'Dr. S. Karthik',
      rating: 4,
      comment: 'Great SQL query exercises and index tuning explanations. Would love to see more complex join case studies.',
      submittedAt: '2026-09-18',
      status: 'APPROVED'
    }
  ];

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesSearch = f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.comment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = selectedRating === 'ALL' || f.rating === Number(selectedRating);
    return matchesSearch && matchesRating;
  });

  const avgRating = (feedbacks.reduce((acc, f) => acc + f.rating, 0) / feedbacks.length).toFixed(1);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn pb-12">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Student Feedback & Course Reviews</h1>
            <p className="text-xs text-slate-500 font-medium">Monitor learner satisfaction, course curriculum ratings, and faculty feedback.</p>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">INSTITUTION AVERAGE RATING</span>
          <div className="text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>{avgRating}</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
          </div>
          <p className="text-xs text-emerald-600 font-bold mt-1">Top tier academic satisfaction</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">NET PROMOTER SCORE (NPS)</span>
          <div className="text-3xl font-black text-indigo-600 mt-1 font-mono">+88</div>
          <p className="text-xs text-slate-500 font-medium mt-1">94% Positive student recommendations</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">TOTAL VERIFIED REVIEWS</span>
          <div className="text-3xl font-black text-slate-900 mt-1 font-mono">{feedbacks.length}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">100% Verified learner enrollments</p>
        </div>
      </div>

      {}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search feedback reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Filter by Rating:</span>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
          </select>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredFeedbacks.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{item.submittedAt}</span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900">{item.courseTitle}</h4>
              <p className="text-[11px] text-slate-500">Instructor: <strong className="text-slate-700">{item.instructorName}</strong></p>

              <p className="mt-3 text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{item.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-extrabold text-slate-800 block text-xs">{item.studentName}</span>
                <span className="text-[10px] text-slate-400">{item.studentEmail}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
