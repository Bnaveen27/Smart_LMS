const Role = require('../models/Role');
const Permission = require('../models/Permission');
const RolePermission = require('../models/RolePermission');
const UserRole = require('../models/UserRole');
const User = require('../models/User');
const sequelize = require('../config/database');

const SYSTEM_ROLES = [
  {
    id: 'role-super-admin',
    code: 'SUPER_ADMIN',
    name: 'Super Administrator',
    description: 'Full global system control, tenant provisioning, subscription billing, and platform health monitoring.',
    is_system_role: true
  },
  {
    id: 'role-inst-admin',
    code: 'INSTITUTE_ADMIN',
    name: 'Institute Administrator',
    description: 'Academic ERP management, departments, faculty hiring, student admissions, and curriculum catalogs.',
    is_system_role: true
  },
  {
    id: 'role-instructor',
    code: 'INSTRUCTOR',
    name: 'Course Instructor / Faculty',
    description: 'Curriculum creation, lecture delivery, assignment evaluations, live doubt desks, and quiz authoring.',
    is_system_role: true
  },
  {
    id: 'role-learner',
    code: 'LEARNER',
    name: 'Academic Student / Learner',
    description: 'Course enrollment, video lecture playback, quiz taking, assignment submissions, and certificate generation.',
    is_system_role: true
  },
  {
    id: 'role-corp-admin',
    code: 'CORPORATE_ADMIN',
    name: 'Corporate Enterprise Admin',
    description: 'Organization structure, business unit setup, corporate seat allocations, and domain management.',
    is_system_role: true
  },
  {
    id: 'role-hr-admin',
    code: 'HR_ADMIN',
    name: 'HR & L&D Training Manager',
    description: 'Mandatory workforce training assignments, department compliance audits, and employee skill roadmaps.',
    is_system_role: true
  },
  {
    id: 'role-trainer',
    code: 'TRAINER',
    name: 'Corporate Workforce Trainer',
    description: 'Corporate skill training modules, workforce workshops, live coding sessions, and employee grading.',
    is_system_role: true
  },
  {
    id: 'role-employee',
    code: 'EMPLOYEE',
    name: 'Corporate Employee',
    description: 'Assigned mandatory training paths, skill certifications, and enterprise compliance tracking.',
    is_system_role: true
  }
];

const SYSTEM_PERMISSIONS = [
  
  { id: 'perm-tenants-read', module: 'tenants', action: 'read', code: 'tenants:read', description: 'View all tenant organizations' },
  { id: 'perm-tenants-create', module: 'tenants', action: 'create', code: 'tenants:create', description: 'Provision new tenant organizations' },
  { id: 'perm-tenants-update', module: 'tenants', action: 'update', code: 'tenants:update', description: 'Modify tenant configuration & branding' },
  { id: 'perm-tenants-delete', module: 'tenants', action: 'delete', code: 'tenants:delete', description: 'Remove tenant organizations' },

  { id: 'perm-users-read', module: 'users', action: 'read', code: 'users:read', description: 'View users roster' },
  { id: 'perm-users-create', module: 'users', action: 'create', code: 'users:create', description: 'Create and invite new users' },
  { id: 'perm-users-update', module: 'users', action: 'update', code: 'users:update', description: 'Edit user profiles and credentials' },
  { id: 'perm-users-delete', module: 'users', action: 'delete', code: 'users:delete', description: 'Delete users and revoke access' },
  { id: 'perm-roles-manage', module: 'users', action: 'manage_roles', code: 'roles:manage', description: 'Assign and modify user roles and permissions' },

  { id: 'perm-institute-read', module: 'institute', action: 'read', code: 'institute:read', description: 'View academic ERP stats and roster' },
  { id: 'perm-dept-manage', module: 'institute', action: 'manage_departments', code: 'departments:manage', description: 'Create and manage academic departments' },
  { id: 'perm-faculty-manage', module: 'institute', action: 'manage_faculty', code: 'faculty:manage', description: 'Invite and manage faculty members' },
  { id: 'perm-timetable-manage', module: 'institute', action: 'manage_timetable', code: 'timetable:manage', description: 'Schedule and manage academic lecture timetables' },

  { id: 'perm-corporate-read', module: 'corporate', action: 'read', code: 'corporate:read', description: 'View corporate enterprise overview' },
  { id: 'perm-units-manage', module: 'corporate', action: 'manage_units', code: 'units:manage', description: 'Manage corporate business units and divisions' },
  { id: 'perm-training-assign', module: 'corporate', action: 'assign_training', code: 'training:assign', description: 'Assign mandatory training paths to workforce' },
  { id: 'perm-compliance-audit', module: 'corporate', action: 'view_compliance', code: 'compliance:audit', description: 'View department compliance audit reports' },

  { id: 'perm-courses-read', module: 'courses', action: 'read', code: 'courses:read', description: 'View courses catalog' },
  { id: 'perm-courses-create', module: 'courses', action: 'create', code: 'courses:create', description: 'Create courses and lessons' },
  { id: 'perm-courses-update', module: 'courses', action: 'update', code: 'courses:update', description: 'Edit curriculum, lessons and media' },
  { id: 'perm-courses-delete', module: 'courses', action: 'delete', code: 'courses:delete', description: 'Delete courses' },
  { id: 'perm-courses-publish', module: 'courses', action: 'publish', code: 'courses:publish', description: 'Publish/Unpublish courses' },

  { id: 'perm-assess-create', module: 'assessments', action: 'create', code: 'assessments:create', description: 'Create quizzes and assignments' },
  { id: 'perm-assess-grade', module: 'assessments', action: 'grade', code: 'assessments:grade', description: 'Grade submissions and provide feedback' },
  { id: 'perm-assess-take', module: 'assessments', action: 'take', code: 'assessments:take', description: 'Take quizzes and submit assignments' },

  { id: 'perm-enroll-manage', module: 'enrollments', action: 'manage', code: 'enrollments:manage', description: 'Process and manage student enrollments' },
  { id: 'perm-certs-issue', module: 'certificates', action: 'issue', code: 'certificates:issue', description: 'Generate and verify completion certificates' }
];

