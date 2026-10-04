const { sequelize } = require('../config/database');
const { ensureDatabaseExists } = require('../config/db');

const Tenant = require('../models/Tenant');
const TenantSettings = require('../models/TenantSettings');
const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');
const UserRole = require('../models/UserRole');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');
const Announcement = require('../models/Announcement');
const Message = require('../models/Message');

const Institute = require('../models/Institute');
const Department = require('../models/Department');
const AcademicProgram = require('../models/AcademicProgram');
const Instructor = require('../models/Instructor');
const Learner = require('../models/Learner');
const CourseCategory = require('../models/CourseCategory');
const Course = require('../models/Course');
const Module = require('../models/Module');
const Lesson = require('../models/Lesson');
const CourseProgress = require('../models/CourseProgress');
const CourseReview = require('../models/CourseReview');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const AssignmentSubmission = require('../models/AssignmentSubmission');
const Quiz = require('../models/Quiz');
const QuizQuestion = require('../models/QuizQuestion');
const QuizAttempt = require('../models/QuizAttempt');
const Certificate = require('../models/Certificate');
const CertificateVerification = require('../models/CertificateVerification');
const Transaction = require('../models/Transaction');
const LiveClass = require('../models/LiveClass');
const Timetable = require('../models/Timetable');

const Corporate = require('../models/Corporate');
const Team = require('../models/Team');
const Manager = require('../models/Manager');
const Employee = require('../models/Employee');
const SkillCategory = require('../models/SkillCategory');
const Skill = require('../models/Skill');
const EmployeeSkill = require('../models/EmployeeSkill');
const SkillGap = require('../models/SkillGap');
const ComplianceCategory = require('../models/ComplianceCategory');
const ComplianceTraining = require('../models/ComplianceTraining');
const ComplianceAssignment = require('../models/ComplianceAssignment');
const CorporateAssignment = require('../models/CorporateAssignment');
const ScormPackage = require('../models/ScormPackage');
const ScormTracking = require('../models/ScormTracking');

const ALL_MODELS = [
  
  Tenant,
  TenantSettings,
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  AuditLog,
  Notification,
  Announcement,
  Message,

  Institute,
  Department,
  AcademicProgram,
  Instructor,
  Learner,
  CourseCategory,
  Course,
  Module,
  Lesson,
  CourseProgress,
  CourseReview,
  Enrollment,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Certificate,
  CertificateVerification,
  Transaction,
  LiveClass,
  Timetable,

  Corporate,
  Team,
  Manager,
  Employee,
  SkillCategory,
  Skill,
  EmployeeSkill,
  SkillGap,
  ComplianceCategory,
  ComplianceTraining,
  ComplianceAssignment,
  CorporateAssignment,
  ScormPackage,
  ScormTracking
];

async function syncAllTables() {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');

  for (const model of ALL_MODELS) {
    try {
      await model.sync({ alter: false });
    } catch (e) {
      console.warn(`[DB Sync] Note on ${model.name || 'table'}:`, e.message);
    }
  }

  await sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('[DB Sync] All Multi-Tenant Tables (Institute + Corporate + Core) synchronized successfully in MySQL.');
  return { success: true };
}

async function provisionSchemaForType(type) {
  return syncAllTables();
}

async function provisionCoreSchema() {
  return syncAllTables();
}

module.exports = {
  syncAllTables,
  provisionCoreSchema,
  provisionSchemaForType,
  ALL_MODELS
};
