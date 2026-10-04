import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  MessageSquare, Send, Search, Users, User,
  Plus, CheckCircle2, Clock, Paperclip, FileText,
  ChevronRight, Reply, Trash2, Edit3, Sparkles
} from 'lucide-react';

export const MessagesTab = ({ initialSubTab = 'all' }) => {
  const { users, activeTenant, messagesList, addMessage, deleteMessage } = useApp();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState('conv-1');
  const [replyText, setReplyText] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      participant: 'Dr. S. Karthik (HOD CSE)',
      avatar: 'K',
      lastMessage: 'The syllabus for Cloud Architecture has been revised and submitted.',
      time: '10:45 AM',
      unread: 0,
      messages: [
        { sender: 'Dr. S. Karthik', text: 'Hello Dean, could you please review the updated Python course modules?', time: 'Yesterday 4:30 PM', isMe: false },
        { sender: 'Me (Super Admin)', text: 'Yes, reviewing them today. Please ensure hands-on assignments are attached.', time: 'Yesterday 5:10 PM', isMe: true },
        { sender: 'Dr. S. Karthik', text: 'The syllabus for Cloud Architecture has been revised and submitted.', time: '10:45 AM', isMe: false }
      ]
    },
    {
      id: 'conv-2',
      participant: 'Naveen Bala (Student - CSE 2026)',
      avatar: 'N',
      lastMessage: 'Sir, I have submitted the assignment on Relational Schema Design.',
      time: 'Yesterday',
      unread: 1,
      messages: [
        { sender: 'Naveen Bala', text: 'Sir, I have submitted the assignment on Relational Schema Design.', time: 'Yesterday 3:15 PM', isMe: false }
      ]
    },
    {
      id: 'conv-3',
      participant: 'Prof. M. Priya (AI Faculty)',
      avatar: 'P',
      lastMessage: 'Looking forward to the Hackathon planning meeting tomorrow.',
      time: 'Sep 19',
      unread: 0,
      messages: [
        { sender: 'Prof. M. Priya', text: 'Looking forward to the Hackathon planning meeting tomorrow.', time: 'Sep 19 11:20 AM', isMe: false }
      ]
    }
  ]);

  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 'msg-tmpl-1',
      title: 'Assignment Extension Approved',
      category: 'Academics',
      body: 'Dear Student, your request for an assignment deadline extension has been reviewed and granted. Please submit by the new deadline.'
    },
    {
      id: 'msg-tmpl-2',
      title: 'Course Enrollment Assistance',
      category: 'Support',
      body: 'Hello, your payment has been verified and access to the course lectures has been unlocked on your student dashboard.'
    },
    {
      id: 'msg-tmpl-3',
      title: 'Faculty Meeting Confirmation',
      category: 'Administration',
      body: 'Dear Professor, your slot for the Academic Council meeting has been scheduled for tomorrow at 2:30 PM.'
    }
  ]);

  const [composeRecipient, setComposeRecipient] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const activeConvData = conversations.find(c => c.id === selectedConversation) || conversations[0];

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg = {
      sender: 'Me (Super Admin)',
      text: replyText,
      time: 'Just now',
      isMe: true
    };

    setConversations(conversations.map(c => {
      if (c.id === selectedConversation) {
        return {
          ...c,
          lastMessage: replyText,
          time: 'Just now',
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));

    await addMessage({
      subject: `Reply to ${activeConvData?.participant || 'User'}`,
      body: replyText.trim(),
      recipient_name: activeConvData?.participant || 'User',
      tenant_id: activeTenant?.id || null
    });

    setReplyText('');
  };

  const handleComposeSend = async (e) => {
    e.preventDefault();
    if (!composeRecipient || !composeBody) return;

    const newConv = {
      id: `conv-${Date.now()}`,
      participant: composeRecipient,
      avatar: composeRecipient.charAt(0).toUpperCase(),
      lastMessage: composeBody,
      time: 'Just now',
      unread: 0,
      messages: [
        { sender: 'Me (Super Admin)', text: composeBody, time: 'Just now', isMe: true }
      ]
    };

    setConversations([newConv, ...conversations]);
    setSelectedConversation(newConv.id);

    await addMessage({
      subject: composeSubject || `Message for ${composeRecipient}`,
      body: composeBody.trim(),
      recipient_name: composeRecipient,
      tenant_id: activeTenant?.id || null
    });

    setComposeRecipient('');
    setComposeSubject('');
    setComposeBody('');
    setSuccessMsg('Direct message sent and saved to MySQL database successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      setActiveSubTab('all');
    }, 1200);
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn pb-12">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Direct Messaging & Communications</h1>
              <p className="text-xs text-slate-500 font-medium">Internal messaging suite for direct communication between admins, faculty, and students.</p>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Messages ({conversations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('compose')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'compose'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Send Message
          </button>
          <button
            onClick={() => setActiveSubTab('templates')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'templates'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Message Templates
          </button>
        </div>
      </div>

      {}
      {activeSubTab === 'all' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[560px]">

          {}
          <div className="border-r border-slate-100 p-4 space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[460px]">
              {conversations.map((c) => {
                const isSelected = selectedConversation === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedConversation(c.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-200/80 shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                      {c.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-extrabold text-xs text-slate-900 truncate">{c.participant}</h4>
                        <span className="text-[10px] text-slate-400 font-medium shrink-0">{c.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.lastMessage}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {}
          <div className="lg:col-span-2 flex flex-col justify-between p-6 bg-slate-50/40">
            {activeConvData ? (
              <>
                {}
                <div className="pb-4 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {activeConvData.avatar}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900">{activeConvData.participant}</h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <div className="py-6 space-y-4 overflow-y-auto max-h-[340px]">
                  {activeConvData.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                          m.isMe
                            ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                    </div>
                  ))}
                </div>

                {}
                <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-200/80 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                Select a conversation to begin messaging
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'compose' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Compose Direct Message</h2>
            <p className="text-xs text-slate-500 mt-0.5">Send a 1-on-1 direct message or announcement notice to faculty or students.</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleComposeSend} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Recipient *</label>
              <select
                required
                value={composeRecipient}
                onChange={(e) => setComposeRecipient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Select Recipient (Faculty or Student)...</option>
                <option value="Dr. S. Karthik (HOD CSE)">Dr. S. Karthik (HOD CSE)</option>
                <option value="Prof. M. Priya (AI Faculty)">Prof. M. Priya (AI Faculty)</option>
                <option value="Naveen Bala (Student - CSE 2026)">Naveen Bala (Student - CSE 2026)</option>
                <option value="Anitha Sundaram (Student)">Anitha Sundaram (Student)</option>
                <option value="Vijay Raghavan (Student)">Vijay Raghavan (Student)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="e.g. Academic Council Updates / Project Review"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Message Content *</label>
              <textarea
                required
                rows={5}
                placeholder="Write your message here..."
                value={composeBody}
                onChange={(e) => setComposeBody(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('all')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Send Message
              </button>
            </div>
          </form>
        </div>
      )}

      {}
      {activeSubTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Reusable Message Snippets & Responses</h3>
            <button
              onClick={() => alert('New Message Template dialog')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> New Quick Response
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {messageTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase">
                    {tmpl.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-2">{tmpl.title}</h4>
                  <p className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 leading-relaxed font-mono text-[11px]">
                    "{tmpl.body}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      setComposeBody(tmpl.body);
                      setActiveSubTab('compose');
                    }}
                    className="font-bold text-blue-600 hover:text-blue-800"
                  >
                    Use in Compose &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
