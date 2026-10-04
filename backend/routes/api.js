const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 150 * 1024 * 1024 } });

const authController = require('../controllers/authController');
const tenantController = require('../controllers/tenantController');
const courseController = require('../controllers/courseController');
const corporateController = require('../controllers/corporateController');
const instituteController = require('../controllers/instituteController');
const superAdminController = require('../controllers/superAdminController');
const assessmentController = require('../controllers/assessmentController');
const analyticsController = require('../controllers/analyticsController');
const paymentController = require('../controllers/paymentController');
const scormController = require('../controllers/scormController');
const enrollmentController = require('../controllers/enrollmentController');
const timetableController = require('../controllers/timetableController');
const communicationController = require('../controllers/communicationController');
const roleRoutes = require('./roleRoutes');

router.post('/scorm/upload', upload.any(), (req, res, next) => {
  if (req.files && req.files.length > 0) req.file = req.files[0];
  next();
}, scormController.uploadPackage);
router.get('/scorm/packages', scormController.getPackages);
router.get('/scorm/packages/:id', scormController.getPackageDetails);
router.delete('/scorm/packages/:id', scormController.deletePackage);
router.get('/scorm/tracking/:packageId', scormController.getTracking);
router.post('/scorm/tracking/:packageId/commit', scormController.commitTracking);
router.get('/scorm/reports', scormController.getReports);
router.get('/scorm/reports/:packageId', scormController.getReports);
router.post('/scorm/sample', scormController.generateSamplePackage);
router.post('/scorm/generate-sample', scormController.generateSamplePackage);

router.get('/system/status', authController.getSystemStatus);
router.get('/v1/system/status', authController.getSystemStatus);
router.post('/system/setup', authController.setupPlatform);
router.post('/v1/system/setup', authController.setupPlatform);
router.post('/system/provision-schema', authController.provisionSchema);
router.post('/v1/system/provision-schema', authController.provisionSchema);

router.post('/auth/send-verification-otp', authController.sendVerificationOtp);
router.post('/v1/auth/send-verification-otp', authController.sendVerificationOtp);
router.post('/auth/verify-otp', authController.verifyOtp);
router.post('/v1/auth/verify-otp', authController.verifyOtp);
router.post('/auth/register-student', authController.registerStudent);
router.post('/v1/auth/register-student', authController.registerStudent);

router.post('/auth/login', authController.login);
router.post('/v1/auth/login', authController.login);

router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/v1/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.post('/v1/auth/reset-password', authController.resetPassword);
router.post('/auth/change-password', authenticateToken, authController.changePassword);
router.post('/v1/auth/change-password', authenticateToken, authController.changePassword);

router.post('/auth/register/institute', authController.registerInstitute);
router.post('/v1/auth/register/institute', authController.registerInstitute);

router.post('/auth/register/corporate', authController.registerCorporate);
router.post('/v1/auth/register/corporate', authController.registerCorporate);

router.post('/auth/invite/instructor', authController.inviteInstructor);
router.post('/v1/auth/invite/instructor', authController.inviteInstructor);
router.get('/auth/verify-invitation', authController.verifyInstructorInvitation);
router.get('/v1/auth/verify-invitation', authController.verifyInstructorInvitation);
router.post('/auth/complete-instructor-onboarding', authController.completeInstructorOnboarding);
router.post('/v1/auth/complete-instructor-onboarding', authController.completeInstructorOnboarding);

router.get('/auth/verify-activation-token', authController.verifyMemberActivationToken);
router.get('/v1/auth/verify-activation-token', authController.verifyMemberActivationToken);
router.post('/auth/complete-activation', authController.completeMemberActivation);
router.post('/v1/auth/complete-activation', authController.completeMemberActivation);

router.get('/auth/me', authenticateToken, authController.getMe);
router.get('/v1/auth/me', authenticateToken, authController.getMe);

