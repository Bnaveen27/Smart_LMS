import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { API_BASE_URL, API_URL } from '../../config/api';
import {
  X, Maximize2, Minimize2, CheckCircle2, AlertCircle, Clock,
  Award, Shield, BookOpen, Sparkles, RefreshCw, Save, Check
} from 'lucide-react';

export const ScormPlayerModal = ({ scormPackage, packageData, onClose, onComplete, onTrackingUpdate, userId, userName }) => {
  const { currentUser, activeTenant } = useApp();
  const activePackage = scormPackage || packageData;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const [lessonStatus, setLessonStatus] = useState('incomplete');
  const [lessonLocation, setLessonLocation] = useState('');
  const [suspendData, setSuspendData] = useState('');
  const [scoreRaw, setScoreRaw] = useState(null);
  const [scoreScaled, setScoreScaled] = useState(null);
  const [attemptCount, setAttemptCount] = useState(1);

  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const cmiStateRef = useRef({});

  const is2004 = activePackage?.version === 'SCORM_2004';
  const packageId = activePackage?.id;
  const launchUrl = activePackage?.launch_url?.startsWith('http')
    ? activePackage.launch_url
    : `${API_BASE_URL}${activePackage?.launch_url || ''}`;

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs) => {
    const m = Math.floor(totalSecs / 60).toString().padStart(2, '0');
    const s = (totalSecs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    let isMounted = true;
    const loadTracking = async () => {
      try {
        const userId = currentUser?.id || 'user-current';
        const res = await fetch(`${API_URL}/api/scorm/tracking/${packageId}?user_id=${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && isMounted) {
            const trk = data.data;
            setLessonStatus(trk.lesson_status || 'incomplete');
            setLessonLocation(trk.lesson_location || '');
            setSuspendData(trk.suspend_data || '');
            setScoreRaw(trk.score_raw);
            setScoreScaled(trk.score_scaled);
            setAttemptCount(trk.attempt_count || 1);

            cmiStateRef.current = {
              ...(trk.cmi_data || {}),
              
              'cmi.core.student_id': userId,
              'cmi.core.student_name': currentUser?.name || 'Learner',
              'cmi.core.lesson_status': trk.lesson_status || 'not attempted',
              'cmi.core.lesson_location': trk.lesson_location || '',
              'cmi.core.score.raw': trk.score_raw !== null ? trk.score_raw.toString() : '',
              'cmi.core.score.min': '0',
              'cmi.core.score.max': '100',
              'cmi.suspend_data': trk.suspend_data || '',
              'cmi.core.credit': 'credit',
              'cmi.core.entry': trk.lesson_location ? 'resume' : 'ab-initio',

              'cmi.learner_id': userId,
              'cmi.learner_name': currentUser?.name || 'Learner',
              'cmi.completion_status': trk.lesson_status === 'completed' || trk.lesson_status === 'passed' ? 'completed' : 'incomplete',
              'cmi.success_status': trk.lesson_status === 'passed' ? 'passed' : trk.lesson_status === 'failed' ? 'failed' : 'unknown',
              'cmi.location': trk.lesson_location || '',
              'cmi.score.raw': trk.score_raw !== null ? trk.score_raw.toString() : '',
              'cmi.score.scaled': trk.score_scaled !== null ? trk.score_scaled.toString() : '',
              'cmi.entry': trk.lesson_location ? 'resume' : 'ab-initio'
            };
          }
        }
      } catch (err) {
        console.warn('Initial SCORM tracking fetch notice:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTracking();
    return () => { isMounted = false; };
  }, [packageId, currentUser]);

  const saveScormDataToBackend = async (dataPayload) => {
    try {
      const userId = currentUser?.id || 'user-current';
      const formattedSessionTime = `00:${formatTimer(sessionSeconds)}`;

      await fetch(`${API_URL}/api/scorm/tracking/${packageId}/commit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          lesson_status: dataPayload.lesson_status ?? lessonStatus,
          lesson_location: dataPayload.lesson_location ?? lessonLocation,
          suspend_data: dataPayload.suspend_data ?? suspendData,
          score_raw: dataPayload.score_raw !== undefined ? dataPayload.score_raw : scoreRaw,
          score_scaled: dataPayload.score_scaled !== undefined ? dataPayload.score_scaled : scoreScaled,
          session_time: formattedSessionTime,
          cmi_data: cmiStateRef.current
        })
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      console.warn('SCORM commit network notice:', err.message);
    }
  };

  useEffect(() => {
    
    const scorm12API = {
      LMSInitialize: (param) => {
        console.log('⚡ [SCORM 1.2] LMSInitialize');
        return "true";
      },
      LMSGetValue: (element) => {
        const val = cmiStateRef.current[element] !== undefined ? cmiStateRef.current[element] : "";
        console.log(`🔍 [SCORM 1.2] LMSGetValue(${element}) => "${val}"`);
        return val.toString();
      },
      LMSSetValue: (element, value) => {
        console.log(`📝 [SCORM 1.2] LMSSetValue(${element}, "${value}")`);
        cmiStateRef.current[element] = value;

        if (element === 'cmi.core.lesson_status') {
          setLessonStatus(value);
          if (value === 'passed' || value === 'completed') {
            if (onComplete) onComplete(scormPackage);
          }
        }
        if (element === 'cmi.core.lesson_location') {
          setLessonLocation(value);
        }
        if (element === 'cmi.suspend_data') {
          setSuspendData(value);
        }
        if (element === 'cmi.core.score.raw') {
          const num = parseFloat(value);
          setScoreRaw(num);
        }
        return "true";
      },
      LMSCommit: (param) => {
        console.log('💾 [SCORM 1.2] LMSCommit');
        saveScormDataToBackend({
          lesson_status: cmiStateRef.current['cmi.core.lesson_status'],
          lesson_location: cmiStateRef.current['cmi.core.lesson_location'],
          suspend_data: cmiStateRef.current['cmi.suspend_data'],
          score_raw: cmiStateRef.current['cmi.core.score.raw'] ? parseFloat(cmiStateRef.current['cmi.core.score.raw']) : null
        });
        return "true";
      },
      LMSFinish: (param) => {
        console.log('🏁 [SCORM 1.2] LMSFinish');
        saveScormDataToBackend({
          lesson_status: cmiStateRef.current['cmi.core.lesson_status'] || 'completed'
        });
        return "true";
      },
      LMSGetLastError: () => "0",
      LMSGetErrorString: () => "No error",
      LMSGetDiagnostic: () => "No diagnostic information"
    };

    const scorm2004API = {
      Initialize: (param) => {
        console.log('⚡ [SCORM 2004] Initialize');
        return "true";
      },
      GetValue: (element) => {
        const val = cmiStateRef.current[element] !== undefined ? cmiStateRef.current[element] : "";
        console.log(`🔍 [SCORM 2004] GetValue(${element}) => "${val}"`);
        return val.toString();
      },
      SetValue: (element, value) => {
        console.log(`📝 [SCORM 2004] SetValue(${element}, "${value}")`);
        cmiStateRef.current[element] = value;

        if (element === 'cmi.completion_status' || element === 'cmi.success_status') {
          setLessonStatus(value);
          if (value === 'passed' || value === 'completed') {
            if (onComplete) onComplete(scormPackage);
          }
        }
        if (element === 'cmi.location') {
          setLessonLocation(value);
        }
        if (element === 'cmi.suspend_data') {
          setSuspendData(value);
        }
        if (element === 'cmi.score.raw') {
          setScoreRaw(parseFloat(value));
        }
        if (element === 'cmi.score.scaled') {
          setScoreScaled(parseFloat(value));
        }
        return "true";
      },
      Commit: (param) => {
        console.log('💾 [SCORM 2004] Commit');
        saveScormDataToBackend({
          lesson_status: cmiStateRef.current['cmi.success_status'] || cmiStateRef.current['cmi.completion_status'] || lessonStatus,
          lesson_location: cmiStateRef.current['cmi.location'],
          suspend_data: cmiStateRef.current['cmi.suspend_data'],
          score_raw: cmiStateRef.current['cmi.score.raw'] ? parseFloat(cmiStateRef.current['cmi.score.raw']) : null,
          score_scaled: cmiStateRef.current['cmi.score.scaled'] ? parseFloat(cmiStateRef.current['cmi.score.scaled']) : null
        });
        return "true";
      },
      Terminate: (param) => {
        console.log('🏁 [SCORM 2004] Terminate');
        saveScormDataToBackend({
          lesson_status: cmiStateRef.current['cmi.success_status'] || cmiStateRef.current['cmi.completion_status'] || 'completed'
        });
        return "true";
      },
      GetLastError: () => "0",
      GetErrorString: () => "No error",
      GetDiagnostic: () => "No diagnostic information"
    };

    window.API = scorm12API;
    window.API_1484_11 = scorm2004API;

    return () => {
      delete window.API;
      delete window.API_1484_11;
    };
  }, [lessonStatus, lessonLocation, suspendData, scoreRaw, scoreScaled, sessionSeconds]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const getStatusBadge = () => {
    const s = (lessonStatus || '').toLowerCase();
    if (s === 'passed') return { text: 'PASSED', bg: 'bg-emerald-500 text-white' };
    if (s === 'completed') return { text: 'COMPLETED', bg: 'bg-indigo-600 text-white' };
    if (s === 'failed') return { text: 'FAILED', bg: 'bg-rose-500 text-white' };
    if (s === 'incomplete') return { text: 'IN PROGRESS', bg: 'bg-amber-500 text-white' };
    return { text: 'NOT ATTEMPTED', bg: 'bg-slate-600 text-slate-200' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div 
        ref={containerRef}
        className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative"
      >
        
        {}
        <div className="bg-slate-950/90 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
                  {scormPackage?.version?.replace('_', ' ') || 'SCORM 1.2'}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs ${statusBadge.bg}`}>
                  {statusBadge.text}
                </span>
                {lessonLocation && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md hidden md:inline">
                    Location: Slide {lessonLocation} (Resumed)
                  </span>
                )}
              </div>
              <h3 className="text-sm font-extrabold text-white truncate mt-0.5">
                {scormPackage?.title || 'Interactive SCORM Learning Course'}
              </h3>
            </div>
          </div>

          {}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {}
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-xl text-center hidden sm:block">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Score</span>
              <span className="text-xs font-mono font-extrabold text-emerald-400">
                {scoreRaw !== null && scoreRaw !== undefined ? `${scoreRaw}%` : 'Pending'}
              </span>
            </div>

            {}
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1 rounded-xl text-center hidden sm:block">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Time</span>
              <span className="text-xs font-mono font-bold text-slate-200">
                {formatTimer(sessionSeconds)}
              </span>
            </div>

            {}
            <button
              onClick={() => saveScormDataToBackend({})}
              title="Save Progress"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isSaved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            {}
            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {}
            <button
              onClick={() => {
                saveScormDataToBackend({});
                onClose();
              }}
              title="Save & Close Player"
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>

        {}
        <div className="flex-1 w-full bg-slate-950 relative overflow-hidden flex items-center justify-center">
          
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 z-10 text-white">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-300">Initializing SCORM {activePackage?.version?.replace('_', ' ')} Runtime Environment...</p>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={launchUrl}
            title={activePackage?.title || 'SCORM Player'}
            className="w-full h-full border-0 bg-white"
            allow="fullscreen; autoplay; microphone; camera"
            onLoad={() => setIsLoading(false)}
          />

        </div>

        {}
        <div className="bg-slate-950 px-5 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              RTE: <b>{is2004 ? 'window.API_1484_11' : 'window.API'}</b> Connected
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">User: <b>{userName || currentUser?.name || 'Learner'}</b></span>
          </div>

          <div className="flex items-center gap-3">
            <span>Attempt: <b>#{attemptCount}</b></span>
            <span>•</span>
            <span className="text-indigo-400">Mastery Required: <b>{activePackage?.mastery_score || 80}%</b></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScormPlayerModal;

