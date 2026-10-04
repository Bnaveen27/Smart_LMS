import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  School, ArrowRight, Laptop, CheckCircle2, Award, 
  Sparkles, Star, BookOpen, Users, Play, ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const LandingHero = ({ currentInstitute }) => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white text-slate-900 border-b border-slate-200/70">
      
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Institute Identity Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-blue-200 shadow-xs">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                <School className="w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {currentInstitute?.name}
              </span>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100">
                ONLINE CAMPUS
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-[1.18]">
              Empowering Minds.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                Building Academic Excellence.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed font-normal">
              Access university-accredited degree modules, attend interactive faculty lectures, collaborate on hands-on laboratory projects, and earn verified credentials from <strong>{currentInstitute?.name}</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate(currentInstitute?.id ? `/enroll/${currentInstitute.id}` : '/enroll')}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#courses"
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs shadow-xs transition-all hover:border-slate-300 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Explore Curriculum</span>
              </a>

              <button
                onClick={() => navigate('/login')}
                className="px-4 py-3.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-xs transition-colors flex items-center gap-1.5"
              >
                <Laptop className="w-4 h-4 text-slate-400" />
                <span>Learner Portal</span>
              </button>
            </div>

            {/* Trust Highlights & Metrics */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-slate-600">
              
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="font-semibold text-slate-800">4.9/5</span>
                <span className="text-slate-400 text-[11px]">(Faculty Rating)</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>UGC & NAAC Aligned</span>
              </div>

              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Digital Verified Transcripts</span>
              </div>

            </div>

          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-md">
              
              {/* Main Image Frame with Ambient Glow */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white p-2">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3.4] bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                    alt={currentInstitute?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">
                      {currentInstitute?.name}
                    </span>
                    <h3 className="text-sm font-semibold text-white">
                      Center for Academic Excellence & Research
                    </h3>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Live Interactive Sessions (Top-Right) */}
              <div className="absolute -top-4 -right-3 sm:-right-4 bg-white/95 backdrop-blur-md text-slate-800 p-3 rounded-2xl shadow-lg border border-slate-200/90 flex items-center gap-2.5 animate-fadeIn">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="pr-1">
                  <div className="text-[10px] text-slate-400 font-medium uppercase">Active Campus</div>
                  <div className="text-xs font-semibold text-slate-800">Live Faculty Mentorship</div>
                </div>
              </div>

              {/* Floating Badge 2: Official Accredited Degree (Bottom-Left) */}
              <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-2xl shadow-lg border border-slate-200/90 flex items-center gap-3 animate-fadeIn">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Accreditation</div>
                  <div className="text-xs font-semibold text-slate-800">Official Degree & Credits</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
