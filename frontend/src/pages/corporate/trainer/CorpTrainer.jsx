import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
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
  LogOut
} from 'lucide-react';
import Swal from 'sweetalert2';

export const TrainerDashboard = () => {
  const navigate = useNavigate();
  const { courses: dbCourses, users, activeTenant, timetable, corporateAssignments } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const trainerCourses = dbCourses.filter(c => !activeTenant || c.tenant_id === activeTenant.id);
  const enrolledLearnersCount = users.filter(u => (!activeTenant || u.tenant_id === activeTenant.id) && (u.role === 'EMPLOYEE' || u.role === 'LEARNER')).length;

  const liveClasses = (timetable || [])
    .filter(t => !activeTenant || t.tenant_id === activeTenant.id)
    .map(t => ({
      id: t.id,
      title: t.title || 'Workforce Workshop & Lecture',
      course: t.course_title || 'Enterprise Training',
      time: `${t.day_of_week}, ${t.start_time} - ${t.end_time}`,
      meetingUrl: t.meeting_url || 'https://meet.google.com'
    }));

  const pendingSubmissions = (corporateAssignments || [])
    .filter(a => !activeTenant || a.tenant_id === activeTenant.id)
    .map(a => ({
      id: a.id,
      learner: a.employee_name,
      student: a.employee_name,
      course: a.course_title,
      assignment: `Module Training: ${a.course_title}`,
      submittedAt: a.assigned_at ? `Due ${a.due_date}` : 'Recently',
      status: a.status || 'PENDING'
    }));

  const trainerStats = {
    activeCourses: trainerCourses.length,
    enrolledLearners: enrolledLearnersCount,
    enrolledStudents: enrolledLearnersCount,
    assignmentsToGrade: pendingSubmissions.length,
    upcomingLiveClasses: liveClasses.length,
    avgLearnerRating: '5.0 / 5.0',
    avgStudentRating: '5.0 / 5.0'
  };

  const courses = trainerCourses.map(c => ({
    id: c.id,
    title: c.title,
    learners: c.enrolled_count || 0,
    students: c.enrolled_count || 0,
    modules: c.modules?.length || 1,
    status: c.published !== false ? 'PUBLISHED' : 'DRAFT'
  }));

  const handleGradeSubmission = (sub) => {
    Swal.fire({
      title: `Grade Submission: ${sub.learner || sub.student}`,
      html: `
        <div style="text-align: left; font-size: 13px;">
          <p><strong>Assignment:</strong> ${sub.assignment}</p>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Score (Max 100):</label>
            <input id="swal-marks" type="number" value="90" class="swal2-input" style="width: 100%; margin: 0; box-sizing: border-box;" />
          </div>
          <div>
            <label style="font-weight: 600; display: block; margin-bottom: 4px;">Instructor Feedback:</label>
            <textarea id="swal-feedback" class="swal2-textarea" style="width: 100%; margin: 0; box-sizing: border-box;">Excellent database indexing and relational design. Approved.</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Grade',
      preConfirm: () => {
        return {
          marks: document.getElementById('swal-marks').value,
          feedback: document.getElementById('swal-feedback').value
        };
      }
    }).then((res) => {
      if (res.isConfirmed) {
        Swal.fire('Graded!', 'Submission has been graded and feedback sent to learner.', 'success');
      }
    });
  };

  return (
    <div className="erp-layout">
      {}
      <aside className="erp-sidebar">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ backgroundColor: '#1e40af', color: '#fff', padding: '5px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '13px' }}>
            SMART LMS
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>Trainer Portal</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Instructor Console</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          <div className="erp-nav-header">Instruction</div>
          <button onClick={() => setActiveTab('overview')} className={`erp-nav-item w-100 text-start border-0 ${activeTab === 'overview' ? 'active' : ''}`}>
            <BarChart2 size={16} /> Overview
          </button>
          <button onClick={() => setActiveTab('courses')} className={`erp-nav-item w-100 text-start border-0 ${activeTab === 'courses' ? 'active' : ''}`}>
            <BookOpen size={16} /> My Courses
          </button>
          <button onClick={() => setActiveTab('live')} className={`erp-nav-item w-100 text-start border-0 ${activeTab === 'live' ? 'active' : ''}`}>
            <Video size={16} /> Live Classes
          </button>

          <div className="erp-nav-header">Evaluation</div>
          <button onClick={() => setActiveTab('assignments')} className={`erp-nav-item w-100 text-start border-0 ${activeTab === 'assignments' ? 'active' : ''}`}>
            <FileCheck size={16} /> Assignment Submissions
          </button>
          <button onClick={() => setActiveTab('students')} className={`erp-nav-item w-100 text-start border-0 ${activeTab === 'students' ? 'active' : ''}`}>
            <Users size={16} /> Learner Roster
          </button>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button onClick={() => navigate('/login')} className="erp-btn erp-btn-outline w-100" style={{ fontSize: '12px' }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {}
      <main className="erp-main">
        {}
        <header className="erp-topbar">
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
            Instructor & Trainer Management Console
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="erp-badge erp-badge-primary">Lead Instructor</span>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>Sophia Chen</div>
          </div>
        </header>

        <div className="erp-content">
          
          {}
          {activeTab === 'overview' && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="erp-stat-card">
                    <div>
                      <div className="erp-stat-label">Active Courses</div>
                      <div className="erp-stat-value">{trainerStats.activeCourses}</div>
                    </div>
                    <BookOpen size={24} color="#1e40af" />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="erp-stat-card">
                    <div>
                      <div className="erp-stat-label">Taught Learners</div>
                      <div className="erp-stat-value">{trainerStats.enrolledLearners}</div>
                    </div>
                    <Users size={24} color="#0891b2" />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="erp-stat-card">
                    <div>
                      <div className="erp-stat-label">Pending Reviews</div>
                      <div className="erp-stat-value">{trainerStats.assignmentsToGrade}</div>
                    </div>
                    <FileCheck size={24} color="#b45309" />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="erp-stat-card">
                    <div>
                      <div className="erp-stat-label">Instructor Rating</div>
                      <div className="erp-stat-value">{trainerStats.avgStudentRating}</div>
                    </div>
                    <Award size={24} color="#15803d" />
                  </div>
                </div>
              </div>

              {}
              <div className="erp-card mb-4">
                <div className="erp-card-header">
                  <span>Upcoming Scheduled Live Sessions</span>
                  <button onClick={() => setActiveTab('live')} className="erp-btn erp-btn-outline erp-btn-sm">
                    Manage Schedule
                  </button>
                </div>
                <div className="erp-card-body p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Class Title</th>
                        <th>Course</th>
                        <th>Scheduled Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liveClasses.map((lc) => (
                        <tr key={lc.id}>
                          <td style={{ fontWeight: '600' }}>{lc.title}</td>
                          <td style={{ color: '#64748b' }}>{lc.course}</td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#1e40af', fontWeight: '500' }}>
                              <Clock size={14} /> {lc.time}
                            </span>
                          </td>
                          <td>
                            <a href={lc.meetingUrl} target="_blank" rel="noreferrer" className="erp-btn erp-btn-primary erp-btn-sm">
                              <Play size={12} /> Launch Class
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {}
              <div className="erp-card">
                <div className="erp-card-header">
                  <span>Submissions Awaiting Evaluation</span>
                </div>
                <div className="erp-card-body p-0">
                  <table className="erp-table">
                    <thead>
                      <tr>
                        <th>Learner</th>
                        <th>Course</th>
                        <th>Assignment</th>
                        <th>Submitted</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingSubmissions.map((sub) => (
                        <tr key={sub.id}>
                          <td style={{ fontWeight: '600' }}>{sub.learner || sub.student}</td>
                          <td style={{ color: '#64748b' }}>{sub.course}</td>
                          <td>{sub.assignment}</td>
                          <td style={{ color: '#64748b' }}>{sub.submittedAt}</td>
                          <td>
                            <button onClick={() => handleGradeSubmission(sub)} className="erp-btn erp-btn-outline erp-btn-sm">
                              <FileCheck size={14} /> Evaluate & Grade
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {}
          {activeTab === 'courses' && (
            <div className="erp-card">
              <div className="erp-card-header">
                <span>My Assigned Curriculum & Courses</span>
                <button className="erp-btn erp-btn-primary erp-btn-sm" onClick={() => Swal.fire('Course Creation', 'Create new module in course editor.', 'info')}>
                  <PlusCircle size={14} /> Add Course Module
                </button>
              </div>
              <div className="erp-card-body p-0">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Enrolled Learners</th>
                      <th>Curriculum Modules</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: '600' }}>{c.title}</td>
                        <td>{c.learners || c.students} Learners</td>
                        <td>{c.modules} Modules</td>
                        <td><span className="erp-badge erp-badge-success">{c.status}</span></td>
                        <td>
                          <button className="erp-btn erp-btn-outline erp-btn-sm">Edit Content</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {}
          {activeTab === 'live' && (
            <div className="erp-card">
              <div className="erp-card-header">
                <span>Live Interactive Class Schedule</span>
                <button className="erp-btn erp-btn-primary erp-btn-sm" onClick={() => Swal.fire('Schedule Class', 'Live meeting link generated.', 'success')}>
                  <PlusCircle size={14} /> Schedule New Live Class
                </button>
              </div>
              <div className="erp-card-body p-0">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Class Title</th>
                      <th>Target Course</th>
                      <th>Time Slot</th>
                      <th>Status</th>
                      <th>Broadcast</th>
                    </tr>
                  </thead>
                  <tbody>
                    {liveClasses.map((lc) => (
                      <tr key={lc.id}>
                        <td style={{ fontWeight: '600' }}>{lc.title}</td>
                        <td>{lc.course}</td>
                        <td>{lc.time}</td>
                        <td><span className="erp-badge erp-badge-primary">SCHEDULED</span></td>
                        <td>
                          <a href={lc.meetingUrl} target="_blank" rel="noreferrer" className="erp-btn erp-btn-primary erp-btn-sm">
                            <Play size={12} /> Start Session
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {}
          {activeTab === 'assignments' && (
            <div className="erp-card">
              <div className="erp-card-header">
                <span>Assignment Grading Console</span>
              </div>
              <div className="erp-card-body p-0">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Learner</th>
                      <th>Assignment Title</th>
                      <th>Course</th>
                      <th>Submission Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td style={{ fontWeight: '600' }}>{sub.learner || sub.student}</td>
                        <td>{sub.assignment}</td>
                        <td style={{ color: '#64748b' }}>{sub.course}</td>
                        <td><span className="erp-badge erp-badge-warning">{sub.status}</span></td>
                        <td>
                          <button onClick={() => handleGradeSubmission(sub)} className="erp-btn erp-btn-primary erp-btn-sm">
                            Evaluate & Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {}
          {activeTab === 'students' && (
            <div className="erp-card">
              <div className="erp-card-header">
                <span>Active Learner Roster</span>
              </div>
              <div className="erp-card-body p-0">
                <table className="erp-table">
                  <thead>
                    <tr>
                      <th>Learner Name</th>
                      <th>Email</th>
                      <th>Department / Batch</th>
                      <th>Overall Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Alex Rivera</td>
                      <td>alex@learner.com</td>
                      <td>Computer Science (Batch 2026)</td>
                      <td><span className="erp-badge erp-badge-success">85% Completed</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: '600' }}>Priya Sharma</td>
                      <td>priya@learner.com</td>
                      <td>Information Technology (Batch 2026)</td>
                      <td><span className="erp-badge erp-badge-primary">70% Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
