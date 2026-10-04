import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, Heart, Bell, User, Star, PlayCircle,
  Award, ChevronDown, Check, X, BookOpen, ShieldCheck, Sparkles,
  ExternalLink, LogOut, Settings, CreditCard, Layers, Compass,
  SlidersHorizontal, CheckCircle2, ChevronRight, Globe, Clock,
  Flame, TrendingUp, Filter, ArrowUpRight, BarChart3, Target,
  Briefcase, Edit3, MonitorPlay, CheckSquare, Zap, BookMarked,
  GraduationCap, ArrowRight, Video, FileText, Share2, HelpCircle,
  Activity, MessageSquare, Calendar, Palette, Code, CheckCircle,
  RotateCw
} from 'lucide-react';
import CoursePreviewModal from '../../../components/course/CoursePreviewModal';
import CourseFeedbackModal from '../../../components/course/CourseFeedbackModal';
import InvoiceReceiptModal from '../../../components/enrollment/InvoiceReceiptModal';

export const LearnerPortal = () => {
  const {
    courses,
    myEnrollments,
    enrollmentRecords,
    transactions,
    certificates,
    courseProgress,
    enrollInFreeCourse,
    setSelectedCourseForPlayer,
    setSelectedCertificateModal,
    setCheckoutModalCourse,
    claimCourseCertificate,
    submitCourseReview,
    activeTenant,
    currentUser,
    setCurrentUser
  } = useApp();

  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState('EXPLORE'); 

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [sortBy, setSortBy] = useState('POPULAR'); 

  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPurchasesModal, setShowPurchasesModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showNotifPrefsModal, setShowNotifPrefsModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [userGoal, setUserGoal] = useState('Full Stack & Cloud Architecture');
  const [previewCourse, setPreviewCourse] = useState(null);
  const [reviewModalCourse, setReviewModalCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSmoothRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsRefreshing(false);
    }, 450);
  };

  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setShowCategoriesMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = useMemo(() => {
    const standard = [
      'All',
      'Development',
      'Business',
      'Finance & Accounting',
      'IT & Software',
      'Personal Development',
      'Design',
      'Marketing'
    ];
    const custom = courses.map(c => c.category).filter(Boolean);
    return Array.from(new Set([...standard, ...custom]));
  }, [courses]);

  const allCourses = useMemo(() => {
    const tenantCourses = activeTenant
      ? courses.filter(c => !c.tenant_id || c.tenant_id === activeTenant.id)
      : courses;

    return tenantCourses.map(c => {
      const dbLearnersCount = (enrollmentRecords || []).filter(e => e.course_id === c.id).length;
      const totalEnrolled = Math.max(Number(c.enrolled_count) || 0, dbLearnersCount);
      const ratingValue = Number(c.rating !== undefined && c.rating !== null ? c.rating : 5);

      return {
        ...c,
        rating: ratingValue,
        enrolled_count: totalEnrolled,
        rating_count: `${totalEnrolled} learners`,
        price: c.price !== undefined ? c.price : 0,
        original_price: c.price ? (c.price * 3.5).toFixed(2) : 0,
        badge: c.badge || (totalEnrolled > 50 ? 'Bestseller' : 'Certified'),
        badge_color: c.badge_color || 'bg-indigo-600 text-white',
        hours: c.duration || '20.0 Hours',
        level: c.level || 'All Levels',
        category: c.category || 'Development',
        instructor_name: c.instructor_name || 'Instructor'
      };
    });
  }, [courses, activeTenant, enrollmentRecords]);

  const toggleWishlist = (courseId, e) => {
    if (e) e.stopPropagation();
    setWishlist(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const toggleCart = (course, e) => {
    if (e) e.stopPropagation();
    setCart(prev =>
      prev.some(item => item.id === course.id)
        ? prev.filter(item => item.id !== course.id)
        : [...prev, course]
    );
  };

  const filteredCourses = useMemo(() => {
    let result = allCourses;

    if (currentView === 'MY_LEARNING') {
      result = result.filter(c => myEnrollments.includes(c.id));
    } else if (currentView === 'WISHLIST') {
      result = result.filter(c => wishlist.includes(c.id));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (selectedLevel !== 'ALL') {
      result = result.filter(c => c.level === selectedLevel || c.level === 'All Levels');
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.instructor_name?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'PRICE_LOW') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [allCourses, currentView, selectedCategory, selectedLevel, searchTerm, sortBy, myEnrollments, wishlist]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const enrolledList = useMemo(() => {
    return allCourses.filter(c => {
      if (myEnrollments.includes(c.id)) return true;
      if (enrollmentRecords?.some(e => e.course_id === c.id && (e.user_id === currentUser?.id || e.learner_email?.toLowerCase() === currentUser?.email?.toLowerCase()))) return true;
      return false;
    });
  }, [allCourses, myEnrollments, enrollmentRecords, currentUser]);

  const completedCoursesCount = useMemo(() => {
    return enrolledList.filter(c => courseProgress[c.id]?.progressPercent === 100).length;
  }, [enrolledList, courseProgress]);

  const avgCompletionPercent = useMemo(() => {
    if (enrolledList.length === 0) return 0;
    const total = enrolledList.reduce((acc, c) => acc + (courseProgress[c.id]?.progressPercent || 0), 0);
    return Math.round(total / enrolledList.length);
  }, [enrolledList, courseProgress]);

  const userName = currentUser?.name || 'Alex';
  const firstName = userName.split(' ')[0] || 'Alex';
  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AR';
  const userEmail = currentUser?.email || 'alex@student.com';
  const orgName = activeTenant?.name || 'Apex Tech Institute';
  const primaryColor = activeTenant?.primary_color || '#4F46E5';

  const CourseCardSkeleton = () => (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs animate-pulse flex flex-col justify-between">
      <div>
        <div className="aspect-video w-full bg-slate-200 relative overflow-hidden">
          <div className="absolute top-2.5 left-2.5 h-4 w-16 bg-slate-300 rounded-md" />
          <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-300" />
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-20 bg-slate-200 rounded" />
            <div className="h-3 w-14 bg-slate-200 rounded" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-slate-200 rounded" />
            <div className="h-4 w-2/3 bg-slate-200 rounded" />
          </div>
          <div className="h-3 w-28 bg-slate-200 rounded" />
          <div className="flex items-center gap-1.5 pt-1">
            <div className="h-3.5 w-5 bg-slate-200 rounded" />
            <div className="h-3.5 w-18 bg-slate-200 rounded" />
            <div className="h-3 w-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
      <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
        <div className="h-5 w-14 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );

  const ContinueSkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex gap-4 items-center animate-pulse">
      <div className="w-20 h-16 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-3.5 w-24 bg-slate-200 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 rounded" />
        <div className="w-full bg-slate-200 h-1.5 rounded-full" />
      </div>
    </div>
  );

  const CertificateSkeletonCard = () => (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 animate-pulse">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-slate-200 rounded-full" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="h-3.5 w-1/2 bg-slate-200 rounded" />
      </div>
      <div className="h-10 w-full bg-slate-200 rounded-xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col selection:bg-indigo-600 selection:text-white">

      {}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-4">

          {}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div 
              onClick={() => { setCurrentView('EXPLORE'); setSelectedCategory('All'); setSearchTerm(''); }}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
            >
              {activeTenant?.logo_url ? (
                <img src={activeTenant.logo_url} alt={orgName} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200 shadow-xs" />
              ) : (
                <div 
                  className="w-9 h-9 rounded-xl text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition truncate max-w-[160px] sm:max-w-xs">
                  {orgName}
                </span>
                {}
              </div>
            </div>

            {}
            <div className="relative hidden md:block" ref={categoryMenuRef}>
              <button
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer border ${
                  showCategoriesMenu 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-xs' 
                    : 'text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border-slate-200'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoriesMenu ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
              </button>

              {showCategoriesMenu && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Browse Subjects</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">{categories.length} Topics</span>
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto space-y-0.5">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setCurrentView('EXPLORE');
                          setShowCategoriesMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                          selectedCategory === cat ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${selectedCategory === cat ? 'bg-indigo-600' : 'bg-slate-300'}`} />
                          {cat}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {}
          <div className="flex-1 max-w-xl mx-2 lg:mx-4 relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses, skills, instructors or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-indigo-600 rounded-full pl-11 pr-10 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setCurrentView('EXPLORE')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  currentView === 'EXPLORE' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Explore
              </button>
              <button
                onClick={() => setCurrentView('MY_LEARNING')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'MY_LEARNING' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>My Courses</span>
                {myEnrollments.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 text-[10px] flex items-center justify-center font-black">
                    {myEnrollments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView('CERTIFICATES')}
                className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                  currentView === 'CERTIFICATES' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Certificates</span>
                {certificates.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-black">
                    {certificates.length}
                  </span>
                )}
              </button>
            </div>

            {}
            <button
              onClick={() => setCurrentView('WISHLIST')}
              className={`relative p-2 rounded-lg hover:bg-slate-100 transition cursor-pointer ${
                currentView === 'WISHLIST' ? 'bg-indigo-50 text-rose-600 ring-1 ring-indigo-200' : 'text-slate-600 hover:text-rose-600'
              }`}
              title="Saved Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist.length > 0 || currentView === 'WISHLIST' ? 'text-rose-600 fill-rose-600' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-black flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {}
            <button
              onClick={() => setShowCartDrawer(true)}
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-indigo-600 text-white text-[8px] font-black flex items-center justify-center shadow-xs animate-bounce">
                  {cart.length}
                </span>
              )}
            </button>

            {}
            <button
              onClick={handleSmoothRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition cursor-pointer ${
                isRefreshing ? 'opacity-80 cursor-wait' : ''
              }`}
              title="Sync & Smooth Refresh"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            {}
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="font-extrabold text-xs text-slate-900">Notifications</h4>
                    <span className="text-[10px] text-indigo-600 font-bold cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="py-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                      <p className="font-bold text-slate-900 text-[11px]">Welcome to {orgName}!</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Explore available courses and track your certificates.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 py-1 pl-2.5 pr-1 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">{firstName}</span>
                <div 
                  className="w-7 h-7 rounded-full text-white font-black text-[11px] flex items-center justify-center shadow-xs ring-1 ring-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  {userInitials}
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2.5 w-94 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 divide-y divide-slate-100 max-h-[88vh] overflow-y-auto ring-1 ring-black/5">
                  {}
                  <div className="p-4 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-2xl text-white font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/15"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {userInitials}
                    </div>
                    <div className="overflow-hidden min-w-0 flex-1">
                      <h4 className="font-extrabold text-sm text-slate-900 truncate leading-tight">{userName}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{userEmail}</p>
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-indigo-100/90 text-indigo-800 rounded-md text-[9px] font-extrabold tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Learner Active
                      </span>
                    </div>
                  </div>

                  {}
                  <div className="py-2 px-1 text-xs">
                    <div className="px-3 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      My Learning Hub
                    </div>
                    <button
                      onClick={() => { setCurrentView('MY_LEARNING'); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl font-bold text-slate-700 transition flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>My Enrolled Courses</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 px-2 py-0.5 rounded-full font-mono font-bold transition-colors">
                        {myEnrollments.length}
                      </span>
                    </button>
                    <button
                      onClick={() => { setCurrentView('WISHLIST'); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl font-bold text-slate-700 transition flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <Heart className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        <span>Saved Wishlist</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 group-hover:bg-rose-100 group-hover:text-rose-700 px-2 py-0.5 rounded-full font-mono font-bold transition-colors">
                        {wishlist.length}
                      </span>
                    </button>
                    <button
                      onClick={() => { setCurrentView('CERTIFICATES'); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl font-bold text-slate-700 transition flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <Award className="w-4 h-4 text-amber-500 transition-transform group-hover:scale-110" />
                        <span>My Certificates</span>
                      </span>
                      <span className="text-[10px] bg-amber-50 text-amber-700 group-hover:bg-amber-100 px-2 py-0.5 rounded-full font-bold transition-colors">
                        {certificates.length}
                      </span>
                    </button>
                    <button
                      onClick={() => { setShowCartDrawer(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl font-bold text-slate-700 transition flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <ShoppingCart className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>My Shopping Cart</span>
                      </span>
                      {cart.length > 0 && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          {cart.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => { setShowAnalyticsModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl font-semibold text-slate-700 transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Activity className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="whitespace-nowrap">Learning Stats & Activity</span>
                    </button>
                    <button
                      onClick={() => { setShowGoalModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-indigo-50/80 hover:text-indigo-600 rounded-xl font-semibold text-slate-700 transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Target className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="whitespace-nowrap">Learning Goals & Focus</span>
                    </button>
                  </div>

                  {}
                  <div className="py-2 px-1 text-xs">
                    <div className="px-3 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Account & Preferences
                    </div>
                    <button
                      onClick={() => { setShowAccountModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100/80 rounded-xl text-slate-700 font-semibold transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Settings className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                      <span className="whitespace-nowrap">Account Settings</span>
                    </button>
                    <button
                      onClick={() => { setShowPurchasesModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100/80 rounded-xl text-slate-700 font-semibold transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <CreditCard className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                      <span className="whitespace-nowrap">Purchase & Invoices</span>
                    </button>
                    <button
                      onClick={() => { setShowNotifPrefsModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100/80 rounded-xl text-slate-700 font-semibold transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <Bell className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                      <span className="whitespace-nowrap">Notification Settings</span>
                    </button>
                  </div>

                  {}
                  <div className="py-2 px-1 text-xs">
                    <div className="px-3 pt-1 pb-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Help & Regional
                    </div>
                    <button
                      onClick={() => { setShowHelpModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100/80 rounded-xl text-slate-700 font-semibold transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="whitespace-nowrap">Help Center & FAQ</span>
                    </button>
                    <button
                      onClick={() => { setShowLanguageModal(true); setShowUserMenu(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-100/80 rounded-xl text-slate-700 font-semibold transition flex items-center justify-between cursor-pointer group"
                    >
                      <span className="flex items-center gap-2.5 whitespace-nowrap">
                        <Globe className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        <span>Language</span>
                      </span>
                      <span className="font-bold text-indigo-600 text-[11px] bg-indigo-50 px-2 py-0.5 rounded-md">
                        {selectedLanguage}
                      </span>
                    </button>
                  </div>

                  {}
                  <div className="p-1.5 text-xs bg-slate-50/50">
                    <button
                      onClick={() => {
                        if (setCurrentUser) setCurrentUser(null);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition flex items-center gap-2.5 cursor-pointer group"
                    >
                      <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {}
      <div className={`h-0.5 w-full bg-slate-100 overflow-hidden transition-opacity duration-300 ${isLoading || isRefreshing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full animate-pulse" />
      </div>

      {}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 animate-in fade-in duration-300">
          
          {}
          <div className="space-y-3 max-w-2xl">
          
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">{firstName}</span>
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span>Goal: <strong className="text-white underline decoration-indigo-400">{userGoal}</strong></span>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="text-indigo-400 hover:text-indigo-300 text-[11px] font-bold underline cursor-pointer"
              >
                (Change)
              </button>
            </div>
          </div>

          {}
          <div className="grid grid-cols-4 gap-3 w-full lg:w-auto bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl transition-all">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-black text-indigo-300 block">Enrolled</span>
              <span className="text-2xl font-black text-white">{myEnrollments.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">Courses</span>
            </div>
            <div className="text-center px-3 border-x border-white/10">
              <span className="text-[10px] uppercase font-black text-emerald-300 block">Completed</span>
              <span className="text-2xl font-black text-emerald-400">{completedCoursesCount}</span>
              <span className="text-[10px] text-slate-400 font-medium">Graduated</span>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-black text-amber-300 block">Certificates</span>
              <span className="text-2xl font-black text-amber-400">{certificates.length}</span>
              <span className="text-[10px] text-slate-400 font-medium">Verified</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase font-black text-purple-300 block">Avg Progress</span>
              <span className="text-2xl font-black text-purple-400">{avgCompletionPercent}%</span>
              <span className="text-[10px] text-slate-400 font-medium">Overall</span>
            </div>
          </div>

        </div>
      </section>

      {}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 transition-all duration-300 animate-in fade-in">

        {}
        {enrolledList.length > 0 && currentView === 'EXPLORE' && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900 tracking-tight">Continue Learning</h3>
                  <p className="text-[11px] text-slate-500">Pick up right where you left off in your courses.</p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView('MY_LEARNING')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition flex items-center gap-1 cursor-pointer"
              >
                <span>View all my courses ({enrolledList.length})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
              {isLoading ? (
                [...Array(Math.max(enrolledList.length, 1))].map((_, i) => (
                  <ContinueSkeletonCard key={i} />
                ))
              ) : (
                enrolledList.map(course => {
                  const prog = courseProgress[course.id];
                  const percent = prog?.progressPercent || 0;
                  const isDone = percent === 100;
                  return (
                    <div
                      key={course.id}
                      onClick={() => setSelectedCourseForPlayer(course)}
                      className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex gap-4 items-center cursor-pointer group"
                    >
                      <div className="relative shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                          alt={course.title}
                          className="w-20 h-16 rounded-xl object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                          <PlayCircle className="w-6 h-6 text-white drop-shadow-sm" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                          isDone ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                        }`}>
                          {isDone ? 'Completed • 100%' : `In-Progress • ${percent}%`}
                        </span>
                        <h4 className="font-extrabold text-xs text-slate-900 truncate group-hover:text-indigo-600 transition">
                          {course.title}
                        </h4>
                        
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {}
        {currentView === 'CERTIFICATES' && (
          <section className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-500" /> Verifiable Certificate Vault
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Accredited certificates awarded upon comprehensive curriculum completion.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(Math.max(certificates.length, 1))].map((_, i) => (
                  <CertificateSkeletonCard key={i} />
                ))}
              </div>
            ) : certificates.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-base text-slate-800">No certificates earned yet</h4>
                <p className="text-xs text-slate-500">Complete 100% of your enrolled courses to generate accredited credentials.</p>
                <button
                  onClick={() => setCurrentView('EXPLORE')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition cursor-pointer"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map(cert => (
                  <div key={cert.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 transition">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
                          {cert.certificate_code}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified
                        </span>
                      </div>
                      <h4 className="font-black text-base text-slate-900 leading-snug">{cert.course_title}</h4>
                      <p className="text-xs text-slate-500">Issued to: <strong>{cert.user_name}</strong> on {cert.issued_at}</p>
                    </div>

                    <button
                      onClick={() => setSelectedCertificateModal(cert)}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4" /> View Verified Credential
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {}
        {currentView !== 'CERTIFICATES' && (
          <section className="space-y-6">

            {}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                    {currentView === 'MY_LEARNING' 
                      ? 'My Enrolled Courses' 
                      : currentView === 'WISHLIST' 
                        ? 'My Saved Wishlist' 
                        : 'Explore Featured Courses'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Showing <strong>{filteredCourses.length}</strong> programs created for {orgName}
                  </p>
                </div>

                {}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span>Level:</span>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="ALL">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="POPULAR">Most Popular</option>
                      <option value="RATING">Highest Rated</option>
                      <option value="PRICE_LOW">Price: Low to High</option>
                      <option value="PRICE_HIGH">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(Math.max(filteredCourses.length, 1))].map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4 shadow-sm">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">No courses match your filter</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try adjusting your search keyword or selecting a different category.
                </p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSelectedLevel('ALL'); setSearchTerm(''); setCurrentView('EXPLORE'); }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
                {filteredCourses.map(course => {
                  const isEnrolled = myEnrollments.includes(course.id);
                  const isWishlisted = wishlist.includes(course.id);
                  const isInCart = cart.some(item => item.id === course.id);

                  return (
                    <div
                      key={course.id}
                      onClick={() => {
                        if (isEnrolled) {
                          setSelectedCourseForPlayer(course);
                        } else {
                          setPreviewCourse(course);
                        }
                      }}
                      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                    >
                      <div>
                        {}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          <img
                            src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                          />

                          {}
                          <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-xs ${course.badge_color || 'bg-indigo-600 text-white'}`}>
                              {course.badge || 'Certified'}
                            </span>
                          </div>

                          {}
                          <button
                            type="button"
                            onClick={(e) => toggleWishlist(course.id, e)}
                            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              isWishlisted
                                ? 'bg-white text-rose-600 shadow-md scale-110'
                                : 'bg-slate-900/60 hover:bg-white text-white hover:text-rose-600'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                          </button>
                        </div>

                        {}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-mono">
                              {course.category}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock className="w-3 h-3 text-slate-400" /> {course.hours || '20.0 Hours'}
                            </span>
                          </div>

                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">
                            {course.title}
                          </h4>

                          <p className="text-[11px] text-slate-500 font-medium truncate">
                            {course.instructor_name}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs pt-0.5">
                            <span className="font-black text-amber-900">
                              {course.rating ? Number(course.rating).toFixed(1) : '5.0'}
                            </span>
                            <div className="flex text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < Math.round(Number(course.rating || 5))
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">
                              ({course.rating_count ? `${course.rating_count} reviews` : 'No reviews yet'} &bull; {course.enrolled_count || 0} learners)
                            </span>
                          </div>
                        </div>
                      </div>

                      {}
                      <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                        {isEnrolled ? (
                          <div className="pt-2.5 space-y-2">
                            {(() => {
                              const prog = courseProgress?.[course.id];
                              const pct = prog?.progressPercent || 0;
                              const isCourseComplete = prog?.isCompleted || pct === 100;

                              return (
                                <>
                                  <div className="flex items-center justify-between text-[10px] font-bold">
                                    <span className="text-slate-400">Course Progress</span>
                                    <span className={isCourseComplete ? 'text-emerald-600 font-black' : 'text-indigo-600'}>
                                      {isCourseComplete ? '100% Completed' : `${pct}%`}
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-500 ${isCourseComplete ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                                      style={{ width: `${isCourseComplete ? 100 : pct}%` }}
                                    />
                                  </div>

                                  <div className="flex items-center gap-1.5 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCourseForPlayer(course);
                                      }}
                                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                                    >
                                      <PlayCircle className="w-3.5 h-3.5" /> {isCourseComplete ? 'Review' : 'Continue'}
                                    </button>

                                    {isCourseComplete && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setReviewModalCourse(course);
                                          }}
                                          className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 border border-amber-200 shadow-2xs cursor-pointer"
                                          title="Rate and give feedback for this course"
                                        >
                                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rate
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            claimCourseCertificate(course.id);
                                          }}
                                          className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                                          title="View Certificate"
                                        >
                                          <Award className="w-3.5 h-3.5" /> Cert
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="pt-2.5 flex items-center justify-between gap-2">
                            <div className="flex items-baseline gap-1.5">
                              {course.price === 0 ? (
                                <span className="font-black text-sm text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider">
                                  FREE
                                </span>
                              ) : (
                                <>
                                  <span className="font-black text-base text-slate-900">₹{course.price}</span>
                                  <span className="text-xs text-slate-400 line-through">₹{course.original_price}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (course.price === 0) {
                                    enrollInFreeCourse(course);
                                  } else {
                                    setCheckoutModalCourse(course);
                                    navigate(`/learner/checkout/${course.id}`);
                                  }
                                }}
                                className={`px-3.5 py-1.5 font-extrabold text-xs rounded-xl transition cursor-pointer ${
                                  course.price === 0
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                                    : 'bg-slate-900 hover:bg-indigo-600 text-white'
                                }`}
                              >
                                {course.price === 0 ? 'Enroll Free' : 'Enroll'}
                              </button>
                              {course.price > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => toggleCart(course, e)}
                                  className={`p-1.5 rounded-xl border transition cursor-pointer ${
                                    isInCart
                                      ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                                      : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                                  }`}
                                  title="Add to cart"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </section>
        )}

      </main>

      {}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <strong className="text-slate-900 font-extrabold">{orgName}</strong>
            <span>•</span>
            <span>© {new Date().getFullYear()} White-Labeled LMS Platform. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-slate-600">
            <button
              onClick={() => alert(`Support for ${orgName}: support@smartlms.io`)}
              className="hover:text-indigo-600 hover:underline transition cursor-pointer"
            >
              Help & Support
            </button>
            <button
              onClick={() => alert(`Terms of Service for ${orgName}`)}
              className="hover:text-indigo-600 hover:underline transition cursor-pointer"
            >
              Privacy & Guidelines
            </button>
          </div>
        </div>
      </footer>

      {}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-black text-base text-slate-900">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" /> Shopping Cart ({cart.length})
                </div>
                <button
                  onClick={() => setShowCartDrawer(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="font-extrabold text-sm text-slate-800">Your cart is empty</p>
                  <p className="text-xs text-slate-400">Explore catalog and add courses to your queue.</p>
                  <button
                    onClick={() => setShowCartDrawer(false)}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50 items-center justify-between">
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">{item.title}</h5>
                        <p className="text-[11px] text-indigo-600 font-mono font-bold">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => toggleCart(item)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <div className="flex justify-between font-black text-sm text-slate-900">
                  <span>Total Due:</span>
                  <span className="text-base text-indigo-600">₹{cart.reduce((acc, c) => acc + (c.price || 99.99), 0).toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    setShowCartDrawer(false);
                    if (cart[0]) {
                      setCheckoutModalCourse(cart[0]);
                      navigate(`/learner/checkout/${cart[0].id}`);
                    }
                  }}
                  className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg shadow-indigo-600/25 transition cursor-pointer"
                >
                  Proceed to Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" /> Set Your Learning Focus Goal
              </h4>
              <button onClick={() => setShowGoalModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Target Specialty or Career Path</label>
              <input
                type="text"
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                placeholder="e.g. Full Stack & Cloud Architecture"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-600" /> Learner Account Settings
              </h4>
              <button onClick={() => setShowAccountModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={userName}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Learning Focus & Bio</label>
                <textarea
                  rows={2}
                  defaultValue={userGoal}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAccountModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Profile settings saved successfully!');
                  setShowAccountModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showPurchasesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Purchase & Invoice History
              </h4>
              <button onClick={() => setShowPurchasesModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-slate-900">Enrolled Track Tuition</h5>
                  <p className="text-[11px] text-slate-500">Invoice #INV-2026-0891 • Paid via Stripe</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-slate-900 block">₹999.00</span>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Receipt Paid</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPurchasesModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" /> Learning Analytics & Activity
              </h4>
              <button onClick={() => setShowAnalyticsModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100 text-center">
                <span className="text-[10px] font-bold text-indigo-700 uppercase block">Active Streak</span>
                <span className="text-2xl font-black text-indigo-950 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" /> 5 Days
                </span>
              </div>
              <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 text-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase block">Hours Studied</span>
                <span className="text-2xl font-black text-emerald-950">18.5 hrs</span>
              </div>
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-center">
                <span className="text-[10px] font-bold text-amber-700 uppercase block">Certificates</span>
                <span className="text-2xl font-black text-amber-950">{certificates.length}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Recent Milestones</h5>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Completed 4 Lectures Today</p>
                  <p className="text-[10px] text-slate-500">Keep learning to maintain your 5-day streak</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" /> Help Center & Support
              </h4>
              <button onClick={() => setShowHelpModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-72 overflow-y-auto">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">How do I download my verified certificate?</h5>
                <p className="text-slate-600 text-[11px]">Navigate to the Certificates tab in your dashboard, click on your completed course badge, and choose "Print / Download PDF".</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <h5 className="font-bold text-slate-900">Can I access course materials on mobile devices?</h5>
                <p className="text-slate-600 text-[11px]">Yes! The Learner Portal is fully responsive and supports lecture streaming across all phones, tablets, and desktops.</p>
              </div>

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-indigo-950">Need 1-on-1 assistance?</h5>
                  <p className="text-indigo-700 text-[11px]">Contact student support: support@smartlms.io</p>
                </div>
                <button
                  onClick={() => alert(`Support ticket dispatched for ${orgName}`)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showNotifPrefsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" /> Notification Preferences
              </h4>
              <button onClick={() => setShowNotifPrefsModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Course Announcements</span>
                  <span className="text-[11px] text-slate-500">Receive instructor updates and new lectures</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
              </label>

              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Study Reminders & Streaks</span>
                  <span className="text-[11px] text-slate-500">Get daily prompts to keep your learning streak</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded cursor-pointer" />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowNotifPrefsModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Notification settings saved!');
                  setShowNotifPrefsModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-600" /> Select Language
              </h4>
              <button onClick={() => setShowLanguageModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {['English (US)', 'Español (Spanish)', 'Français (French)', 'Deutsch (German)', '日本語 (Japanese)'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold transition flex items-center justify-between cursor-pointer ${
                    selectedLanguage === lang ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <span>{lang}</span>
                  {selectedLanguage === lang && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {}
      {showPurchasesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" /> My Course Enrollments & Invoices
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Stored enrollment records and payment history for {currentUser?.name || 'Learner'}.
                </p>
              </div>
              <button 
                onClick={() => setShowPurchasesModal(false)} 
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {enrolledList.length > 0 ? (
                enrolledList.map((course) => {
                  const enrRecord = enrollmentRecords?.find(e => e.course_id === course.id);
                  const txnRecord = transactions?.find(t => t.course_id === course.id);
                  const progress = courseProgress[course.id]?.progressPercent || 0;
                  const isCompleted = progress === 100;
                  const priceDisplay = course.price > 0 ? `₹${Number(course.price).toFixed(2)}` : 'Free';
                  const dateStr = enrRecord?.enrolled_at 
                    ? new Date(enrRecord.enrolled_at).toLocaleDateString() 
                    : txnRecord?.created_at || 'Enrolled';

                  return (
                    <div 
                      key={course.id} 
                      className="p-4 bg-slate-50 hover:bg-indigo-50/20 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img 
                          src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80'} 
                          alt={course.title} 
                          className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 shrink-0 shadow-xs" 
                        />
                        <div className="min-w-0 space-y-0.5">
                          <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">{course.title}</h5>
                          <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2">
                            <span>Instructor: <strong className="text-slate-700">{course.instructor_name}</strong></span>
                            <span>&bull;</span>
                            <span className="font-mono text-indigo-600 font-bold">{priceDisplay}</span>
                            <span>&bull;</span>
                            <span className="text-slate-400">{dateStr}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                                style={{ width: `${progress}%` }} 
                              />
                            </div>
                            <span className={`text-[10px] font-bold ${isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                              {progress}% {isCompleted ? 'Completed' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => {
                            const enr = enrRecord || {};
                            setSelectedInvoice({
                              invoiceNo: enr.transaction_ref?.startsWith('TXN-') || enr.transaction_ref?.startsWith('REC-') 
                                ? enr.transaction_ref 
                                : `REC-${(enr.id || course.id).toString().slice(-6)}`,
                              date: enr.enrolled_at || txnRecord?.created_at || new Date().toISOString(),
                              learnerName: currentUser?.name || enr.learner_name || 'Enrolled Learner',
                              learnerEmail: currentUser?.email || enr.learner_email || 'learner@domain.com',
                              courseTitle: course.title,
                              instructorName: course.instructor_name || 'Instructor',
                              amount: course.price,
                              paymentMethod: enr.payment_method || (course.price > 0 ? 'RAZORPAY_UPI' : 'FREE_ENROLLMENT'),
                              paymentReference: enr.transaction_ref || txnRecord?.transaction_ref || 'ENR-ONLINE',
                              status: 'PAID',
                              enrollmentType: enr.enrollment_type || (course.price > 0 ? 'ONLINE_PURCHASE' : 'FREE_ENROLLMENT'),
                              notes: enr.notes || 'Official Course Enrollment Fee Receipt'
                            });
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" /> Receipt
                        </button>

                        <button
                          onClick={() => {
                            setSelectedCourseForPlayer(course);
                            setShowPurchasesModal(false);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Start Course
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                  <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>No course enrollments stored yet.</p>
                  <button
                    onClick={() => {
                      setCurrentView('EXPLORE');
                      setShowPurchasesModal(false);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Browse Academic Catalog
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-semibold">Total Stored Enrollments: <strong>{enrolledList.length}</strong></span>
              <button
                onClick={() => setShowPurchasesModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {previewCourse && (
        <CoursePreviewModal
          isOpen={Boolean(previewCourse)}
          onClose={() => setPreviewCourse(null)}
          course={previewCourse}
          isEnrolled={myEnrollments.includes(previewCourse?.id)}
          onEnroll={(c) => {
            setPreviewCourse(null);
            if (c.price === 0) {
              enrollInFreeCourse(c);
            } else {
              setCheckoutModalCourse(c);
              navigate(`/learner/checkout/${c.id}`);
            }
          }}
          onContinueLearning={(c) => {
            setPreviewCourse(null);
            setSelectedCourseForPlayer(c);
          }}
        />
      )}

      {}
      {reviewModalCourse && (
        <CourseFeedbackModal
          isOpen={Boolean(reviewModalCourse)}
          onClose={() => setReviewModalCourse(null)}
          course={reviewModalCourse}
          currentUser={currentUser}
          onSubmitReview={(courseId, reviewData) => {
            return submitCourseReview(courseId, reviewData);
          }}
        />
      )}

      {}
      <InvoiceReceiptModal
        isOpen={Boolean(selectedInvoice)}
        invoiceData={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

    </div>
  );
};