router.get('/auth/users', authController.getUsers);
router.get('/v1/auth/users', authController.getUsers);
router.post('/auth/users', authController.createUser);
router.post('/v1/auth/users', authController.createUser);
router.put('/auth/users/:id', authController.updateUser);
router.put('/v1/auth/users/:id', authController.updateUser);
router.delete('/auth/users/:id', authController.deleteUser);
router.delete('/v1/auth/users/:id', authController.deleteUser);
router.patch('/auth/users/:id/status', authController.toggleUserStatus);
router.patch('/v1/auth/users/:id/status', authController.toggleUserStatus);

router.get('/users', authController.getUsers);
router.post('/users', authController.createUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

router.get('/public/certificates/verify/:certificateNumber', authController.verifyCertificate);
router.get('/v1/public/certificates/verify/:certificateNumber', authController.verifyCertificate);

router.get('/super-admin/dashboard', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.getDashboard);
router.get('/v1/super-admin/dashboard', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.getDashboard);

router.get('/super-admin/tenants', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.getTenants);
router.get('/v1/super-admin/tenants', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.getTenants);

router.patch('/super-admin/tenants/:tenantId/activate', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.activateTenant);
router.patch('/v1/super-admin/tenants/:tenantId/activate', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.activateTenant);

router.patch('/super-admin/tenants/:tenantId/suspend', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.suspendTenant);
router.patch('/v1/super-admin/tenants/:tenantId/suspend', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.suspendTenant);

router.get('/super-admin/audit-logs', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.getAuditLogs);
router.get('/v1/super-admin/audit-logs', authenticateToken, authorizeRoles('SUPER_ADMIN'), superAdminController.getAuditLogs);

router.get('/tenants', tenantController.getTenants);
router.get('/v1/tenants', tenantController.getTenants);
router.post('/tenants', authenticateToken, authorizeRoles('SUPER_ADMIN'), tenantController.createTenant);

router.get('/institute/dashboard', authenticateToken, instituteController.getInstituteDashboard);
router.get('/v1/institute/dashboard', authenticateToken, instituteController.getInstituteDashboard);

router.get('/institute/departments', authenticateToken, instituteController.getDepartments);
router.get('/v1/institute/departments', authenticateToken, instituteController.getDepartments);
router.post('/institute/departments', authenticateToken, authorizeRoles('INSTITUTE_ADMIN'), instituteController.createDepartment);
router.post('/v1/institute/departments', authenticateToken, authorizeRoles('INSTITUTE_ADMIN'), instituteController.createDepartment);

router.get('/institute/programs', authenticateToken, instituteController.getPrograms);
router.get('/v1/institute/programs', authenticateToken, instituteController.getPrograms);
router.post('/institute/programs', authenticateToken, authorizeRoles('INSTITUTE_ADMIN'), instituteController.createProgram);
router.post('/v1/institute/programs', authenticateToken, authorizeRoles('INSTITUTE_ADMIN'), instituteController.createProgram);

router.get('/institute/learners', authenticateToken, instituteController.getLearners);
router.get('/v1/institute/learners', authenticateToken, instituteController.getLearners);

router.get('/institute/instructors', authenticateToken, instituteController.getInstructors);
router.get('/v1/institute/instructors', authenticateToken, instituteController.getInstructors);
router.get('/institute/teachers', authenticateToken, instituteController.getInstructors);
router.get('/v1/institute/teachers', authenticateToken, instituteController.getInstructors);

router.get('/corporate/dashboard', authenticateToken, corporateController.getCorporateDashboard);
router.get('/v1/corporate/dashboard', authenticateToken, corporateController.getCorporateDashboard);

router.get('/corporate/assignments', authenticateToken, corporateController.getCorporateAssignments);
router.get('/v1/corporate/assignments', authenticateToken, corporateController.getCorporateAssignments);
router.post('/corporate/assign', authenticateToken, authorizeRoles('CORPORATE_ADMIN'), corporateController.assignTraining);
router.post('/v1/corporate/assign', authenticateToken, authorizeRoles('CORPORATE_ADMIN'), corporateController.assignTraining);
router.put('/corporate/assignments/:id', authenticateToken, corporateController.updateAssignmentStatus);
router.put('/v1/corporate/assignments/:id', authenticateToken, corporateController.updateAssignmentStatus);

router.get('/corporate/skills', authenticateToken, corporateController.getSkills);
router.get('/v1/corporate/skills', authenticateToken, corporateController.getSkills);
router.post('/corporate/skills', authenticateToken, authorizeRoles('CORPORATE_ADMIN'), corporateController.createSkill);
router.post('/v1/corporate/skills', authenticateToken, authorizeRoles('CORPORATE_ADMIN'), corporateController.createSkill);

router.get('/corporate/employees', authenticateToken, corporateController.getEmployees);
router.get('/v1/corporate/employees', authenticateToken, corporateController.getEmployees);

router.get('/courses', courseController.getCourses);
router.get('/v1/courses', courseController.getCourses);
router.get('/courses/:id', courseController.getCourseDetails);
router.get('/v1/courses/:id', courseController.getCourseDetails);
router.post('/courses', courseController.createCourse);
router.post('/v1/courses', courseController.createCourse);
router.put('/courses/:id', courseController.updateCourse);
router.put('/v1/courses/:id', courseController.updateCourse);
router.delete('/courses/:id', courseController.deleteCourse);
router.delete('/v1/courses/:id', courseController.deleteCourse);
router.post('/courses/upload-content', upload.single('file'), courseController.uploadContent);
router.post('/v1/courses/upload-content', upload.single('file'), courseController.uploadContent);
router.post('/courses/:id/reviews', courseController.submitCourseReview);
router.get('/courses/:id/reviews', courseController.getCourseReviews);

router.get('/quizzes', authenticateToken, assessmentController.getQuizzes);
router.get('/v1/quizzes', authenticateToken, assessmentController.getQuizzes);
router.post('/quizzes/:id/submit', authenticateToken, assessmentController.submitQuiz);
router.post('/v1/quizzes/:id/submit', authenticateToken, assessmentController.submitQuiz);

router.get('/assignments', authenticateToken, assessmentController.getAssignments);
router.get('/v1/assignments', authenticateToken, assessmentController.getAssignments);
router.post('/assignments/:id/submit', authenticateToken, assessmentController.submitAssignment);
router.post('/v1/assignments/:id/submit', authenticateToken, assessmentController.submitAssignment);

router.post('/payments/checkout', paymentController.processCheckout);
router.post('/v1/payments/checkout', paymentController.processCheckout);
router.get('/payments/transactions', paymentController.getTransactions);
router.get('/v1/payments/transactions', paymentController.getTransactions);

router.post('/enrollments', enrollmentController.createEnrollment);
router.post('/v1/enrollments', enrollmentController.createEnrollment);
router.post('/enrollments/manual', enrollmentController.createManualEnrollment);
router.post('/v1/enrollments/manual', enrollmentController.createManualEnrollment);
router.get('/enrollments/reports', enrollmentController.getEnrollmentReports);
router.get('/v1/enrollments/reports', enrollmentController.getEnrollmentReports);
router.get('/enrollments', enrollmentController.getEnrollments);
router.get('/v1/enrollments', enrollmentController.getEnrollments);
router.get('/enrollments/:id', enrollmentController.getEnrollmentById);
router.get('/v1/enrollments/:id', enrollmentController.getEnrollmentById);
router.patch('/enrollments/:id/progress', enrollmentController.updateProgress);
router.patch('/v1/enrollments/:id/progress', enrollmentController.updateProgress);
router.patch('/enrollments/:id/approve', enrollmentController.approveEnrollment);
router.patch('/v1/enrollments/:id/approve', enrollmentController.approveEnrollment);
router.patch('/enrollments/:id/status', enrollmentController.updateEnrollmentStatus);
router.patch('/v1/enrollments/:id/status', enrollmentController.updateEnrollmentStatus);

router.post('/certificates/issue', authenticateToken, paymentController.issueCertificate);
router.post('/v1/certificates/issue', authenticateToken, paymentController.issueCertificate);

router.get('/analytics/institute', authenticateToken, analyticsController.getInstituteStats);
router.get('/v1/analytics/institute', authenticateToken, analyticsController.getInstituteStats);

router.get('/analytics/corporate', authenticateToken, analyticsController.getCorporateStats);
router.get('/v1/analytics/corporate', authenticateToken, analyticsController.getCorporateStats);

router.get('/analytics/super-admin', authenticateToken, authorizeRoles('SUPER_ADMIN'), analyticsController.getSuperAdminStats);
router.get('/v1/analytics/super-admin', authenticateToken, authorizeRoles('SUPER_ADMIN'), analyticsController.getSuperAdminStats);

router.get('/timetable', timetableController.getTimetable);
router.get('/v1/timetable', timetableController.getTimetable);
router.post('/timetable', timetableController.createTimetable);
router.post('/v1/timetable', timetableController.createTimetable);
router.put('/timetable/:id', timetableController.updateTimetable);
router.put('/v1/timetable/:id', timetableController.updateTimetable);
router.delete('/timetable/:id', timetableController.deleteTimetable);
router.delete('/v1/timetable/:id', timetableController.deleteTimetable);

router.get('/announcements', communicationController.getAnnouncements);
router.get('/v1/announcements', communicationController.getAnnouncements);
router.post('/announcements', communicationController.createAnnouncement);
router.post('/v1/announcements', communicationController.createAnnouncement);
router.put('/announcements/:id', communicationController.updateAnnouncement);
router.put('/v1/announcements/:id', communicationController.updateAnnouncement);
router.delete('/announcements/:id', communicationController.deleteAnnouncement);
router.delete('/v1/announcements/:id', communicationController.deleteAnnouncement);

router.get('/notifications', communicationController.getNotifications);
router.get('/v1/notifications', communicationController.getNotifications);
router.post('/notifications', communicationController.createNotification);
router.post('/v1/notifications', communicationController.createNotification);
router.delete('/notifications/:id', communicationController.deleteNotification);
router.delete('/v1/notifications/:id', communicationController.deleteNotification);

router.get('/messages', communicationController.getMessages);
router.get('/v1/messages', communicationController.getMessages);
router.post('/messages', communicationController.createMessage);
router.post('/v1/messages', communicationController.createMessage);
router.delete('/messages/:id', communicationController.deleteMessage);
router.delete('/v1/messages/:id', communicationController.deleteMessage);

router.get('/feedback', communicationController.getFeedback);
router.get('/v1/feedback', communicationController.getFeedback);
router.post('/feedback', communicationController.createFeedback);
router.post('/v1/feedback', communicationController.createFeedback);
router.delete('/feedback/:id', communicationController.deleteFeedback);
router.delete('/v1/feedback/:id', communicationController.deleteFeedback);

router.get('/departments', communicationController.getDepartments);
router.get('/v1/departments', communicationController.getDepartments);
router.post('/departments', communicationController.createDepartment);
router.post('/v1/departments', communicationController.createDepartment);
router.delete('/departments/:id', communicationController.deleteDepartment);
router.delete('/v1/departments/:id', communicationController.deleteDepartment);

router.get('/categories', communicationController.getCategories);
router.get('/v1/categories', communicationController.getCategories);
router.post('/categories', communicationController.createCategory);
router.post('/v1/categories', communicationController.createCategory);
router.delete('/categories/:id', communicationController.deleteCategory);
router.delete('/v1/categories/:id', communicationController.deleteCategory);

router.post('/tenants', tenantController.createTenant);
router.delete('/tenants/:id', tenantController.deleteTenant);

router.use('/roles', roleRoutes);

module.exports = router;
