import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const LandingFaq = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: 'How do course credits map to official university degree transcripts?',
      a: 'All courses published on this portal are mapped directly to official semester academic credits (3 to 4 Credits per module). Upon course completion and passing proctored exams, grades synchronize automatically into the student marksheet.'
    },
    {
      q: 'Are certificates cryptographically verifiable by employers?',
      a: 'Yes. Every completion certificate and degree diploma generated includes a secure cryptographic QR code and unique verification hash that can be instantly verified on our public verification portal.'
    },
    {
      q: 'Can students access virtual laboratory sandboxes directly in the browser?',
      a: 'Yes. Technical and engineering modules include embedded browser IDEs, cloud terminals, and simulation sandboxes that require zero local software installation.'
    },
    {
      q: 'How do I access faculty office hours and live lecture sessions?',
      a: 'Enrolled students receive automatic calendar reminders for scheduled live webinars, interactive Q&A sessions, and 1-on-1 virtual faculty mentoring hours.'
    }
  ];

  return (
    <section id="faq" className="py-14 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="text-center space-y-1.5 mb-8">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
          ACADEMIC POLICIES
        </span>
        <h3 className="text-2xl font-semibold text-slate-800 tracking-tight">
          Frequently Asked Questions
        </h3>
      </div>

      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
              >
                <span>{faq.q}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
