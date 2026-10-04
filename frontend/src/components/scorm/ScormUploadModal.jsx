import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { 
  X, 
  UploadCloud, 
  FileArchive, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Loader2,
  BookOpen
} from 'lucide-react';

const API_BASE = `${API_URL}/api`;

export default function ScormUploadModal({ isOpen, onClose, onSuccess, tenantId = 1, courses = [] }) {
  const [file, setFile] = useState(null);
  const [courseId, setCourseId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.zip')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Only .zip SCORM packages are supported.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.zip')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Only .zip SCORM packages are supported.');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a SCORM .zip file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('package', file);
    formData.append('tenant_id', tenantId);
    if (courseId) formData.append('course_id', courseId);

    try {
      const res = await axios.post(`${API_BASE}/scorm/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      if (res.data.success) {
        setSuccessMsg(`SCORM package "${res.data.data.title}" (${res.data.data.version}) imported successfully!`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data.data);
          onClose();
        }, 1200);
      } else {
        setError(res.data.message || 'Failed to process SCORM package.');
      }
    } catch (err) {
      console.error('SCORM upload error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to upload SCORM package.');
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateSample = async (version) => {
    setGenerating(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/scorm/generate-sample`, {
        version,
        tenant_id: tenantId,
        course_id: courseId || null
      });

      if (res.data.success) {
        setSuccessMsg(`Generated demo ${version} package: "${res.data.data.title}"!`);
        setTimeout(() => {
          if (onSuccess) onSuccess(res.data.data);
          onClose();
        }, 1200);
      } else {
        setError(res.data.message || 'Failed to generate sample SCORM package.');
      }
    } catch (err) {
      console.error('SCORM sample generator error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate sample package.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Import SCORM Package</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Supports SCORM 1.2 & SCORM 2004 (.zip packages)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {}
        <form onSubmit={handleUpload} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center space-x-3 text-rose-700 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center space-x-3 text-emerald-700 dark:text-emerald-300 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {}
          {courses.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Link to Course (Optional)
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">-- Standalone SCORM Module --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title || c.name || `Course #${c.id}`}</option>
                ))}
              </select>
            </div>
          )}

          {}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              SCORM Archive (.zip)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
                  : file
                  ? 'border-emerald-400 dark:border-emerald-600 bg-emerald-50/30 dark:bg-emerald-950/10'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip,application/zip,application/x-zip-compressed"
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-center space-x-3 text-slate-800 dark:text-slate-200">
                  <FileArchive className="w-8 h-8 text-emerald-500" />
                  <div className="text-left">
                    <p className="font-semibold text-sm truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to browse</span> or drag & drop SCORM .zip
                  </div>
                  <p className="text-xs text-slate-400">Exported from Articulate Storyline, Adobe Captivate, iSpring, etc.</p>
                </div>
              )}
            </div>
          </div>

          {}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Extracting & validating manifest...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {}
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading || generating}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm hover:shadow transition-all flex items-center space-x-2"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{uploading ? 'Processing SCORM...' : 'Upload & Launch'}</span>
            </button>
          </div>
        </form>

        {}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Don't have a SCORM package ready?</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={uploading || generating}
                onClick={() => handleGenerateSample('SCORM_1.2')}
                className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1"
              >
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                <span>Create SCORM 1.2 Demo</span>
              </button>
              <button
                type="button"
                disabled={uploading || generating}
                onClick={() => handleGenerateSample('SCORM_2004')}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center space-x-1"
              >
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                <span>Create SCORM 2004 Demo</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
