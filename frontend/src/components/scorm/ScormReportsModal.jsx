import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { 
  X, 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  RotateCcw, 
  Users, 
  Search,
  Download,
  Loader2,
  TrendingUp
} from 'lucide-react';

const API_BASE = `${API_URL}/api`;

export default function ScormReportsModal({ isOpen, onClose, packageId, packageTitle }) {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && packageId) {
      fetchReport();
    }
  }, [isOpen, packageId]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/scorm/reports/${packageId}`);
      if (res.data.success) {
        setReportData(res.data.data);
      } else {
        setError(res.data.message || 'Failed to fetch report.');
      }
    } catch (err) {
      console.error('Error fetching SCORM reports:', err);
      setError('Could not retrieve SCORM analytics data.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const summary = reportData?.summary || {
    total_learners: 0,
    passed_count: 0,
    completed_count: 0,
    failed_count: 0,
    incomplete_count: 0,
    avg_score: 0,
    pass_rate: 0
  };

  const records = reportData?.records || [];

  const filteredRecords = records.filter(rec => {
    const nameMatch = (rec.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (rec.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'ALL' || rec.lesson_status?.toLowerCase() === statusFilter.toLowerCase();
    return (nameMatch || emailMatch) && statusMatch;
  });

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'passed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">Passed</span>;
      case 'completed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">Completed</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">Failed</span>;
      case 'incomplete':
      case 'in_progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">In Progress</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Not Attempted</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col overflow-hidden">
        
        {}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                SCORM Analytics & Reports
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-lg">
                {packageTitle || reportData?.package?.title || 'SCORM Tracking'} &bull; Standard: {reportData?.package?.version || 'SCORM'}
              </p>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
              <p className="text-sm">Loading SCORM performance metrics...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-sm">
              {error}
            </div>
          ) : (
            <>
              {}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Enrolled Learners</span>
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {summary.total_learners}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Passed / Completed</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-2">
                    {summary.passed_count + summary.completed_count}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Average Score</span>
                    <Award className="w-4 h-4 text-violet-500" />
                  </div>
                  <p className="text-2xl font-bold text-violet-700 dark:text-violet-300 mt-2">
                    {summary.avg_score}%
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Pass Rate</span>
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mt-2">
                    {summary.pass_rate}%
                  </p>
                </div>
              </div>

              {}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by learner name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="passed">Passed</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="incomplete">In Progress</option>
                  </select>
                </div>
              </div>

              {}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Learner</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Score</th>
                      <th className="px-4 py-3 text-center">Attempts</th>
                      <th className="px-4 py-3">Time Spent</th>
                      <th className="px-4 py-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {rec.user?.name || `Learner #${rec.user_id}`}
                            </div>
                            <div className="text-xs text-slate-400">{rec.user?.email || 'N/A'}</div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(rec.lesson_status)}
                          </td>
                          <td className="px-4 py-3 text-center font-bold">
                            {rec.score_raw !== null && rec.score_raw !== undefined ? (
                              <span className={rec.score_raw >= (reportData.package?.mastery_score || 80) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'}>
                                {rec.score_raw}%
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal">--</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {rec.attempt_count || 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                            {rec.total_time || rec.session_time || '00:00:00'}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">
                            {rec.updated_at ? new Date(rec.updated_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-slate-400">
                          {records.length === 0 
                            ? 'No learner attempts recorded yet. Launch the SCORM module to record progress.'
                            : 'No learners match your search criteria.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {}
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
