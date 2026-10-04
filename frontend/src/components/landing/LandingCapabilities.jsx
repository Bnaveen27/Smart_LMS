import React from 'react';
import { Award as CertificateIcon, Terminal, FileCheck, Users } from 'lucide-react';

export const LandingCapabilities = () => {
  const capabilities = [
    {
      icon: CertificateIcon,
      title: 'Official Degree Credits',
      desc: 'Earn recognized semester credits mapped directly to UGC, AICTE, and university academic requirements.'
    },
    {
      icon: Terminal,
      title: 'Cloud Lab Sandboxes',
      desc: 'Practice on embedded browser code sandboxes, simulated testbenches, and cloud terminals with auto-grading.'
    },
    {
      icon: FileCheck,
      title: 'Proctored Examinations',
      desc: 'Take secure online assessments, timed quizzes, and automated gradebook mark synchronizations.'
    },
    {
      icon: Users,
      title: 'Faculty Mentorship',
      desc: 'Engage with department heads, research scholars, and peer student cohorts via dedicated academic forums.'
    }
  ];

  return (
    <section id="features" className="bg-slate-100/70 border-t border-slate-200 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            DIGITAL ACADEMIC INFRASTRUCTURE
          </span>
          <h3 className="text-2xl sm:text-3xl font-semibold text-slate-800 tracking-tight">
            State-of-the-Art University Capabilities
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Integrated academic framework equipped with cloud coding terminals, verified degree issuance, and automated grading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 hover:border-blue-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
