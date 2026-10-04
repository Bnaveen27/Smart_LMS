import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Video,
  FileCheck,
  Award,
  Users,
  BarChart2,
  Calendar,
  Clock,
  CheckCircle,
  PlusCircle,
  Play,
  LogOut,
  Edit3,
  HelpCircle,
  FileText,
  Upload,
  Layers,
  Search,
  MessageSquare,
  GraduationCap,
  Sparkles,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Download,
  Filter,
  MoreVertical,
  Mail,
  UserCheck,
  FileQuestion,
  Settings,
  Bell,
  Trash2,
  X
} from 'lucide-react';
import Swal from 'sweetalert2';
import CourseCurriculumModal from '../../../components/course/CourseCurriculumModal';

export const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { 
    courses: dbCourses, 
    courseProgress,
    enrollmentRecords,
    certificates,
    createCourse, 
    updateCourse,
    deleteCourse, 
    toggleCoursePublish, 
    timetable,
    addTimetableEntry,
    deleteTimetableEntry,
    users, 
    activeTenant, 
    currentUser,
    setCurrentUser
  } = useApp();

  const [activeMenu, setActiveMenu] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [selectedCourseForCurriculum, setSelectedCourseForCurriculum] = useState(null);

  const [timetableForm, setTimetableForm] = useState({
    day_of_week: 'Monday',
    title: '',
    course_id: '',
    course_title: '',
    start_time: '10:00 AM',
    end_time: '11:30 AM',
    session_type: 'LECTURE',
    location: 'Lecture Hall / Online',
    meeting_url: ''
  });

  const [newCourseForm, setNewCourseForm] = useState({
    title: '',
    code: '',
    subtitle: '',
    description: '',
    price: 0,
    level: 'BEGINNER',
    category: 'Development',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  });

  const instructorCourses = dbCourses.filter(c => {
    if (activeTenant && c.tenant_id && c.tenant_id !== activeTenant.id) return false;
    if (currentUser) {
      const matchId = c.instructor_id && currentUser.id && String(c.instructor_id) === String(currentUser.id);
      const matchName = c.instructor_name && currentUser.name && c.instructor_name.trim().toLowerCase() === currentUser.name.trim().toLowerCase();
      const matchEmail = c.instructor_email && currentUser.email && c.instructor_email.trim().toLowerCase() === currentUser.email.trim().toLowerCase();
      return Boolean(matchId || matchName || matchEmail);
    }
    return false;
  });

  const instructorCourseIds = instructorCourses.map(c => c.id);

  const enrolledLearnersCount = instructorCourses.reduce((acc, c) => acc + (Number(c.enrolled_count) || 0), 0);

  const enrolledStudents = (enrollmentRecords || [])
    .filter(e => instructorCourseIds.includes(e.course_id))
    .map(e => ({
      id: e.user_id || `std-${Math.random().toString(36).substring(2, 7)}`,
      name: e.learner_name || 'Enrolled Student',
      email: e.learner_email || 'student@domain.com',
      course_id: e.course_id,
      course_title: e.course_title,
      department: e.department || 'Academic Department',
      role: 'LEARNER',
      enrolled_at: e.enrolled_at,
      status: e.status || 'ACTIVE'
    }));

  const finalEnrolledStudents = enrolledStudents;

  const instructorCertificates = (certificates || []).filter(cert => instructorCourseIds.includes(cert.course_id));

  const [liveSessions, setLiveSessions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [doubts, setDoubts] = useState([]);

  const totalCoursesCount = instructorCourses.length;
  const publishedCoursesCount = instructorCourses.filter(c => c.published !== false).length;
  const pendingReviewsCount = submissions.filter(s => s.status === 'PENDING').length;
  const liveLecturesCount = liveSessions.length;
  const avgRating = instructorCourses.length > 0
    ? (instructorCourses.reduce((acc, c) => acc + (Number(c.rating) || 5.0), 0) / instructorCourses.length).toFixed(1)
    : '5.0';

  const instructorName = currentUser?.name || 'Academic Instructor';
  const instructorRole = currentUser?.department ? `${currentUser.department} Instructor` : (currentUser?.job_title || 'Lead Instructor');
  const orgName = activeTenant?.name || 'Academic Institute';

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newCourseForm.title.trim()) {
      Swal.fire('Error', 'Please enter a course title', 'error');
      return;
    }

    const courseId = `course-${Date.now()}`;
    const newCourse = {
      id: courseId,
      tenant_id: activeTenant ? activeTenant.id : 'tenant-1',
      instructor_id: currentUser ? currentUser.id : null,
      instructor_name: currentUser?.name || instructorName,
      instructor_email: currentUser?.email || '',
      title: newCourseForm.title,
      code: newCourseForm.code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      subtitle: newCourseForm.subtitle,
      description: newCourseForm.description,
      category: newCourseForm.category,
      price: Number(newCourseForm.price || 0),
      level: newCourseForm.level,
      thumbnail: newCourseForm.thumbnail,
      rating: 5.0,
      enrolled_count: 0,
      published: true,
      modules: [
        {
          id: `sec-${Date.now()}-1`,
          title: 'Week 1: Fundamentals & Getting Started',
          lessons: [
            { id: `les-${Date.now()}-1`, title: '1. Course Orientation & Overview', duration_mins: 15, video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', preview: true }
          ]
        }
      ]
    };

    createCourse(newCourse);
    setShowAddCourseModal(false);
    setNewCourseForm({
      title: '',
      code: '',
      subtitle: '',
      description: '',
      price: 0,
      level: 'BEGINNER',
      category: 'Development',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
    });

    Swal.fire({
      icon: 'success',
      title: 'Course Created!',
      text: `Course "${newCourse.title}" is now published and active.`,
      timer: 1800,
      showConfirmButton: false
    });
  };

  const handleScheduleClass = () => {
    if (instructorCourses.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Add a Course First',
        text: 'Please create a course before scheduling a live lecture.',
        confirmButtonColor: '#1d4ed8'
      });
      return;
    }

    Swal.fire({
      title: 'Schedule Instructor Live Lecture',
      html: `
        <div style="text-align: left; font-size: 13px;">
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Lecture Title:</label>
            <input id="swal-lc-title" class="swal2-input" placeholder="e.g. Distributed Database Sharding Lab" style="width: 100%; margin: 0;" />
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Select Course:</label>
            <select id="swal-lc-course" class="swal2-select" style="width: 100%; margin: 0;">
              ${instructorCourses.map(c => `<option value="${c.title}">${c.title}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Date & Time Slot:</label>
            <input id="swal-lc-time" class="swal2-input" placeholder="e.g. Friday • 03:00 PM - 04:30 PM" style="width: 100%; margin: 0;" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Publish Live Session',
      confirmButtonColor: '#1d4ed8',
      preConfirm: () => {
        const title = document.getElementById('swal-lc-title').value;
        const course = document.getElementById('swal-lc-course').value;
        const dateTime = document.getElementById('swal-lc-time').value;
        if (!title || !dateTime) {
          Swal.showValidationMessage('Please fill all lecture details.');
          return false;
        }
        return { title, course, dateTime };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        const newSession = {
          id: `ls-${Date.now()}`,
          title: res.value.title,
          course: res.value.course,
          dateTime: res.value.dateTime,
          meetingUrl: `https://meet.google.com/lms-${Math.random().toString(36).substring(2, 7)}`,
          registeredCount: enrolledLearnersCount,
          status: 'SCHEDULED'
        };
        setLiveSessions(prev => [newSession, ...prev]);

        const dayMatch = res.value.dateTime.split('•')[0]?.trim() || 'Monday';
        const timeMatch = res.value.dateTime.split('•')[1]?.trim() || '10:00 AM - 11:30 AM';
        const [st, et] = timeMatch.includes('-') ? timeMatch.split('-').map(s => s.trim()) : ['10:00 AM', '11:30 AM'];

        addTimetableEntry({
          tenant_id: activeTenant?.id || 'tenant-default',
          instructor_id: currentUser?.id || null,
          instructor_name: currentUser?.name || instructorName,
          course_title: res.value.course,
          title: res.value.title,
          day_of_week: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].find(d => d.toLowerCase() === dayMatch.toLowerCase()) || 'Monday',
          start_time: st || '10:00 AM',
          end_time: et || '11:30 AM',
          session_type: 'LECTURE',
          location: 'Live Virtual Classroom / Online',
          meeting_url: newSession.meetingUrl
        });

        Swal.fire({
          icon: 'success',
          title: 'Live Lecture Scheduled',
          text: `Session "${newSession.title}" saved and published.`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleOpenAddTimetable = (defaultDay = 'Monday') => {
    setTimetableForm({
      day_of_week: defaultDay,
      title: instructorCourses[0] ? `${instructorCourses[0].title} Lecture` : 'Academic Lecture',
      course_id: instructorCourses[0]?.id || '',
      course_title: instructorCourses[0]?.title || 'General Lecture',
      start_time: '10:00 AM',
      end_time: '11:30 AM',
      session_type: 'LECTURE',
      location: 'Lecture Hall 101 / Online',
      meeting_url: `https://meet.google.com/lms-${Math.random().toString(36).substring(2, 7)}`
    });
    setShowTimetableModal(true);
  };

  const handleSaveTimetable = async (e) => {
    e.preventDefault();
    if (!timetableForm.title.trim()) {
      Swal.fire('Error', 'Please enter a lecture or office hours title.', 'error');
      return;
    }

    const newSlot = {
      tenant_id: activeTenant?.id || 'tenant-default',
      instructor_id: currentUser?.id || null,
      instructor_name: currentUser?.name || instructorName,
      course_id: timetableForm.course_id || null,
      course_title: timetableForm.course_title || timetableForm.title,
      day_of_week: timetableForm.day_of_week,
      start_time: timetableForm.start_time,
      end_time: timetableForm.end_time,
      title: timetableForm.title.trim(),
      session_type: timetableForm.session_type,
      location: timetableForm.location || 'Lecture Hall / Online',
      meeting_url: timetableForm.meeting_url || null
    };

    const res = await addTimetableEntry(newSlot);
    setShowTimetableModal(false);

    if (res?.success) {
      Swal.fire({
        icon: 'success',
        title: 'Timetable Slot Saved!',
        text: `Lecture "${newSlot.title}" added for ${newSlot.day_of_week} in database.`,
        timer: 1600,
        showConfirmButton: false
      });
    }
  };

  const handleDeleteTimetableSlot = (slotId, slotTitle) => {
    Swal.fire({
      title: 'Remove Timetable Slot?',
      text: `Are you sure you want to remove "${slotTitle}" from your schedule?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Delete Slot'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTimetableEntry(slotId);
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'The timetable slot has been removed from database.',
          timer: 1200,
          showConfirmButton: false
        });
      }
    });
  };

  const handleAddQuestion = () => {
    if (instructorCourses.length === 0) {
      Swal.fire('Notice', 'Create a course first to add assessment questions.', 'info');
      return;
    }

    Swal.fire({
      title: 'Add Assessment Question',
      html: `
        <div style="text-align: left; font-size: 13px;">
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Select Course:</label>
            <select id="swal-q-course" class="swal2-select" style="width: 100%; margin: 0;">
              ${instructorCourses.map(c => `<option value="${c.title}">${c.title}</option>`).join('')}
            </select>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Question Text:</label>
            <textarea id="swal-q-stem" class="swal2-textarea" placeholder="Enter question..." style="width: 100%; margin: 0;" rows="2"></textarea>
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Option A:</label>
            <input id="swal-q-opt1" class="swal2-input" placeholder="Option A" style="width: 100%; margin: 0;" />
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Option B:</label>
            <input id="swal-q-opt2" class="swal2-input" placeholder="Option B" style="width: 100%; margin: 0;" />
          </div>
          <div style="margin-bottom: 10px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Correct Answer:</label>
            <input id="swal-q-ans" class="swal2-input" placeholder="Exact correct answer" style="width: 100%; margin: 0;" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Question',
      confirmButtonColor: '#1d4ed8',
      preConfirm: () => {
        const course = document.getElementById('swal-q-course').value;
        const stem = document.getElementById('swal-q-stem').value;
        const opt1 = document.getElementById('swal-q-opt1').value;
        const opt2 = document.getElementById('swal-q-opt2').value;
        const ans = document.getElementById('swal-q-ans').value;
        if (!stem || !opt1 || !opt2 || !ans) {
          Swal.showValidationMessage('Please fill all question fields.');
          return false;
        }
        return { course, stem, options: [opt1, opt2], correctAnswer: ans };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        const newQ = {
          id: `q-${Date.now()}`,
          course: res.value.course,
          type: 'MCQ',
          stem: res.value.stem,
          options: res.value.options,
          correctAnswer: res.value.correctAnswer,
          marks: 2
        };
        setQuestions(prev => [newQ, ...prev]);
        Swal.fire({
          icon: 'success',
          title: 'Question Saved',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const handleEvaluate = (sub) => {
    Swal.fire({
      title: `Evaluate Submission: ${sub.studentName}`,
      html: `
        <div style="text-align: left; font-size: 13px;">
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 14px; border: 1px solid #e2e8f0;">
            <div style="margin-bottom: 4px;"><strong>Course:</strong> ${sub.courseTitle}</div>
            <div style="margin-bottom: 4px;"><strong>Assignment:</strong> ${sub.assignmentTitle}</div>
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px; color: #334155;">Award Score (Max 100):</label>
            <input id="swal-marks" type="number" value="${sub.marks || 90}" class="swal2-input" style="width: 100%; margin: 0; box-sizing: border-box;" />
          </div>
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px; color: #334155;">Instructor Feedback:</label>
            <textarea id="swal-feedback" class="swal2-textarea" style="width: 100%; margin: 0; box-sizing: border-box;" rows="3">${sub.feedback || 'Good work.'}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Publish Grade',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#1d4ed8',
      preConfirm: () => {
        const marks = document.getElementById('swal-marks').value;
        const feedback = document.getElementById('swal-feedback').value;
        if (!marks) {
          Swal.showValidationMessage('Score is required.');
          return false;
        }
        return { marks: parseInt(marks, 10), feedback };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        setSubmissions(submissions.map(s => s.id === sub.id ? { ...s, status: 'GRADED', marks: res.value.marks, feedback: res.value.feedback } : s));
        Swal.fire({
          icon: 'success',
          title: 'Evaluation Published',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      
      {}
      {}
      {}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
        
        {}
        <div>
          <div className="h-16 border-b border-slate-200 flex items-center px-6 gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-sm shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-extrabold text-sm text-slate-900 tracking-tight truncate">{orgName}</div>
              <div className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">Instructor Portal</div>
            </div>
          </div>

          {}
          <div className="p-3 space-y-4">
            {}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Main</div>
              <button
                onClick={() => setActiveMenu('overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeMenu === 'overview'
                    ? 'bg-blue-700 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" /> Overview & Analytics
              </button>
            </div>

            {}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Curriculum & Delivery</div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveMenu('courses')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'courses'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4" /> My Courses & Lessons
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeMenu === 'courses' ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {totalCoursesCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMenu('live')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'live'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4" /> Live Classes & Labs
                  </div>
                  {liveSessions.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </button>

                <button
                  onClick={() => setActiveMenu('timetable')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'timetable'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" /> Timetable & Calendar
                </button>
              </div>
            </div>

            {}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Evaluation & Testing</div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveMenu('assignments')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'assignments'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-4 h-4" /> Assignment Grading
                  </div>
                  {pendingReviewsCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {pendingReviewsCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveMenu('question-bank')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'question-bank'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <FileQuestion className="w-4 h-4" /> Question Bank & Quizzes
                </button>
              </div>
            </div>

            {}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Learners & Q&A</div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveMenu('students')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'students'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" /> Enrolled Students
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                    {enrolledLearnersCount}
                  </span>
                </button>

                <button
                  onClick={() => setActiveMenu('doubts')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'doubts'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" /> Doubts & Q&A Forum
                  </div>
                </button>

                <button
                  onClick={() => setActiveMenu('certificates')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeMenu === 'certificates'
                      ? 'bg-blue-700 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Award className="w-4 h-4" /> Issued Certificates
                </button>
              </div>
            </div>

            {}
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-1 tracking-wider">Analytics</div>
              <button
                onClick={() => setActiveMenu('analytics')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeMenu === 'analytics'
                    ? 'bg-blue-700 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-4 h-4" /> Performance Reports
              </button>
            </div>

          </div>
        </div>

        {}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200 shadow-sm shrink-0">
              {instructorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{instructorName}</div>
              <div className="text-[11px] text-slate-500 truncate">{currentUser?.email || instructorRole}</div>
            </div>
          </div>
          <button 
            onClick={() => {
              if (setCurrentUser) setCurrentUser(null);
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium hover:bg-slate-100 hover:text-red-600 transition-colors shadow-sm cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {}
      {}
      {}
      <main className="flex-1 flex flex-col min-w-0">
        
        {}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-900">
              {activeMenu === 'overview' && 'Instructor Dashboard & Academic Analytics'}
              {activeMenu === 'courses' && 'Course Curriculum & Lesson Builder'}
              {activeMenu === 'live' && 'Live Virtual Classrooms & Coding Labs'}
              {activeMenu === 'timetable' && 'Academic Lecture Schedule & Timetable'}
              {activeMenu === 'assignments' && 'Student Project Submissions & Evaluation Desk'}
              {activeMenu === 'question-bank' && 'Assessment Question Bank & Quizzes'}
              {activeMenu === 'students' && 'Enrolled Students Roster & Syllabus Progress'}
              {activeMenu === 'doubts' && 'Student Doubts & Academic Q&A Forum'}
              {activeMenu === 'certificates' && 'Course Certificates & Graduation Registry'}
              {activeMenu === 'analytics' && 'Course Completion & Performance Analytics'}
            </h1>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              {orgName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/instructor/courses/create')} 
              className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Course
            </button>
            <button 
              onClick={handleScheduleClass} 
              className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Video className="w-3.5 h-3.5 text-blue-700" /> Schedule Class
            </button>
          </div>
        </header>

        {}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {}
          {}
          {}
          {activeMenu === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Courses</span>
                    <BookOpen className="w-4 h-4 text-blue-700" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{totalCoursesCount}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {publishedCoursesCount} Published
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Enrolled Learners</span>
                    <Users className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{enrolledLearnersCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {totalCoursesCount > 0 ? `Across ${totalCoursesCount} courses` : 'No courses active'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">To Evaluate</span>
                    <FileCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600">{pendingReviewsCount}</div>
                  <div className="text-[11px] text-amber-700 font-medium mt-1">Pending reviews</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Live Lectures</span>
                    <Video className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{liveLecturesCount}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Scheduled</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Completion</span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {totalCoursesCount > 0 ? '100%' : '0%'}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                    {totalCoursesCount > 0 ? 'Active track' : 'No activity'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Instructor Rating</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{avgRating}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {totalCoursesCount > 0 ? 'out of 5.0' : 'No ratings yet'}
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-blue-700" />
                      <span className="text-xs font-bold text-slate-900">Upcoming Live Virtual Lectures</span>
                    </div>
                    <button onClick={handleScheduleClass} className="text-xs font-semibold text-blue-700 hover:underline">
                      + Schedule New
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {liveSessions.length > 0 ? (
                      liveSessions.map(ls => (
                        <div key={ls.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-900">{ls.title}</div>
                            <div className="text-[11px] text-slate-500">{ls.course}</div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-0.5">
                              <span className="flex items-center gap-1 text-blue-700 font-medium">
                                <Clock className="w-3.5 h-3.5" /> {ls.dateTime}
                              </span>
                              <span>•</span>
                              <span>{ls.registeredCount} Registered</span>
                            </div>
                          </div>

                          <a 
                            href={ls.meetingUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm"
                          >
                            <Play className="w-3.5 h-3.5" /> Launch Room
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        <Video className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                        <p className="font-semibold text-slate-600">No live lectures scheduled yet.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click '+ Schedule New' to schedule interactive virtual classrooms.</p>
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                  <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">Evaluation Desk</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {pendingReviewsCount} Pending
                    </span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    {submissions.filter(s => s.status === 'PENDING').length > 0 ? (
                      submissions.filter(s => s.status === 'PENDING').map(sub => (
                        <div key={sub.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                          <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                            <span>{sub.studentName}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{sub.submittedDate}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 truncate mb-2">{sub.assignmentTitle}</div>
                          <button 
                            onClick={() => handleEvaluate(sub)}
                            className="w-full py-1.5 bg-blue-700 text-white rounded text-xs font-semibold hover:bg-blue-800 transition-colors"
                          >
                            Evaluate & Grade
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                        <p className="font-semibold text-slate-600">All caught up!</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">No student submissions are pending grading.</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Curriculum Portfolio ({totalCoursesCount})</span>
                  <button onClick={() => setActiveMenu('courses')} className="text-xs text-blue-700 font-semibold hover:underline">
                    Manage All Courses →
                  </button>
                </div>
                
                {instructorCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                    {instructorCourses.map(c => (
                      <div key={c.id} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                        <img src={c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'} alt={c.title} className="w-full h-28 object-cover" />
                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                              <span>{c.code || 'COURSE'}</span>
                              <span className={`px-1.5 py-0.2 rounded font-bold ${c.published !== false ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                                {c.published !== false ? 'PUBLISHED' : 'DRAFT'}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{c.title}</div>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between text-[11px] text-slate-600">
                              <span>{c.enrolled_count || 0} Learners</span>
                              <span className="font-semibold text-amber-600">⭐ {c.rating ? Number(c.rating).toFixed(1) : '5.0'} ({c.rating_count || 0})</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-400 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <div>
                      <p className="font-bold text-slate-700 text-sm">No courses added yet</p>
                      <p className="text-xs text-slate-400 mt-1">Start by creating your first academic course and lesson modules.</p>
                    </div>
                    <button 
                      onClick={() => navigate('/instructor/courses/create')} 
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Course Now
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'courses' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Assigned Courses & Syllabus Structure ({instructorCourses.length})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => navigate('/instructor/courses/create')} 
                      className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add New Course
                    </button>
                  </div>
                </div>

                {instructorCourses.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Code</th>
                        <th className="p-3.5">Course Title</th>
                        <th className="p-3.5">Category & Level</th>
                        <th className="p-3.5">Learners</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {instructorCourses.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-slate-700">{c.code || 'CRS'}</td>
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{c.title}</div>
                            <div className="text-[11px] text-slate-500">Rating: ⭐ {c.rating ? Number(c.rating).toFixed(1) : '5.0'} ({c.rating_count ? `${c.rating_count} reviews` : 'No reviews'})</div>
                          </td>
                          <td className="p-3.5">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">{c.category || 'General'}</span>
                            <div className="text-[10px] text-slate-400 mt-0.5">{c.level || 'Beginner'}</div>
                          </td>
                          <td className="p-3.5 font-semibold text-slate-900">{c.enrolled_count || 0} Students</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => toggleCoursePublish(c.id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                                c.published !== false ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {c.published !== false ? 'PUBLISHED' : 'DRAFT'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => navigate(`/instructor/courses/${c.id}/edit`)}
                                className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded-md text-[11px] font-semibold hover:bg-slate-50 flex items-center gap-1 shadow-2xs cursor-pointer"
                                title="Edit Course Content & Lessons"
                              >
                                <Edit3 className="w-3 h-3 text-blue-700" />
                                <span>Edit Course & Content</span>
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm(`Delete course "${c.title}"?`)) {
                                    deleteCourse(c.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Course"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-3">
                    <BookOpen className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <div>
                      <p className="font-bold text-slate-700 text-sm">No courses created yet</p>
                      <p className="text-xs text-slate-400 mt-1">Click below to create and publish your first course.</p>
                    </div>
                    <button 
                      onClick={() => setShowAddCourseModal(true)}
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Create Course
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'live' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Virtual Interactive Lecture Schedule</span>
                  </div>
                  <button onClick={handleScheduleClass} className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm">
                    <PlusCircle className="w-3.5 h-3.5" /> Schedule New Lecture
                  </button>
                </div>

                {liveSessions.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Session Subject</th>
                        <th className="p-3.5">Assigned Course</th>
                        <th className="p-3.5">Schedule Slot</th>
                        <th className="p-3.5">Attendees</th>
                        <th className="p-3.5">Broadcast</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {liveSessions.map(ls => (
                        <tr key={ls.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{ls.title}</td>
                          <td className="p-3.5 text-slate-500">{ls.course}</td>
                          <td className="p-3.5 text-blue-700 font-medium">{ls.dateTime}</td>
                          <td className="p-3.5 font-semibold text-slate-900">{ls.registeredCount} Students</td>
                          <td className="p-3.5">
                            <a 
                              href={ls.meetingUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5" /> Start Broadcast
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-3">
                    <Video className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <div>
                      <p className="font-bold text-slate-700 text-sm">No live lectures scheduled</p>
                      <p className="text-xs text-slate-400 mt-1">Schedule online classes, webinars, or lab sessions for your enrolled students.</p>
                    </div>
                    <button 
                      onClick={handleScheduleClass}
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Schedule Class
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'timetable' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-base font-extrabold text-slate-900">Instructor Weekly Timetable & Office Hours</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manage your weekly lecture slots, lab sessions, and student doubt clarification hours stored in MySQL.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs text-slate-500 font-medium hidden sm:inline">{orgName}</span>
                    <button
                      onClick={() => handleOpenAddTimetable('Monday')}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" /> Add Timetable Slot
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => {
                    const daySlots = (timetable || []).filter(t => (t.day_of_week || '').toLowerCase() === day.toLowerCase());

                    return (
                      <div key={idx} className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50/70 flex flex-col space-y-3 min-h-[320px]">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                          <span className="font-extrabold text-slate-900">{day}</span>
                          <button
                            onClick={() => handleOpenAddTimetable(day)}
                            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                            title={`Add slot for ${day}`}
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {daySlots.length === 0 ? (
                          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white/60">
                            <Clock className="w-6 h-6 mb-1 text-slate-300" />
                            <p className="text-[11px] font-semibold text-slate-500">No slots set</p>
                            <button
                              onClick={() => handleOpenAddTimetable(day)}
                              className="mt-2 text-[10px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition cursor-pointer"
                            >
                              + Add Slot
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5 flex-1">
                            {daySlots.map(slot => {
                              const isOfficeHours = slot.session_type === 'OFFICE_HOURS' || slot.session_type === 'DOUBT_CLEARING';
                              const isLab = slot.session_type === 'LAB';

                              return (
                                <div 
                                  key={slot.id} 
                                  className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-1.5 hover:shadow-md transition group relative"
                                >
                                  <div className="flex items-center justify-between gap-1">
                                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                                      isOfficeHours
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : isLab
                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    }`}>
                                      {slot.start_time} - {slot.end_time}
                                    </span>

                                    <button
                                      onClick={() => handleDeleteTimetableSlot(slot.id, slot.title)}
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition opacity-60 hover:opacity-100 cursor-pointer"
                                      title="Delete Slot"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div>
                                    <div className="font-extrabold text-slate-900 leading-tight text-xs">{slot.title}</div>
                                    {slot.course_title && slot.course_title !== slot.title && (
                                      <div className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">{slot.course_title}</div>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500">
                                    <span className="truncate max-w-[120px]">{slot.location || 'Lecture Hall / Online'}</span>
                                    {slot.meeting_url && (
                                      <a
                                        href={slot.meeting_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-600 font-bold hover:underline shrink-0"
                                      >
                                        Join &rarr;
                                      </a>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'assignments' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Student Assignment Submissions & Grading Desk</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Total Submissions: {submissions.length}
                  </span>
                </div>

                {submissions.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Student</th>
                        <th className="p-3.5">Assignment & Course</th>
                        <th className="p-3.5">Attachment</th>
                        <th className="p-3.5">Submitted Date</th>
                        <th className="p-3.5">Score</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map(sub => (
                        <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-slate-900">{sub.studentName}</div>
                            <div className="text-[11px] text-slate-500">{sub.studentEmail}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-900">{sub.assignmentTitle}</div>
                            <div className="text-[11px] text-slate-500">{sub.courseTitle}</div>
                          </td>
                          <td className="p-3.5 text-blue-700 font-medium">
                            {sub.submissionType || 'File Submission'}
                          </td>
                          <td className="p-3.5 text-slate-500">{sub.submittedDate}</td>
                          <td className="p-3.5 font-bold text-slate-900">
                            {sub.marks !== null ? `${sub.marks} / 100` : '—'}
                          </td>
                          <td className="p-3.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {sub.status === 'PENDING' ? 'NEEDS GRADING' : 'EVALUATED'}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button 
                              onClick={() => handleEvaluate(sub)}
                              className="px-3 py-1.5 bg-blue-700 text-white rounded-md text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm"
                            >
                              <Edit3 className="w-3 h-3 inline mr-1" />
                              {sub.status === 'PENDING' ? 'Grade Now' : 'Edit Grade'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <FileCheck className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <p className="font-bold text-slate-700 text-sm">No assignment submissions yet</p>
                    <p className="text-xs text-slate-400">Student submissions for course assignments will appear here for grading.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'question-bank' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Assessment Question Bank ({questions.length})</span>
                  </div>
                  <button 
                    onClick={handleAddQuestion}
                    className="px-3.5 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Add Question
                  </button>
                </div>

                {questions.length > 0 ? (
                  <div className="divide-y divide-slate-100 p-4 space-y-4">
                    {questions.map((q, idx) => (
                      <div key={q.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Q{idx + 1} • {q.type}</span>
                            <span className="text-slate-500 font-medium">{q.course}</span>
                          </div>
                          <span className="font-bold text-slate-900">{q.marks} Marks</span>
                        </div>

                        <div className="text-sm font-semibold text-slate-900 pt-1">{q.stem}</div>

                        {q.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                            {q.options.map((opt, oIdx) => (
                              <div 
                                key={oIdx} 
                                className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                                  opt === q.correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold' : 'bg-white border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className="w-4 h-4 rounded-full bg-slate-100 text-[10px] flex items-center justify-center font-bold">{String.fromCharCode(65 + oIdx)}</span>
                                <span>{opt}</span>
                                {opt === q.correctAnswer && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-3">
                    <FileQuestion className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <div>
                      <p className="font-bold text-slate-700 text-sm">No questions in question bank</p>
                      <p className="text-xs text-slate-400 mt-1">Create multiple choice or true/false questions for your course quizzes.</p>
                    </div>
                    <button 
                      onClick={handleAddQuestion}
                      className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Add Question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'students' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Enrolled Student Cohort Roster ({finalEnrolledStudents.length})</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{orgName}</span>
                </div>

                {finalEnrolledStudents.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Student</th>
                        <th className="p-3.5">Department / Program</th>
                        <th className="p-3.5">Enrolled Course</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {finalEnrolledStudents.map(student => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-semibold text-slate-900">
                            <div className="font-bold">{student.name}</div>
                            <div className="text-[11px] text-slate-500">{student.email}</div>
                          </td>
                          <td className="p-3.5 text-slate-600">{student.department || 'Academic Department'}</td>
                          <td className="p-3.5 font-medium text-slate-800">{student.course_title || 'Enrolled Course'}</td>
                          <td className="p-3.5">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ACTIVE
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button 
                              onClick={() => Swal.fire('Student Profile', `Viewing record for ${student.name} (${student.email})`, 'info')} 
                              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                            >
                              <Mail className="w-3 h-3 inline mr-1" /> Contact
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <Users className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <p className="font-bold text-slate-700 text-sm">No enrolled learners registered yet</p>
                    <p className="text-xs text-slate-400">Learners enrolled in your courses will be displayed here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'doubts' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Student Doubts & Technical Q&A Threads</span>
                  </div>
                </div>

                {doubts.length > 0 ? (
                  <div className="p-5 space-y-4">
                    {doubts.map(d => (
                      <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{d.student}</span>
                          <span className="text-[11px] text-slate-400">{d.date}</span>
                        </div>
                        <div className="font-semibold text-slate-800">{d.topic}</div>
                        <p className="text-slate-600 italic">"{d.question}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <MessageSquare className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <p className="font-bold text-slate-700 text-sm">No student doubts posted yet</p>
                    <p className="text-xs text-slate-400">Questions asked by learners in course forums will appear here for responses.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'certificates' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900">Graduation Digital Credentials Registry ({instructorCertificates.length})</span>
                  </div>
                </div>

                {instructorCertificates.length > 0 ? (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Student Name</th>
                        <th className="p-3.5">Course Completed</th>
                        <th className="p-3.5">Certificate ID</th>
                        <th className="p-3.5">Issue Date</th>
                        <th className="p-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {instructorCertificates.map(cert => (
                        <tr key={cert.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-bold text-slate-900">{cert.student_name || cert.learner_name || 'Graduated Student'}</td>
                          <td className="p-3.5 font-medium text-slate-800">{cert.course_title}</td>
                          <td className="p-3.5 font-mono text-[11px] text-blue-700">{cert.id}</td>
                          <td className="p-3.5 text-slate-500">{new Date(cert.issued_at || Date.now()).toLocaleDateString()}</td>
                          <td className="p-3.5 text-right">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              VERIFIED & ISSUED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <Award className="w-10 h-10 mx-auto opacity-30 text-slate-500" />
                    <p className="font-bold text-slate-700 text-sm">No course certificates issued yet</p>
                    <p className="text-xs text-slate-400">Certificates issued upon learner course completions for your courses will be tracked here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          {}
          {}
          {activeMenu === 'analytics' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-blue-700" />
                    <span className="text-sm font-bold text-slate-900">Academic Course Performance & Analytics</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900">Published Courses</div>
                    <div className="text-3xl font-bold text-blue-700 pt-2">{publishedCoursesCount}</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Active courses published and visible to students in the catalog.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900">Enrolled Learners</div>
                    <div className="text-3xl font-bold text-emerald-700 pt-2">{enrolledLearnersCount}</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Total active students currently registered under {orgName}.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="font-bold text-slate-900">Average Course Rating</div>
                    <div className="text-3xl font-bold text-amber-600 pt-2">{avgRating} / 5.0</div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Overall student feedback rating across published academic tracks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {}
      {}
      {}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            
            {}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Create New Academic Course</h3>
                  <p className="text-xs text-slate-500">Add syllabus, pricing, and curriculum for your students</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {}
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Advanced Distributed Systems & Cloud Architecture"
                  value={newCourseForm.title}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
                  <input 
                    type="text"
                    placeholder="e.g. CS-402"
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Category</label>
                  <select 
                    value={newCourseForm.category}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Development">Development</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty Level</label>
                  <select 
                    value={newCourseForm.level}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹ INR)</label>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0 for Free"
                    value={newCourseForm.price}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Description / Syllabus Overview</label>
                <textarea 
                  rows="3"
                  placeholder="Describe the learning outcomes and module highlights..."
                  value={newCourseForm.description}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-white bg-blue-700 hover:bg-blue-800 font-semibold rounded-xl shadow-sm transition-all flex items-center space-x-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Course</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {}
      {selectedCourseForCurriculum && (
        <CourseCurriculumModal
          isOpen={true}
          onClose={() => setSelectedCourseForCurriculum(null)}
          course={selectedCourseForCurriculum}
          onSave={(updatedCourse) => {
            updateCourse(updatedCourse);
            setSelectedCourseForCurriculum(null);
          }}
        />
      )}

      {}
      {showTimetableModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp font-['Plus_Jakarta_Sans',sans-serif]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">Schedule Timetable Slot</h3>
                  <p className="text-xs text-slate-500">Save lecture hours or office desk sessions in MySQL</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTimetableModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTimetable} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Day of Week *</label>
                  <select
                    value={timetableForm.day_of_week}
                    onChange={(e) => setTimetableForm({ ...timetableForm, day_of_week: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Session Type *</label>
                  <select
                    value={timetableForm.session_type}
                    onChange={(e) => setTimetableForm({ ...timetableForm, session_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="LECTURE">Academic Lecture</option>
                    <option value="LAB">Practical / Lab Session</option>
                    <option value="OFFICE_HOURS">Instructor Office Hours</option>
                    <option value="DOUBT_CLEARING">Doubt Clarification Desk</option>
                    <option value="SEMINAR">Seminar / Workshop</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Class / Subject Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database Systems Theory"
                  value={timetableForm.title}
                  onChange={(e) => setTimetableForm({ ...timetableForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Associated Course (Optional)</label>
                <select
                  value={timetableForm.course_id}
                  onChange={(e) => {
                    const cId = e.target.value;
                    const found = instructorCourses.find(c => c.id === cId);
                    setTimetableForm({
                      ...timetableForm,
                      course_id: cId,
                      course_title: found ? found.title : ''
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
                >
                  <option value="">-- General Academic Slot --</option>
                  {instructorCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={timetableForm.start_time}
                    onChange={(e) => setTimetableForm({ ...timetableForm, start_time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">End Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 11:30 AM"
                    value={timetableForm.end_time}
                    onChange={(e) => setTimetableForm({ ...timetableForm, end_time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Classroom / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Lecture Hall 204 / Google Meet"
                  value={timetableForm.location}
                  onChange={(e) => setTimetableForm({ ...timetableForm, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Online Broadcast Link (Optional URL)</label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz-abcd-efg"
                  value={timetableForm.meeting_url}
                  onChange={(e) => setTimetableForm({ ...timetableForm, meeting_url: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="pt-3 flex gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowTimetableModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Calendar className="w-4 h-4" /> Save to Database
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
