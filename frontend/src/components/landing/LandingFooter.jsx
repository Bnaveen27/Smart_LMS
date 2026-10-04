import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone } from 'lucide-react';

export const LandingFooter = ({ currentInstitute, onSelectDepartment }) => {
  const navigate = useNavigate();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-xs">
          
          {/* Column 1: Institute Info */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>{currentInstitute?.name}</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Autonomous University Institution committed to world-class teaching, technological innovation, and accredited digital learning.
            </p>
            <div className="space-y-1 text-slate-400 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentInstitute?.contact_email || 'admissions@apextech.edu'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentInstitute?.phone || '+91 44 2855 9000'}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Academic Disciplines */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white text-xs">Academic Programs</h5>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => onSelectDepartment('Computer Science & Engineering')}>Computer Science & Engineering</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => onSelectDepartment('AI & Data Science')}>AI & Data Science</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => onSelectDepartment('Cloud Computing & DevOps')}>Cloud Computing & DevOps</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => onSelectDepartment('Business & Management (MBA)')}>MBA Programs</p>
          </div>

          {/* Column 3: Portals & Logins */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white text-xs">Portals & Access</h5>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('/login')}>Student Portal Sign In</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('/login')}>Faculty Studio</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('/login')}>Dean / Admin Console</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('/register')}>Student Admission</p>
          </div>

          {/* Column 4: Verification & Trust */}
          <div className="space-y-2">
            <h5 className="font-semibold text-white text-xs">Verification & Governance</h5>
            <p className="hover:text-blue-400 cursor-pointer transition-colors" onClick={() => navigate('/certificate-verification')}>Verify Marksheet</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors">Academic Regulations</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors">Student Honor Code</p>
            <p className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</p>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            &copy; 2026 {currentInstitute?.name}. Powered by Smart LMS Academic Enterprise Platform.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Accreditation</span>
            <span className="hover:text-slate-300 cursor-pointer">Security</span>
            <span className="hover:text-slate-300 cursor-pointer">Helpdesk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
