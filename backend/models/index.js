const { ensureDatabaseExists } = require('../config/db');
const sequelize = require('../config/database');

const Tenant = require('./Tenant');
const TenantSettings = require('./TenantSettings');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const UserRole = require('./UserRole');
const Institute = require('./Institute');
const Corporate = require('./Corporate');
const Department = require('./Department');
const AcademicProgram = require('./AcademicProgram');
const Learner = require('./Learner');
const Instructor = require('./Instructor');
const Teacher = Instructor; 
const Employee = require('./Employee');
const Manager = require('./Manager');
const Team = require('./Team');
const CourseCategory = require('./CourseCategory');
const Course = require('./Course');
const Module = require('./Module');
const Lesson = require('./Lesson');
const CourseProgress = require('./CourseProgress');
const Enrollment = require('./Enrollment');
const CorporateAssignment = require('./CorporateAssignment');
const Question = require('./Question');
const Quiz = require('./Quiz');
const QuizQuestion = require('./QuizQuestion');
const QuizAttempt = require('./QuizAttempt');
const Assignment = require('./Assignment');
const AssignmentSubmission = require('./AssignmentSubmission');
const Certificate = require('./Certificate');
const CertificateVerification = require('./CertificateVerification');
const Transaction = require('./Transaction');
const SkillCategory = require('./SkillCategory');
const Skill = require('./Skill');
const EmployeeSkill = require('./EmployeeSkill');
const SkillGap = require('./SkillGap');
const ComplianceCategory = require('./ComplianceCategory');
const ComplianceTraining = require('./ComplianceTraining');
const ComplianceAssignment = require('./ComplianceAssignment');
const LiveClass = require('./LiveClass');
const Timetable = require('./Timetable');
const Notification = require('./Notification');
const Announcement = require('./Announcement');
const AuditLog = require('./AuditLog');
const ScormPackage = require('./ScormPackage');
const ScormTracking = require('./ScormTracking');
const CourseReview = require('./CourseReview');
const Message = require('./Message');

Tenant.hasOne(TenantSettings, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
TenantSettings.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

Tenant.hasOne(Institute, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Institute.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

Tenant.hasOne(Corporate, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Corporate.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

Tenant.hasMany(User, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

Tenant.hasMany(Department, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Department.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

Department.hasMany(AcademicProgram, { foreignKey: 'department_id', onDelete: 'CASCADE' });
AcademicProgram.belongsTo(Department, { foreignKey: 'department_id', onDelete: 'CASCADE' });

Tenant.hasMany(Course, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Course.belongsTo(Tenant, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });

User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });

Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'role_id' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permission_id' });

User.hasOne(Instructor, { foreignKey: 'user_id', constraints: false });
Instructor.belongsTo(User, { foreignKey: 'user_id', constraints: false });

User.hasOne(Learner, { foreignKey: 'user_id', constraints: false });
Learner.belongsTo(User, { foreignKey: 'user_id', constraints: false });

Tenant.hasMany(Instructor, { foreignKey: 'tenant_id', constraints: false });
Instructor.belongsTo(Tenant, { foreignKey: 'tenant_id', constraints: false });

Tenant.hasMany(Learner, { foreignKey: 'tenant_id', constraints: false });
Learner.belongsTo(Tenant, { foreignKey: 'tenant_id', constraints: false });

Department.hasMany(Instructor, { foreignKey: 'department_id', constraints: false });
Instructor.belongsTo(Department, { foreignKey: 'department_id', constraints: false });

Department.hasMany(Learner, { foreignKey: 'department_id', constraints: false });
Learner.belongsTo(Department, { foreignKey: 'department_id', constraints: false });

AcademicProgram.hasMany(Learner, { foreignKey: 'program_id', constraints: false });
Learner.belongsTo(AcademicProgram, { foreignKey: 'program_id', constraints: false });

User.hasOne(Employee, { foreignKey: 'user_id', constraints: false });
Employee.belongsTo(User, { foreignKey: 'user_id', constraints: false });

User.hasOne(Manager, { foreignKey: 'user_id', constraints: false });
Manager.belongsTo(User, { foreignKey: 'user_id', constraints: false });

Course.hasMany(Module, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Module.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });

Module.hasMany(Lesson, { foreignKey: 'module_id', onDelete: 'CASCADE' });
Lesson.belongsTo(Module, { foreignKey: 'module_id', onDelete: 'CASCADE' });

User.hasMany(Course, { foreignKey: 'instructor_id', as: 'courses', constraints: false });
Course.belongsTo(User, { foreignKey: 'instructor_id', as: 'instructor', constraints: false });

Tenant.hasMany(Enrollment, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
User.hasMany(Enrollment, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Course.hasMany(Enrollment, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Enrollment.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

Course.hasMany(Quiz, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Quiz.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quiz_id', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quiz_id', onDelete: 'CASCADE' });

Course.hasMany(Assignment, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Assignment.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignment_id', onDelete: 'CASCADE' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignment_id', onDelete: 'CASCADE' });

Tenant.hasMany(Transaction, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Tenant.hasMany(Certificate, { foreignKey: 'tenant_id', onDelete: 'CASCADE' });
Certificate.belongsTo(Course, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Certificate.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });

Tenant.hasMany(ScormPackage, { foreignKey: 'tenant_id', constraints: false });
ScormPackage.belongsTo(Tenant, { foreignKey: 'tenant_id', constraints: false });

Course.hasMany(ScormPackage, { foreignKey: 'course_id', constraints: false });
ScormPackage.belongsTo(Course, { foreignKey: 'course_id', constraints: false });

ScormPackage.hasMany(ScormTracking, { foreignKey: 'scorm_package_id', constraints: false });
ScormTracking.belongsTo(ScormPackage, { foreignKey: 'scorm_package_id', constraints: false });

User.hasMany(ScormTracking, { foreignKey: 'user_id', constraints: false });
ScormTracking.belongsTo(User, { foreignKey: 'user_id', constraints: false });

const { syncAllTables, provisionSchemaForType, provisionCoreSchema } = require('../services/schemaProvisioner');
const { seedRolesAndPermissions, assignRoleToUser } = require('../services/roleService');

async function initDatabase() {
  try {
    await ensureDatabaseExists();
    await sequelize.authenticate();
    console.log('[DB] Sequelize ORM connected to MySQL database.');
  } catch (err) {
    console.warn('[DB] Notice: Database connection:', err.message);
  }
}

module.exports = {
  sequelize,
  Tenant,
  TenantSettings,
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Institute,
  Corporate,
  Department,
  AcademicProgram,
  Learner,
  Instructor,
  Teacher,
  Employee,
  Manager,
  Team,
  CourseCategory,
  Course,
  Module,
  Lesson,
  CourseProgress,
  Enrollment,
  CorporateAssignment,
  Question,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Assignment,
  AssignmentSubmission,
  Certificate,
  CertificateVerification,
  Transaction,
  SkillCategory,
  Skill,
  EmployeeSkill,
  SkillGap,
  ComplianceCategory,
  ComplianceTraining,
  ComplianceAssignment,
  LiveClass,
  Timetable,
  Notification,
  Announcement,
  AuditLog,
  ScormPackage,
  ScormTracking,
  CourseReview,
  Message,
  provisionSchemaForType,
  provisionCoreSchema,
  initDatabase
};
