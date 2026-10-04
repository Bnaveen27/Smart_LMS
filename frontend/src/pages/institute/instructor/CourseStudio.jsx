import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import { API_URL } from '../../../config/api';
import {
  BookOpen,
  ArrowLeft,
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  Layers,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Save,
  Eye,
  Check,
  Upload,
  Camera,
  Image as ImageIcon,
  DollarSign,
  GraduationCap,
  Award,
  AlertCircle,
  ExternalLink,
  Play,
  FileUp,
  Paperclip,
  Loader2,
  FileCode,
  FolderArchive,
  X,
  ListChecks,
  CheckSquare,
  ShieldCheck,
  Code,
  FileCheck2,
  Headphones,
  FileQuestion
} from 'lucide-react';
import Swal from 'sweetalert2';

const THUMBNAIL_PRESETS = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
];

export const CourseCreatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    courses, 
    createCourse, 
    updateCourse, 
    activeTenant, 
    currentUser 
  } = useApp();

  const fileInputRef = useRef(null);
  const isEditMode = Boolean(id);
  const existingCourse = isEditMode ? courses.find(c => c.id === id) : null;

  const [activeTab, setActiveTab] = useState('INFO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingLessonId, setUploadingLessonId] = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: '',
    code: '',
    subtitle: '',
    category: 'Development',
    level: 'BEGINNER',
    price: 0,
    isFree: true,
    thumbnail: THUMBNAIL_PRESETS[0],
    description: '',
    learning_outcomes: [
      'Master fundamental architecture and principles',
      'Build end-to-end practical hands-on projects',
      'Implement industry best practices and security standards'
    ],
    modules: [
      {
        id: `sec-${Date.now()}-1`,
        title: 'Week 1: Fundamentals & Environment Setup',
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: '1. Course Orientation & Syllabus Overview',
            type: 'video',
            duration_mins: 15,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            preview: true,
            description: 'Introduction to course prerequisites, tooling, and workflow.'
          },
          {
            id: `les-${Date.now()}-2`,
            title: '2. Architecture Deep Dive & Key Concepts',
            type: 'video',
            duration_mins: 25,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            preview: false,
            description: 'Core concepts, data flow, and foundational theory.'
          }
        ]
      }
    ]
  });

  useEffect(() => {
    if (existingCourse) {
      setCourseForm({
        ...existingCourse,
        price: Number(existingCourse.price) || 0,
        isFree: Number(existingCourse.price) === 0,
        thumbnail: existingCourse.thumbnail || THUMBNAIL_PRESETS[0],
        learning_outcomes: existingCourse.learning_outcomes || [
          'Master fundamental architecture and principles',
          'Build end-to-end practical hands-on projects'
        ],
        modules: existingCourse.modules && existingCourse.modules.length > 0 ? existingCourse.modules : [
          {
            id: `sec-${Date.now()}-1`,
            title: 'Week 1: Fundamentals & Getting Started',
            lessons: [
              {
                id: `les-${Date.now()}-1`,
                title: '1. Course Orientation',
                type: 'video',
                duration_mins: 15,
                video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                preview: true
              }
            ]
          }
        ]
      });
    }
  }, [existingCourse]);

  const [expandedSections, setExpandedSections] = useState({
    [courseForm.modules[0]?.id || 'sec-0']: true
  });

  const toggleSection = (secId) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('File Too Large', 'Please select an image smaller than 5MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCourseForm(prev => ({ ...prev, thumbnail: uploadEvent.target.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSection = () => {
    const secNum = courseForm.modules.length + 1;
    const newSection = {
      id: `sec-${Date.now()}`,
      title: `Week ${secNum}: Advanced Modules & Hands-on Lab`,
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: `1. Week ${secNum} Deep Dive Lecture`,
          type: 'video',
          duration_mins: 20,
          video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          preview: false,
          description: ''
        }
      ]
    };
    setCourseForm(prev => ({
      ...prev,
      modules: [...prev.modules, newSection]
    }));
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
  };

  const handleRemoveSection = (secId) => {
    if (courseForm.modules.length <= 1) {
      Swal.fire('Notice', 'A course must contain at least one section or module.', 'warning');
      return;
    }
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== secId)
    }));
  };

  const handleUpdateSectionTitle = (secId, title) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => m.id === secId ? { ...m, title } : m)
    }));
  };

  const handleAddLesson = (secId) => {
    const section = courseForm.modules.find(m => m.id === secId);
    const lesNum = (section?.lessons?.length || 0) + 1;
    const newLesson = {
      id: `les-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${lesNum}. New Topic & Practical Exercise`,
      type: 'video',
      duration_mins: 15,
      video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      preview: false,
      description: ''
    };

    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return { ...m, lessons: [...(m.lessons || []), newLesson] };
        }
        return m;
      })
    }));
  };

  const handleUpdateLesson = (secId, lesId, field, value) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return {
            ...m,
            lessons: (m.lessons || []).map(l => l.id === lesId ? { ...l, [field]: value } : l)
          };
        }
        return m;
      })
    }));
  };

  const handleRemoveLesson = (secId, lesId) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return { ...m, lessons: (m.lessons || []).filter(l => l.id !== lesId) };
        }
        return m;
      })
    }));
  };

  const handleLessonFileUpload = async (secId, lesId, file) => {
    if (!file) return;

    if (file.size > 250 * 1024 * 1024) {
      Swal.fire('File Too Large', 'Please upload a video, document or package smaller than 250MB.', 'warning');
      return;
    }

    setUploadingLessonId(lesId);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/api/courses/upload-content`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result.success && result.data) {
        const fileUrl = result.data.url;
        const fileName = result.data.fileName || file.name;
        const mime = (result.data.mimeType || file.type || '').toLowerCase();

        let detectedType = 'video';
        if (mime.includes('pdf') || mime.includes('document') || mime.includes('text') || fileName.endsWith('.pdf') || fileName.endsWith('.docx') || fileName.endsWith('.pptx')) {
          detectedType = 'reading';
        } else if (fileName.endsWith('.zip')) {
          detectedType = 'scorm';
        }

        setCourseForm(prev => ({
          ...prev,
          modules: prev.modules.map(m => {
            if (m.id === secId) {
              return {
                ...m,
                lessons: (m.lessons || []).map(l => {
                  if (l.id === lesId) {
                    return {
                      ...l,
                      video_url: fileUrl,
                      content_url: fileUrl,
                      file_name: fileName,
                      file_size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                      type: detectedType
                    };
                  }
                  return l;
                })
              };
            }
            return m;
          })
        }));

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: `Uploaded: ${fileName}`,
          showConfirmButton: false,
          timer: 2500
        });
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (err) {
      console.warn('Backend upload note, using local preview buffer:', err.message);
      const localUrl = URL.createObjectURL(file);
      const fileName = file.name;
      const mime = (file.type || '').toLowerCase();
      let detectedType = 'video';
      if (mime.includes('pdf') || mime.includes('document') || fileName.endsWith('.pdf')) {
        detectedType = 'reading';
      } else if (fileName.endsWith('.zip')) {
        detectedType = 'scorm';
      }

      setCourseForm(prev => ({
        ...prev,
        modules: prev.modules.map(m => {
          if (m.id === secId) {
            return {
              ...m,
              lessons: (m.lessons || []).map(l => {
                if (l.id === lesId) {
                  return {
                    ...l,
                    video_url: localUrl,
                    content_url: localUrl,
                    file_name: fileName,
                    file_size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                    type: detectedType
                  };
                }
                return l;
              })
            };
          }
          return m;
        })
      }));

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: `Loaded file: ${file.name}`,
        showConfirmButton: false,
        timer: 2500
      });
    } finally {
      setUploadingLessonId(null);
    }
  };

  const handleToggleModuleAssessment = (secId) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          const currentAssessment = m.assessment || {
            enabled: false,
            title: `${m.title} - Knowledge Check & Quiz`,
            type: 'quiz',
            passing_score: 70,
            time_limit_mins: 15,
            instructions: 'Answer all questions to demonstrate mastery of this module before advancing.',
            require_passing_to_unlock: true,
            questions: [
              {
                id: `q-${Date.now()}-1`,
                question: 'What is the primary architectural concept introduced in this module?',
                options: [
                  'Core system fundamentals & modular design',
                  'Legacy deprecated patterns',
                  'Unstructured ad-hoc scripting',
                  'None of the above'
                ],
                correct_answer: 0,
                explanation: 'This option reflects the foundational principle learned in this module.'
              }
            ]
          };
          return {
            ...m,
            assessment: {
              ...currentAssessment,
              enabled: !currentAssessment.enabled
            }
          };
        }
        return m;
      })
    }));
  };

  const handleUpdateModuleAssessment = (secId, field, value) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return {
            ...m,
            assessment: {
              ...(m.assessment || {}),
              [field]: value
            }
          };
        }
        return m;
      })
    }));
  };

  const handleAddAssessmentQuestion = (secId) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          const questions = m.assessment?.questions || [];
          const newQ = {
            id: `q-${Date.now()}-${questions.length + 1}`,
            question: '',
            options: [
              'Option A',
              'Option B',
              'Option C',
              'Option D'
            ],
            correct_answer: 0,
            explanation: ''
          };
          return {
            ...m,
            assessment: {
              ...(m.assessment || {}),
              questions: [...questions, newQ]
            }
          };
        }
        return m;
      })
    }));
  };

  const handleUpdateAssessmentQuestion = (secId, qId, field, value) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return {
            ...m,
            assessment: {
              ...(m.assessment || {}),
              questions: (m.assessment?.questions || []).map(q => q.id === qId ? { ...q, [field]: value } : q)
            }
          };
        }
        return m;
      })
    }));
  };

  const handleUpdateAssessmentOption = (secId, qId, optIdx, value) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return {
            ...m,
            assessment: {
              ...(m.assessment || {}),
              questions: (m.assessment?.questions || []).map(q => {
                if (q.id === qId) {
                  const updatedOpts = [...(q.options || ['', '', '', ''])];
                  updatedOpts[optIdx] = value;
                  return { ...q, options: updatedOpts };
                }
                return q;
              })
            }
          };
        }
        return m;
      })
    }));
  };

  const handleRemoveAssessmentQuestion = (secId, qId) => {
    setCourseForm(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === secId) {
          return {
            ...m,
            assessment: {
              ...(m.assessment || {}),
              questions: (m.assessment?.questions || []).filter(q => q.id !== qId)
            }
          };
        }
        return m;
      })
    }));
  };

  const handleQuickGenerateSyllabus = (weeksCount = 6) => {
    const topics = [
      'Foundations, Core Concepts & Architecture',
      'Database Modeling, Queries & RESTful APIs',
      'State Management, Security & Authentication',
      'Testing, Performance Optimization & CI/CD',
      'Advanced Framework Features & Microservices',
      'Full-Stack Cloud Integration & Storage',
      'Real-Time WebSockets & Message Queues',
      'System Security, OWASP & Token Encryption',
      'Containerization, Docker & Kubernetes Deployment',
      'Performance Profiling, Caching & Scalability',
      'Production Monitoring, Logs & Observability',
      'Capstone Project, Code Review & Graduation'
    ];

    const generatedModules = [];
    for (let i = 0; i < weeksCount; i++) {
      const topic = topics[i % topics.length];
      generatedModules.push({
        id: `sec-${Date.now()}-${i + 1}`,
        title: `Week ${i + 1}: ${topic}`,
        lessons: [
          {
            id: `les-${Date.now()}-${i + 1}-1`,
            title: `1. ${topic} - Theory & Principles`,
            type: 'video',
            duration_mins: 20,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            preview: i === 0,
            description: `Core theoretical concepts and architectural guidelines for ${topic}.`
          },
          {
            id: `les-${Date.now()}-${i + 1}-2`,
            title: `2. ${topic} - Hands-on Implementation Lab`,
            type: 'video',
            duration_mins: 30,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            preview: false,
            description: `Practical coding exercise and implementation lab.`
          },
          {
            id: `les-${Date.now()}-${i + 1}-3`,
            title: `3. Knowledge Check & Module Quiz`,
            type: 'quiz',
            duration_mins: 15,
            preview: false,
            description: `Assessment questions on ${topic}.`
          }
        ]
      });
    }

    setCourseForm(prev => ({
      ...prev,
      modules: generatedModules
    }));

    const allOpen = {};
    generatedModules.forEach(m => { allOpen[m.id] = true; });
    setExpandedSections(allOpen);

    Swal.fire({
      icon: 'success',
      title: `${weeksCount}-Week Syllabus Generated!`,
      text: `Created ${generatedModules.length} structured modules with video lectures and quizzes. All will be saved to DB when you click Publish.`,
      timer: 1800,
      showConfirmButton: false
    });
  };

  const totalLectures = courseForm.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalMins = courseForm.modules.reduce((acc, m) => {
    return acc + (m.lessons?.reduce((lAcc, l) => lAcc + (Number(l.duration_mins) || 15), 0) || 0);
  }, 0);
  const totalHours = (totalMins / 60).toFixed(1);

  const handleSaveCourse = async (published = true) => {
    if (!courseForm.title.trim()) {
      Swal.fire('Title Required', 'Please provide a course title before saving.', 'warning');
      setActiveTab('INFO');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      id: isEditMode ? id : `course-${Date.now()}`,
      tenant_id: activeTenant?.id || 'tenant-default',
      instructor_id: currentUser?.id || null,
      instructor_name: currentUser?.name || 'Academic Instructor',
      instructor_email: currentUser?.email || '',
      title: courseForm.title.trim(),
      code: courseForm.code ? courseForm.code.trim() : `CRS-${Math.floor(100 + Math.random() * 900)}`,
      subtitle: courseForm.subtitle || '',
      category: courseForm.category || 'Development',
      level: courseForm.level || 'BEGINNER',
      price: courseForm.isFree ? 0 : Number(courseForm.price) || 0,
      thumbnail: courseForm.thumbnail,
      description: courseForm.description || '',
      learning_outcomes: courseForm.learning_outcomes,
      modules: courseForm.modules,
      published
    };

    try {
      if (isEditMode) {
        await updateCourse(payload);
      } else {
        await createCourse(payload);
      }

      setIsSubmitting(false);

      Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Course Updated!' : 'Course Published!',
        text: `Course "${payload.title}" and its ${courseForm.modules.length} modules have been saved to the MySQL database.`,
        confirmButtonColor: '#4f46e5'
      }).then(() => {
        const returnUrl = currentUser?.role === 'SUPER_ADMIN' ? '/superadmin/courses' : '/instructor';
        navigate(returnUrl);
      });
    } catch (err) {
      setIsSubmitting(false);
      Swal.fire('Error', 'Failed to save course in database: ' + err.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      
      {}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleThumbnailUpload}
        accept="image/*"
        className="hidden"
      />

      {}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm px-4 sm:px-8 py-3.5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={currentUser?.role === 'SUPER_ADMIN' ? '/superadmin/courses' : '/instructor'}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition"
            title="Back to Courses"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {isEditMode ? 'Edit Course Studio' : 'Course Creator & Curriculum Studio'}
              </span>
              <span className="text-xs text-slate-400 font-medium">| {activeTenant?.name || 'Academic Institute'}</span>
            </div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {courseForm.title ? courseForm.title : (isEditMode ? 'Edit Course Content' : 'Create New Academic Course')}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSaveCourse(false)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveCourse(true)}
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving to Database...' : (isEditMode ? 'Save & Update Course' : 'Publish Course & Content')}</span>
          </button>
        </div>
      </header>

      {}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'INFO'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Course Details & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('CURRICULUM')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'CURRICULUM'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>2. Curriculum & Lesson Builder ({courseForm.modules.length} Weeks • {totalLectures} Lectures)</span>
          </button>

          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'PREVIEW'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>3. Student View Preview</span>
          </button>
        </div>

        {}
        {}
        {}
        {activeTab === 'INFO' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
            
            {}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Distributed Systems & Cloud Architecture"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Headline / Subtitle</label>
                <input
                  type="text"
                  placeholder="e.g. Master microservices, high-throughput pipelines, and distributed DBs"
                  value={courseForm.subtitle}
                  onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Course Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS-402"
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Academic Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="Development">Software Engineering & Dev</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Cybersecurity">Cybersecurity & Networking</option>
                    <option value="Cloud Computing">Cloud Computing & DevOps</option>
                    <option value="Business & Management">Business & Management</option>
                    <option value="General Science">General Science & Math</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-800">Difficulty Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="BEGINNER">Beginner Level</option>
                    <option value="INTERMEDIATE">Intermediate Level</option>
                    <option value="ADVANCED">Advanced Level</option>
                  </select>
                </div>
              </div>

              {}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Course Tuition / Pricing</span>
                    <span className="text-[11px] text-slate-500">Allow free access or charge a one-time enrollment fee</span>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, isFree: true, price: 0 })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        courseForm.isFree ? 'bg-emerald-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseForm({ ...courseForm, isFree: false, price: courseForm.price || 499 })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        !courseForm.isFree ? 'bg-indigo-600 text-white' : 'text-slate-600'
                      }`}
                    >
                      Paid (₹)
                    </button>
                  </div>
                </div>

                {!courseForm.isFree && (
                  <div className="pt-2 border-t border-slate-200/80 flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-700">Course Price (INR):</span>
                    <div className="relative w-40">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                      <input
                        type="number"
                        min="1"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-900 font-bold font-mono focus:outline-none focus:border-indigo-600"
                        placeholder="e.g. 499"
                      />
                    </div>
                  </div>
                )}
              </div>

              {}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-800">Course Description & Syllabus Overview</label>
                <textarea
                  rows={4}
                  placeholder="Describe the target audience, weekly roadmap, and what students will build..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('CURRICULUM')}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Curriculum Builder</span> &rarr;
                </button>
              </div>

            </div>

            {}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">Course Cover Image</span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video group bg-slate-100 shadow-inner">
                  <img
                    src={courseForm.thumbnail}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5 cursor-pointer backdrop-blur-xs"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Change Cover Photo</span>
                  </div>
                </div>

                {}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">Or Choose from Curated Library:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {THUMBNAIL_PRESETS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCourseForm({ ...courseForm, thumbnail: url })}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-video transition cursor-pointer ${
                          courseForm.thumbnail === url
                            ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105 shadow-sm'
                            : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-400'
                        }`}
                      >
                        <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                        {courseForm.thumbnail === url && (
                          <div className="absolute inset-0 bg-indigo-600/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-3xl p-5 text-xs space-y-2.5">
                <div className="font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Syllabus Highlights
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Structured Weeks / Modules:</span>
                  <strong className="text-slate-900 font-mono">{courseForm.modules.length}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Lectures & Labs:</span>
                  <strong className="text-slate-900 font-mono">{totalLectures}</strong>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Total Video & Reading Hours:</span>
                  <strong className="text-slate-900 font-mono">{totalHours} Hours</strong>
                </div>
              </div>

            </div>

          </div>
        )}

        {}
        {}
        {}
        {activeTab === 'CURRICULUM' && (
          <div className="space-y-6 animate-fadeIn">
            
            {}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-indigo-600/15 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-200" />
                  <h3 className="font-black text-base tracking-tight">Need an Instant Syllabus Blueprint?</h3>
                </div>
                <p className="text-xs text-indigo-100 mt-1">
                  Generate structured multi-week curriculums with complete theory lessons, coding labs, and quizzes in one click.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleQuickGenerateSyllabus(4)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    courseForm.modules.length === 4
                      ? 'bg-white text-indigo-700 font-black shadow-md scale-105'
                      : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
                  }`}
                >
                  ⚡ 4-Week Fast Track
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGenerateSyllabus(6)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    courseForm.modules.length === 6
                      ? 'bg-white text-indigo-700 font-black shadow-md scale-105'
                      : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
                  }`}
                >
                  🚀 6-Week Standard
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGenerateSyllabus(8)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    courseForm.modules.length === 8
                      ? 'bg-white text-indigo-700 font-black shadow-md scale-105'
                      : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
                  }`}
                >
                  🎓 8-Week Deep Dive
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickGenerateSyllabus(12)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                    courseForm.modules.length === 12
                      ? 'bg-white text-indigo-700 font-black shadow-md scale-105'
                      : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm'
                  }`}
                >
                  🏆 12-Week Semester
                </button>
              </div>
            </div>

            {}
            <div className="space-y-4">
              {courseForm.modules.map((module, mIdx) => {
                const isExpanded = expandedSections[module.id];
                const sectionDuration = (module.lessons || []).reduce((acc, l) => acc + (Number(l.duration_mins) || 15), 0);

                return (
                  <div 
                    key={module.id} 
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
                  >
                    
                    {}
                    <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleSection(module.id)}
                          className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 transition shrink-0 cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={module.title}
                            onChange={(e) => handleUpdateSectionTitle(module.id, e.target.value)}
                            className="w-full bg-transparent font-extrabold text-sm text-slate-900 focus:outline-none focus:bg-white focus:border focus:border-indigo-600 px-2 py-1 rounded-lg transition"
                            placeholder="Section Title (e.g. Week 1: Foundations)"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">
                          {module.lessons?.length || 0} Lessons • {sectionDuration} Mins
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => handleAddLesson(module.id)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Lesson
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveSection(module.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          title="Delete Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {}
                    {isExpanded && (
                      <div className="p-4 sm:p-5 space-y-3 bg-white">
                        {(!module.lessons || module.lessons.length === 0) ? (
                          <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                            <p className="font-semibold text-xs text-slate-500">No lessons in this module yet.</p>
                            <button
                              type="button"
                              onClick={() => handleAddLesson(module.id)}
                              className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                            >
                              + Click here to add your first lecture
                            </button>
                          </div>
                        ) : (
                          module.lessons.map((lesson, lIdx) => (
                            <div 
                              key={lesson.id}
                              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                
                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                  <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                    {lesson.type === 'video' ? <Video className="w-3.5 h-3.5" /> : lesson.type === 'quiz' ? <HelpCircle className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                                  </div>
                                  
                                  <input
                                    type="text"
                                    value={lesson.title}
                                    onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'title', e.target.value)}
                                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                                    placeholder="Lesson Title"
                                  />
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {}
                                  <select
                                    value={lesson.type || 'video'}
                                    onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'type', e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                                  >
                                    <option value="video">🎬 Video Lecture</option>
                                    <option value="document">📄 PDF / Slide Deck</option>
                                    <option value="reading">📖 Reading / Notes</option>
                                    <option value="lab">💻 Coding Lab / Repo</option>
                                    <option value="audio">🎙️ Audio / Podcast</option>
                                    <option value="scorm">📦 Interactive SCORM</option>
                                  </select>

                                  {}
                                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-xs">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    <input
                                      type="number"
                                      min="1"
                                      value={lesson.duration_mins || 15}
                                      onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'duration_mins', e.target.value)}
                                      className="w-12 text-center font-bold text-slate-900 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">m</span>
                                  </div>

                                  {}
                                  <label className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(lesson.preview)}
                                      onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'preview', e.target.checked)}
                                      className="accent-indigo-600 w-3.5 h-3.5"
                                    />
                                    <span>Preview</span>
                                  </label>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveLesson(module.id, lesson.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                    title="Delete Lesson"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                              </div>

                              {/* Content Source & Upload Options */}
                              <div className="space-y-3 pt-1">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                                  
                                  {/* Left: Content Source URL & File Upload */}
                                  <div className="lg:col-span-7 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                                        {lesson.type === 'video' ? <Video className="w-3.5 h-3.5 text-indigo-600" /> :
                                         lesson.type === 'reading' ? <FileText className="w-3.5 h-3.5 text-amber-600" /> :
                                         lesson.type === 'lab' ? <Code className="w-3.5 h-3.5 text-emerald-600" /> :
                                         lesson.type === 'audio' ? <Headphones className="w-3.5 h-3.5 text-purple-600" /> :
                                         lesson.type === 'scorm' ? <FolderArchive className="w-3.5 h-3.5 text-sky-600" /> :
                                         <FileText className="w-3.5 h-3.5 text-indigo-600" />}
                                        <span>
                                          {lesson.type === 'video' ? 'Video Stream URL or Upload File (MP4, WebM, MOV)' :
                                           lesson.type === 'reading' ? 'Document / Reading PDF URL or Upload' :
                                           lesson.type === 'lab' ? 'Lab Exercise / Starter Code Repo Link' :
                                           lesson.type === 'audio' ? 'Audio Stream URL or Upload (.mp3)' :
                                           lesson.type === 'scorm' ? 'SCORM ZIP Package URL or Upload' :
                                           'Content Source (URL or Upload File)'}
                                        </span>
                                      </label>
                                      
                                      <label 
                                        htmlFor={`lesson-upload-${lesson.id}`}
                                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 rounded-lg cursor-pointer transition-colors shadow-xs"
                                      >
                                        {uploadingLessonId === lesson.id ? (
                                          <>
                                            <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
                                            <span>Uploading...</span>
                                          </>
                                        ) : (
                                          <>
                                            <FileUp className="w-3 h-3 text-indigo-600" />
                                            <span>Upload Content</span>
                                          </>
                                        )}
                                      </label>
                                      <input
                                        id={`lesson-upload-${lesson.id}`}
                                        type="file"
                                        accept="video/*,.mp4,.webm,.mov,.pdf,.ppt,.pptx,.doc,.docx,.zip,.mp3"
                                        className="hidden"
                                        disabled={uploadingLessonId === lesson.id}
                                        onChange={(e) => {
                                          if (e.target.files?.[0]) {
                                            handleLessonFileUpload(module.id, lesson.id, e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </div>

                                    <div className="relative flex items-center">
                                      <input
                                        type="text"
                                        value={lesson.video_url || ''}
                                        onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'video_url', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-24 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                                        placeholder={
                                          lesson.type === 'video' ? 'https://... (MP4, YouTube, Vimeo, Drive)' :
                                          lesson.type === 'lab' ? 'https://github.com/... or starter repo' :
                                          'https://... (Content URL or upload from device)'
                                        }
                                      />
                                      <label
                                        htmlFor={`lesson-upload-${lesson.id}`}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 rounded-lg text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                                        title="Upload File"
                                      >
                                        <Upload className="w-3 h-3" />
                                        <span>Browse</span>
                                      </label>
                                    </div>

                                    {lesson.file_name && (
                                      <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                        <div className="flex items-center gap-1.5 truncate">
                                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                          <span className="font-semibold truncate">{lesson.file_name}</span>
                                          {lesson.file_size && <span className="text-emerald-600 font-mono">({lesson.file_size})</span>}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleUpdateLesson(module.id, lesson.id, 'file_name', '');
                                            handleUpdateLesson(module.id, lesson.id, 'video_url', '');
                                          }}
                                          className="text-emerald-700 hover:text-rose-600 p-0.5 ml-2 cursor-pointer"
                                          title="Remove File"
                                        >
                                          <X className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {/* Right: Multi-line Textarea for Notes & Objectives */}
                                  <div className="lg:col-span-5 space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <label className="text-[11px] font-bold text-slate-700 block">
                                        Lesson Notes & Learning Objectives
                                      </label>
                                      <span className="text-[10px] text-slate-400 font-medium">Textarea</span>
                                    </div>
                                    <textarea
                                      rows={2}
                                      value={lesson.description || ''}
                                      onChange={(e) => handleUpdateLesson(module.id, lesson.id, 'description', e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition resize-y"
                                      placeholder="Write lecture highlights, key takeaways, code instructions, or readings..."
                                    />
                                  </div>

                                </div>
                              </div>

                            </div>
                          ))
                        )}

                        {/* Module End Assessment & Exam Section */}
                        <div className="mt-4 pt-4 border-t border-slate-200/80">
                          <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            module.assessment?.enabled
                              ? 'bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border-indigo-200 shadow-sm'
                              : 'bg-slate-50/60 border-slate-200'
                          }`}>
                            
                            {/* Assessment Header & Toggle */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                  module.assessment?.enabled 
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                                    : 'bg-slate-200 text-slate-500'
                                }`}>
                                  <ListChecks className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                                      Module End Assessment & Exam
                                    </h4>
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                      module.assessment?.enabled
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        : 'bg-slate-200/80 text-slate-600'
                                    }`}>
                                      {module.assessment?.enabled ? (module.assessment?.type === 'assignment' ? '💼 Project / Assignment' : '📝 Quiz Assessment') : 'Optional'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    Evaluate learners at the end of {module.title || 'this module'} with quizzes or assignments.
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleModuleAssessment(module.id)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                                  module.assessment?.enabled
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                                }`}
                              >
                                {module.assessment?.enabled ? (
                                  <>
                                    <X className="w-3.5 h-3.5" />
                                    <span>Disable Assessment</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Add Module Assessment</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Active Assessment Configuration */}
                            {module.assessment?.enabled && (
                              <div className="mt-4 pt-4 border-t border-indigo-100/80 space-y-4 animate-fadeIn">
                                
                                {/* Assessment Type & Core Meta Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="space-y-1 sm:col-span-1">
                                    <label className="text-[11px] font-bold text-slate-700 block">Assessment Type</label>
                                    <select
                                      value={module.assessment?.type || 'quiz'}
                                      onChange={(e) => handleUpdateModuleAssessment(module.id, 'type', e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600 cursor-pointer"
                                    >
                                      <option value="quiz">📝 Multiple Choice Quiz (MCQs)</option>
                                      <option value="assignment">💼 Practical Assignment / Project</option>
                                    </select>
                                  </div>

                                  <div className="space-y-1 sm:col-span-1">
                                    <label className="text-[11px] font-bold text-slate-700 block">Assessment Title</label>
                                    <input
                                      type="text"
                                      value={module.assessment?.title || ''}
                                      onChange={(e) => handleUpdateModuleAssessment(module.id, 'title', e.target.value)}
                                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-600"
                                      placeholder="e.g. Week 1 Comprehensive Mastery Test"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 sm:col-span-1">
                                    <div className="space-y-1">
                                      <label className="text-[11px] font-bold text-slate-700 block">Pass Score (%)</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={module.assessment?.passing_score || 70}
                                        onChange={(e) => handleUpdateModuleAssessment(module.id, 'passing_score', Number(e.target.value) || 70)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold font-mono focus:outline-none focus:border-indigo-600"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[11px] font-bold text-slate-700 block">Time (Mins)</label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={module.assessment?.time_limit_mins || 15}
                                        onChange={(e) => handleUpdateModuleAssessment(module.id, 'time_limit_mins', Number(e.target.value) || 15)}
                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold font-mono focus:outline-none focus:border-indigo-600"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Textarea for Assessment Instructions */}
                                <div className="space-y-1">
                                  <label className="text-[11px] font-bold text-slate-700 block">
                                    Instructions & Guidelines for Learners (Textarea)
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={module.assessment?.instructions || ''}
                                    onChange={(e) => handleUpdateModuleAssessment(module.id, 'instructions', e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition"
                                    placeholder="Provide assessment guidelines, grading criteria, or submission format instructions..."
                                  />
                                </div>

                                {/* Prerequisite Gate Checkbox */}
                                <div className="p-3 bg-white border border-indigo-100 rounded-xl flex items-center justify-between">
                                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                                    <input
                                      type="checkbox"
                                      checked={Boolean(module.assessment?.require_passing_to_unlock)}
                                      onChange={(e) => handleUpdateModuleAssessment(module.id, 'require_passing_to_unlock', e.target.checked)}
                                      className="accent-indigo-600 w-4 h-4"
                                    />
                                    <span className="flex items-center gap-1.5">
                                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                                      Prerequisite Gate: Require passing this assessment to unlock next module
                                    </span>
                                  </label>
                                </div>

                                {/* MCQ Quiz Questions Builder */}
                                {(!module.assessment?.type || module.assessment?.type === 'quiz') && (
                                  <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                                        <HelpCircle className="w-4 h-4 text-indigo-600" />
                                        Quiz Questions ({module.assessment?.questions?.length || 0})
                                      </span>
                                      
                                      <button
                                        type="button"
                                        onClick={() => handleAddAssessmentQuestion(module.id)}
                                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-lg flex items-center gap-1 transition cursor-pointer"
                                      >
                                        <Plus className="w-3.5 h-3.5" /> Add Question
                                      </button>
                                    </div>

                                    <div className="space-y-3">
                                      {(module.assessment?.questions || []).map((q, qIdx) => (
                                        <div key={q.id} className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-extrabold text-indigo-600">Q{qIdx + 1}.</span>
                                            <input
                                              type="text"
                                              value={q.question}
                                              onChange={(e) => handleUpdateAssessmentQuestion(module.id, q.id, 'question', e.target.value)}
                                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:bg-white focus:border-indigo-600"
                                              placeholder="Type question prompt here..."
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleRemoveAssessmentQuestion(module.id, q.id)}
                                              className="p-1.5 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                              title="Remove Question"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                          {/* 4 Options with Radio */}
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4">
                                            {['A', 'B', 'C', 'D'].map((optKey, oIdx) => (
                                              <div key={oIdx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
                                                <input
                                                  type="radio"
                                                  name={`correct-ans-${module.id}-${q.id}`}
                                                  checked={q.correct_answer === oIdx}
                                                  onChange={() => handleUpdateAssessmentQuestion(module.id, q.id, 'correct_answer', oIdx)}
                                                  className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer"
                                                  title="Mark as correct answer"
                                                />
                                                <span className="text-[10px] font-bold text-slate-500">{optKey}.</span>
                                                <input
                                                  type="text"
                                                  value={q.options?.[oIdx] || ''}
                                                  onChange={(e) => handleUpdateAssessmentOption(module.id, q.id, oIdx, e.target.value)}
                                                  className="flex-1 bg-transparent text-xs text-slate-800 font-medium focus:outline-none"
                                                  placeholder={`Option ${optKey}`}
                                                />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

              {}
              <button
                type="button"
                onClick={handleAddSection}
                className="w-full py-4 rounded-3xl border-2 border-dashed border-indigo-200 hover:border-indigo-600 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Week / Module to Syllabus</span>
              </button>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setActiveTab('INFO')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                &larr; Back to Details
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('PREVIEW')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Preview Student View</span> &rarr;
              </button>
            </div>

          </div>
        )}

        {}
        {}
        {}
        {activeTab === 'PREVIEW' && (
          <div className="space-y-6 animate-fadeIn">
            
            {}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <img
                src={courseForm.thumbnail}
                alt="Course"
                className="w-full md:w-64 aspect-video object-cover rounded-2xl ring-1 ring-slate-200 shadow-md shrink-0"
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold">
                    {courseForm.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold">
                    {courseForm.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    {courseForm.isFree ? 'FREE COURSE' : `₹ ${courseForm.price}`}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {courseForm.title || 'Untitled Course'}
                </h2>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  {courseForm.description || courseForm.subtitle || 'No description provided.'}
                </p>

                <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span>Instructor: <strong className="text-slate-800">{currentUser?.name || 'Faculty Member'}</strong></span>
                  <span>•</span>
                  <span>{courseForm.modules.length} Modules</span>
                  <span>•</span>
                  <span>{totalLectures} Lectures ({totalHours}h Total)</span>
                </div>
              </div>
            </div>

            {}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900">Course Syllabus & Curriculum Breakdown</h3>
              
              <div className="space-y-3">
                {courseForm.modules.map((m, mIdx) => (
                  <div key={m.id} className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="p-4 bg-slate-50 flex items-center justify-between font-extrabold text-xs text-slate-800">
                      <span>{m.title}</span>
                      <span className="text-slate-500 font-medium">{m.lessons?.length || 0} Lectures</span>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                      {(m.lessons || []).map((l, lIdx) => (
                        <div key={l.id} className="p-3 px-4 flex items-center justify-between hover:bg-slate-50/50">
                          <div className="flex items-center gap-2 text-slate-700">
                            <Play className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{l.title}</span>
                            {l.preview && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded">
                                Free Preview
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono text-[11px]">{l.duration_mins || 15} mins</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {}
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-base">Ready to Publish Course?</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your course and all its modules will be saved directly to the MySQL database and made immediately accessible to learners.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('CURRICULUM')}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  &larr; Edit Curriculum
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCourse(true)}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving to Database...' : 'Save & Publish Course'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
