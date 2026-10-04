import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL, APP_BASE_URL } from '../config/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('lms_role') || '');

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'lms_current_user') {
        try {
          const newUser = e.newValue ? JSON.parse(e.newValue) : null;
          setCurrentUser(newUser);
        } catch (_) { setCurrentUser(null); }
      }
      if (e.key === 'lms_role') {
        setRole(e.newValue || '');
      }
      if (e.key === 'lms_active_tenant') {
        try {
          const newTenant = e.newValue ? JSON.parse(e.newValue) : null;
          setActiveTenant(newTenant);
        } catch (_) { setActiveTenant(null); }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('lms_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(u => !['user-super-1', 'user-inst-admin', 'user-inst-instructor', 'user-learner-1', 'user-corp-admin', 'user-emp-1'].includes(u.id));
      } catch (e) { return []; }
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (['user-super-1', 'user-inst-admin', 'user-inst-instructor', 'user-learner-1', 'user-corp-admin', 'user-emp-1'].includes(parsed?.id)) {
          return null;
        }
        return parsed;
      } catch (e) { return null; }
    }
    return null;
  });

  const [tenants, setTenants] = useState(() => {
    const saved = localStorage.getItem('lms_tenants');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(t => !['tenant-inst-1', 'tenant-corp-1'].includes(t.id));
      } catch (e) { return []; }
    }
    return [];
  });

  const [activeTenant, setActiveTenant] = useState(() => {
    const saved = localStorage.getItem('lms_active_tenant');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (['tenant-inst-1', 'tenant-corp-1'].includes(parsed?.id)) return null;
        return parsed;
      } catch (e) { return null; }
    }
    return null;
  });

  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('lms_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.filter(c => !['course-1', 'course-2', 'course-3'].includes(c.id));
      } catch (e) { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('lms_courses', JSON.stringify(courses));
  }, [courses]);

  const [corporateAssignments, setCorporateAssignments] = useState(() => {
    const saved = localStorage.getItem('lms_corp_assign');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lms_txns');
    return saved ? JSON.parse(saved) : [];
  });

  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('lms_certs');
    return saved ? JSON.parse(saved) : [];
  });

  const [subscriptions, setSubscriptions] = useState(() => {
    const saved = localStorage.getItem('lms_subscriptions');
    return saved ? JSON.parse(saved) : [];
  });

  const [myEnrollments, setMyEnrollments] = useState(() => {
    const saved = localStorage.getItem('lms_enrollments');
    return saved ? JSON.parse(saved) : [];
  });

  const [enrollmentRecords, setEnrollmentRecords] = useState(() => {
    const saved = localStorage.getItem('lms_enrollment_records');
    return saved ? JSON.parse(saved) : [];
  });

  const [courseProgress, setCourseProgress] = useState(() => {
    const saved = localStorage.getItem('lms_course_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('lms_course_progress', JSON.stringify(courseProgress));
  }, [courseProgress]);

  useEffect(() => {
    localStorage.setItem('lms_certs', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem('lms_enrollments', JSON.stringify(myEnrollments));
  }, [myEnrollments]);

  useEffect(() => {
    localStorage.setItem('lms_enrollment_records', JSON.stringify(enrollmentRecords));
  }, [enrollmentRecords]);

  const [timetable, setTimetable] = useState(() => {
    const saved = localStorage.getItem('lms_timetable');
    return saved ? JSON.parse(saved) : [];
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('lms_departments');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('lms_announcements');
    return saved ? JSON.parse(saved) : [];
  });

  const [notificationsList, setNotificationsList] = useState(() => {
    const saved = localStorage.getItem('lms_notifications_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [messagesList, setMessagesList] = useState(() => {
    const saved = localStorage.getItem('lms_messages_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [feedbackList, setFeedbackList] = useState(() => {
    const saved = localStorage.getItem('lms_feedback_list');
    return saved ? JSON.parse(saved) : [];
  });

  const [categoriesList, setCategoriesList] = useState(() => {
    const saved = localStorage.getItem('lms_categories_list');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('lms_timetable', JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem('lms_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('lms_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('lms_notifications_list', JSON.stringify(notificationsList));
  }, [notificationsList]);

  useEffect(() => {
    localStorage.setItem('lms_messages_list', JSON.stringify(messagesList));
  }, [messagesList]);

  useEffect(() => {
    localStorage.setItem('lms_feedback_list', JSON.stringify(feedbackList));
  }, [feedbackList]);

  useEffect(() => {
    localStorage.setItem('lms_categories_list', JSON.stringify(categoriesList));
  }, [categoriesList]);

  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState(null);
  const [selectedCertificateModal, setSelectedCertificateModal] = useState(null);
  const [checkoutModalCourse, setCheckoutModalCourse] = useState(null);

  const [isSystemChecking, setIsSystemChecking] = useState(false);
  const [isSetupCompleted, setIsSetupCompleted] = useState(() => {
    return localStorage.getItem('lms_setup_completed') === 'true';
  });
  const [setupType, setSetupType] = useState(() => {
    return localStorage.getItem('lms_setup_type') || 'INSTITUTE';
  });

  const reloadDatabaseData = async () => {
    try {
      
      const resStatus = await fetch(`${API_URL}/api/system/status`);
      if (resStatus.ok) {
        const statusData = await resStatus.json();
        if (statusData?.data) {
          const completed = Boolean(statusData.data.isSetupCompleted && (statusData.data.userCount > 0 || statusData.data.hasSuperAdmin));
          setIsSetupCompleted(completed);
          localStorage.setItem('lms_setup_completed', completed ? 'true' : 'false');
          if (statusData.data.installedType) {
            setSetupType(statusData.data.installedType);
            localStorage.setItem('lms_setup_type', statusData.data.installedType);
          }
          if (statusData.data.tenant) {
            setActiveTenant(statusData.data.tenant);
          }
        }
      } else {
        setIsSetupCompleted(false);
        localStorage.setItem('lms_setup_completed', 'false');
      }

      const resTenants = await fetch(`${API_URL}/api/tenants`);
      if (resTenants.ok) {
        const data = await resTenants.json();
        const tenantList = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
        setTenants(tenantList);
      }

      const resUsers = await fetch(`${API_URL}/api/auth/users`);
      if (resUsers.ok) {
        const usersData = await resUsers.json();
        const userList = Array.isArray(usersData) ? usersData : (usersData?.data && Array.isArray(usersData.data) ? usersData.data : []);
        setUsers(userList);
        if (userList.length === 0) {
          setIsSetupCompleted(false);
          localStorage.setItem('lms_setup_completed', 'false');
        }
      }

      const resCourses = await fetch(`${API_URL}/api/courses`);
      if (resCourses.ok) {
        const coursesData = await resCourses.json();
        const courseList = Array.isArray(coursesData) ? coursesData : (coursesData?.data && Array.isArray(coursesData.data) ? coursesData.data : []);
        setCourses(courseList);
      }

      const resEnrollments = await fetch(`${API_URL}/api/enrollments`);
      if (resEnrollments.ok) {
        const enrollData = await resEnrollments.json();
        const enrollList = Array.isArray(enrollData) ? enrollData : (enrollData?.data && Array.isArray(enrollData.data) ? enrollData.data : []);
        setEnrollmentRecords(enrollList);
      }

      const resTxns = await fetch(`${API_URL}/api/payments/transactions`);
      if (resTxns.ok) {
        const txnsData = await resTxns.json();
        const txnList = Array.isArray(txnsData) ? txnsData : (txnsData?.data && Array.isArray(txnsData.data) ? txnsData.data : []);
        setTransactions(txnList);
      }

      const resAssignments = await fetch(`${API_URL}/api/corporate/assignments`);
      if (resAssignments.ok) {
        const assignData = await resAssignments.json();
        const assignList = Array.isArray(assignData) ? assignData : (assignData?.data && Array.isArray(assignData.data) ? assignData.data : []);
        setCorporateAssignments(assignList);
      }

      const resTimetable = await fetch(`${API_URL}/api/timetable`);
      if (resTimetable.ok) {
        const ttData = await resTimetable.json();
        const ttList = Array.isArray(ttData) ? ttData : (ttData?.data && Array.isArray(ttData.data) ? ttData.data : []);
        setTimetable(ttList);
      }

      const resDepts = await fetch(`${API_URL}/api/departments`);
      if (resDepts.ok) {
        const deptsData = await resDepts.json();
        const deptsList = Array.isArray(deptsData) ? deptsData : (deptsData?.data && Array.isArray(deptsData.data) ? deptsData.data : []);
        setDepartments(deptsList);
      }

      const resAnnouncements = await fetch(`${API_URL}/api/announcements`);
      if (resAnnouncements.ok) {
        const annData = await resAnnouncements.json();
        const annList = Array.isArray(annData) ? annData : (annData?.data && Array.isArray(annData.data) ? annData.data : []);
        setAnnouncements(annList);
      }

      const resNotifs = await fetch(`${API_URL}/api/notifications`);
      if (resNotifs.ok) {
        const notifData = await resNotifs.json();
        const notifList = Array.isArray(notifData) ? notifData : (notifData?.data && Array.isArray(notifData.data) ? notifData.data : []);
        setNotificationsList(notifList);
      }

      const resMsgs = await fetch(`${API_URL}/api/messages`);
      if (resMsgs.ok) {
        const msgData = await resMsgs.json();
        const msgList = Array.isArray(msgData) ? msgData : (msgData?.data && Array.isArray(msgData.data) ? msgData.data : []);
        setMessagesList(msgList);
      }

      const resFeedback = await fetch(`${API_URL}/api/feedback`);
      if (resFeedback.ok) {
        const fbData = await resFeedback.json();
        const fbList = Array.isArray(fbData) ? fbData : (fbData?.data && Array.isArray(fbData.data) ? fbData.data : []);
        setFeedbackList(fbList);
      }

      const resCats = await fetch(`${API_URL}/api/categories`);
      if (resCats.ok) {
        const catData = await resCats.json();
        const catList = Array.isArray(catData) ? catData : (catData?.data && Array.isArray(catData.data) ? catData.data : []);
        setCategoriesList(catList);
      }
    } catch (e) {
      console.warn('Backend MySQL DB fetch notice:', e.message);
    }
  };

  useEffect(() => {
    reloadDatabaseData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_current_user', JSON.stringify(currentUser));
      if (currentUser.role) localStorage.setItem('lms_role', currentUser.role);
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTenant) {
      localStorage.setItem('lms_active_tenant', JSON.stringify(activeTenant));
    }
  }, [activeTenant]);

  useEffect(() => {
    if (activeTenant && role !== 'SUPER_ADMIN') {
      document.documentElement.style.setProperty('--brand-primary', activeTenant.primary_color || '#2563EB');
      document.documentElement.style.setProperty('--brand-secondary', activeTenant.secondary_color || '#06B6D4');
    } else {
      document.documentElement.style.setProperty('--brand-primary', '#2563EB');
      document.documentElement.style.setProperty('--brand-secondary', '#06B6D4');
    }
  }, [activeTenant, role]);

  const loginUserByEmail = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password })
      });
      if (response.ok) {
        const data = await response.json();
        const userObj = data.user || data.data?.user;
        const tenantObj = data.tenant || data.data?.tenant;
        const token = data.token || data.data?.token;

        if (userObj) {
          if (token) localStorage.setItem('token', token);
          setCurrentUser(userObj);
          setRole(userObj.role);
          if (tenantObj) {
            setActiveTenant(tenantObj);
            setTenants(prev => {
              if (prev.some(t => t.id === tenantObj.id)) return prev;
              return [tenantObj, ...prev];
            });
          }
          return {
            success: true,
            user: userObj,
            tenant: tenantObj,
            redirectUrl: data.redirectUrl || data.data?.redirectUrl
          };
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || 'Invalid email or password' };
      }
    } catch (e) {
      console.warn('Backend MySQL API connection notice during login:', e.message);
      return { success: false, error: 'Database connection failed. Please ensure MySQL server is running.' };
    }

    return { success: false, error: 'User account not found in database.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_current_user');
    localStorage.removeItem('lms_role');
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    const match = users.find(u => u.role === newRole);
    if (match) {
      setCurrentUser(match);
      if (match.tenant_id) {
        const found = tenants.find(t => t.id === match.tenant_id);
        if (found) setActiveTenant(found);
      }
    }
  };

  const addTenant = async (newTenant) => {
    setTenants(prev => [newTenant, ...prev.filter(t => t.id !== newTenant.id)]);
    try {
      const res = await fetch(`${API_URL}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenant)
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.data) {
          setTenants(prev => [resData.data, ...prev.filter(t => t.id !== newTenant.id && t.id !== resData.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Tenant DB sync warning:', e.message);
    }
  };

  const deleteTenant = async (tenantId) => {
    setTenants(prev => prev.filter(t => t.id !== tenantId));
    if (activeTenant && activeTenant.id === tenantId) {
      setActiveTenant(null);
    }
    try {
      await fetch(`${API_URL}/api/tenants/${tenantId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Tenant DB delete warning:', e.message);
    }
  };

  const addDepartment = async (deptData) => {
    const tempId = deptData.id || `dept-${Date.now()}`;
    const newDept = { ...deptData, id: tempId };
    setDepartments(prev => [newDept, ...prev.filter(d => d.id !== tempId)]);
    try {
      const res = await fetch(`${API_URL}/api/departments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...deptData, tenant_id: activeTenant?.id })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.data) {
          setDepartments(prev => [resJson.data, ...prev.filter(d => d.id !== tempId && d.id !== resJson.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Department DB sync warning:', e.message);
    }
  };

  const deleteDepartment = async (deptId) => {
    setDepartments(prev => prev.filter(d => d.id !== deptId));
    try {
      await fetch(`${API_URL}/api/departments/${deptId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Department DB delete warning:', e.message);
    }
  };

  const addAnnouncement = async (annData) => {
    const tempId = annData.id || `ann-${Date.now()}`;
    const newAnn = { ...annData, id: tempId };
    setAnnouncements(prev => [newAnn, ...prev.filter(a => a.id !== tempId)]);
    try {
      const res = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...annData, tenant_id: activeTenant?.id })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.data) {
          setAnnouncements(prev => [resJson.data, ...prev.filter(a => a.id !== tempId && a.id !== resJson.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Announcement DB sync warning:', e.message);
    }
  };

  const deleteAnnouncement = async (annId) => {
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
    try {
      await fetch(`${API_URL}/api/announcements/${annId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Announcement DB delete warning:', e.message);
    }
  };

  const addNotification = async (notifData) => {
    const tempId = notifData.id || `notif-${Date.now()}`;
    const newNotif = { ...notifData, id: tempId };
    setNotificationsList(prev => [newNotif, ...prev.filter(n => n.id !== tempId)]);
    try {
      const res = await fetch(`${API_URL}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...notifData, tenant_id: activeTenant?.id })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.data) {
          setNotificationsList(prev => [resJson.data, ...prev.filter(n => n.id !== tempId && n.id !== resJson.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Notification DB sync warning:', e.message);
    }
  };

  const deleteNotification = async (notifId) => {
    setNotificationsList(prev => prev.filter(n => n.id !== notifId));
    try {
      await fetch(`${API_URL}/api/notifications/${notifId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Notification DB delete warning:', e.message);
    }
  };

  const addMessage = async (msgData) => {
    const tempId = msgData.id || `msg-${Date.now()}`;
    const newMsg = { ...msgData, id: tempId };
    setMessagesList(prev => [newMsg, ...prev.filter(m => m.id !== tempId)]);
    try {
      const res = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...msgData, tenant_id: activeTenant?.id })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.data) {
          setMessagesList(prev => [resJson.data, ...prev.filter(m => m.id !== tempId && m.id !== resJson.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Message DB sync warning:', e.message);
    }
  };

  const deleteMessage = async (msgId) => {
    setMessagesList(prev => prev.filter(m => m.id !== msgId));
    try {
      await fetch(`${API_URL}/api/messages/${msgId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Message DB delete warning:', e.message);
    }
  };

  const addFeedback = async (fbData) => {
    const tempId = fbData.id || `rev-${Date.now()}`;
    const newFb = { ...fbData, id: tempId };
    setFeedbackList(prev => [newFb, ...prev.filter(f => f.id !== tempId)]);
    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fbData, tenant_id: activeTenant?.id })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.data) {
          setFeedbackList(prev => [resJson.data, ...prev.filter(f => f.id !== tempId && f.id !== resJson.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Feedback DB sync warning:', e.message);
    }
  };

  const deleteFeedback = async (fbId) => {
    setFeedbackList(prev => prev.filter(f => f.id !== fbId));
    try {
      await fetch(`${API_URL}/api/feedback/${fbId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Feedback DB delete warning:', e.message);
    }
  };

  const addCategory = async (catData) => {
    const tempId = catData.id || `cat-${Date.now()}`;
    const newCat = { ...catData, id: tempId };
    setCategoriesList(prev => [newCat, ...prev.filter(c => c.id !== tempId)]);
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...catData, tenant_id: activeTenant?.id })
      });
      if (res.ok) {
        const resJson = await res.json();
        if (resJson.data) {
          setCategoriesList(prev => [resJson.data, ...prev.filter(c => c.id !== tempId && c.id !== resJson.data.id)]);
        }
      }
    } catch (e) {
      console.warn('Category DB sync warning:', e.message);
    }
  };

  const deleteCategory = async (catId) => {
    setCategoriesList(prev => prev.filter(c => c.id !== catId));
    try {
      await fetch(`${API_URL}/api/categories/${catId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Category DB delete warning:', e.message);
    }
  };

  const addUser = async (newUser) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (response.ok) {
        const result = await response.json();
        const createdUser = result.data || result.user || result;
        setUsers(prev => [createdUser, ...prev.filter(u => u.id !== createdUser.id && u.email !== createdUser.email)]);
        return {
          success: true,
          user: createdUser,
          inviteLink: result.data?.inviteLink || result.inviteLink,
          message: result.message
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.message || 'Failed to save user in database' };
      }
    } catch (e) {
      console.warn('Backend user create error:', e.message);
      
      setUsers(prev => [newUser, ...prev.filter(u => u.id !== newUser.id)]);
      return {
        success: true,
        user: newUser,
        inviteLink: `${APP_BASE_URL}/activate-account?token=demo_token_${Date.now()}`
      };
    }
  };

  const inviteInstructor = async ({ name, email, department, tenant_id, job_title }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/invite/instructor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, department, tenant_id, job_title })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        return {
          success: true,
          message: result.message,
          inviteLink: result.data?.inviteLink
        };
      } else {
        return { success: false, error: result.message || 'Failed to send instructor invitation' };
      }
    } catch (e) {
      console.warn('Invite instructor API fallback:', e.message);
      const fallbackToken = `demo_token_${Date.now()}`;
      const inviteLink = `${APP_BASE_URL}/instructor/onboarding?token=${fallbackToken}`;
      return {
        success: true,
        message: `Instructor invitation link generated for ${email}`,
        inviteLink
      };
    }
  };
  const inviteFacultyMember = inviteInstructor;

  const updateUser = async (userId, updatedFields) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (response.ok) {
        const result = await response.json();
        const updated = result.data || result.user || updatedFields;
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updated } : u));
        if (currentUser && currentUser.id === userId) {
          setCurrentUser(prev => ({ ...prev, ...updated }));
        }
        return { success: true, user: updated };
      }
    } catch (e) {
      console.warn('Backend user update error:', e.message);
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updatedFields }));
    }
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`${API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Backend user delete error:', e.message);
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const toggleUserStatus = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/users/${userId}/status`, {
        method: 'PATCH'
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setUsers(prev => prev.map(u => u.id === userId ? result.data : u));
          return;
        }
      }
    } catch (e) {
      console.warn('Backend user toggle status error:', e.message);
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE' } : u));
  };

  const createCourse = async (newCourse) => {
    setCourses(prev => [newCourse, ...prev.filter(c => c.id !== newCourse.id)]);
    try {
      const res = await fetch(`${API_URL}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCourse)
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setCourses(prev => [saved, ...prev.filter(c => c.id !== newCourse.id && c.id !== saved.id)]);
          return saved;
        }
      }
    } catch (err) {
      console.warn('Course creation DB sync warning:', err.message);
    }
    return newCourse;
  };

  const deleteCourse = async (courseId) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    try {
      await fetch(`${API_URL}/api/courses/${courseId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Course delete DB sync warning:', err.message);
    }
  };

  const updateCourse = async (updatedCourse) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    try {
      const res = await fetch(`${API_URL}/api/courses/${updatedCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse)
      });
      if (res.ok) {
        const saved = await res.json();
        if (saved && saved.id) {
          setCourses(prev => prev.map(c => c.id === updatedCourse.id ? saved : c));
          return saved;
        }
      }
    } catch (err) {
      console.warn('Course update DB sync warning:', err.message);
    }
    return updatedCourse;
  };

  const submitCourseReview = async (courseId, { rating, feedback, user_name, user_id }) => {
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          feedback,
          user_id: user_id || (currentUser ? currentUser.id : null),
          user_name: user_name || (currentUser ? currentUser.name : 'Student Learner'),
          tenant_id: activeTenant ? activeTenant.id : null
        })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.data) {
          const newRating = resData.data.rating;
          const newCount = resData.data.rating_count;
          setCourses(prev => prev.map(c => c.id === courseId ? { ...c, rating: newRating, rating_count: newCount } : c));
        }
        return resData;
      }
    } catch (e) {
      console.warn('Submit course review API warning:', e.message);
    }
    
    setCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        const currentCount = Number(c.rating_count) || 0;
        const currentRating = Number(c.rating) || 5;
        const updatedRating = Number(((currentRating * currentCount + Number(rating)) / (currentCount + 1)).toFixed(1));
        return { ...c, rating: updatedRating, rating_count: currentCount + 1 };
      }
      return c;
    }));
  };

  const enrollInCourse = async (course, paymentMeta = {}) => {
    if (!course) return null;
    const user_id = currentUser ? currentUser.id : 'user-learner';
    const learner_name = currentUser ? currentUser.name : 'Learner';
    const learner_email = currentUser ? currentUser.email : 'learner@domain.com';
    const tenant_id = activeTenant ? activeTenant.id : null;
    const isPaid = Number(course.price || 0) > 0;
    const txnRef = paymentMeta.transaction_ref || `${paymentMeta.gateway === 'RAZORPAY' ? 'pay_' : 'ch_'}${Math.random().toString(36).substring(2, 11)}`;

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      tenant_id,
      user_id,
      learner_name,
      learner_email,
      course_id: course.id,
      course_title: course.title,
      course_thumbnail: course.thumbnail,
      course_instructor: course.instructor_name || 'Instructor',
      price: Number(course.price || 0),
      currency: 'INR',
      gateway: paymentMeta.gateway || (isPaid ? 'RAZORPAY' : 'FREE'),
      payment_method: paymentMeta.payment_method || (isPaid ? 'UPI' : 'FREE_ENROLLMENT'),
      transaction_ref: isPaid ? txnRef : 'FREE_ENROLLMENT',
      status: 'ACTIVE',
      progress_percentage: 0,
      enrolled_at: new Date().toISOString()
    };

    setEnrollmentRecords(prev => {
      const filtered = prev.filter(e => !(e.course_id === course.id && e.user_id === user_id));
      return [newEnrollment, ...filtered];
    });

    setMyEnrollments(prev => prev.includes(course.id) ? prev : [...prev, course.id]);

    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, enrolled_count: (Number(c.enrolled_count) || 0) + 1 } : c));

    if (isPaid) {
      const txn = {
        id: `txn-${Date.now()}`,
        tenant_id,
        user_id,
        learner_name,
        course_id: course.id,
        course_title: course.title,
        amount: course.price,
        currency: 'INR',
        gateway: paymentMeta.gateway || 'RAZORPAY',
        transaction_ref: txnRef,
        status: 'SUCCESS',
        created_at: new Date().toISOString().split('T')[0]
      };
      setTransactions(prev => [txn, ...prev]);
    }

    try {
      fetch(`${API_URL}/api/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: course.id,
          user_id,
          tenant_id,
          learner_name,
          learner_email,
          amount: course.price || 0,
          gateway: paymentMeta.gateway || 'RAZORPAY',
          transaction_ref: txnRef,
          payment_method: paymentMeta.payment_method || 'UPI'
        })
      }).catch(() => { });
    } catch (e) { }

    return newEnrollment;
  };

  const enrollInFreeCourse = (course) => {
    return enrollInCourse(course, { gateway: 'FREE', payment_method: 'FREE_ENROLLMENT' });
  };

  const completeLesson = (courseId, lessonId) => {
    setCourseProgress(prev => {
      const existing = prev[courseId] || { completedLessons: [], progressPercent: 0, isCompleted: false };
      const completedList = existing.completedLessons.includes(lessonId)
        ? existing.completedLessons
        : [...existing.completedLessons, lessonId];

      const targetCourse = courses.find(c => c.id === courseId);
      const totalLessons = targetCourse?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1;
      const progressPercent = Math.min(100, Math.round((completedList.length / totalLessons) * 100));
      const isCompleted = progressPercent === 100;

      if (isCompleted) {
        setCertificates(cPrev => {
          const currentUserId = currentUser ? currentUser.id : 'user-learner';
          const alreadyHasCert = cPrev.some(c => c.course_id === courseId && (c.user_id === currentUserId || !c.user_id));
          if (alreadyHasCert) return cPrev;

          const certCode = `CERT-${(activeTenant?.slug || 'LMS').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const cert = {
            id: `cert-${Date.now()}`,
            tenant_id: activeTenant ? activeTenant.id : null,
            user_id: currentUserId,
            user_name: currentUser ? currentUser.name : 'Learner',
            course_id: courseId,
            course_title: targetCourse?.title || 'Academic Course',
            certificate_code: certCode,
            issued_at: new Date().toISOString().split('T')[0]
          };
          return [cert, ...cPrev];
        });
      }

      return {
        ...prev,
        [courseId]: {
          completedLessons: completedList,
          progressPercent,
          isCompleted,
          lastAccessed: new Date().toISOString()
        }
      };
    });
  };

  const claimCourseCertificate = (courseId) => {
    const progress = courseProgress[courseId];
    const targetCourse = courses.find(c => c.id === courseId);
    const currentUserId = currentUser ? currentUser.id : 'user-learner';

    const isCompleted = progress?.isCompleted || progress?.progressPercent === 100;
    if (!isCompleted) {
      return {
        success: false,
        error: 'Course is not yet 100% completed. Please complete all lessons to claim your certificate.'
      };
    }

    const existingCert = certificates.find(c => c.course_id === courseId && (c.user_id === currentUserId || !c.user_id));
    if (existingCert) {
      setSelectedCertificateModal(existingCert);
      return { success: true, certificate: existingCert, isExisting: true };
    }

    const certCode = `CERT-${(activeTenant?.slug || 'LMS').toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert = {
      id: `cert-${Date.now()}`,
      tenant_id: activeTenant ? activeTenant.id : null,
      user_id: currentUserId,
      user_name: currentUser ? currentUser.name : 'Learner',
      course_id: courseId,
      course_title: targetCourse?.title || 'Academic Course',
      certificate_code: certCode,
      issued_at: new Date().toISOString().split('T')[0]
    };

    setCertificates(prev => [newCert, ...prev]);
    setSelectedCertificateModal(newCert);
    return { success: true, certificate: newCert, isExisting: false };
  };

  const toggleCoursePublish = (courseId) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, published: !c.published } : c));
  };

  const assignCorporateTraining = (assignment) => {
    setCorporateAssignments(prev => [assignment, ...prev.filter(a => a.id !== assignment.id)]);
  };

  const processCoursePurchase = (course, gateway, extraMeta = {}) => {
    return enrollInCourse(course, { gateway: gateway || 'RAZORPAY', ...extraMeta });
  };

  const completeSetup = ({ tenant, superAdmin, type }) => {
    setIsSetupCompleted(true);
    if (type) setSetupType(type);
    if (tenant) {
      setTenants(prev => [tenant, ...prev.filter(t => t.id !== tenant.id)]);
      setActiveTenant(tenant);
    }
    if (superAdmin) {
      setUsers(prev => [superAdmin, ...prev.filter(u => u.id !== superAdmin.id)]);
      setCurrentUser(superAdmin);
      setRole('SUPER_ADMIN');
    }
    localStorage.setItem('lms_setup_completed', 'true');
    if (type) localStorage.setItem('lms_setup_type', type);
  };

  const resetSetup = () => {
    setIsSetupCompleted(false);
    localStorage.removeItem('lms_setup_completed');
    localStorage.removeItem('lms_setup_type');
  };

  const createManualEnrollment = async (payload) => {
    
    try {
      const res = await fetch(`${API_URL}/api/enrollments/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const result = await res.json();
        if (result.enrollments && Array.isArray(result.enrollments)) {
          setEnrollmentRecords(prev => {
            const newIds = result.enrollments.map(e => e.id);
            const filtered = prev.filter(e => !newIds.includes(e.id));
            return [...result.enrollments, ...filtered];
          });
          setCourses(prev => prev.map(c => c.id === payload.course_id ? { ...c, enrolled_count: (Number(c.enrolled_count) || 0) + result.enrollments.length } : c));

          if (currentUser) {
            const isCurrentEnrolled = payload.learners.some(l => l.user_id === currentUser.id || l.learner_email?.toLowerCase() === currentUser.email?.toLowerCase());
            if (isCurrentEnrolled) {
              setMyEnrollments(prev => prev.includes(payload.course_id) ? prev : [...prev, payload.course_id]);
            }
          }
          return result;
        }
      }
    } catch (err) {
      console.warn('Backend manual enrollment API call notice:', err.message);
    }

    const createdList = (payload.learners || []).map((l, idx) => ({
      id: `man-enr-${Date.now()}-${idx}`,
      tenant_id: payload.tenant_id,
      user_id: l.user_id || `user-${Date.now()}-${idx}`,
      learner_name: l.learner_name,
      learner_email: l.learner_email,
      course_id: payload.course_id,
      course_title: payload.course_title,
      price: payload.payment_amount,
      enrollment_type: payload.enrollment_type || 'OFFLINE_PAYMENT',
      payment_method: payload.payment_method || 'BANK_TRANSFER',
      transaction_ref: payload.payment_reference,
      status: payload.status || 'ACTIVE',
      progress_percentage: 0,
      start_date: payload.start_date,
      expiry_date: payload.expiry_date,
      notes: payload.notes,
      enrolled_at: payload.payment_date || new Date().toISOString()
    }));

    setEnrollmentRecords(prev => [...createdList, ...prev]);
    setCourses(prev => prev.map(c => c.id === payload.course_id ? { ...c, enrolled_count: (Number(c.enrolled_count) || 0) + createdList.length } : c));
    if (currentUser) {
      const isCurrentEnrolled = payload.learners.some(l => l.user_id === currentUser.id || l.learner_email?.toLowerCase() === currentUser.email?.toLowerCase());
      if (isCurrentEnrolled) {
        setMyEnrollments(prev => prev.includes(payload.course_id) ? prev : [...prev, payload.course_id]);
      }
    }
    return { success: true, count: createdList.length };
  };

  const approveEnrollment = async (enrollmentId) => {
    try {
      const res = await fetch(`${API_URL}/api/enrollments/${enrollmentId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setEnrollmentRecords(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: 'ACTIVE' } : e));
        return data;
      }
    } catch (e) {
      console.warn('Backend approve call notice:', e.message);
    }
    setEnrollmentRecords(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: 'ACTIVE' } : e));
  };

  const updateEnrollmentStatus = async (enrollmentId, newStatus, notes = '') => {
    try {
      const res = await fetch(`${API_URL}/api/enrollments/${enrollmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes })
      });
      if (res.ok) {
        setEnrollmentRecords(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: newStatus, notes: notes || e.notes } : e));
        return;
      }
    } catch (e) {
      console.warn('Backend status update notice:', e.message);
    }
    setEnrollmentRecords(prev => prev.map(e => e.id === enrollmentId ? { ...e, status: newStatus, notes: notes || e.notes } : e));
  };

  const addTimetableEntry = async (entry) => {
    try {
      const res = await fetch(`${API_URL}/api/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
      if (res.ok) {
        const result = await res.json();
        const created = result.data || entry;
        setTimetable(prev => [created, ...prev]);
        return { success: true, data: created };
      }
    } catch (err) {
      console.warn('Timetable create error:', err.message);
    }
    const fallback = { id: `tt-${Date.now()}`, ...entry };
    setTimetable(prev => [fallback, ...prev]);
    return { success: true, data: fallback };
  };

  const updateTimetableEntry = async (id, fields) => {
    try {
      const res = await fetch(`${API_URL}/api/timetable/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const result = await res.json();
        setTimetable(prev => prev.map(t => t.id === id ? { ...t, ...fields, ...result.data } : t));
        return { success: true };
      }
    } catch (err) {
      console.warn('Timetable update error:', err.message);
    }
    setTimetable(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t));
    return { success: true };
  };

  const deleteTimetableEntry = async (id) => {
    try {
      await fetch(`${API_URL}/api/timetable/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Timetable delete error:', err.message);
    }
    setTimetable(prev => prev.filter(t => t.id !== id));
  };

  const [invoiceModalData, setInvoiceModalData] = useState(null);

  return (
    <AppContext.Provider value={{
      isSystemChecking,
      isSetupCompleted,
      setIsSetupCompleted,
      setupType,
      setSetupType,
      completeSetup,
      resetSetup,
      reloadDatabaseData,
      role,
      setRole,
      switchRole,
      currentUser,
      setCurrentUser,
      users,
      addUser,
      inviteInstructor,
      inviteFacultyMember,
      updateUser,
      deleteUser,
      toggleUserStatus,
      loginUserByEmail,
      tenants,
      activeTenant,
      setActiveTenant,
      addTenant,
      deleteTenant,
      courses,
      createCourse,
      updateCourse,
      deleteCourse,
      toggleCoursePublish,
      courseProgress,
      completeLesson,
      claimCourseCertificate,
      enrollInFreeCourse,
      subscriptions,
      setSubscriptions,
      corporateAssignments,
      assignCorporateTraining,
      transactions,
      certificates,
      myEnrollments,
      enrollmentRecords,
      setEnrollmentRecords,
      timetable,
      setTimetable,
      addTimetableEntry,
      updateTimetableEntry,
      deleteTimetableEntry,
      enrollInCourse,
      createManualEnrollment,
      approveEnrollment,
      updateEnrollmentStatus,
      invoiceModalData,
      setInvoiceModalData,
      departments,
      setDepartments,
      addDepartment,
      deleteDepartment,
      announcements,
      setAnnouncements,
      addAnnouncement,
      deleteAnnouncement,
      notificationsList,
      setNotificationsList,
      addNotification,
      deleteNotification,
      messagesList,
      setMessagesList,
      addMessage,
      deleteMessage,
      feedbackList,
      setFeedbackList,
      addFeedback,
      deleteFeedback,
      categoriesList,
      setCategoriesList,
      addCategory,
      deleteCategory,
      selectedCourseForPlayer,
      setSelectedCourseForPlayer,
      selectedCertificateModal,
      setSelectedCertificateModal,
      checkoutModalCourse,
      setCheckoutModalCourse,
      processCoursePurchase,
      submitCourseReview,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
