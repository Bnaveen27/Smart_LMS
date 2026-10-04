import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LandingHeader,
  LandingHero,
  LandingStats,
  LandingCurriculum,
  LandingSyllabusModal,
  LandingCapabilities,
  LandingFaq,
  LandingFooter
} from '../../components/landing';

export const LandingPage = () => {
  const { 
    courses, 
    tenants, 
    activeTenant, 
    currentUser, 
    role, 
    logout 
  } = useApp();
  
  const instituteTenants = (tenants || []).filter(t => t.type === 'INSTITUTE');
  const initialInstitute = activeTenant?.type === 'INSTITUTE' 
    ? activeTenant 
    : (instituteTenants.length > 0 ? instituteTenants[0] : {
        id: 'tenant-inst-default',
        name: 'Apex Institute of Technology & Sciences',
        code: 'AIT-2026',
        type: 'INSTITUTE',
        contact_email: 'admissions@apextech.edu',
        phone: '+91 44 2855 9000',
        plan: 'Enterprise University',
        logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80'
      });

  const [selectedInstituteId, setSelectedInstituteId] = useState(initialInstitute.id);
  const currentInstitute = instituteTenants.find(t => t.id === selectedInstituteId) || initialInstitute;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [previewCourse, setPreviewCourse] = useState(null);

  const actualInstituteCourses = (courses || []).filter(c => c.tenant_id === currentInstitute.id);

  const displayCourses = actualInstituteCourses.map((c, idx) => ({
    id: c.id || `inst-c-${idx}`,
    title: c.title || 'Curriculum Course Module',
    instructor: c.instructor_name || 'Institute Faculty Member',
    instructorTitle: c.instructor_title || 'Department Faculty',
    instructorAvatar: c.instructor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    department: c.department || c.category || 'Core Curriculum',
    thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    rating: c.rating || 5.0,
    reviews: `${c.enrolled_count || 1}+`,
    enrolled: `${c.enrolled_count || 1}`,
    level: c.level || 'Academic Core',
    credits: c.credits ? `${c.credits} Credits` : '4 Credits',
    duration: c.duration || 'Self-Paced / 12 Wks',
    type: c.is_enterprise_eligible ? 'Enterprise Degree' : 'Official Syllabus Module',
    skills: c.subtitle || c.skills || 'Foundational Principles, Assignments, Semester Exams',
    description: c.description || 'Official curriculum course module tailored exclusively for enrolled learners.',
    modules: c.curriculum && Array.isArray(c.curriculum) ? c.curriculum.map(m => m.title || m) : [
      'Module 1: Orientation & Core Fundamentals',
      'Module 2: Theoretical Principles & Case Studies',
      'Module 3: Hands-on Practical Lab Exercises',
      'Module 4: Final Assessment & Proctored Examination'
    ]
  }));

  const dynamicDepartments = ['All', ...new Set(displayCourses.map(c => c.department).filter(Boolean))];

  const filteredCourses = displayCourses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.instructor && c.instructor.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (c.skills && c.skills.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (c.department && c.department.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDept = selectedDepartment === 'All' || c.department === selectedDepartment;
    const matchesLevel = selectedLevel === 'All' || c.level.toLowerCase().includes(selectedLevel.toLowerCase());
    return matchesSearch && matchesDept && matchesLevel;
  });

  const getDashboardUrl = () => {
    if (!currentUser) return '/login';
    switch (role) {
      case 'SUPER_ADMIN': return '/superadmin';
      case 'INSTITUTE_ADMIN': return '/institute';
      case 'INSTRUCTOR': return '/instructor';
      case 'LEARNER': return '/learner';
      case 'CORP_ADMIN': return '/corporate/admin';
      default: return '/learner';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      
      {/* 1. Header Component */}
      <LandingHeader
        currentInstitute={currentInstitute}
        instituteTenants={instituteTenants}
        selectedInstituteId={selectedInstituteId}
        setSelectedInstituteId={setSelectedInstituteId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentUser={currentUser}
        getDashboardUrl={getDashboardUrl}
        logout={logout}
      />

      {/* 2. Hero Component */}
      <LandingHero 
        currentInstitute={currentInstitute} 
      />

      {/* 3. Live Stats Component */}
      <LandingStats />

      {/* 4. Curriculum & Courses Component */}
      <LandingCurriculum
        currentInstitute={currentInstitute}
        dynamicDepartments={dynamicDepartments}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        filteredCourses={filteredCourses}
        onPreviewCourse={(course) => setPreviewCourse(course)}
      />

      {/* 5. Syllabus Preview Modal Component */}
      <LandingSyllabusModal
        previewCourse={previewCourse}
        onClose={() => setPreviewCourse(null)}
      />

      {/* 6. University Infrastructure Capabilities Component */}
      <LandingCapabilities />

      {/* 7. FAQ Component */}
      <LandingFaq />

      {/* 8. Footer Component */}
      <LandingFooter 
        currentInstitute={currentInstitute}
        onSelectDepartment={(dept) => setSelectedDepartment(dept)}
      />

    </div>
  );
};
