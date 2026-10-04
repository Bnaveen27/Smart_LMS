import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Megaphone, Plus, Search, Filter, Calendar,
  Users, AlertCircle, CheckCircle2, Eye, Trash2,
  Edit3, Pin, Bell, Tag, Clock, Send, ChevronRight
} from 'lucide-react';

export const AnnouncementsTab = ({ initialSubTab = 'all' }) => {
  const {
    activeTenant,
    users,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    categoriesList,
    addCategory,
    deleteCategory
  } = useApp();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = categoriesList?.length > 0 ? categoriesList : [
    { id: 'cat-1', name: 'Examination', color: 'bg-red-50 text-red-700 border-red-200', count: 4 },
    { id: 'cat-2', name: 'Events', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', count: 6 },
    { id: 'cat-3', name: 'Faculty', color: 'bg-blue-50 text-blue-700 border-blue-200', count: 3 },
    { id: 'cat-4', name: 'Holidays', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', count: 2 },
    { id: 'cat-5', name: 'Admissions', color: 'bg-purple-50 text-purple-700 border-purple-200', count: 5 }
  ];

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Examination');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [newAudience, setNewAudience] = useState('ALL');
  const [isPinned, setIsPinned] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const created = {
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      priority: newPriority,
      target_audience: newAudience,
      pinned: isPinned,
      author: 'Super Admin',
      tenant_id: activeTenant?.id || null
    };

    await addAnnouncement(created);
    setNewTitle('');
    setNewContent('');
    setIsPinned(false);
    setSuccessMsg('Announcement published successfully to MySQL database and portals!');
    setTimeout(() => {
      setSuccessMsg('');
      setActiveSubTab('all');
    }, 1200);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      await deleteAnnouncement(id);
    }
  };

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] animate-fadeIn pb-12">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Announcements Studio</h1>
              <p className="text-xs text-slate-500 font-medium">Broadcast notices, circulars, and academic bulletins to students and faculty.</p>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto border border-slate-200/60">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'all'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Bulletins ({announcements.length})
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'create'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Announcement
          </button>
          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'categories'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Categories
          </button>
        </div>
      </div>

      {}
      {activeSubTab === 'all' && (
        <div className="space-y-4">
          {}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="Examination">Examination</option>
                <option value="Events">Events</option>
                <option value="Faculty">Faculty</option>
                <option value="Holidays">Holidays</option>
              </select>
            </div>
          </div>

          {}
          <div className="space-y-3">
            {filteredAnnouncements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.pinned && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black flex items-center gap-1">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase">
                      {item.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      Audience: {item.target_audience}
                    </span>
                    {item.priority === 'HIGH' && (
                      <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                        High Priority
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.created_at}
                    </span>
                    <span>By: <strong className="text-slate-700">{item.author}</strong></span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Broadcast Live on Portal
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {}
      {activeSubTab === 'create' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Create New Academic Announcement</h2>
            <p className="text-xs text-slate-500 mt-0.5">Publish circulars that appear directly on students' and instructors' notice boards.</p>
          </div>

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Announcement Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Schedule for Internal Assessments / Campus Holiday Notice"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="Examination">Examination</option>
                  <option value="Events">Events & Competitions</option>
                  <option value="Faculty">Faculty Notice</option>
                  <option value="Holidays">Holidays</option>
                  <option value="Admissions">Admissions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Audience</label>
                <select
                  value={newAudience}
                  onChange={(e) => setNewAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="ALL">Everyone (All Users)</option>
                  <option value="STUDENTS">Students & Learners Only</option>
                  <option value="INSTRUCTORS">Faculty & Mentors Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none cursor-pointer"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High Priority (Urgent)</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Announcement Details & Instructions *</label>
              <textarea
                required
                rows={5}
                placeholder="Write the complete announcement content, timings, instructions, and relevant details..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinNotice"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
              />
              <label htmlFor="pinNotice" className="text-xs font-bold text-slate-700 cursor-pointer">
                Pin this announcement to top of the dashboard
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('all')}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Broadcast Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {}
      {activeSubTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Announcement Categories</h2>
              <p className="text-xs text-slate-500">Categorize institutional notices for targeted filtering.</p>
            </div>
            <button
              onClick={() => alert('New category dialog')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-slate-900">{cat.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{cat.count} published notices</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${cat.color}`}>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
