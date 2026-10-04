import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/AppContext';
import { API_URL } from '../../config/api';
import {
  BookOpen, Search, Filter, CheckCircle2, XCircle,
  Trash2, Eye, DollarSign, Star, Users, ExternalLink, ShieldCheck,
  Layers, UploadCloud, Play, BarChart3, Sparkles, RefreshCw, Award,
  PlusCircle, Edit3
} from 'lucide-react';
import ScormUploadModal from '../../components/scorm/ScormUploadModal';
import ScormPlayerModal from '../../components/scorm/ScormPlayerModal';
import ScormReportsModal from '../../components/scorm/ScormReportsModal';

const API_BASE = `${API_URL}/api`;

export const CoursesTab = () => {
  const navigate = useNavigate();
  const { courses, toggleCoursePublish, deleteCourse, tenants, setSelectedCourseForPlayer, currentUser, activeTenant, setupType } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('courses'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantFilter, setTenantFilter] = useState('ALL');

  const isCorporate = activeTenant?.type === 'CORPORATE' || setupType === 'CORPORATE' || localStorage.getItem('lms_setup_type') === 'CORPORATE';

  const [scormPackages, setScormPackages] = useState([]);
  const [scormLoading, setScormLoading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedScormForPlayer, setSelectedScormForPlayer] = useState(null);
  const [selectedScormForReports, setSelectedScormForReports] = useState(null);

  const fetchScormPackages = async () => {
    setScormLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/scorm/packages`);
      if (res.data.success) {
        setScormPackages(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching SCORM packages:', err);
    } finally {
      setScormLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'scorm') {
      fetchScormPackages();
    }
  }, [activeSubTab]);

  const handleDeleteScorm = async (id, title) => {
    if (!confirm(`Are you sure you want to delete SCORM package "${title}"?`)) return;
    try {
      const res = await axios.delete(`${API_BASE}/scorm/packages/${id}`);
      if (res.data.success) {
        setScormPackages(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Error deleting SCORM package:', err);
      alert('Failed to delete SCORM package.');
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.instructor_name && c.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTenant = tenantFilter === 'ALL' || c.tenant_id === tenantFilter;
    return matchesSearch && matchesTenant;
  });

  const filteredScormPackages = scormPackages.filter(p => {
    return p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.version && p.version.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {isCorporate ? 'Training Tracks & Upskilling Modules' : 'Courses & Curriculum'}
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-full">
              {activeSubTab === 'courses' ? `${courses.length} ${isCorporate ? 'Tracks' : 'Courses'}` : `${scormPackages.length} SCORM Packages`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isCorporate 
              ? 'Manage enterprise training tracks, compliance videos, hands-on labs, and SCORM interactive e-learning packages.'
              : 'Manage academic syllabus modules, video lectures, and standard-compliant SCORM 1.2 / SCORM 2004 e-learning packages.'}
          </p>
        </div>

        {}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'courses'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isCorporate ? 'Training Tracks' : 'Academic Courses'}</span>
          </button>
          <button
            onClick={() => setActiveSubTab('scorm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'scorm'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>SCORM Packages (1.2 & 2004)</span>
          </button>
        </div>
      </div>

      {}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder={activeSubTab === 'courses' ? "Search course title or instructor..." : "Search SCORM package..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {activeSubTab === 'courses' ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 font-semibold">Tenant:</span>
                <select
                  value={tenantFilter}
                  onChange={(e) => setTenantFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-bold text-slate-800 cursor-pointer"
                >
                  <option value="ALL">All Tenants</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigate('/superadmin/courses/create')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={fetchScormPackages}
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                title="Refresh SCORM packages"
              >
                <RefreshCw className={`w-4 h-4 ${scormLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload SCORM (.zip)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      {activeSubTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => {
            const tenant = tenants.find(t => t.id === c.tenant_id);

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
              >
                {}
                <div className="relative h-44 overflow-hidden bg-slate-900">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                      {c.level || 'INTERMEDIATE'}
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border ${c.published !== false
                        ? 'bg-emerald-500/80 text-white border-emerald-400'
                        : 'bg-rose-500/80 text-white border-rose-400'
                      }`}>
                      {c.published !== false ? 'Approved & Live' : 'Moderation Held'}
                    </span>
                  </div>

                  {}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                      {tenant ? tenant.name : 'Platform Organization'}
                    </span>
                    <p className="text-white font-extrabold text-xs line-clamp-1">{c.title}</p>
                  </div>
                </div>

                {}
                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                    {c.description || c.subtitle}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Price</span>
                      <span className="text-xs font-black text-slate-900">{c.price > 0 ? `₹${c.price}` : 'Free'}</span>
                    </div>
                    <div className="border-x border-slate-200">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Rating</span>
                      <span className="text-xs font-black text-amber-600 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {c.rating || 5.0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Enrolled</span>
                      <span className="text-xs font-black text-indigo-600">{c.enrolled_count || 0}</span>
                    </div>
                  </div>
                </div>

                {}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedCourseForPlayer(c)}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview Player
                  </button>

                  <button
                    onClick={() => navigate(`/superadmin/courses/${c.id}/edit`)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                    title="Edit Course Content & Lessons"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  </button>

                  <button
                    onClick={() => toggleCoursePublish(c.id)}
                    title={c.published !== false ? 'Unpublish / Hold' : 'Publish / Approve'}
                    className={`p-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${c.published !== false
                        ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                  >
                    {c.published !== false ? 'Hold' : 'Approve'}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove course "${c.title}"?`)) {
                        deleteCourse(c.id);
                      }
                    }}
                    title="Delete Course"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {}
      {activeSubTab === 'scorm' && (
        <div>
          {scormLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400 bg-white rounded-3xl border border-slate-200/80">
              <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-sm font-semibold">Loading SCORM packages...</p>
            </div>
          ) : filteredScormPackages.length === 0 ? (
            <div className="py-16 px-6 text-center bg-white rounded-3xl border border-slate-200/80 flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Layers className="w-8 h-8" />
              </div>
              <div className="max-w-md">
                <h3 className="text-lg font-extrabold text-slate-900">No SCORM Packages Found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload standard SCORM 1.2 or SCORM 2004 packages created in Storyline, Captivate, or iSpring, or generate an instant demo package.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload or Generate Demo SCORM</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScormPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
                >
                  {}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={pkg.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                    {}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                        pkg.version === 'SCORM_2004'
                          ? 'bg-violet-600/90 text-white border-violet-400'
                          : 'bg-indigo-600/90 text-white border-indigo-400'
                      }`}>
                        {pkg.version.replace('_', ' ')}
                      </span>

                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        Pass: {pkg.mastery_score || 80}%
                      </span>
                    </div>

                    {}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">
                        Interactive Package
                      </span>
                      <p className="text-white font-extrabold text-sm line-clamp-1">{pkg.title}</p>
                    </div>
                  </div>

                  {}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Launch Entry:</span>
                      <span className="font-mono font-semibold text-slate-700 truncate max-w-[160px]">{pkg.entry_point || 'index.html'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>File Size:</span>
                      <span className="font-semibold text-slate-700">
                        {pkg.file_size_bytes ? `${(pkg.file_size_bytes / (1024 * 1024)).toFixed(2)} MB` : '1.2 MB'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Manifest ID:</span>
                      <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                        {pkg.manifest_identifier || 'SCORM_MANIFEST'}
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedScormForPlayer(pkg)}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Launch Player</span>
                    </button>

                    <button
                      onClick={() => setSelectedScormForReports(pkg)}
                      title="View SCORM Analytics & Learner Tracking"
                      className="p-2 rounded-xl bg-white hover:bg-violet-50 text-violet-700 border border-slate-200 hover:border-violet-300 text-xs font-bold transition-colors flex items-center justify-center"
                    >
                      <BarChart3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteScorm(pkg.id, pkg.title)}
                      title="Delete SCORM Package"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {}
      <ScormUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={() => {
          fetchScormPackages();
        }}
        courses={courses}
      />

      {}
      {selectedScormForPlayer && (
        <ScormPlayerModal
          isOpen={true}
          onClose={() => setSelectedScormForPlayer(null)}
          packageData={selectedScormForPlayer}
          userId={currentUser?.id || 1}
          userName={currentUser?.name || 'Super Admin'}
          onTrackingUpdate={() => {
            
          }}
        />
      )}

      {}
      {selectedScormForReports && (
        <ScormReportsModal
          isOpen={true}
          onClose={() => setSelectedScormForReports(null)}
          packageId={selectedScormForReports.id}
          packageTitle={selectedScormForReports.title}
        />
      )}

    </div>
  );
};