const ROLE_PERMISSIONS_MAP = {
  SUPER_ADMIN: [
    'tenants:read', 'tenants:create', 'tenants:update', 'tenants:delete',
    'users:read', 'users:create', 'users:update', 'users:delete', 'roles:manage',
    'institute:read', 'departments:manage', 'faculty:manage', 'timetable:manage',
    'corporate:read', 'units:manage', 'training:assign', 'compliance:audit',
    'courses:read', 'courses:create', 'courses:update', 'courses:delete', 'courses:publish',
    'assessments:create', 'assessments:grade', 'assessments:take',
    'enrollments:manage', 'certificates:issue'
  ],
  INSTITUTE_ADMIN: [
    'users:read', 'users:create', 'users:update', 'users:delete',
    'institute:read', 'departments:manage', 'faculty:manage', 'timetable:manage',
    'courses:read', 'courses:create', 'courses:update', 'courses:delete', 'courses:publish',
    'assessments:create', 'assessments:grade',
    'enrollments:manage', 'certificates:issue'
  ],
  INSTRUCTOR: [
    'institute:read', 'timetable:manage',
    'courses:read', 'courses:create', 'courses:update', 'courses:publish',
    'assessments:create', 'assessments:grade', 'certificates:issue'
  ],
  LEARNER: [
    'courses:read', 'assessments:take'
  ],
  CORPORATE_ADMIN: [
    'users:read', 'users:create', 'users:update', 'users:delete',
    'corporate:read', 'units:manage', 'training:assign', 'compliance:audit',
    'courses:read', 'courses:create', 'courses:update',
    'certificates:issue'
  ],
  HR_ADMIN: [
    'users:read',
    'corporate:read', 'units:manage', 'training:assign', 'compliance:audit',
    'courses:read', 'certificates:issue'
  ],
  TRAINER: [
    'corporate:read', 'courses:read', 'courses:create', 'courses:update',
    'assessments:create', 'assessments:grade'
  ],
  EMPLOYEE: [
    'courses:read', 'assessments:take'
  ]
};

async function seedRolesAndPermissions() {
  try {
    
    for (const r of SYSTEM_ROLES) {
      const existing = await Role.findOne({ where: { code: r.code } });
      if (!existing) {
        await Role.create(r);
      } else {
        existing.name = r.name;
        existing.description = r.description;
        existing.is_system_role = true;
        await existing.save();
      }
    }

    for (const p of SYSTEM_PERMISSIONS) {
      const existing = await Permission.findOne({ where: { code: p.code } });
      if (!existing) {
        await Permission.create(p);
      } else {
        existing.module = p.module;
        existing.action = p.action;
        existing.description = p.description;
        await existing.save();
      }
    }

    for (const [roleCode, permCodes] of Object.entries(ROLE_PERMISSIONS_MAP)) {
      const role = await Role.findOne({ where: { code: roleCode } });
      if (role) {
        const perms = await Permission.findAll({ where: { code: permCodes } });
        for (const perm of perms) {
          const mappingExists = await RolePermission.findOne({
            where: { role_id: role.id, permission_id: perm.id }
          });
          if (!mappingExists) {
            await RolePermission.create({
              role_id: role.id,
              permission_id: perm.id
            });
          }
        }
      }
    }

    console.log('[Roles & Permissions] System roles and permissions synchronized with MySQL Database.');
    return { success: true };
  } catch (err) {
    console.error('Error seeding roles and permissions in DB:', err);
    throw err;
  }
}

async function assignRoleToUser(userId, roleCode) {
  try {
    const user = await User.findByPk(userId);
    if (!user) throw new Error(`User with ID ${userId} not found`);

    const role = await Role.findOne({ where: { code: roleCode.toUpperCase() } });
    if (!role) throw new Error(`Role with code ${roleCode} not found in database`);

    user.role = role.code;
    await user.save();

    const existing = await UserRole.findOne({
      where: { user_id: user.id, role_id: role.id }
    });

    if (!existing) {
      await UserRole.create({
        user_id: user.id,
        role_id: role.id
      });
    }

    return { success: true, user, role };
  } catch (err) {
    console.error(`Error assigning role ${roleCode} to user ${userId}:`, err);
    throw err;
  }
}

async function getUserRolesAndPermissions(userId) {
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Role,
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) return null;

    const permissions = new Set();
    if (user.Roles) {
      user.Roles.forEach(r => {
        if (r.Permissions) {
          r.Permissions.forEach(p => permissions.add(p.code));
        }
      });
    }

    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      primaryRole: user.role,
      roles: user.Roles || [],
      permissions: Array.from(permissions)
    };
  } catch (err) {
    console.error('Error fetching user roles and permissions:', err);
    throw err;
  }
}

module.exports = {
  SYSTEM_ROLES,
  SYSTEM_PERMISSIONS,
  seedRolesAndPermissions,
  assignRoleToUser,
  getUserRolesAndPermissions
};
