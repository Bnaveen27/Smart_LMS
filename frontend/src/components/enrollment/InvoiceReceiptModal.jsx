import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  FileText, 
  Building, 
  Calendar, 
  ShieldCheck, 
  CreditCard 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function InvoiceReceiptModal({ invoiceData, isOpen, onClose }) {
  const { activeTenant } = useApp();
  const printRef = useRef(null);

  if (!isOpen || !invoiceData) return null;

  const {
    invoiceNo = `REC-${Date.now().toString().slice(-6)}`,
    date = new Date().toISOString().split('T')[0],
    learnerName = 'Enrolled Learner',
    learnerEmail = 'learner@example.com',
    courseTitle = 'Enterprise Professional Course',
    instructorName = 'Course Instructor',
    amount = 0,
    paymentMethod = 'RAZORPAY',
    paymentReference = 'TXN-983021',
    status = 'PAID',
    enrollmentType = 'ONLINE_PURCHASE',
    notes = 'Official Enrollment Receipt'
  } = invoiceData;

  const basePrice = Number(amount) || 0;
  const gstRate = 0.18; 
  const taxableAmount = (basePrice / 1.18).toFixed(2);
  const totalTax = (basePrice - Number(taxableAmount)).toFixed(2);
  const cgst = (Number(totalTax) / 2).toFixed(2);
  const sgst = (Number(totalTax) / 2).toFixed(2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200 my-8">
        
        {}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-black tracking-tight">Tax Invoice & Fee Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {}
        <div ref={printRef} className="p-8 space-y-6 text-slate-800 bg-white">
          
          {}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2.5">
                {activeTenant?.logo_url ? (
                  <img src={activeTenant.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
                    {activeTenant?.name?.[0] || 'L'}
                  </div>
                )}
                <div>
                  <h1 className="text-lg font-black text-slate-900">{activeTenant?.name || 'Smart LMS Academy'}</h1>
                  <p className="text-[11px] text-slate-500 font-medium">Enterprise Learning Management System</p>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-2 space-y-0.5 font-medium">
                <p>{activeTenant?.address || 'Academic Complex, Tech Corridor, Bangalore 560100'}</p>
                <p>Email: {activeTenant?.email || 'support@smartlms.edu'} | GSTIN: 29AABCU9603R1ZM</p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 border border-emerald-300">
                {status === 'PAID' || status === 'ACTIVE' || status === 'MANUALLY_ENROLLED' ? '✓ PAYMENT RECEIVED' : status}
              </span>
              <p className="text-xs font-mono font-bold text-slate-900">INVOICE #{invoiceNo}</p>
              <p className="text-[11px] text-slate-500 font-mono">Date: {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Billed To (Learner):</span>
              <p className="text-xs font-extrabold text-slate-900 mt-0.5">{learnerName}</p>
              <p className="text-[11px] text-slate-600 font-mono">{learnerEmail}</p>
              <p className="text-[10px] text-slate-500 mt-1">Enrollment Track: <span className="font-bold text-indigo-700">{enrollmentType}</span></p>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Payment Breakdown:</span>
              <p className="text-[11px] text-slate-800 font-bold mt-0.5">Method: <span className="text-indigo-600 font-mono uppercase">{paymentMethod}</span></p>
              <p className="text-[11px] text-slate-800 font-mono">UTR / Txn Ref: <span className="text-slate-900 font-bold">{paymentReference}</span></p>
              {notes && <p className="text-[10px] text-slate-500 italic mt-0.5">Note: {notes}</p>}
            </div>
          </div>

          {}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase">
                  <th className="py-2.5 px-4">Item Description</th>
                  <th className="py-2.5 px-4 text-center">Instructor</th>
                  <th className="py-2.5 px-4 text-right">Taxable</th>
                  <th className="py-2.5 px-4 text-right">GST (18%)</th>
                  <th className="py-2.5 px-4 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{courseTitle}</p>
                    <p className="text-[10px] text-slate-500">Lifetime access & verified completion certificate</p>
                  </td>
                  <td className="py-3 px-4 text-center text-[11px] text-slate-600">
                    {instructorName}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    ₹{taxableAmount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-700">
                    ₹{totalTax}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 font-mono">
                    ₹{basePrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Net Fee):</span>
                <span className="font-mono">₹{taxableAmount}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>CGST (9%):</span>
                <span className="font-mono">₹{cgst}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>SGST (9%):</span>
                <span className="font-mono">₹{sgst}</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                <span>Grand Total Paid:</span>
                <span className="text-emerald-700 font-mono">₹{basePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {}
          <div className="border-t border-slate-200 pt-6 flex items-end justify-between">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p className="flex items-center gap-1 text-slate-600 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Digitally generated and verified invoice.
              </p>
              <p>Thank you for choosing {activeTenant?.name || 'Smart LMS'}. Happy learning!</p>
            </div>

            <div className="text-center">
              <div className="h-10 border-b border-slate-300 w-36 mb-1" />
              <p className="text-[10px] font-bold uppercase text-slate-500">Authorized Signatory</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
