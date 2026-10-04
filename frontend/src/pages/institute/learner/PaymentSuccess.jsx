import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  CheckCircle, PlayCircle, Download, FileText, ArrowRight,
  ShieldCheck, Award, BookOpen, Clock, ChevronRight, Home
} from 'lucide-react';

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { courses, setSelectedCourseForPlayer, activeTenant, currentUser } = useApp();

  const txnId = searchParams.get('txn_id') || `pay_${Math.random().toString(36).substring(2, 10)}`;
  const courseId = searchParams.get('course_id');
  const gateway = searchParams.get('gateway') || 'RAZORPAY';
  const method = searchParams.get('method') || 'UPI';

  const course = courses.find(c => c.id === courseId) || courses[0];
  const paidAmount = course ? Number(course.price || 15).toFixed(2) : '15.00';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartCourse = () => {
    if (course) {
      setSelectedCourseForPlayer(course);
    }
    navigate('/learner');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between">
      
      {}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm border border-emerald-200">
              ✓
            </span>
            <span className="font-extrabold text-sm text-slate-900">Payment Receipt & Enrollment Confirmed</span>
          </div>
          <button
            onClick={() => navigate('/learner')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" /> Learner Dashboard
          </button>
        </div>
      </header>

      {}
      <main className="max-w-2xl mx-auto px-4 py-10 w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6 text-center animate-in zoom-in-95">
          
          {}
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Your enrollment is confirmed and your curriculum is immediately unlocked.
            </p>
          </div>

          {}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3 font-mono">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 text-slate-500">
              <span>Transaction Ref:</span>
              <span className="font-bold text-indigo-600">{txnId}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Course Name:</span>
              <span className="font-bold text-slate-900 font-sans text-right truncate max-w-[240px]">{course?.title || 'Enrolled Course'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Institution / Tenant:</span>
              <span className="font-bold text-slate-800 font-sans">{activeTenant?.name || 'Smart LMS Academy'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Learner / Student:</span>
              <span className="font-bold text-slate-800 font-sans">{currentUser?.name || 'Learner'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Payment Gateway:</span>
              <span className="font-bold text-indigo-600 font-sans">{gateway} ({method})</span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Date & Time:</span>
              <span className="text-slate-700">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200 font-bold text-sm">
              <span className="text-slate-900">Amount Paid:</span>
              <span className="text-emerald-600 text-base font-black">₹{paidAmount} (INR)</span>
            </div>
          </div>

          {}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStartCourse}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4" /> Start Learning Now (Course Player)
            </button>
            <button
              onClick={() => alert(`Invoice #${txnId} downloaded successfully as PDF.`)}
              className="py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Download className="w-4 h-4" /> Receipt (PDF)
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            A confirmation receipt has also been dispatched to your registered email address.
          </p>

        </div>
      </main>

      {}
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} {activeTenant?.name || 'Smart LMS'}. All course credentials & certificates verified.
      </footer>

    </div>
  );
};
