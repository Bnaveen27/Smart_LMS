import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';
import {
  X, PlayCircle, CheckCircle2, Award, BookOpen, Clock, FileText,
  ChevronRight, ChevronLeft, Star, MessageSquare, Download, Share2,
  HelpCircle, ThumbsUp, Send, Bookmark, BookmarkCheck, Check, RotateCcw,
  Sparkles, ExternalLink, Zap, Terminal, Code2, AlertCircle, FileCode,
  Sliders, Maximize2, Volume2, UserCheck, Layers, Award as AwardIcon
} from 'lucide-react';
import CourseFeedbackModal from './CourseFeedbackModal';

export const CoursePlayerModal = () => {
  const {
    selectedCourseForPlayer,
    setSelectedCourseForPlayer,
    activeTenant,
    currentUser,
    courseProgress,
    completeLesson,
    claimCourseCertificate,
    submitCourseReview
  } = useApp();

  const videoRef = useRef(null);

  useEffect(() => {
    if (selectedCourseForPlayer?.id) {
      fetch(`${API_URL}/api/courses/${selectedCourseForPlayer.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.modules && Array.isArray(data.modules) && data.modules.length > 0) {
            setSelectedCourseForPlayer(prev => prev && prev.id === data.id ? { ...prev, ...data } : prev);
          }
        })
        .catch(() => {});
    }
  }, [selectedCourseForPlayer?.id]);

  const currentCourseProgress = selectedCourseForPlayer && courseProgress ? courseProgress[selectedCourseForPlayer.id] : null;
  const completedLessons = currentCourseProgress?.completedLessons || [];

  const defaultModules = selectedCourseForPlayer?.modules && selectedCourseForPlayer.modules.length > 0
    ? selectedCourseForPlayer.modules
    : [
        {
          id: 'mod-1',
          title: 'Module 1: Foundations & Architecture',
          lessons: [
            {
              id: 'les-1',
              title: '1. Course Overview & Production Workflow',
              duration_mins: 12,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
              type: 'video',
              resources: [
                { name: 'Lecture Slides (PDF)', size: '2.4 MB', type: 'pdf' },
                { name: 'Starter Template Repo (GitHub)', url: 'https://github.com', type: 'link' }
              ]
            },
            {
              id: 'les-2',
              title: '2. Backend API Architecture & Database Schemas',
              duration_mins: 20,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
              type: 'video',
              resources: [
                { name: 'Database Schema Diagram (PNG)', size: '1.1 MB', type: 'image' },
                { name: 'Postman Collection JSON', size: '45 KB', type: 'code' }
              ]
            },
            {
              id: 'les-quiz-1',
              title: '3. Knowledge Check: Core Architecture Assessment',
              duration_mins: 10,
              type: 'quiz',
              quizQuestions: [
                {
                  id: 'q1',
                  question: 'Which architectural pattern is best suited for high-throughput multi-tenant SaaS systems?',
                  options: [
                    'Monolithic without caching',
                    'Tenant-isolated database schema with Redis caching',
                    'Single shared file storage without authorization',
                    'Hardcoded static endpoints'
                  ],
                  correctAnswer: 1,
                  explanation: 'Tenant-isolated schemas or tenant keys with distributed caching provide both data isolation and scalability.'
                },
                {
                  id: 'q2',
                  question: 'What is the primary role of JWT tokens in stateless authentication?',
                  options: [
                    'To store entire user database records on client',
                    'To cryptographically verify user claims without server session storage',
                    'To compress video streams',
                    'To encrypt frontend CSS files'
                  ],
                  correctAnswer: 1,
                  explanation: 'JWT allows the server to verify user identity and roles via digital signatures without querying session stores on every request.'
                },
                {
                  id: 'q3',
                  question: 'In REST API design, which HTTP status code represents successful resource creation?',
                  options: ['200 OK', '201 Created', '204 No Content', '301 Redirect'],
                  correctAnswer: 1,
                  explanation: '201 Created is the standard HTTP status code returned when a resource is successfully created on the server.'
                }
              ]
            }
          ]
        },
        {
          id: 'mod-2',
          title: 'Module 2: Advanced Implementation & Deployments',
          lessons: [
            {
              id: 'les-3',
              title: '4. Scalable Microservices & Real-Time WebSockets',
              duration_mins: 28,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              type: 'video',
              resources: [
                { name: 'Microservices Architecture Cheat Sheet (PDF)', size: '3.8 MB', type: 'pdf' },
                { name: 'Docker Compose Setup File', size: '12 KB', type: 'code' }
              ]
            },
            {
              id: 'les-4',
              title: '5. Production CI/CD, Dockerization & Cloud Hosting',
              duration_mins: 25,
              video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              type: 'video',
              resources: [
                { name: 'Kubernetes Manifests & Helm Charts', size: '1.5 MB', type: 'archive' }
              ]
            }
          ]
        }
      ];

  const allLessons = defaultModules.flatMap(m => m.lessons || []);
  const [activeLesson, setActiveLesson] = useState(allLessons[0] || null);

  useEffect(() => {
    if (selectedCourseForPlayer) {
      const activeMods = selectedCourseForPlayer.modules && selectedCourseForPlayer.modules.length > 0
        ? selectedCourseForPlayer.modules
        : defaultModules;
      const firstLes = activeMods?.[0]?.lessons?.[0];
      if (firstLes) setActiveLesson(firstLes);
    }
  }, [selectedCourseForPlayer?.id, selectedCourseForPlayer?.modules]);

  const [activeTab, setActiveTab] = useState('overview'); 

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`lms_notes_${selectedCourseForPlayer?.id}`);
    return saved ? JSON.parse(saved) : [
      { id: 'n1', timestamp: '01:15', timeSec: 75, text: 'Remember to inspect the database connection pool settings for concurrent requests.', lessonTitle: '1. Course Overview & Production Workflow' },
      { id: 'n2', timestamp: '03:40', timeSec: 220, text: 'Key takeaway: JWT tokens must always have appropriate expiration and secret rotation.', lessonTitle: '2. Backend API Architecture & Database Schemas' }
    ];
  });
  const [newNoteText, setNewNoteText] = useState('');

  const [qaThreads, setQaThreads] = useState([
    {
      id: 'qa-1',
      author: 'Vikram Sundaram',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      title: 'How to handle WebSocket reconnects during network throttling?',
      body: 'In production environments with unstable mobile networks, what exponential backoff algorithm is recommended for socket reconnects?',
      timeAgo: '2 days ago',
      upvotes: 14,
      answers: [
        {
          id: 'ans-1',
          author: selectedCourseForPlayer?.instructor_name || 'Dr. Ronald Vance',
          isInstructor: true,
          body: 'Great question! We recommend using a randomized exponential backoff strategy starting at 1000ms with a multiplier of 1.5 and a max delay cap of 30 seconds.',
          timeAgo: '1 day ago'
        }
      ]
    },
    {
      id: 'qa-2',
      author: 'Priya Narayanan',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      title: 'Is Redis Sentinel sufficient for high availability?',
      body: 'Should we configure Redis Sentinel or Redis Cluster for caching session tokens?',
      timeAgo: '4 days ago',
      upvotes: 8,
      answers: []
    }
  ]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');
  const [showAskBox, setShowAskBox] = useState(false);
  const [replyTextMap, setReplyTextMap] = useState({});

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCertificateClaimedBanner, setShowCertificateClaimedBanner] = useState(false);

  useEffect(() => {
    if (selectedCourseForPlayer?.id) {
      localStorage.setItem(`lms_notes_${selectedCourseForPlayer.id}`, JSON.stringify(notes));
    }
  }, [notes, selectedCourseForPlayer?.id]);

  if (!selectedCourseForPlayer) return null;

  const progressPercent = Math.min(100, Math.round((completedLessons.length / Math.max(1, allLessons.length)) * 100));

  const currentIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allLessons.length - 1;

  const handleLessonComplete = (lessonId) => {
    completeLesson(selectedCourseForPlayer.id, lessonId);
  };

  const goToNextLesson = () => {
    if (hasNext) {
      const next = allLessons[currentIndex + 1];
      setActiveLesson(next);
      if (next.type === 'quiz') {
        setActiveTab('quiz');
      }
    }
  };

  const goToPrevLesson = () => {
    if (hasPrevious) {
      const prev = allLessons[currentIndex - 1];
      setActiveLesson(prev);
    }
  };

  const handlePlaybackSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnded = () => {
    if (activeLesson) {
      handleLessonComplete(activeLesson.id);
    }
    if (autoAdvance && hasNext) {
      goToNextLesson();
    }
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      timestamp: formatSeconds(currentTime),
      timeSec: currentTime,
      text: newNoteText.trim(),
      lessonTitle: activeLesson?.title || 'Lesson'
    };
    setNotes([newNote, ...notes]);
    setNewNoteText('');
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  const seekToTime = (timeSec) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSec;
      videoRef.current.play();
    }
  };

  const exportNotesAsText = () => {
    const content = `SMART LMS - Study Notes for: ${selectedCourseForPlayer.title}\nExported On: ${new Date().toLocaleString()}\n\n` +
      notes.map(n => `[${n.timestamp}] - ${n.lessonTitle}\nNote: ${n.text}\n-----------------------------------\n`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedCourseForPlayer.title.replace(/[^a-zA-Z0-9]/g, '_')}_Notes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;
    const newQ = {
      id: `qa-${Date.now()}`,
      author: currentUser?.name || 'Learner',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      title: newQuestionTitle.trim(),
      body: newQuestionBody.trim() || 'No additional details provided.',
      timeAgo: 'Just now',
      upvotes: 0,
      answers: []
    };
    setQaThreads([newQ, ...qaThreads]);
    setNewQuestionTitle('');
    setNewQuestionBody('');
    setShowAskBox(false);
  };

  const handleAddAnswer = (threadId) => {
    const text = replyTextMap[threadId];
    if (!text || !text.trim()) return;
    setQaThreads(qaThreads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          answers: [
            ...t.answers,
            {
              id: `ans-${Date.now()}`,
              author: currentUser?.name || 'Learner',
              isInstructor: false,
              body: text.trim(),
              timeAgo: 'Just now'
            }
          ]
        };
      }
      return t;
    }));
    setReplyTextMap({ ...replyTextMap, [threadId]: '' });
  };

  const handleUpvoteThread = (threadId) => {
    setQaThreads(qaThreads.map(t => t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t));
  };

  const quizQuestions = activeLesson?.quizQuestions || defaultModules[0].lessons[2].quizQuestions || [];
  
  const handleOptionSelect = (questionId, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleGradeQuiz = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });
    const percentage = Math.round((score / quizQuestions.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);
    if (percentage >= 70 && activeLesson) {
      handleLessonComplete(activeLesson.id);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const handleClaimCertificate = () => {
    if (progressPercent < 100) return;
    claimCourseCertificate(selectedCourseForPlayer.id);
    setShowCertificateClaimedBanner(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-7xl h-[92vh] rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-100">

        {}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
              <Zap className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                  {selectedCourseForPlayer.category || 'Professional Track'}
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">&bull;</span>
                <span className="text-xs text-slate-400 hidden sm:inline">Instructor: <strong className="text-slate-200">{selectedCourseForPlayer.instructor_name || 'Senior Architect'}</strong></span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate max-w-lg">
                {selectedCourseForPlayer.title}
              </h2>
            </div>
          </div>

          {}
          <div className="flex items-center gap-3 shrink-0">
            {}
            <div className="hidden md:flex items-center gap-3 bg-slate-800/80 px-3.5 py-1.5 rounded-2xl border border-slate-700/60">
              <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-slate-300 font-mono">
                {progressPercent}%
              </span>
            </div>

            {}
            {progressPercent === 100 && (
              <>
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="hidden sm:inline">Review</span>
                </button>
                <button
                  onClick={handleClaimCertificate}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-pulse transition cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Claim Certificate</span>
                </button>
              </>
            )}

            <button
              onClick={() => setSelectedCourseForPlayer(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {}
        {showCertificateClaimedBanner && (
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2.5 text-emerald-300 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Congratulations! Your official verified certificate has been generated and added to your profile!</span>
            </div>
            <button
              onClick={() => setShowCertificateClaimedBanner(false)}
              className="text-emerald-400 hover:text-emerald-200 font-bold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-950">

          {}
          <div className="lg:col-span-8 flex flex-col h-full overflow-hidden border-r border-slate-800/80 bg-slate-900/50">

            {}
            <div className="bg-black shrink-0 relative group flex flex-col justify-center">
              {activeLesson?.type === 'quiz' ? (
                
                <div className="w-full aspect-video max-h-[440px] bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col items-center justify-center p-6 sm:p-10 text-center relative overflow-y-auto">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                    {activeLesson.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6">
                    Test your understanding of core concepts before proceeding. You need at least 70% to pass and certify.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                    >
                      <Zap className="w-4 h-4" /> Start Assessment Below
                    </button>
                    <button
                      onClick={() => handleLessonComplete(activeLesson.id)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 cursor-pointer transition"
                    >
                      Mark as Reviewed
                    </button>
                  </div>
                </div>
              ) : (
                
                <div className="w-full aspect-video max-h-[440px] bg-black relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    key={activeLesson?.id || 'video'}
                    controls
                    autoPlay
                    onTimeUpdate={handleVideoTimeUpdate}
                    onEnded={handleVideoEnded}
                    className="w-full h-full object-contain"
                    src={activeLesson?.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                  />
                </div>
              )}

              {}
              <div className="px-4 py-2 bg-slate-900 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                {}
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevLesson}
                    disabled={!hasPrevious}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer ${
                      hasPrevious ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                    }`}
                    title="Previous Lesson"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    onClick={goToNextLesson}
                    disabled={!hasNext}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition cursor-pointer ${
                      hasNext ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                    }`}
                    title="Next Lesson"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-slate-400 font-mono hidden sm:inline ml-2">
                    {formatSeconds(currentTime)} / {activeLesson?.duration_mins || 15}:00
                  </span>
                </div>

                {}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-slate-800/70 p-1 rounded-xl border border-slate-700/50">
                    {[0.75, 1, 1.25, 1.5, 2].map(spd => (
                      <button
                        key={spd}
                        onClick={() => handlePlaybackSpeedChange(spd)}
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold font-mono transition cursor-pointer ${
                          playbackSpeed === spd
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>

                  <label className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoAdvance}
                      onChange={(e) => setAutoAdvance(e.target.checked)}
                      className="rounded accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
                    />
                    Auto-play Next
                  </label>

                  {}
                  {activeLesson && (
                    <button
                      onClick={() => handleLessonComplete(activeLesson.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                        completedLessons.includes(activeLesson.id)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {completedLessons.includes(activeLesson.id) ? 'Completed' : 'Complete'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {}
            <div className="flex items-center border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 gap-1 sm:gap-4 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Overview
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'notes'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" /> Notes ({notes.length})
              </button>

              <button
                onClick={() => setActiveTab('qa')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'qa'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Q&A Discussion ({qaThreads.length})
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Quiz Assessment
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === 'resources'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Download className="w-4 h-4" /> Resources ({activeLesson?.resources?.length || 2})
              </button>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/40 space-y-6">

              {}
              {activeTab === 'overview' && (
                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      About this Lesson: {activeLesson?.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedCourseForPlayer.description ||
                        'Master production-ready architectural patterns, real-time data streaming, modular components, and enterprise cloud deployments with industry-standard best practices.'}
                    </p>
                  </div>

                  {}
                  <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" /> Key Takeaways in this Module
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Understanding high-performance stateless authentication schemas</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Multi-tenant database tenancy models and data segregation</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>REST API rate-limiting, caching and WebSocket multiplexing</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>Automated CI/CD pipelines & production verification checks</span>
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                    <img
                      src={selectedCourseForPlayer.instructor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                      alt="Instructor"
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/30"
                    />
                    <div>
                      <div className="text-xs text-slate-400">Created by Lead Instructor</div>
                      <div className="text-sm font-bold text-white">{selectedCourseForPlayer.instructor_name || 'Dr. Ronald Vance'}</div>
                      <div className="text-xs text-slate-400">Principal Cloud Solutions Architect & Certified Technical Instructor</div>
                    </div>
                  </div>
                </div>
              )}

              {}
              {activeTab === 'notes' && (
                <div className="space-y-6 max-w-3xl">
                  {}
                  <form onSubmit={handleAddNote} className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-indigo-400" />
                        Capture note at <strong className="text-indigo-300 font-mono bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-800">{formatSeconds(currentTime)}</strong>
                      </span>
                      <span className="text-slate-400 text-[11px]">{activeLesson?.title}</span>
                    </div>
                    <textarea
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write your study notes, code snippet reminders, or key insights..."
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={exportNotesAsText}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Export All Notes (.txt)
                      </button>
                      <button
                        type="submit"
                        disabled={!newNoteText.trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <BookmarkCheck className="w-4 h-4" /> Save Note
                      </button>
                    </div>
                  </form>

                  {}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Saved Course Notes ({notes.length})
                    </h4>
                    {notes.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 text-xs">
                        No notes yet. Type a note above while watching to bookmark moments!
                      </div>
                    ) : (
                      notes.map(note => (
                        <div key={note.id} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start justify-between gap-3 group">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => seekToTime(note.timeSec || 0)}
                                className="px-2 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer transition"
                                title="Click to jump to video timestamp"
                              >
                                <PlayCircle className="w-3 h-3" /> {note.timestamp}
                              </button>
                              <span className="text-[11px] text-slate-400 truncate">{note.lessonTitle}</span>
                            </div>
                            <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                              {note.text}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition cursor-pointer"
                            title="Delete note"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {}
              {activeTab === 'qa' && (
                <div className="space-y-6 max-w-3xl">
                  {}
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-300">
                      Got a question? Ask our instructor and community of active learners.
                    </div>
                    <button
                      onClick={() => setShowAskBox(!showAskBox)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Ask a Question
                    </button>
                  </div>

                  {}
                  {showAskBox && (
                    <form onSubmit={handlePostQuestion} className="bg-slate-800/80 p-4 rounded-2xl border border-indigo-500/40 space-y-3 animate-fadeIn">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Post New Discussion Thread</h4>
                      <input
                        type="text"
                        value={newQuestionTitle}
                        onChange={(e) => setNewQuestionTitle(e.target.value)}
                        placeholder="Title: e.g. How to structure relational multi-tenant queries?"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        required
                      />
                      <textarea
                        value={newQuestionBody}
                        onChange={(e) => setNewQuestionBody(e.target.value)}
                        placeholder="Provide details about what you tried or errors encountered..."
                        rows={3}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAskBox(false)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" /> Post Question
                        </button>
                      </div>
                    </form>
                  )}

                  {}
                  <div className="space-y-4">
                    {qaThreads.map(thread => (
                      <div key={thread.id} className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/60 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img src={thread.avatar} alt={thread.author} className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/30" />
                            <div>
                              <div className="text-xs font-bold text-white">{thread.author}</div>
                              <div className="text-[10px] text-slate-400">{thread.timeAgo}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUpvoteThread(thread.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{thread.upvotes}</span>
                          </button>
                        </div>

                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-100 mb-1">{thread.title}</h4>
                          <p className="text-xs text-slate-300 leading-relaxed">{thread.body}</p>
                        </div>

                        {}
                        {thread.answers.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-indigo-500/40 space-y-2">
                            {thread.answers.map(ans => (
                              <div key={ans.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white">{ans.author}</span>
                                  {ans.isInstructor && (
                                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                                      Instructor Response
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500">{ans.timeAgo}</span>
                                </div>
                                <p className="text-xs text-slate-300">{ans.body}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={replyTextMap[thread.id] || ''}
                            onChange={(e) => setReplyTextMap({ ...replyTextMap, [thread.id]: e.target.value })}
                            placeholder="Write a response..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleAddAnswer(thread.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold cursor-pointer"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {}
              {activeTab === 'quiz' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-gradient-to-r from-indigo-950/60 via-slate-800 to-indigo-950/60 p-4 sm:p-5 rounded-2xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <AwardIcon className="w-5 h-5 text-indigo-400" /> Module Knowledge Assessment
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Answer all {quizQuestions.length} questions. Passing score requirement: <strong>70%</strong>.
                      </p>
                    </div>

                    {quizSubmitted && (
                      <div className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 ${
                        quizScore >= 70
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {quizScore >= 70 ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Passed: {quizScore}%
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-400" /> Failed: {quizScore}% (Retake required)
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {}
                  <div className="space-y-4">
                    {quizQuestions.map((q, idx) => {
                      const isSelected = selectedAnswers[q.id] !== undefined;
                      const isCorrect = quizSubmitted && selectedAnswers[q.id] === q.correctAnswer;
                      const isWrong = quizSubmitted && isSelected && selectedAnswers[q.id] !== q.correctAnswer;

                      return (
                        <div
                          key={q.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            quizSubmitted
                              ? isCorrect
                                ? 'bg-emerald-950/20 border-emerald-500/40'
                                : isWrong
                                ? 'bg-rose-950/20 border-rose-500/40'
                                : 'bg-slate-800/40 border-slate-700'
                              : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-100 flex items-start gap-2">
                              <span className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-[11px] font-mono font-bold text-indigo-300 shrink-0">
                                {idx + 1}
                              </span>
                              <span>{q.question}</span>
                            </h4>
                          </div>

                          <div className="space-y-2 pl-8">
                            {q.options.map((opt, optIdx) => {
                              const isOptionSelected = selectedAnswers[q.id] === optIdx;
                              const isThisCorrect = quizSubmitted && q.correctAnswer === optIdx;

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleOptionSelect(q.id, optIdx)}
                                  disabled={quizSubmitted}
                                  className={`w-full text-left p-3 rounded-xl text-xs flex items-center justify-between transition cursor-pointer ${
                                    quizSubmitted
                                      ? isThisCorrect
                                        ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 font-bold'
                                        : isOptionSelected
                                        ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                                        : 'bg-slate-900/50 text-slate-400 border border-transparent opacity-60'
                                      : isOptionSelected
                                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20 border border-indigo-400'
                                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && isThisCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {}
                          {quizSubmitted && q.explanation && (
                            <div className="mt-3 pl-8 text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                              <strong className="text-slate-300">Explanation:</strong> {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {}
                  <div className="flex items-center justify-between pt-2">
                    {quizSubmitted ? (
                      <button
                        onClick={handleRetakeQuiz}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <RotateCcw className="w-4 h-4" /> Retake Assessment
                      </button>
                    ) : (
                      <button
                        onClick={handleGradeQuiz}
                        disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer transition"
                      >
                        <Zap className="w-4 h-4" /> Submit & Grade Assessment
                      </button>
                    )}

                    {quizSubmitted && quizScore >= 70 && hasNext && (
                      <button
                        onClick={goToNextLesson}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow-md"
                      >
                        Proceed to Next Module <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {}
              {activeTab === 'resources' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="text-xs text-slate-300">
                    Download source code, slides, and cheat sheets prepared by the course instructor.
                  </div>

                  <div className="space-y-2.5">
                    {(activeLesson?.resources || [
                      { name: 'Lecture Slides & Architecture Diagrams (PDF)', size: '3.2 MB', type: 'pdf' },
                      { name: 'Full Stack Starter Boilerplate (GitHub)', url: 'https://github.com', type: 'link' },
                      { name: 'Database Schemas & Postman Collection', size: '1.1 MB', type: 'code' }
                    ]).map((res, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                            {res.type === 'link' ? <ExternalLink className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-100">{res.name}</div>
                            <div className="text-[11px] text-slate-400">{res.size || 'External Repository Link'}</div>
                          </div>
                        </div>

                        {res.type === 'link' ? (
                          <a
                            href={res.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            Open <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <button
                            onClick={() => alert(`Downloading ${res.name}...`)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {}
          <div className="lg:col-span-4 flex flex-col h-full bg-slate-900 border-l border-slate-800/80 overflow-hidden">
            {}
            <div className="p-4 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div>
                <h4 className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" /> Course Curriculum
                </h4>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {completedLessons.length} of {allLessons.length} lessons completed
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {progressPercent}% Done
                </span>
              </div>
            </div>

            {}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {defaultModules.map((mod, modIdx) => {
                const modLessons = mod.lessons || [];
                const modCompletedCount = modLessons.filter(l => completedLessons.includes(l.id)).length;

                return (
                  <div key={mod.id || modIdx} className="rounded-2xl border border-slate-800 bg-slate-800/30 overflow-hidden">
                    {}
                    <div className="p-3 bg-slate-800/70 border-b border-slate-800/60 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 line-clamp-1">
                        {mod.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2 bg-slate-900/80 px-2 py-0.5 rounded-md">
                        {modCompletedCount}/{modLessons.length}
                      </span>
                    </div>

                    {}
                    <div className="p-1.5 space-y-1">
                      {modLessons.map(les => {
                        const isCurrent = activeLesson?.id === les.id;
                        const isDone = completedLessons.includes(les.id);
                        const isQuiz = les.type === 'quiz';

                        return (
                          <button
                            key={les.id}
                            onClick={() => {
                              setActiveLesson(les);
                              if (isQuiz) setActiveTab('quiz');
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-indigo-600/30 border border-indigo-500/50 text-white font-bold shadow-xs'
                                : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : isQuiz ? (
                                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                              ) : isCurrent ? (
                                <PlayCircle className="w-4 h-4 text-indigo-400 shrink-0 animate-pulse" />
                              ) : (
                                <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className="truncate">{les.title}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {isQuiz ? (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                                  Quiz
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-500">
                                  {les.duration_mins}m
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {}
            <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-[11px]">Certificate: {progressPercent === 100 ? 'Unlocked' : 'Requires 100%'}</span>
              </div>
              {progressPercent === 100 ? (
                <button
                  onClick={handleClaimCertificate}
                  className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  View / Claim
                </button>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 font-bold">{allLessons.length - completedLessons.length} left</span>
              )}
            </div>

          </div>

        </div>

      </div>

      {}
      {showFeedbackModal && (
        <CourseFeedbackModal
          isOpen={Boolean(showFeedbackModal)}
          onClose={() => setShowFeedbackModal(false)}
          course={selectedCourseForPlayer}
          currentUser={currentUser}
          onSubmitReview={(courseId, reviewData) => {
            return submitCourseReview(courseId, reviewData);
          }}
        />
      )}

    </div>
  );
};
