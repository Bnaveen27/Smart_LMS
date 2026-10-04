import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  BookOpen, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Clock, 
  ShieldCheck,
  Search,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ManualEnrollmentModal({ isOpen, onClose, defaultCourseId = null }) {
  const { courses, users, activeTenant, createManualEnrollment } = useApp();

  const [courseId, setCourseId] = useState(defaultCourseId || (courses[0]?.id || ''));
  const [learnerSelectionMode, setLearnerSelectionMode] = useState('EXISTING'); 
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [newLearner, setNewLearner] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [enrollmentType, setEnrollmentType] = useState('OFFLINE_PAYMENT'); 
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER'); 
  const [customAmount, setCustomAmount] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentProof, setPaymentProof] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState('ACTIVE'); 
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const selectedCourse = courses.find(c => c.id === courseId) || courses[0];
  const coursePrice = selectedCourse?.price || 0;
  const effectiveAmount = customAmount !== '' ? Number(customAmount) : coursePrice;

  const availableLearners = users.filter(u => 
    (u.role === 'LEARNER' || u.role === 'STUDENT' || !u.role) &&
    (u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
     u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const toggleUserSelection = (id) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    const filteredIds = availableLearners.map(u => u.id);
    setSelectedUserIds(filteredIds);
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!courseId) {
      setErrorMessage('Please select a course to enroll.');
      return;
    }

    let learnersToEnroll = [];

    if (learnerSelectionMode === 'EXISTING') {
      if (selectedUserIds.length === 0) {
        setErrorMessage('Please select at least one learner from the list.');
        return;
      }
      learnersToEnroll = selectedUserIds.map(uid => {
        const u = users.find(x => x.id === uid);
        return {
          user_id: u.id,
          learner_name: u.name,
          learner_email: u.email
        };
      });
    } else {
      if (!newLearner.name.trim() || !newLearner.email.trim()) {
        setErrorMessage('Please provide both learner full name and email address.');
        return;
      }
      learnersToEnroll = [{
        user_id: `user-${Date.now()}`,
        learner_name: newLearner.name.trim(),
        learner_email: newLearner.email.trim().toLowerCase(),
        phone: newLearner.phone
      }];
    }

    setIsSubmitting(true);

    try {
      const payload = {
        course_id: selectedCourse.id,
        course_title: selectedCourse.title,
        tenant_id: activeTenant?.id || 'default-tenant',
        learners: learnersToEnroll,
        enrollment_type: enrollmentType,
        payment_method: paymentMethod,
        payment_amount: effectiveAmount,
        payment_reference: paymentReference || `OFFLINE-${Date.now().toString().slice(-6)}`,
        payment_date: paymentDate,
        payment_proof: paymentProof,
        start_date: startDate,
        expiry_date: expiryDate || null,
        status: status,
        notes: notes
      };

      if (createManualEnrollment) {
        await createManualEnrollment(payload);
      }

      setSuccessMessage(`Successfully recorded ${learnersToEnroll.length} manual enrollment(s) for "${selectedCourse.title}". The course is immediately unlocked for the learner(s).`);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete manual enrollment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        
        {}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <UserPlus className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                Offline Payment & Manual Course Enrollment
              </h2>
              <p className="text-xs text-indigo-200">
                Model 2 – Collect fees offline (Cash, Bank Transfer, UPI) and grant immediate course access.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs font-semibold">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMessage}
            </div>
          )}

          {}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Step 1: Select Course to Enroll
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title} {c.price ? `(Standard: ₹${c.price})` : '(Free Track)'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-2.5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-700">Catalog Price:</span>
                <span className="text-xs font-black text-indigo-900 font-mono">
                  {selectedCourse?.price ? `₹${selectedCourse.price}` : 'Free'}
                </span>
              </div>
            </div>
          </div>

          {}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Step 2: Select Learner(s)
              </label>
              
              <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLearnerSelectionMode('EXISTING')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                    learnerSelectionMode === 'EXISTING' 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Existing Registered ({users.filter(u => u.role === 'LEARNER').length})
                </button>
                <button
                  type="button"
                  onClick={() => setLearnerSelectionMode('NEW')}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all ${
                    learnerSelectionMode === 'NEW' 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  + New Learner Form
                </button>
              </div>
            </div>

            {learnerSelectionMode === 'EXISTING' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search learners by name or email..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSelectAllFiltered}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-2 rounded-xl border border-indigo-100"
                  >
                    Select All
                  </button>
                  {selectedUserIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 bg-rose-50 px-2.5 py-2 rounded-xl border border-rose-100"
                    >
                      Clear ({selectedUserIds.length})
                    </button>
                  )}
                </div>

                {}
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl bg-white divide-y divide-slate-100">
                  {availableLearners.length > 0 ? (
                    availableLearners.map(u => {
                      const isChecked = selectedUserIds.includes(u.id);
                      return (
                        <div 
                          key={u.id}
                          onClick={() => toggleUserSelection(u.id)}
                          className={`flex items-center justify-between p-2.5 hover:bg-indigo-50/50 cursor-pointer transition-colors ${
                            isChecked ? 'bg-indigo-50/70' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-800">{u.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">{u.email}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg">
                            {u.role || 'LEARNER'}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No learners match your search query.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newLearner.name}
                    onChange={(e) => setNewLearner({ ...newLearner, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={newLearner.email}
                    onChange={(e) => setNewLearner({ ...newLearner, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 9876543210"
                    value={newLearner.phone}
                    onChange={(e) => setNewLearner({ ...newLearner, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {}
          <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Step 3: Offline Payment Reference & Verification
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / IMPS / RTGS)</option>
                  <option value="CASH">Cash Payment (Counter)</option>
                  <option value="UPI_DIRECT">Direct UPI (GPay / PhonePe / QR)</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="DEMAND_DRAFT">Demand Draft (DD)</option>
                  <option value="SCHOLARSHIP">Scholarship / Fee Waiver</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Fee Collected (₹)</label>
                <input
                  type="number"
                  placeholder={`Default: ₹${coursePrice}`}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-emerald-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Transaction / UTR Ref</label>
                <input
                  type="text"
                  placeholder="e.g. UTR198302919 or REC-402"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Access Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Access Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Initial Access Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ACTIVE">ACTIVE (Immediate Course Access)</option>
                  <option value="MANUALLY_ENROLLED">MANUALLY_ENROLLED (Standard Verified)</option>
                  <option value="PENDING_APPROVAL">PENDING_APPROVAL (Requires Super Admin Signoff)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Admin Audit Notes / Receipt Slip</label>
                <input
                  type="text"
                  placeholder="e.g. Verified by Accounts Dept / Cash receipt #104"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Recording Enrollment...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Confirm & Grant Course Access
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
