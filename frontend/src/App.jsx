import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { TenantPortalLayout } from './layouts/TenantPortalLayout';

import {
  
  LoginPage,
  ResetPasswordPage,
  AccountActivationPage,
  SetupPage,

  RegisterStudentPage,
  CertificateVerifyPage,
  LandingPage,

  InstituteDashboard,

  CorporateDashboard,
  CorporateAdminDashboard,
  CorporateHRDashboard,
  TrainerDashboard,
  EmployeePortal,

  SuperAdminLayout,
  DashboardOverview,
  InstitutesTab,
  CreateInstitutePage,
  DepartmentsTab,
  UsersTab,
  CoursesTab,
  SubscriptionsTab,
  PaymentsTab,
  AnnouncementsTab,
  NotificationsTab,
  MessagesTab,
  FeedbackTab,

  InstructorDashboard,
  CourseCreatePage,
  InstructorOnboardingPage,

  LearnerPortal,
  CheckoutPage,
  PaymentSuccessPage,
} from './pages';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { CoursePlayerModal } from './components/course/CoursePlayerModal';
import { CertificateModal } from './components/course/CertificateModal';
import { CheckoutModal } from './components/course/CheckoutModal';

const AppRoutes = () => {
  const { isSetupCompleted } = useApp();

  return (
    <>
      <Routes>
        {/* 1. Public Facing Root Route */}
        <Route path="/" element={!isSetupCompleted ? <Navigate to="/setup" replace /> : <LandingPage />} />

        {/* 2. Setup and Onboarding Routes */}
        <Route path="/setup" element={isSetupCompleted ? <Navigate to="/" replace /> : <SetupPage />} />
        <Route path="/select-portal" element={isSetupCompleted ? <Navigate to="/" replace /> : <SetupPage />} />
        <Route path="/onboarding" element={isSetupCompleted ? <Navigate to="/" replace /> : <SetupPage />} />

        {}
        <Route path="/login" element={!isSetupCompleted ? <Navigate to="/setup" replace /> : <LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/activate-account" element={<AccountActivationPage />} />
        <Route path="/activate" element={<AccountActivationPage />} />
        <Route path="/register" element={<RegisterStudentPage />} />
        <Route path="/register/:instituteId" element={<RegisterStudentPage />} />
        <Route path="/enroll" element={<RegisterStudentPage />} />
        <Route path="/enroll/:instituteId" element={<RegisterStudentPage />} />
        <Route path="/register/institute" element={<Navigate to="/register" replace />} />
        <Route path="/register/corporate" element={<Navigate to="/register" replace />} />
        <Route path="/registration-success" element={<Navigate to="/login" replace />} />
        <Route path="/certificate-verification" element={<CertificateVerifyPage />} />

        {}
        <Route path="/superadmin" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardOverview />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="institutes" element={<InstitutesTab onOpenAddModal={() => { }} />} />
          <Route path="institutes/create" element={<CreateInstitutePage />} />
          <Route path="departments" element={<DepartmentsTab />} />
          <Route path="users" element={<UsersTab />} />
          <Route path="students" element={<UsersTab />} />
          <Route path="admins" element={<UsersTab />} />
          <Route path="instructors" element={<UsersTab />} />
          <Route path="roles-permissions" element={<UsersTab />} />
          <Route path="courses" element={<CoursesTab />} />
          <Route path="courses/create" element={<CourseCreatePage />} />
          <Route path="courses/:id/edit" element={<CourseCreatePage />} />
          <Route path="categories" element={<CoursesTab />} />
          <Route path="subscriptions" element={<SubscriptionsTab />} />
          <Route path="payments" element={<PaymentsTab />} />
          <Route path="analytics" element={<DashboardOverview />} />
          <Route path="organizations" element={<Navigate to="/superadmin" replace />} />

          {}
          <Route path="announcements" element={<AnnouncementsTab initialSubTab="all" />} />
          <Route path="announcements/all" element={<AnnouncementsTab initialSubTab="all" />} />
          <Route path="announcements/create" element={<AnnouncementsTab initialSubTab="create" />} />
          <Route path="announcements/categories" element={<AnnouncementsTab initialSubTab="categories" />} />

          <Route path="notifications" element={<NotificationsTab initialSubTab="all" />} />
          <Route path="notifications/all" element={<NotificationsTab initialSubTab="all" />} />
          <Route path="notifications/email-templates" element={<NotificationsTab initialSubTab="email-templates" />} />
          <Route path="notifications/sms-templates" element={<NotificationsTab initialSubTab="sms-templates" />} />
          <Route path="notifications/push" element={<NotificationsTab initialSubTab="push" />} />

          <Route path="messages" element={<MessagesTab initialSubTab="all" />} />
          <Route path="messages/all" element={<MessagesTab initialSubTab="all" />} />
          <Route path="messages/compose" element={<MessagesTab initialSubTab="compose" />} />
          <Route path="messages/templates" element={<MessagesTab initialSubTab="templates" />} />

          <Route path="feedback" element={<FeedbackTab />} />
        </Route>

        {}
        <Route path="/super-admin" element={<Navigate to="/superadmin" replace />} />
        <Route path="/super-admin/*" element={<Navigate to="/superadmin" replace />} />

        {}
        <Route path="/instructor/courses/create" element={
          <ProtectedRoute allowedRoles={['INSTRUCTOR', 'TRAINER', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'SUPER_ADMIN']}>
            <CourseCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/instructor/courses/:id/edit" element={
          <ProtectedRoute allowedRoles={['INSTRUCTOR', 'TRAINER', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'SUPER_ADMIN']}>
            <CourseCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/courses/create" element={
          <ProtectedRoute allowedRoles={['INSTRUCTOR', 'TRAINER', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'SUPER_ADMIN']}>
            <CourseCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/courses/:id/edit" element={
          <ProtectedRoute allowedRoles={['INSTRUCTOR', 'TRAINER', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN', 'SUPER_ADMIN']}>
            <CourseCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/courses/create" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <CourseCreatePage />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/courses/:id/edit" element={
          <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
            <CourseCreatePage />
          </ProtectedRoute>
        } />

        {}
        <Route path="/institute" element={
          <ProtectedRoute allowedRoles={['INSTITUTE_ADMIN']}>
            <InstituteDashboard />
          </ProtectedRoute>
        } />
        <Route path="/institute/*" element={
          <ProtectedRoute allowedRoles={['INSTITUTE_ADMIN']}>
            <InstituteDashboard />
          </ProtectedRoute>
        } />

        {}
        {}
        {}
        
        {}
        <Route
          path="/corporate"
          element={
            <ProtectedRoute allowedRoles={['CORPORATE_ADMIN', 'HR_ADMIN', 'TRAINER', 'EMPLOYEE']}>
              <TenantPortalLayout>
                <CorporateDashboard />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/corporate/*"
          element={
            <ProtectedRoute allowedRoles={['CORPORATE_ADMIN', 'HR_ADMIN', 'TRAINER', 'EMPLOYEE']}>
              <TenantPortalLayout>
                <CorporateDashboard />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />

        {}
        <Route
          path="/corporate/admin"
          element={
            <ProtectedRoute allowedRoles={['CORPORATE_ADMIN']}>
              <TenantPortalLayout>
                <CorporateAdminDashboard />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />

        {}
        <Route
          path="/corporate/hr"
          element={
            <ProtectedRoute allowedRoles={['HR_ADMIN']}>
              <TenantPortalLayout>
                <CorporateHRDashboard />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />

        {}
        <Route path="/corporate/trainer" element={
          <ProtectedRoute allowedRoles={['TRAINER']}>
            <TrainerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/trainer" element={
          <ProtectedRoute allowedRoles={['TRAINER']}>
            <TrainerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/trainer/*" element={
          <ProtectedRoute allowedRoles={['TRAINER']}>
            <TrainerDashboard />
          </ProtectedRoute>
        } />

        {}
        <Route
          path="/corporate/employee"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <TenantPortalLayout>
                <EmployeePortal />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <TenantPortalLayout>
                <EmployeePortal />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/*"
          element={
            <ProtectedRoute allowedRoles={['EMPLOYEE']}>
              <TenantPortalLayout>
                <EmployeePortal />
              </TenantPortalLayout>
            </ProtectedRoute>
          }
        />

        {}
        {}
        {}

        {}
        <Route path="/instructor/onboarding" element={<InstructorOnboardingPage />} />
        <Route path="/activate-instructor" element={<InstructorOnboardingPage />} />
        <Route path="/register/instructor" element={<InstructorOnboardingPage />} />
        <Route path="/instructor" element={
          <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
            <InstructorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/instructor/*" element={
          <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
            <InstructorDashboard />
          </ProtectedRoute>
        } />

        {}
        <Route path="/learner/checkout/:courseId" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/learner/checkout" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout/:courseId" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/learner/payment-success" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <PaymentSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <PaymentSuccessPage />
          </ProtectedRoute>
        } />

        {}
        <Route path="/learner" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <LearnerPortal />
          </ProtectedRoute>
        } />
        <Route path="/learner/*" element={
          <ProtectedRoute allowedRoles={['LEARNER', 'STUDENT']}>
            <LearnerPortal />
          </ProtectedRoute>
        } />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {}
      <CoursePlayerModal />
      <CertificateModal />
      <CheckoutModal />
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
