import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  UserCheck, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  FileText, 
  Building, 
  BookOpen, 
  Eye, 
  RefreshCw,
  Printer,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ManualEnrollmentModal from './ManualEnrollmentModal';
import InvoiceReceiptModal from './InvoiceReceiptModal';

export default function EnrollmentReportsHub({ initialTab = 'all' }) {
  const { 
    courses, 
    users, 
    activeTenant, 
    enrollmentRecords = [], 
    transactions = [], 
    approveEnrollment, 
    updateEnrollmentStatus,
    courseProgress = {}
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState(initialTab); 

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('ALL');
  
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const allEnrolledList = useMemo(() => {
    return (enrollmentRecords || []).map(enr => {
      const course = courses.find(c => c.id === enr.course_id) || {};
      const user = users.find(u => u.id === enr.user_id) || {};
      const txn = transactions.find(t => t.course_id === enr.course_id && (t.user_id === enr.user_id || t.learner_email === enr.learner_email)) || {};

      const progress = courseProgress[enr.course_id]?.progressPercent || enr.progress_percentage || 0;

      return {
        id: enr.id,
        user_id: enr.user_id || user.id,
        learner_name: enr.learner_name || user.name || 'Enrolled Learner',
        learner_email: enr.learner_email || user.email || 'learner@domain.com',
        course_id: enr.course_id,
        course_title: enr.course_title || course.title || 'Course',
        course_price: enr.price || enr.payment_amount || course.price || 0,
        course_instructor: enr.course_instructor || course.instructor_name || 'Academic Instructor',
        enrollment_type: enr.enrollment_type || (enr.gateway === 'RAZORPAY' ? 'ONLINE_PURCHASE' : enr.payment_method ? 'OFFLINE_PAYMENT' : 'MANUAL_ADMIN'),
        payment_method: enr.payment_method || (enr.gateway === 'RAZORPAY' ? 'RAZORPAY_UPI' : 'OFFLINE_DIRECT'),
        transaction_ref: enr.transaction_ref || enr.payment_reference || txn.transaction_ref || `ENR-${enr.id}`,
        status: enr.status || 'ACTIVE',
        progress: progress,
        isCompleted: progress === 100,
        enrolled_at: enr.enrolled_at || enr.created_at || new Date().toISOString(),
        start_date: enr.start_date,
        expiry_date: enr.expiry_date,
        notes: enr.notes,
        raw: enr
      };
    });
  }, [enrollmentRecords, courses, users, transactions, courseProgress]);

  const metrics = useMemo(() => {
    const totalEnrollments = allEnrolledList.length;
    const onlinePurchases = allEnrolledList.filter(e => e.enrollment_type === 'ONLINE_PURCHASE' || e.payment_method?.toLowerCase().includes('razorpay'));
    const offlineEnrollments = allEnrolledList.filter(e => e.enrollment_type === 'OFFLINE_PAYMENT' || e.enrollment_type === 'MANUAL_ADMIN');
    const pendingApprovals = allEnrolledList.filter(e => e.status === 'PENDING_APPROVAL' || e.status === 'PENDING_PAYMENT');
    
    const totalRevenue = allEnrolledList.reduce((sum, item) => sum + (Number(item.course_price) || 0), 0);
    const onlineRevenue = onlinePurchases.reduce((sum, item) => sum + (Number(item.course_price) || 0), 0);
    const offlineRevenue = offlineEnrollments.reduce((sum, item) => sum + (Number(item.course_price) || 0), 0);

    return {
      totalEnrollments,
      totalRevenue,
      onlinePurchasesCount: onlinePurchases.length,
      onlineRevenue,
      offlineEnrollmentsCount: offlineEnrollments.length,
      offlineRevenue,
      pendingApprovalsCount: pendingApprovals.length
    };
  }, [allEnrolledList]);

  const filteredList = useMemo(() => {
    return allEnrolledList.filter(item => {
      
      if (activeReportTab === 'online' && item.enrollment_type !== 'ONLINE_PURCHASE' && !item.payment_method?.toLowerCase().includes('razorpay')) return false;
      if (activeReportTab === 'offline' && item.enrollment_type !== 'OFFLINE_PAYMENT' && item.enrollment_type !== 'MANUAL_ADMIN') return false;
      if (activeReportTab === 'pending' && item.status !== 'PENDING_APPROVAL' && item.status !== 'PENDING_PAYMENT') return false;
      if (activeReportTab === 'refunds' && item.status !== 'REFUNDED' && item.status !== 'CANCELLED') return false;

      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

      if (selectedCourseFilter !== 'ALL' && item.course_id !== selectedCourseFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchLearner = item.learner_name?.toLowerCase().includes(q) || item.learner_email?.toLowerCase().includes(q);
        const matchCourse = item.course_title?.toLowerCase().includes(q);
        const matchRef = item.transaction_ref?.toLowerCase().includes(q);
        if (!matchLearner && !matchCourse && !matchRef) return false;
      }

      return true;
    });
  }, [allEnrolledList, activeReportTab, statusFilter, selectedCourseFilter, searchTerm]);

  const courseRevenueReport = useMemo(() => {
    return courses.map(c => {
      const courseEnrs = allEnrolledList.filter(e => e.course_id === c.id);
      const onlineEnrs = courseEnrs.filter(e => e.enrollment_type === 'ONLINE_PURCHASE');
      const offlineEnrs = courseEnrs.filter(e => e.enrollment_type === 'OFFLINE_PAYMENT' || e.enrollment_type === 'MANUAL_ADMIN');
      const totalRev = courseEnrs.reduce((sum, e) => sum + (Number(e.course_price) || 0), 0);
      const completedCount = courseEnrs.filter(e => e.isCompleted).length;
      const completionRate = courseEnrs.length > 0 ? Math.round((completedCount / courseEnrs.length) * 100) : 0;

      return {
        id: c.id,
        title: c.title,
        price: c.price || 0,
        category: c.category || 'General',
        instructor: c.instructor_name || 'Academic Instructor',
        onlineCount: onlineEnrs.length,
        offlineCount: offlineEnrs.length,
        totalEnrolled: courseEnrs.length,
        totalRevenue: totalRev,
        completionRate: completionRate
      };
    });
  }, [courses, allEnrolledList]);

  const learnerHistoryReport = useMemo(() => {
    const learnerMap = {};
    allEnrolledList.forEach(e => {
      const email = e.learner_email || 'unknown';
      if (!learnerMap[email]) {
        learnerMap[email] = {
          name: e.learner_name,
          email: e.learner_email,
          user_id: e.user_id,
          totalSpent: 0,
          coursesEnrolled: [],
          enrollments: []
        };
      }
      learnerMap[email].totalSpent += Number(e.course_price) || 0;
      learnerMap[email].coursesEnrolled.push(e.course_title);
      learnerMap[email].enrollments.push(e);
    });
    return Object.values(learnerMap);
  }, [allEnrolledList]);

  const handleApprove = async (enrId) => {
    if (!window.confirm('Approve offline enrollment and immediately unlock course curriculum for this learner?')) return;
    setIsProcessingAction(true);
    try {
      if (approveEnrollment) {
        await approveEnrollment(enrId);
      }
    } catch (e) {
      alert('Failed to approve enrollment: ' + e.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const handleStatusChange = async (enrId, newStatus) => {
    setIsProcessingAction(true);
    try {
      if (updateEnrollmentStatus) {
        await updateEnrollmentStatus(enrId, newStatus);
      }
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    } finally {
      setIsProcessingAction(false);
    }
  };

  const openInvoiceFor = (item) => {
    setSelectedInvoice({
      invoiceNo: item.transaction_ref?.startsWith('TXN-') || item.transaction_ref?.startsWith('REC-') 
        ? item.transaction_ref 
        : `REC-${item.id.toString().slice(-6)}`,
      date: item.enrolled_at,
      learnerName: item.learner_name,
      learnerEmail: item.learner_email,
      courseTitle: item.course_title,
      instructorName: item.course_instructor,
      amount: item.course_price,
      paymentMethod: item.payment_method,
      paymentReference: item.transaction_ref,
      status: item.status === 'ACTIVE' || item.status === 'PAYMENT_SUCCESSFUL' || item.status === 'MANUALLY_ENROLLED' ? 'PAID' : item.status,
      enrollmentType: item.enrollment_type,
      notes: item.notes || (item.enrollment_type === 'OFFLINE_PAYMENT' ? 'Manual offline payment verified by Admin.' : 'Direct online gateway checkout.')
    });
  };

  const exportCSV = () => {
    let headers = ['Enrollment ID', 'Learner Name', 'Learner Email', 'Course Title', 'Enrollment Type', 'Payment Method', 'Amount (INR)', 'Transaction Ref', 'Status', 'Date'];
    let rows = filteredList.map(e => [
      e.id,
      `"${e.learner_name}"`,
      `"${e.learner_email}"`,
      `"${e.course_title}"`,
      e.enrollment_type,
      e.payment_method,
      e.course_price,
      `"${e.transaction_ref}"`,
      e.status,
      e.enrolled_at
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `enrollment_report_${activeReportTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Course Purchase & Enrollment Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage Model 1 (Online Razorpay purchases), Model 2 (Offline fee collection & manual enrollment), and financial revenue reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            + New Manual / Offline Enrollment
          </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Enrollments</span>
            <UserCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.totalEnrollments}</p>
          <p className="text-[10px] text-slate-400 font-medium">All active & completed learners</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-mono">₹{metrics.totalRevenue.toLocaleString('en-IN')}</p>
          <p className="text-[10px] text-emerald-600 font-medium">Online + Offline collected</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Online (Razorpay)</span>
            <CreditCard className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.onlinePurchasesCount}</p>
          <p className="text-[10px] text-blue-600 font-bold font-mono">₹{metrics.onlineRevenue.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Offline & Manual</span>
            <FileText className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{metrics.offlineEnrollmentsCount}</p>
          <p className="text-[10px] text-amber-600 font-bold font-mono">₹{metrics.offlineRevenue.toLocaleString('en-IN')}</p>
        </div>

        <div className={`p-4 rounded-2xl border shadow-sm space-y-1 ${
          metrics.pendingApprovalsCount > 0 
            ? 'bg-rose-50 border-rose-200 text-rose-900' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Approvals</span>
            <Clock className={`w-4 h-4 ${metrics.pendingApprovalsCount > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <p className="text-2xl font-black">{metrics.pendingApprovalsCount}</p>
          <p className="text-[10px] text-slate-500 font-medium">Awaiting admin verification</p>
        </div>

      </div>

      {}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold">
        {[
          { id: 'all', label: 'All Enrollments & Transactions' },
          { id: 'online', label: 'Model 1: Online Purchases (Razorpay)' },
          { id: 'offline', label: 'Model 2: Offline / Manual Enrollments' },
          { id: 'pending', label: `Pending Approvals Queue (${metrics.pendingApprovalsCount})` },
          { id: 'course_revenue', label: 'Course-wise Revenue' },
          { id: 'learner_history', label: 'Learner Payment History' },
          { id: 'refunds', label: 'Refunds & Cancellations' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
              activeReportTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {}
      {(activeReportTab === 'all' || activeReportTab === 'online' || activeReportTab === 'offline' || activeReportTab === 'pending' || activeReportTab === 'refunds') && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by learner, course, or UTR/txn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="MANUALLY_ENROLLED">Manually Enrolled</option>
              <option value="PAYMENT_SUCCESSFUL">Payment Successful</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="COMPLETED">Completed</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:bg-white max-w-[200px] truncate"
            >
              <option value="ALL">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

        </div>
      )}

      {}
      {(activeReportTab === 'all' || activeReportTab === 'online' || activeReportTab === 'offline' || activeReportTab === 'pending' || activeReportTab === 'refunds') && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                  <th className="py-3.5 px-4">Learner Info</th>
                  <th className="py-3.5 px-4">Course Details</th>
                  <th className="py-3.5 px-4">Type / Payment Mode</th>
                  <th className="py-3.5 px-4">Fee Amount</th>
                  <th className="py-3.5 px-4">Status & Progress</th>
                  <th className="py-3.5 px-4">Payment Ref / Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredList.length > 0 ? (
                  filteredList.map((item) => {
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {}
                        <td className="py-3 px-4">
                          <p className="font-extrabold text-slate-900">{item.learner_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{item.learner_email}</p>
                        </td>

                        {}
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-bold text-slate-800 line-clamp-1">{item.course_title}</p>
                          <p className="text-[10px] text-indigo-600 font-semibold">{item.course_instructor}</p>
                        </td>

                        {}
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            item.enrollment_type === 'ONLINE_PURCHASE'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {item.enrollment_type?.replace('_', ' ')}
                          </span>
                          <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                            {item.payment_method}
                          </span>
                        </td>

                        {}
                        <td className="py-3 px-4 font-mono">
                          <span className="font-extrabold text-emerald-700">
                            {Number(item.course_price) > 0 ? `₹${Number(item.course_price).toLocaleString('en-IN')}` : 'Free'}
                          </span>
                        </td>

                        {}
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              item.status === 'ACTIVE' || item.status === 'PAYMENT_SUCCESSFUL' || item.status === 'MANUALLY_ENROLLED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'PENDING_APPROVAL'
                                ? 'bg-amber-100 text-amber-800 animate-pulse'
                                : item.status === 'COMPLETED'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.status}
                            </span>
                            
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                              <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                              </div>
                              <span>{item.progress}%</span>
                            </div>
                          </div>
                        </td>

                        {}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          <p className="font-bold text-slate-700">{item.transaction_ref}</p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(item.enrolled_at).toLocaleDateString()}
                          </p>
                        </td>

                        {}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {item.status === 'PENDING_APPROVAL' && (
                              <button
                                onClick={() => handleApprove(item.id)}
                                disabled={isProcessingAction}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all"
                              >
                                ✓ Approve
                              </button>
                            )}

                            <button
                              onClick={() => openInvoiceFor(item)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <FileText className="w-3 h-3 text-slate-500" />
                              Receipt
                            </button>

                            {item.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleStatusChange(item.id, 'CANCELLED')}
                                className="px-2 py-1 hover:bg-rose-50 text-rose-600 rounded-lg text-[10px] font-medium"
                                title="Cancel Enrollment"
                              >
                                Cancel
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="font-bold text-slate-600">No records found</p>
                        <p className="text-xs text-slate-400">No enrollments match the selected filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {activeReportTab === 'course_revenue' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Course-Wise Revenue Breakdown</h3>
              <p className="text-xs text-slate-500">Aggregated revenue generated across Online Razorpay and Offline Manual enrollments per curriculum.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                  <th className="py-3 px-4">Course Title & Category</th>
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4 text-center">Base Price</th>
                  <th className="py-3 px-4 text-center">Online Learners</th>
                  <th className="py-3 px-4 text-center">Offline Learners</th>
                  <th className="py-3 px-4 text-center">Total Enrolled</th>
                  <th className="py-3 px-4 text-right">Total Revenue (₹)</th>
                  <th className="py-3 px-4 text-center">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {courseRevenueReport.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.title}
                      <span className="block text-[10px] text-slate-400 font-normal">{c.category}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{c.instructor}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">₹{c.price}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-blue-600">{c.onlineCount}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-purple-600">{c.offlineCount}</td>
                    <td className="py-3.5 px-4 text-center font-black text-slate-900">{c.totalEnrolled}</td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-700 font-mono text-sm">
                      ₹{c.totalRevenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-700">
                      {c.completionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {activeReportTab === 'learner_history' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Learner-Wise Payment History</h3>
              <p className="text-xs text-slate-500">Consolidated financial ledger per learner with fee totals and instant receipts.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                  <th className="py-3 px-4">Learner Name & Email</th>
                  <th className="py-3 px-4">Enrolled Courses</th>
                  <th className="py-3 px-4 text-center">Courses Count</th>
                  <th className="py-3 px-4 text-right">Lifetime Spent (₹)</th>
                  <th className="py-3 px-4 text-right">Latest Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {learnerHistoryReport.map((l, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <p className="font-extrabold text-slate-900">{l.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{l.email}</p>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex flex-wrap gap-1">
                        {l.coursesEnrolled.map((c, i) => (
                          <span key={i} className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium truncate max-w-[200px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {l.coursesEnrolled.length}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-emerald-700 font-mono">
                      ₹{l.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {l.enrollments[0] && (
                        <button
                          onClick={() => openInvoiceFor(l.enrollments[0])}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3 text-slate-500" />
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      <ManualEnrollmentModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {}
      <InvoiceReceiptModal
        isOpen={Boolean(selectedInvoice)}
        invoiceData={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

    </div>
  );
}
