import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  X, CreditCard, ShieldCheck, Lock, QrCode, Building2,
  Maximize2, ArrowRight
} from 'lucide-react';

export const CheckoutModal = () => {
  const { checkoutModalCourse, setCheckoutModalCourse, processCoursePurchase, activeTenant, currentUser } = useApp();
  const navigate = useNavigate();
  const [gateway, setGateway] = useState('RAZORPAY'); 
  const [paymentMethod, setPaymentMethod] = useState('UPI'); 
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!checkoutModalCourse) return null;

  const coursePrice = Number(checkoutModalCourse.price || 0);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    const txnRef = `${gateway === 'RAZORPAY' ? 'pay_' : 'ch_'}${Math.random().toString(36).substring(2, 11)}`;

    setTimeout(() => {
      processCoursePurchase(checkoutModalCourse, gateway, {
        transaction_ref: txnRef,
        payment_method: paymentMethod
      });
      setIsProcessing(false);
      const courseId = checkoutModalCourse.id;
      setCheckoutModalCourse(null);
      navigate(`/learner/payment-success?txn_id=${txnRef}&course_id=${courseId}&gateway=${gateway}&method=${paymentMethod}`);
    }, 1200);
  };

  const handleExpandToPage = () => {
    const courseId = checkoutModalCourse.id;
    navigate(`/learner/checkout/${courseId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-slate-200 bg-white shadow-2xl space-y-5 text-slate-900">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xs">
            <Lock className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encrypted Indian Gateway
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExpandToPage}
              title="Open full checkout page"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCheckoutModalCourse(null)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex gap-3.5 items-center">
          <img
            src={checkoutModalCourse.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
            alt={checkoutModalCourse.title}
            className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 shadow-sm"
          />
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
              {activeTenant?.name || 'Institution Course'}
            </span>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">{checkoutModalCourse.title}</h4>
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="font-black text-emerald-600 text-lg">₹{coursePrice.toFixed(2)}</span>
              {checkoutModalCourse.original_price && (
                <span className="text-xs text-slate-400 line-through">₹{checkoutModalCourse.original_price}</span>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="space-y-2">
          <label className="block text-slate-700 font-bold text-xs">Select Payment Gateway</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setGateway('RAZORPAY')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                gateway === 'RAZORPAY'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Razorpay (UPI / Cards / NetBanking)</span>
            </button>
            <button
              type="button"
              onClick={() => setGateway('STRIPE')}
              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                gateway === 'STRIPE'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>Stripe Gateway (Global)</span>
            </button>
          </div>
        </div>

        {}
        {gateway === 'RAZORPAY' && (
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {}
            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shrink-0 border border-slate-200 shadow-xs">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=upi://pay?pa=smartlms@razorpay&pn=SmartLMS&am=${coursePrice}&cu=INR`}
                    alt="Scan UPI QR"
                    className="w-16 h-16"
                  />
                </div>
                <div className="text-xs space-y-1 flex-1">
                  <span className="font-extrabold text-indigo-700 text-[11px] block">Scan & Pay via UPI</span>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  <input
                    type="text"
                    placeholder="or enter UPI ID (e.g. mobile@upi)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {}
        {(gateway === 'STRIPE' || (gateway === 'RAZORPAY' && paymentMethod === 'CARD')) && (
          <form onSubmit={handlePay} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Cardholder Name</label>
              <input
                type="text"
                required
                defaultValue={currentUser?.name || 'Naveen B'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Card Number (RuPay / Visa / Master)</label>
              <input
                type="text"
                required
                defaultValue="4242 •••• •••• 4242"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expiry</label>
                <input
                  type="text"
                  required
                  defaultValue="12/28"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">CVV</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  defaultValue="884"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition"
                />
              </div>
            </div>
          </form>
        )}

        {}
        {gateway === 'RAZORPAY' && paymentMethod === 'NETBANKING' && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            {['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak', 'PNB'].map(bank => (
              <button
                key={bank}
                type="button"
                className="p-2 bg-slate-50 border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl font-bold text-[11px] text-slate-700 hover:text-indigo-700 transition"
              >
                {bank}
              </button>
            ))}
          </div>
        )}

        {}
        <div>
          <button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing ₹{coursePrice.toFixed(2)} with {gateway}...
              </span>
            ) : (
              <>
                <span>Pay ₹{coursePrice.toFixed(2)} & Unlock Course</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Instant course access upon successful transaction.
          </p>
        </div>

      </div>
    </div>
  );
};
