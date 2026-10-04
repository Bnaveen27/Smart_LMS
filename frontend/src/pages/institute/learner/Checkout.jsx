import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import {
  Lock, ShieldCheck, CheckCircle2, CreditCard, QrCode, Building2,
  ArrowLeft, Check, Sparkles, AlertCircle, ShoppingCart, User, Mail, Phone,
  ChevronRight, ArrowRight, Laptop, Award, BookOpen, Clock, Star, CheckCircle
} from 'lucide-react';
import CourseContentAccordion from '../../../components/course/CourseContentAccordion';

export const CheckoutPage = () => {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    courses,
    activeTenant,
    currentUser,
    checkoutModalCourse,
    setCheckoutModalCourse,
    processCoursePurchase
  } = useApp();

  const queryCourseId = courseId || searchParams.get('courseId') || searchParams.get('course_id');

  const course = courses.find(c => c.id === queryCourseId) ||
                 checkoutModalCourse ||
                 courses.find(c => c.price > 0) ||
                 courses[0];

  const [gateway, setGateway] = useState('RAZORPAY'); 
  const [paymentMethod, setPaymentMethod] = useState('UPI'); 
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: currentUser?.name || 'Naveen B',
    number: '4242 •••• •••• 4242',
    expiry: '12/28',
    cvv: '884'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900">No Course Selected</h2>
          <p className="text-xs text-slate-500">Please choose a course from the academic catalog to proceed with enrollment.</p>
          <button
            onClick={() => navigate('/learner')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
          >
            Back to Learner Catalog
          </button>
        </div>
      </div>
    );
  }

  const coursePrice = Number(course.price || 0);
  const originalPrice = Number(course.original_price || (coursePrice * 3.5));
  const discountAmount = Math.max(0, originalPrice - coursePrice);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const generatedRef = `${gateway === 'RAZORPAY' ? 'pay_' : 'ch_'}${Math.random().toString(36).substring(2, 11)}`;

    setTimeout(() => {
      processCoursePurchase(course, gateway, {
        transaction_ref: generatedRef,
        payment_method: paymentMethod
      });
      setIsProcessing(false);
      setCheckoutModalCourse(null);
      navigate(`/learner/payment-success?txn_id=${generatedRef}&course_id=${course.id}&gateway=${gateway}&method=${paymentMethod}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Plus_Jakarta_Sans',sans-serif] pb-16">
      
      {}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={() => navigate('/learner')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted Indian Gateway
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Student Account:</span>
            <span className="text-xs font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {currentUser?.name || 'Learner Student'}
            </span>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        
        {}
        <div className="mb-8 flex items-center justify-center gap-3 text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-500 font-semibold">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px]">1</span>
            Select Course
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center gap-1.5 text-indigo-600 font-black">
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
            Payment Checkout (₹ INR)
          </span>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">3</span>
            Access Course
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Order Summary</span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {activeTenant?.name || 'Institution Enrollment'}
                </span>
              </div>

              {}
              <div className="flex gap-4 items-start">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                  alt={course.title}
                  className="w-24 h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {course.level || 'Certified'}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2 leading-snug pt-1">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    Instructor: {course.instructor_name || 'Academic Department'}
                  </p>
                </div>
              </div>

              {}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Full Lifetime Access to all video modules & reading tracks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Official Verified Certificate upon 100% completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Interactive quizzes, assignments & hands-on modules</span>
                </div>
              </div>

              {}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Course MRP Price:</span>
                  <span className="line-through font-mono text-slate-400">₹{originalPrice.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Student Concession / Scholarship:</span>
                    <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST / Processing Taxes (18% Included):</span>
                  <span className="text-slate-600 font-mono">₹0.00 (Inclusive)</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-black text-slate-900">Total Due Amount:</span>
                  <span className="text-2xl font-black text-emerald-600 font-mono">₹{coursePrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-500 shadow-xs">
              <span>Need help with enrollment?</span>
              <a href="mailto:support@smartlms.io" className="text-indigo-600 font-bold hover:underline">
                support@smartlms.io
              </a>
            </div>

            {}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
              <CourseContentAccordion modules={course.modules || []} allowPreview={false} />
            </div>

          </div>

          {}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Select Payment Method
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pay securely using Indian UPI, NetBanking, Debit/Credit Cards, or International Gateways.
                </p>
              </div>

              {}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGateway('RAZORPAY')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    gateway === 'RAZORPAY'
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-2 ring-indigo-600/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute top-2.5 right-3 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    Recommended (INR)
                  </span>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span className="text-indigo-600 font-black">Razorpay Gateway</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">UPI (GPay, PhonePe, Paytm), RuPay & NetBanking</p>
                </button>

                <button
                  type="button"
                  onClick={() => setGateway('STRIPE')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    gateway === 'STRIPE'
                      ? 'bg-indigo-50/60 border-indigo-600 shadow-xs ring-2 ring-indigo-600/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <span className="text-slate-800 font-black">Stripe Gateway</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Visa, MasterCard, Amex & Global Cards</p>
                </button>
              </div>

              {}
              {gateway === 'RAZORPAY' && (
                <div className="space-y-5 pt-1">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    {[
                      { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                      { id: 'CARD', label: 'Debit / Credit Card', icon: CreditCard },
                      { id: 'NETBANKING', label: 'Net Banking', icon: Building2 }
                    ].map(tab => {
                      const Icon = tab.icon;
                      const isActive = paymentMethod === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setPaymentMethod(tab.id)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {}
                  {paymentMethod === 'UPI' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=smartlms@razorpay&pn=SmartLMS&am=15.00&cu=INR"
                            alt="Scan UPI QR Code"
                            className="w-24 h-24"
                          />
                        </div>
                        <div className="space-y-1.5 text-center sm:text-left">
                          <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            Instant Scan & Pay Any UPI App
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-900">Google Pay, PhonePe, Paytm, BHIM, CRED</h4>
                          <p className="text-[11px] text-slate-500">Scan this dynamic UPI QR with your phone camera or payment app to complete ₹{coursePrice.toFixed(2)} payment instantly.</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <label className="font-bold text-slate-700 block">Or Enter UPI ID / VPA</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. mobileNumber@upi or yourname@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => alert(`Verification request dispatched to UPI ID: ${upiId || 'your-vpa@upi'}`)}
                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition cursor-pointer shadow-sm"
                          >
                            Verify & Request
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  {paymentMethod === 'CARD' && (
                    <div className="space-y-3.5 text-xs animate-in fade-in">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Cardholder Name (as on card)</label>
                        <input
                          type="text"
                          required
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-slate-700">Card Number</label>
                          <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">RuPay / Visa / MasterCard</span>
                        </div>
                        <input
                          type="text"
                          required
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            required
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">CVV (3-digit)</label>
                          <input
                            type="password"
                            maxLength={4}
                            required
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {}
                  {paymentMethod === 'NETBANKING' && (
                    <div className="space-y-3 text-xs animate-in fade-in">
                      <label className="font-bold text-slate-700 block">Popular Indian Net Banking Banks</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {[
                          { code: 'HDFC', name: 'HDFC Bank' },
                          { code: 'SBI', name: 'State Bank of India' },
                          { code: 'ICICI', name: 'ICICI Bank' },
                          { code: 'AXIS', name: 'Axis Bank' },
                          { code: 'KOTAK', name: 'Kotak Mahindra' },
                          { code: 'PNB', name: 'Punjab National' }
                        ].map(bank => (
                          <button
                            key={bank.code}
                            type="button"
                            onClick={() => setSelectedBank(bank.code)}
                            className={`p-3 rounded-xl border text-left font-bold transition cursor-pointer ${
                              selectedBank === bank.code
                                ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs ring-1 ring-indigo-600'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {bank.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {}
              {gateway === 'STRIPE' && (
                <div className="space-y-3.5 text-xs animate-in fade-in pt-1">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Credit / Debit Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Expiration Date</label>
                      <input
                        type="text"
                        required
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Security CVC</label>
                      <input
                        type="password"
                        required
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-slate-900 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePay}
                  className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing ₹{coursePrice.toFixed(2)} with {gateway}...
                    </span>
                  ) : (
                    <>
                      <span>Pay ₹{coursePrice.toFixed(2)} & Unlock Course</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Your payment is processed under 256-bit encrypted {gateway} RBI-compliant checkout.
                </p>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
