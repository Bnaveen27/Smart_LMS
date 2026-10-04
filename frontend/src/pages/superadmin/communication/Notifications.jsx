import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Bell, Mail, MessageSquare, Smartphone, Send,
  Plus, CheckCircle2, Clock, Eye, Edit3, Trash2,
  Search, Filter, Sparkles, Layers, ShieldCheck, Copy
} from 'lucide-react';

export const NotificationsTab = ({ initialSubTab = 'all' }) => {
  const { users, activeTenant, notificationsList, addNotification, deleteNotification } = useApp();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); 
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const notifications = notificationsList?.length > 0 ? notificationsList.map(n => ({
    id: n.id,
    title: n.title,
    recipient: n.user_id ? (users.find(u => u.id === n.user_id)?.name || n.user_id) : 'All Users',
    channel: n.channel || 'IN_APP',
    status: n.status || 'DELIVERED',
    sent_at: n.createdAt ? new Date(n.createdAt).toLocaleString() : 'Just now',
    event: n.type || 'SYSTEM_NOTIFICATION'
  })) : [
    {
      id: 'notif-101',
      title: 'Course Enrollment Confirmation',
      recipient: 'Naveen Bala (naveenbala2701@gmail.com)',
      channel: 'EMAIL',
      status: 'DELIVERED',
      sent_at: '2026-09-21 14:30',
      event: 'COURSE_PURCHASE'
    },
    {
      id: 'notif-102',
      title: 'Security Alert: New Sign-in Detected',
      recipient: 'Dr. S. Karthik (karthik@aactni.edu.in)',
      channel: 'PUSH',
      status: 'DELIVERED',
      sent_at: '2026-09-21 12:15',
      event: 'LOGIN_SECURITY'
    },
    {
      id: 'notif-103',
      title: 'Exam Schedule Reminder SMS',
      recipient: 'Anitha Sundaram (+91 98401 22334)',
      channel: 'SMS',
      status: 'DELIVERED',
      sent_at: '2026-09-20 09:00',
      event: 'EXAM_REMINDER'
    },
    {
      id: 'notif-104',
      title: 'Fee Payment Receipt Generated',
      recipient: 'Vijay Raghavan (vijay.r@student.edu.in)',
      channel: 'EMAIL',
      status: 'DELIVERED',
      sent_at: '2026-09-20 18:45',
      event: 'FEE_RECEIPT'
    }
  ];

  const [emailTemplates, setEmailTemplates] = useState([
    {
      id: 'tmpl-email-1',
      name: 'Welcome & Account Activation',
      subject: 'Welcome to {{institute_name}} - Activate Your Student Account',
      category: 'Onboarding',
      variables: ['{{student_name}}', '{{activation_link}}', '{{institute_name}}'],
      body: 'Hello {{student_name}},\n\nWelcome to {{institute_name}}! Click the link below to set your password and access your academic portal:\n{{activation_link}}\n\nBest regards,\nAcademic Administration'
    },
    {
      id: 'tmpl-email-2',
      name: 'Course Enrollment Success',
      subject: 'Your Enrollment in {{course_title}} is Confirmed!',
      category: 'Academics',
      variables: ['{{student_name}}', '{{course_title}}', '{{instructor_name}}', '{{course_url}}'],
      body: 'Hello {{student_name}},\n\nYou have successfully enrolled in {{course_title}} taught by {{instructor_name}}.\nAccess your lessons here: {{course_url}}'
    },
    {
      id: 'tmpl-email-3',
      name: 'Password Reset Request',
      subject: 'Security: Reset Your Password',
      category: 'Security',
      variables: ['{{user_name}}', '{{reset_link}}', '{{expiry_minutes}}'],
      body: 'Hello {{user_name}},\n\nWe received a request to reset your password. Click here:\n{{reset_link}}\nThis link will expire in {{expiry_minutes}} minutes.'
    }
  ]);

  const [smsTemplates, setSmsTemplates] = useState([
    {
      id: 'tmpl-sms-1',
      name: 'OTP Verification SMS',
      category: 'Auth',
      sender_id: 'SMARTLMS',
      text: 'Your Smart LMS verification OTP is {{otp}}. Valid for 10 minutes. Do not share this code.'
    },
    {
      id: 'tmpl-sms-2',
      name: 'Fee Payment Received',
      category: 'Finance',
      sender_id: 'SMARTLMS',
      text: 'Dear {{student_name}}, payment of Rs.{{amount}} for {{course_name}} has been received. Txn ID: {{txn_id}}.'
    },
    {
      id: 'tmpl-sms-3',
      name: 'Urgent Class Reschedule Alert',
      category: 'Academics',
      sender_id: 'SMARTLMS',
      text: 'Notice: Class for {{subject_name}} scheduled on {{date}} has been rescheduled to {{new_time}}.'
    }
  ]);

  const [pushTitle, setPushTitle] = useState('');
  const [pushMessage, setPushMessage] = useState('');
  const [pushTarget, setPushTarget] = useState('ALL');

  const handleSendPush = (e) => {
    e.preventDefault();
    if (!pushTitle || !pushMessage) return;

    const newLog = {
      id: `notif-${Date.now()}`,
      title: pushTitle,
      recipient: `Broadcast to ${pushTarget}`,
      channel: 'PUSH',
      status: 'DELIVERED',
      sent_at: 'Just now',
      event: 'PUSH_BROADCAST'
    };

    setNotifications([newLog, ...notifications]);
    setPushTitle('');
    setPushMessage('');
    setSuccessMsg('Push notification broadcasted successfully to all active devices!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn pb-12">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Notifications & Dispatch Center</h1>
              <p className="text-xs text-slate-500 font-medium">Manage multi-channel notification logs, email templates, SMS alerts, and web push broadcasts.</p>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto border border-slate-200/60 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'all'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Logs ({notifications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('email-templates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'email-templates'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email Templates
          </button>
          <button
            onClick={() => setActiveSubTab('sms-templates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'sms-templates'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SMS Templates
          </button>
          <button
            onClick={() => setActiveSubTab('push')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              activeSubTab === 'push'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Push Broadcast
          </button>
        </div>
      </div>

      {}
      {activeSubTab === 'all' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Recent Notification Dispatches</h3>
            <span className="text-xs text-slate-400 font-bold">Real-time gateway webhook logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-6">Event & Notification Title</th>
                  <th className="py-3.5 px-6">Recipient</th>
                  <th className="py-3.5 px-6">Channel</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Sent Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      <div>{n.title}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{n.event}</span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{n.recipient}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        n.channel === 'EMAIL' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        n.channel === 'SMS' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                        {n.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3" /> {n.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 font-medium">{n.sent_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'email-templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">System Email Templates</h3>
            <button
              onClick={() => alert('Create Email Template dialog')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {emailTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase">
                      {tmpl.category}
                    </span>
                    <Mail className="w-4 h-4 text-purple-500" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 font-medium mt-1">Subject: <strong>{tmpl.subject}</strong></p>

                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 whitespace-pre-line font-mono text-[11px] max-h-32 overflow-y-auto">
                    {tmpl.body}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                    {tmpl.variables.length} Dynamic tags
                  </div>
                  <button
                    onClick={() => alert(`Editing template: ${tmpl.name}`)}
                    className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'sms-templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">DLT Verified SMS Gateway Templates</h3>
            <button
              onClick={() => alert('Add SMS Template dialog')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add DLT Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {smsTemplates.map((sms) => (
              <div key={sms.id} className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Sender: {sms.sender_id}
                    </span>
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-2">{sms.name}</h4>
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 font-mono text-[11px]">
                    "{sms.text}"
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-bold text-emerald-600">DLT Approved</span>
                  <button
                    onClick={() => alert(`Editing SMS template: ${sms.name}`)}
                    className="font-bold text-purple-600 hover:text-purple-800"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'push' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Instant Web & Mobile Push Broadcast</h2>
            <p className="text-xs text-slate-500 mt-0.5">Send immediate push notifications to active student and faculty mobile devices.</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSendPush} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Notification Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Live Class Starting in 10 Minutes"
                value={pushTitle}
                onChange={(e) => setPushTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Audience</label>
              <select
                value={pushTarget}
                onChange={(e) => setPushTarget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Enrolled Students & Instructors</option>
                <option value="STUDENTS">Students Only</option>
                <option value="INSTRUCTORS">Faculty Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Push Body Message *</label>
              <textarea
                required
                rows={4}
                placeholder="Write your push notification message (keep under 120 characters for best delivery)..."
                value={pushMessage}
                onChange={(e) => setPushMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-500 focus:bg-white leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold shadow-md shadow-purple-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast Push Notification
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
