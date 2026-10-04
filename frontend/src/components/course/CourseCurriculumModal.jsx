import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  BookOpen, 
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
  Link,
  Edit2,
  Calendar,
  Eye,
  Check,
  Upload,
  FileUp,
  Loader2
} from 'lucide-react';
import Swal from 'sweetalert2';
import { API_URL } from '../../config/api';
import { formatSectionDuration, formatTotalCourseDuration } from './CourseContentAccordion';

export default function CourseCurriculumModal({ isOpen, onClose, course, onSave }) {
  if (!isOpen || !course) return null;

  const [courseData, setCourseData] = useState({
    ...course,
    price: course.price !== undefined ? course.price : 0,
    modules: course.modules && course.modules.length > 0 ? course.modules : [
      {
        id: `sec-${Date.now()}-1`,
        title: 'Week 1: Fundamentals & Getting Started',
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: '1. Course Orientation & Environment Setup',
            type: 'video',
            duration_mins: 15,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            preview: true
          },
          {
            id: `les-${Date.now()}-2`,
            title: '2. Core Principles & Architecture Overview',
            type: 'video',
            duration_mins: 25,
            video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            preview: false
          }
        ]
      }
    ]
  });

  const [expandedSections, setExpandedSections] = useState({
    [courseData.modules[0]?.id || 'sec-0']: true
  });

  const [activeTab, setActiveTab] = useState('EDITOR'); 
  const [editingLessonSectionId, setEditingLessonSectionId] = useState(null);
  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    type: 'video', 
    duration_mins: 15,
    video_url: '',
    preview: false,
    description: ''
  });

  const totalSections = courseData.modules.length;
  const totalLectures = courseData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const totalMins = courseData.modules.reduce((acc, m) => {
    return acc + (m.lessons?.reduce((lAcc, l) => lAcc + (Number(l.duration_mins) || 15), 0) || 0);
  }, 0);

  const toggleSection = (secId) => {
    setExpandedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  const toggleAllSections = () => {
    const areAllOpen = courseData.modules.every(m => expandedSections[m.id]);
    if (areAllOpen) {
      setExpandedSections({});
    } else {
      const all = {};
      courseData.modules.forEach(m => { all[m.id] = true; });
      setExpandedSections(all);
    }
  };

  const handleAddSection = () => {
    const secNum = courseData.modules.length + 1;
    const newSection = {
      id: `sec-${Date.now()}`,
      title: `Week ${secNum}: Advanced Modules & Hands-on Lab`,
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: `1. Week ${secNum} Deep Dive & Theory`,
          type: 'video',
          duration_mins: 20,
          video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          preview: false
        }
      ]
    };
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, newSection]
    }));
    setExpandedSections(prev => ({ ...prev, [newSection.id]: true }));
  };

  const handleRemoveSection = (secId) => {
    if (courseData.modules.length <= 1) {
      Swal.fire('Notice', 'A course must have at least one section or week.', 'warning');
      return;
    }
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.filter(m => m.id !== secId)
    }));
  };

  const handleQuickPopulate = (weeksCount = 6) => {
    Swal.fire({
      title: `Populate ${weeksCount}-Week Syllabus?`,
      text: `This will structure a comprehensive ${weeksCount}-week course curriculum with structured lectures and hours.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Yes, Populate!'
    }).then((result) => {
      if (result.isConfirmed) {
        const topics = [
          'Foundations, Core Concepts & Architecture',
          'Data Structures, Query Optimization & Modeling',
          'State Management & Scalable Design Patterns',
          'Security, Authentication & Cloud Integrations',
          'Testing, CI/CD Deployment & Best Practices',
          'Capstone Project, Code Review & Graduation',
          'Microservices & Distributed Systems',
          'Performance Profiling & Observability'
        ];

        const newModules = Array.from({ length: weeksCount }).map((_, wIdx) => {
          const weekNum = wIdx + 1;
          const topic = topics[wIdx % topics.length];
          return {
            id: `sec-${Date.now()}-${weekNum}`,
            title: `Week ${weekNum}: ${topic}`,
            lessons: [
              {
                id: `les-${Date.now()}-${weekNum}-1`,
                title: `${weekNum}.1 Conceptual Theory & Overview`,
                type: 'video',
                duration_mins: 25,
                video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                preview: weekNum === 1
              },
              {
                id: `les-${Date.now()}-${weekNum}-2`,
                title: `${weekNum}.2 Architecture & Live Coding Session`,
                type: 'video',
                duration_mins: 35,
                video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
                preview: false
              },
              {
                id: `les-${Date.now()}-${weekNum}-3`,
                title: `${weekNum}.3 Academic Reading & Supplementary Notes`,
                type: 'reading',
                duration_mins: 15,
                video_url: '',
                preview: false
              },
              {
                id: `les-${Date.now()}-${weekNum}-4`,
                title: `${weekNum}.4 Weekly Knowledge Check Quiz`,
                type: 'quiz',
                duration_mins: 10,
                video_url: '',
                preview: false
              }
            ]
          };
        });

        setCourseData(prev => ({
          ...prev,
          modules: newModules
        }));

        const newExpanded = {};
        newModules.forEach(m => { newExpanded[m.id] = true; });
        setExpandedSections(newExpanded);

        Swal.fire('Success', `Generated ${weeksCount} academic sections with full lecture breakdown!`, 'success');
      }
    });
  };

  const handleAddLesson = (sectionId) => {
    if (!newLessonForm.title.trim()) {
      Swal.fire('Error', 'Please enter a lecture title.', 'error');
      return;
    }

    const newLesson = {
      id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: newLessonForm.title,
      type: newLessonForm.type,
      duration_mins: Number(newLessonForm.duration_mins) || 15,
      video_url: newLessonForm.video_url || 'https://www.w3schools.com/html/mov_bbb.mp4',
      preview: Boolean(newLessonForm.preview),
      description: newLessonForm.description || ''
    };

    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === sectionId) {
          return { ...m, lessons: [...(m.lessons || []), newLesson] };
        }
        return m;
      })
    }));

    setEditingLessonSectionId(null);
    setNewLessonForm({
      title: '',
      type: 'video',
      duration_mins: 15,
      video_url: '',
      preview: false,
      description: ''
    });
  };

  const handleRemoveLesson = (sectionId, lessonId) => {
    setCourseData(prev => ({
      ...prev,
      modules: prev.modules.map(m => {
        if (m.id === sectionId) {
          return { ...m, lessons: (m.lessons || []).filter(l => l.id !== lessonId) };
        }
        return m;
      })
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(courseData);
    }
    Swal.fire({
      icon: 'success',
      title: 'Course Content Saved',
      text: `Successfully updated ${totalSections} sections and ${totalLectures} lectures for "${courseData.title}".`,
      timer: 1800,
      showConfirmButton: false
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-white w-full max-w-5xl h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 line-clamp-1">
                Course Content & Curriculum Studio
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {courseData.title} &bull; <strong className="text-indigo-600">{totalSections} Sections</strong> &bull; <strong>{totalLectures} Lectures</strong> ({formatTotalCourseDuration(totalMins)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('EDITOR')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'EDITOR' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Curriculum Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('PREVIEW')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'PREVIEW' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Learner View Preview
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="text-emerald-600 font-extrabold text-sm">₹</span>
              <span>Course Pricing (INR):</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={courseData.price}
              onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) || 0 })}
              className="w-24 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
            <span className="text-[11px] font-semibold text-slate-500">
              {courseData.price > 0 ? `Paid Course (₹${courseData.price})` : 'Free (1-Click Enrollment)'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500">Quick Generator:</span>
            <button
              type="button"
              onClick={() => handleQuickPopulate(4)}
              className={`px-2.5 py-1 border rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all ${
                courseData.modules.length === 4 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>4-Week</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPopulate(6)}
              className={`px-2.5 py-1 border rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all ${
                courseData.modules.length === 6 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>6-Week</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPopulate(8)}
              className={`px-2.5 py-1 border rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all ${
                courseData.modules.length === 8 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>8-Week</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPopulate(12)}
              className={`px-2.5 py-1 border rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs transition-all ${
                courseData.modules.length === 12 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>12-Week</span>
            </button>
            <button
              type="button"
              onClick={handleAddSection}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all ml-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Week</span>
            </button>
          </div>
        </div>

        {}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          {activeTab === 'EDITOR' ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              
              {}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-2xs">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">Course content</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {totalSections} {totalSections === 1 ? 'section' : 'sections'} &bull; {totalLectures} {totalLectures === 1 ? 'lecture' : 'lectures'} &bull; {formatTotalCourseDuration(totalMins)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleAllSections}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {courseData.modules.every(m => expandedSections[m.id]) ? 'Collapse all sections' : 'Expand all sections'}
                </button>
              </div>

              {}
              <div className="space-y-3">
                {courseData.modules.map((sec, secIdx) => {
                  const isExpanded = Boolean(expandedSections[sec.id]);
                  const secLessons = sec.lessons || [];
                  const secLectureCount = secLessons.length;
                  const secMins = secLessons.reduce((acc, l) => acc + (Number(l.duration_mins) || 15), 0);

                  return (
                    <div 
                      key={sec.id}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all"
                    >
                      {}
                      <div className="p-4 bg-slate-50/80 flex items-center justify-between gap-3 border-b border-slate-200">
                        <div 
                          onClick={() => toggleSection(sec.id)}
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0 select-none"
                        >
                          <div className="text-slate-400 hover:text-slate-700">
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-700" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                          
                          <input
                            type="text"
                            value={sec.title}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              setCourseData(prev => ({
                                ...prev,
                                modules: prev.modules.map(m => m.id === sec.id ? { ...m, title: newTitle } : m)
                              }));
                            }}
                            className="font-bold text-xs sm:text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:bg-white px-1.5 py-0.5 rounded transition-all flex-1 min-w-0"
                            placeholder={`Week ${secIdx + 1}: Section Title`}
                          />
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500 font-medium">
                            {secLectureCount} {secLectureCount === 1 ? 'lecture' : 'lectures'} &bull; {formatSectionDuration(secMins)}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingLessonSectionId(editingLessonSectionId === sec.id ? null : sec.id);
                              setExpandedSections(prev => ({ ...prev, [sec.id]: true }));
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Lecture</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveSection(sec.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete Section"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {}
                      {isExpanded && (
                        <div className="p-4 space-y-3 bg-white">
                          
                          {}
                          {secLessons.length > 0 ? (
                            <div className="space-y-2">
                              {secLessons.map((lesson, lesIdx) => (
                                <div 
                                  key={lesson.id}
                                  className="p-3 bg-slate-50/60 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-indigo-300 transition-all text-xs"
                                >
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                      {lesson.type === 'reading' ? <FileText className="w-3.5 h-3.5 text-amber-500" /> :
                                       lesson.type === 'quiz' ? <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> :
                                       lesson.type === 'scorm' ? <Layers className="w-3.5 h-3.5 text-purple-500" /> :
                                       <Video className="w-3.5 h-3.5 text-indigo-600" />}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="font-bold text-slate-900 truncate">
                                        {lesson.title}
                                      </div>
                                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                        <span className="capitalize font-semibold text-slate-600">{lesson.type || 'video'}</span>
                                        <span>&bull;</span>
                                        <span className="flex items-center gap-0.5 text-slate-500 font-mono">
                                          <Clock className="w-3 h-3" /> {lesson.duration_mins || 15} mins
                                        </span>
                                        {lesson.preview && (
                                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                            Free Preview
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveLesson(sec.id, lesson.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                                      title="Delete Lecture"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-4 text-center text-slate-400 text-xs italic">
                              No lectures in this section yet. Click "+ Add Lecture" above.
                            </div>
                          )}

                          {}
                          {editingLessonSectionId === sec.id && (
                            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-3 animate-fadeIn text-xs">
                              <div className="font-bold text-indigo-950 flex items-center justify-between">
                                <span>Add Lecture to {sec.title}</span>
                                <button onClick={() => setEditingLessonSectionId(null)} className="text-slate-400 hover:text-slate-600">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Lecture Title *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 1. Introduction to Algorithms & Complexities"
                                    value={newLessonForm.title}
                                    onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Content Format
                                  </label>
                                  <select
                                    value={newLessonForm.type}
                                    onChange={(e) => setNewLessonForm({ ...newLessonForm, type: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value="video">Video Lecture (MP4 / Stream)</option>
                                    <option value="reading">Article / Notes</option>
                                    <option value="quiz">Interactive Quiz</option>
                                    <option value="scorm">SCORM Package</option>
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <label className="text-[11px] font-bold text-slate-700">
                                      Video Stream or Resource URL
                                    </label>
                                    <label 
                                      htmlFor="modal-lesson-file"
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md cursor-pointer transition"
                                    >
                                      {isUploadingFile ? (
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
                                      id="modal-lesson-file"
                                      type="file"
                                      accept="video/*,.mp4,.webm,.mov,.pdf,.ppt,.pptx,.doc,.docx,.zip,.mp3"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIsUploadingFile(true);
                                        try {
                                          const formData = new FormData();
                                          formData.append('file', file);
                                          const res = await fetch(`${API_URL}/api/courses/upload-content`, {
                                            method: 'POST',
                                            body: formData
                                          });
                                          const data = await res.json();
                                          if (data.success && data.data?.url) {
                                            setNewLessonForm(prev => ({
                                              ...prev,
                                              video_url: data.data.url,
                                              file_name: data.data.fileName
                                            }));
                                            Swal.fire({
                                              toast: true,
                                              position: 'top-end',
                                              icon: 'success',
                                              title: `Uploaded: ${data.data.fileName}`,
                                              showConfirmButton: false,
                                              timer: 2000
                                            });
                                          } else {
                                            throw new Error(data.message || 'Upload failed');
                                          }
                                        } catch (err) {
                                          const localUrl = URL.createObjectURL(file);
                                          setNewLessonForm(prev => ({
                                            ...prev,
                                            video_url: localUrl,
                                            file_name: file.name
                                          }));
                                        } finally {
                                          setIsUploadingFile(false);
                                        }
                                      }}
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="https://... (Video URL or upload file)"
                                    value={newLessonForm.video_url}
                                    onChange={(e) => setNewLessonForm({ ...newLessonForm, video_url: e.target.value })}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                    Duration (Minutes)
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={newLessonForm.duration_mins}
                                    onChange={(e) => setNewLessonForm({ ...newLessonForm, duration_mins: parseInt(e.target.value, 10) || 15 })}
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                                  <input
                                    type="checkbox"
                                    checked={newLessonForm.preview}
                                    onChange={(e) => setNewLessonForm({ ...newLessonForm, preview: e.target.checked })}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <span className="font-semibold text-xs">Allow Free Learner Preview</span>
                                </label>

                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingLessonSectionId(null)}
                                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAddLesson(sec.id)}
                                    className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
                                  >
                                    Save Lecture
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Learner Catalog Preview</span>
                <h2 className="text-xl font-black text-slate-900 mt-2">{courseData.title}</h2>
                <p className="text-xs text-slate-500">{courseData.subtitle || courseData.description}</p>
              </div>

              {}
              <div className="pt-2">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900">Course content</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-slate-600">
                    <div className="font-medium text-slate-700">
                      {totalSections} sections &bull; {totalLectures} lectures &bull; {formatTotalCourseDuration(totalMins)}
                    </div>
                    <button
                      type="button"
                      onClick={toggleAllSections}
                      className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors cursor-pointer text-sm"
                    >
                      {courseData.modules.every(m => expandedSections[m.id]) ? 'Collapse all sections' : 'Expand all sections'}
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
                  {courseData.modules.map((sec, secIdx) => {
                    const isExpanded = Boolean(expandedSections[sec.id]);
                    const secLessons = sec.lessons || [];
                    const secLectureCount = secLessons.length;
                    const secMins = secLessons.reduce((acc, l) => acc + (Number(l.duration_mins) || 15), 0);

                    return (
                      <div key={sec.id} className="bg-white">
                        <button
                          type="button"
                          onClick={() => toggleSection(sec.id)}
                          className="w-full px-5 py-4 bg-slate-50/70 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-700" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                            <span className="font-bold text-sm text-slate-900">{sec.title || `Week ${secIdx + 1}`}</span>
                          </div>
                          <div className="text-right text-xs text-slate-500 font-medium">
                            {secLectureCount} lectures &bull; {formatSectionDuration(secMins)}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="divide-y divide-slate-100 bg-white">
                            {secLessons.map((lesson, lesIdx) => (
                              <div key={lesson.id} className="px-6 py-3 flex items-center justify-between text-xs text-slate-700">
                                <div className="flex items-center gap-3">
                                  <Video className="w-4 h-4 text-indigo-600" />
                                  <span className="font-medium text-slate-800">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                  {lesson.preview && <span className="text-indigo-600 font-bold underline">Preview</span>}
                                  <span className="font-mono">{lesson.duration_mins || 15} min</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total Content: <b>{totalSections} Sections / Weeks</b> &bull; <b>{totalLectures} Lectures</b> ({formatTotalCourseDuration(totalMins)}) &bull; <b>{courseData.price > 0 ? `₹${courseData.price}` : 'Free'}</b>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Content</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
