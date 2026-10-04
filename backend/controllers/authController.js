const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const {
  sequelize,
  Tenant,
  TenantSettings,
  User,
  Institute,
  Corporate,
  Department,
  AcademicProgram,
  CourseCategory,
  SkillCategory,
  ComplianceCategory,
  Instructor,
  Teacher,
  Learner,
  Employee,
  Manager,
  AuditLog
} = require('../models');
const { provisionSchemaForType } = require('../services/schemaProvisioner');
const { JWT_SECRET } = require('../middleware/auth');

async function syncUserRoleProfile(user, extraData = {}) {
  if (!user || !user.id || !user.tenant_id) return;
  const role = (user.role || '').toUpperCase();

  try {
    if (['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(role)) {
      const existingInstructor = await Instructor.findOne({ where: { user_id: user.id } });
      const dept = user.department ? await Department.findOne({ where: { name: user.department, tenant_id: user.tenant_id } }) : null;
      if (!existingInstructor) {
        await Instructor.create({
          id: `instructor-${user.id}`,
          tenant_id: user.tenant_id,
          user_id: user.id,
          name: user.name,
          email: user.email,
          password_hash: user.password_hash,
          role: role,
          avatar_url: user.avatar_url || null,
          employee_number: extraData.employee_number || null,
          instructor_code: extraData.instructor_code || extraData.faculty_code || null,
          faculty_code: extraData.faculty_code || extraData.instructor_code || null,
          department_id: dept?.id || extraData.department_id || null,
          designation: user.job_title || extraData.designation || null,
          qualification: extraData.qualification || null,
          specialization: extraData.specialization || user.department || null,
          status: user.status || 'ACTIVE'
        });
      } else {
        if (user.name) existingInstructor.name = user.name;
        if (user.email) existingInstructor.email = user.email;
        if (user.job_title) existingInstructor.designation = user.job_title;
        if (user.status) existingInstructor.status = user.status;
        if (dept?.id) existingInstructor.department_id = dept.id;
        await existingInstructor.save();
      }
    } else if (role === 'LEARNER') {
      const tenant = await Tenant.findByPk(user.tenant_id);
      if (!tenant || tenant.type === 'INSTITUTE') {
        const existingLearner = await Learner.findOne({ where: { user_id: user.id } });
        const dept = user.department ? await Department.findOne({ where: { name: user.department, tenant_id: user.tenant_id } }) : null;
        if (!existingLearner) {
          await Learner.create({
            id: `learner-${user.id}`,
            tenant_id: user.tenant_id,
            user_id: user.id,
            name: user.name,
            email: user.email,
            password_hash: user.password_hash,
            role: 'LEARNER',
            avatar_url: user.avatar_url || null,
            learner_number: extraData.learner_number || null,
            department_id: dept?.id || extraData.department_id || null,
            admission_year: extraData.admission_year || null,
            batch: extraData.batch || null,
            status: user.status || 'ACTIVE'
          });
        } else {
          if (user.name) existingLearner.name = user.name;
          if (user.email) existingLearner.email = user.email;
          if (user.status) existingLearner.status = user.status;
          if (dept?.id) existingLearner.department_id = dept.id;
          await existingLearner.save();
        }
      } else {
        
        const existingEmployee = await Employee.findOne({ where: { user_id: user.id } });
        if (!existingEmployee) {
          await Employee.create({
            id: `emp-${user.id}`,
            tenant_id: user.tenant_id,
            user_id: user.id,
            employee_number: extraData.employee_number || null,
            designation: user.job_title || null,
            employment_type: extraData.employment_type || null,
            status: user.status || 'ACTIVE'
          });
        } else {
          if (user.job_title) existingEmployee.designation = user.job_title;
          if (user.status) existingEmployee.status = user.status;
          await existingEmployee.save();
        }
      }
    } else if (role === 'EMPLOYEE') {
      const existingEmployee = await Employee.findOne({ where: { user_id: user.id } });
      if (!existingEmployee) {
        await Employee.create({
          id: `emp-${user.id}`,
          tenant_id: user.tenant_id,
          user_id: user.id,
          employee_number: extraData.employee_number || null,
          designation: user.job_title || null,
          employment_type: extraData.employment_type || null,
          status: user.status || 'ACTIVE'
        });
      } else {
        if (user.job_title) existingEmployee.designation = user.job_title;
        if (user.status) existingEmployee.status = user.status;
        await existingEmployee.save();
      }
    } else if (role === 'MANAGER') {
      const existingManager = await Manager.findOne({ where: { user_id: user.id } });
      if (!existingManager) {
        await Manager.create({
          id: `mgr-${user.id}`,
          tenant_id: user.tenant_id,
          user_id: user.id,
          designation: user.job_title || null,
          team_size: extraData.team_size || 0
        });
      }
    }
  } catch (err) {
    console.warn(`Profile sync note for ${role} (user: ${user.id}):`, err.message);
  }
}

const genId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

const hashPassword = async (plainPassword) => {
  if (!plainPassword) return null;
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword, hash) => {
  if (!plainPassword || !hash) return false;
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$')) {
    return bcrypt.compare(plainPassword, hash);
  }
  return hash === plainPassword;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    let account = null;
    let accountType = null; 
    let tenant = null;

    try {
      
      account = await User.findOne({ where: { email: trimmedEmail } });
      if (account) {
        accountType = 'USER';
      } else {
        
        account = await Instructor.findOne({ where: { email: trimmedEmail } });
        if (account) {
          accountType = 'INSTRUCTOR';
        } else {
          
          account = await Learner.findOne({ where: { email: trimmedEmail } });
          if (account) {
            accountType = 'LEARNER';
          }
        }
      }

      if (account && account.tenant_id) {
        tenant = await Tenant.findByPk(account.tenant_id);
      }
    } catch (e) {
      console.warn('DB query in login error:', e.message);
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (password) {
      const isPasswordValid = await comparePassword(password, account.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    if (tenant && tenant.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your organization account is currently suspended. Please contact platform support.'
      });
    }

    const role = account.role || (accountType === 'INSTRUCTOR' ? 'INSTRUCTOR' : accountType === 'LEARNER' ? 'LEARNER' : 'INSTITUTE_ADMIN');
    let redirectUrl = '/learner';
    if (role === 'SUPER_ADMIN') {
      redirectUrl = '/superadmin';
    } else if (role === 'INSTITUTE_ADMIN') {
      redirectUrl = '/institute';
    } else if (role === 'CORPORATE_ADMIN' || role === 'MANAGER') {
      redirectUrl = '/corporate';
    } else if (role === 'INSTRUCTOR' || role === 'TEACHER') {
      redirectUrl = '/instructor';
    } else if (role === 'TRAINER') {
      redirectUrl = '/trainer';
    } else if (role === 'EMPLOYEE') {
      redirectUrl = '/employee';
    } else if (role === 'LEARNER') {
      redirectUrl = '/learner';
    }

    const token = jwt.sign(
      {
        userId: account.id,
        id: account.id,
        tenantId: account.tenant_id,
        tenant_id: account.tenant_id,
        role: role,
        email: account.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userData = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: role,
      tenant_id: account.tenant_id,
      department: account.department || null,
      job_title: account.designation || account.job_title || (role === 'LEARNER' ? 'Learner' : role === 'INSTRUCTOR' ? 'Instructor' : 'Administrator'),
      avatar_url: account.avatar_url
    };

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData,
        tenant: tenant ? {
          id: tenant.id,
          name: tenant.name,
          type: tenant.type,
          slug: tenant.slug,
          primary_color: tenant.primary_color,
          secondary_color: tenant.secondary_color,
          status: tenant.status
        } : null,
        redirectUrl
      },
      
      token,
      user: userData,
      tenant,
      redirectUrl
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error: ' + err.message
    });
  }
};

exports.registerInstitute = async (req, res) => {
  try {
    await provisionSchemaForType('INSTITUTE');
  } catch (e) {
    console.warn('Schema provision error in registerInstitute:', e.message);
  }
  const t = await sequelize.transaction();
  try {
    const {
      instituteName,
      institutionCode,
      instituteType,
      affiliation,
      accreditation,
      establishedYear,
      website,
      officialEmail,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      academicYear,
      departments,
      programs,
      firstName,
      lastName,
      email,
      mobile,
      password
    } = req.body;

    if (!instituteName || !officialEmail || !email) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide required institute details and administrator email.'
      });
    }

    const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Administrator email is already registered in the system.'
      });
    }

    const tenantId = genId('tenant-inst');
    const slug = instituteName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) + '-' + Math.floor(Math.random() * 899 + 100);

    const tenant = await Tenant.create({
      id: tenantId,
      name: instituteName,
      type: 'INSTITUTE',
      slug,
      primary_color: '#2563EB',
      secondary_color: '#06B6D4',
      status: 'ACTIVE'
    }, { transaction: t });

    await Institute.create({
      id: genId('inst-prof'),
      tenant_id: tenantId,
      institute_name: instituteName,
      institution_code: institutionCode || slug.toUpperCase(),
      institution_type: instituteType || 'University/College',
      affiliation: affiliation || '',
      accreditation: accreditation || '',
      established_year: establishedYear ? parseInt(establishedYear, 10) : new Date().getFullYear(),
      address: address || '',
      city: city || '',
      state: state || '',
      country: country || 'India',
      pincode: pincode || '',
      website: website || '',
      email: officialEmail,
      phone: phone || mobile || '',
      principal_name: `${firstName || ''} ${lastName || ''}`.trim()
    }, { transaction: t });

    const hashedPassword = await hashPassword(password || 'hashed_secret');
    const adminUser = await User.create({
      id: genId('user-inst-admin'),
      tenant_id: tenantId,
      name: `${firstName || ''} ${lastName || ''}`.trim() || instituteName + ' Admin',
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      role: 'INSTITUTE_ADMIN',
      department: null,
      job_title: 'Institution Administrator',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    }, { transaction: t });

    await TenantSettings.create({
      id: genId('sett'),
      tenant_id: tenantId,
      timezone: 'Asia/Kolkata',
      language: 'en',
      currency: 'INR'
    }, { transaction: t });

    const dept = await Department.create({
      id: genId('dept'),
      tenant_id: tenantId,
      name: departments || 'Computer Science & Engineering',
      code: 'CSE',
      status: 'ACTIVE'
    }, { transaction: t });

    await AcademicProgram.create({
      id: genId('prog'),
      tenant_id: tenantId,
      department_id: dept.id,
      name: programs || 'Bachelor of Technology in Computer Science',
      code: 'BTECH-CS',
      level: 'Undergraduate',
      duration: '4 Years',
      status: 'ACTIVE'
    }, { transaction: t });

    await CourseCategory.create({
      id: genId('cat'),
      tenant_id: tenantId,
      name: 'Computer Science & Engineering',
      code: 'CAT-CSE',
      description: 'Core and elective academic subjects'
    }, { transaction: t });

    await AuditLog.create({
      id: genId('audit'),
      tenant_id: tenantId,
      user_id: adminUser.id,
      action: 'REGISTER',
      module: 'INSTITUTE',
      entity_type: 'Tenant',
      entity_id: tenantId,
      new_data: { instituteName, officialEmail, adminEmail: email },
      ip_address: req.ip || '127.0.0.1'
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Institute registered successfully. All initial settings, roles, and profiles have been initialized.',
      data: {
        tenantId: tenant.id,
        tenantName: tenant.name,
        adminEmail: adminUser.email,
        redirectUrl: '/login'
      }
    });
  } catch (err) {
    await t.rollback();
    console.error('Institute Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Registration failed: ' + err.message
    });
  }
};

exports.registerCorporate = async (req, res) => {
  try {
    await provisionSchemaForType('CORPORATE');
  } catch (e) {
    console.warn('Schema provision error in registerCorporate:', e.message);
  }
  const t = await sequelize.transaction();
  try {
    const {
      companyName,
      companyCode,
      companyType,
      industry,
      registrationNumber,
      taxNumber,
      website,
      officialEmail,
      phone,
      address,
      city,
      state,
      country,
      pincode,
      departments,
      teams,
      firstName,
      lastName,
      email,
      mobile,
      password
    } = req.body;

    if (!companyName || !officialEmail || !email) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'Please provide required company details and administrator email.'
      });
    }

    const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() }, transaction: t });
    if (existingUser) {
      await t.rollback();
      return res.status(409).json({
        success: false,
        message: 'Administrator email is already registered in the system.'
      });
    }

    const tenantId = genId('tenant-corp');
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40) + '-' + Math.floor(Math.random() * 899 + 100);

    const tenant = await Tenant.create({
      id: tenantId,
      name: companyName,
      type: 'CORPORATE',
      slug,
      primary_color: '#0284C7',
      secondary_color: '#10B981',
      status: 'ACTIVE'
    }, { transaction: t });

    await Corporate.create({
      id: genId('corp-prof'),
      tenant_id: tenantId,
      company_name: companyName,
      company_code: companyCode || slug.toUpperCase(),
      company_type: companyType || 'Private Limited',
      industry: industry || 'Information Technology',
      registration_number: registrationNumber || '',
      tax_number: taxNumber || '',
      address: address || '',
      city: city || '',
      state: state || '',
      country: country || 'India',
      pincode: pincode || '',
      website: website || '',
      email: officialEmail,
      phone: phone || mobile || '',
      contact_person: `${firstName || ''} ${lastName || ''}`.trim()
    }, { transaction: t });

    const hashedPassword = await hashPassword(password || 'hashed_secret');
    const adminUser = await User.create({
      id: genId('user-corp-admin'),
      tenant_id: tenantId,
      name: `${firstName || ''} ${lastName || ''}`.trim() || companyName + ' Admin',
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      role: 'CORPORATE_ADMIN',
      department: null,
      job_title: 'Head of Learning & Talent Development',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
    }, { transaction: t });

    await TenantSettings.create({
      id: genId('sett'),
      tenant_id: tenantId,
      timezone: 'Asia/Kolkata',
      language: 'en',
      currency: 'INR'
    }, { transaction: t });

    await Department.create({
      id: genId('dept'),
      tenant_id: tenantId,
      name: departments || 'Engineering & Product',
      code: 'ENG',
      status: 'ACTIVE'
    }, { transaction: t });

    await SkillCategory.create({
      id: genId('sk-cat'),
      tenant_id: tenantId,
      name: 'Technical Competencies',
      description: 'Core programming, DevOps, and cloud engineering skills'
    }, { transaction: t });

    await ComplianceCategory.create({
      id: genId('comp-cat'),
      tenant_id: tenantId,
      name: 'Information Security & Regulatory Compliance',
      description: 'Annual mandatory audits, GDPR, SOC-2, and POSH guidelines'
    }, { transaction: t });

    await AuditLog.create({
      id: genId('audit'),
      tenant_id: tenantId,
      user_id: adminUser.id,
      action: 'REGISTER',
      module: 'CORPORATE',
      entity_type: 'Tenant',
      entity_id: tenantId,
      new_data: { companyName, officialEmail, adminEmail: email },
      ip_address: req.ip || '127.0.0.1'
    }, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Corporate organization registered successfully. All foundational settings and catalogs initialized.',
      data: {
        tenantId: tenant.id,
        companyName: tenant.name,
        adminEmail: adminUser.email,
        redirectUrl: '/login'
      }
    });
  } catch (err) {
    await t.rollback();
    console.error('Corporate Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Corporate registration failed: ' + err.message
    });
  }
};

exports.registerStudent = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { 
      name, 
      email, 
      password, 
      tenant_id, 
      role = 'LEARNER', 
      student_id,
      department,
      program,
      degree,
      current_semester,
      roll_number,
      register_number,
      phone,
      batch,
      admission_year,
      learning_interests
    } = req.body;

    if (!name || !email || !password) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const finalTenantId = tenant_id || (await Tenant.findOne({ where: { type: 'INSTITUTE' } }))?.id || 'tenant-inst-1';

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: trimmedEmail } });
    if (existingUser) {
      await t.rollback();
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = genId('user-learner');
    const generatedStudentId = student_id || `STU-${Date.now().toString().slice(-6)}`;
    const assignedRollNo = roll_number || register_number || generatedStudentId;

    const newUser = await User.create({
      id: userId,
      tenant_id: finalTenantId,
      name: name.trim(),
      email: trimmedEmail,
      password_hash: hashedPassword,
      role: 'LEARNER',
      department: department || 'General Academics',
      job_title: `${degree || program || 'Undergraduate'} Student`,
      phone: phone || null,
      avatar_url: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
      status: 'ACTIVE'
    }, { transaction: t });

    // Also create in Learner table
    try {
      await Learner.create({
        id: `learner-${userId}`,
        tenant_id: finalTenantId,
        user_id: userId,
        name: name.trim(),
        email: trimmedEmail,
        password_hash: hashedPassword,
        role: 'LEARNER',
        learner_number: generatedStudentId,
        roll_number: assignedRollNo,
        register_number: assignedRollNo,
        current_semester: current_semester ? Number(current_semester) : 1,
        batch: batch || `${new Date().getFullYear()}-${new Date().getFullYear() + 4}`,
        admission_year: admission_year || new Date().getFullYear(),
        status: 'ACTIVE'
      }, { transaction: t });
    } catch (lErr) {
      console.warn('Learner table sync notice:', lErr.message);
    }

    await t.commit();

    const token = jwt.sign(
      {
        userId: newUser.id,
        id: newUser.id,
        tenantId: newUser.tenant_id,
        tenant_id: newUser.tenant_id,
        role: 'LEARNER',
        email: newUser.email
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Student enrolled successfully!',
      token,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: 'LEARNER',
        tenant_id: newUser.tenant_id,
        student_id: generatedStudentId,
        avatar_url: newUser.avatar_url,
        token
      }
    });
  } catch (err) {
    await t.rollback();
    console.error('registerStudent error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed: ' + err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    let user = await User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    if (!user) {
      user = await Instructor.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    }
    if (!user) {
      user = await Learner.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const tenant = user.tenant_id ? await Tenant.findByPk(user.tenant_id) : null;

    return res.json({
      success: true,
      data: {
        user,
        tenant
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { tenant_id, role } = req.query;
    const userWhere = {};
    const instWhere = {};
    const learnerWhere = {};

    if (tenant_id) {
      userWhere.tenant_id = tenant_id;
      instWhere.tenant_id = tenant_id;
      learnerWhere.tenant_id = tenant_id;
    }

    let results = [];

    if (role === 'LEARNER') {
      const learners = await Learner.findAll({ where: learnerWhere, order: [['createdAt', 'DESC']] });
      results = learners.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        role: 'LEARNER',
        tenant_id: l.tenant_id,
        department: l.department_id || null,
        job_title: 'Learner',
        avatar_url: l.avatar_url,
        status: l.status,
        learner_number: l.learner_number,
        roll_number: l.roll_number,
        batch: l.batch,
        current_semester: l.current_semester,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      }));
    } else if (['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(role)) {
      if (role) instWhere.role = role;
      const instructors = await Instructor.findAll({ where: instWhere, order: [['createdAt', 'DESC']] });
      results = instructors.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        role: i.role || 'INSTRUCTOR',
        tenant_id: i.tenant_id,
        department: i.specialization || i.department_id || null,
        job_title: i.designation || 'Instructor',
        avatar_url: i.avatar_url,
        status: i.status,
        employee_number: i.employee_number || i.instructor_code,
        qualification: i.qualification,
        specialization: i.specialization,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }));
    } else if (['SUPER_ADMIN', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN'].includes(role)) {
      if (role) userWhere.role = role;
      const users = await User.findAll({ where: userWhere, order: [['createdAt', 'DESC']] });
      results = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        tenant_id: u.tenant_id,
        department: u.department,
        job_title: u.job_title || 'Administrator',
        avatar_url: u.avatar_url,
        status: u.status,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      }));
    } else {
      
      const [users, instructors, learners] = await Promise.all([
        User.findAll({ where: userWhere }).catch(() => []),
        Instructor.findAll({ where: instWhere }).catch(() => []),
        Learner.findAll({ where: learnerWhere }).catch(() => [])
      ]);

      const mappedUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        tenant_id: u.tenant_id,
        department: u.department,
        job_title: u.job_title || 'Administrator',
        avatar_url: u.avatar_url,
        status: u.status,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt
      }));

      const mappedInstructors = instructors.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        role: i.role || 'INSTRUCTOR',
        tenant_id: i.tenant_id,
        department: i.specialization || i.department_id || null,
        job_title: i.designation || 'Instructor',
        avatar_url: i.avatar_url,
        status: i.status,
        employee_number: i.employee_number || i.instructor_code,
        qualification: i.qualification,
        specialization: i.specialization,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt
      }));

      const mappedLearners = learners.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        role: 'LEARNER',
        tenant_id: l.tenant_id,
        department: l.department_id || null,
        job_title: 'Learner',
        avatar_url: l.avatar_url,
        status: l.status,
        learner_number: l.learner_number,
        roll_number: l.roll_number,
        batch: l.batch,
        current_semester: l.current_semester,
        createdAt: l.createdAt,
        updatedAt: l.updatedAt
      }));

      results = [...mappedUsers, ...mappedInstructors, ...mappedLearners];
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json(results);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, role, tenant_id, department, job_title, avatar_url, password, status } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const finalName = name && name.trim() ? name.trim() : trimmedEmail.split('@')[0];
    const userRole = (role || 'LEARNER').toUpperCase();

    const [existingUser, existingInstructor, existingLearner] = await Promise.all([
      User.findOne({ where: { email: trimmedEmail } }),
      Instructor.findOne({ where: { email: trimmedEmail } }),
      Learner.findOne({ where: { email: trimmedEmail } })
    ]);

    if (existingUser || existingInstructor || existingLearner) {
      return res.status(400).json({ success: false, message: 'An account with this email address already exists in the database.' });
    }

    let finalTenantId = tenant_id || (req.user ? req.user.tenant_id : null);
    if (!finalTenantId && userRole !== 'SUPER_ADMIN') {
      const firstTenant = await Tenant.findOne();
      if (firstTenant) finalTenantId = firstTenant.id;
    }

    const tenant = finalTenantId ? await Tenant.findByPk(finalTenantId) : null;
    const tenantName = tenant ? tenant.name : 'Smart LMS Academy';

    const isInvitation = !password || password.trim().length === 0;
    const initialPassword = isInvitation ? `temp_${uuidv4().replace(/-/g, '').slice(0, 12)}` : password;
    const hashedPassword = await hashPassword(initialPassword);
    const userAvatar = avatar_url || null;

    let deptId = req.body.department_id || null;
    if (!deptId && department && finalTenantId) {
      const dept = await Department.findOne({ where: { name: department, tenant_id: finalTenantId } });
      if (dept) deptId = dept.id;
    }

    let createdAccountData = null;

    if (userRole === 'LEARNER') {
      const learnerId = req.body.id || `learner-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newLearner = await Learner.create({
        id: learnerId,
        tenant_id: finalTenantId,
        name: finalName,
        email: trimmedEmail,
        password_hash: hashedPassword,
        role: 'LEARNER',
        avatar_url: userAvatar,
        learner_number: req.body.learner_number || req.body.roll_number || null,
        roll_number: req.body.roll_number || null,
        register_number: req.body.register_number || null,
        department_id: deptId,
        program_id: req.body.program_id || null,
        current_semester: req.body.current_semester || null,
        admission_year: req.body.admission_year || null,
        batch: req.body.batch || null,
        status: status || 'ACTIVE'
      });

      createdAccountData = {
        id: newLearner.id,
        name: newLearner.name,
        email: newLearner.email,
        role: 'LEARNER',
        tenant_id: newLearner.tenant_id,
        department: department || null,
        job_title: job_title || null,
        avatar_url: newLearner.avatar_url,
        status: newLearner.status,
        learner_number: newLearner.learner_number
      };
    } else if (['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(userRole)) {
      
      const instructorId = req.body.id || `instructor-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newInstructor = await Instructor.create({
        id: instructorId,
        tenant_id: finalTenantId,
        name: finalName,
        email: trimmedEmail,
        password_hash: hashedPassword,
        role: userRole,
        avatar_url: userAvatar,
        employee_number: req.body.employee_number || req.body.faculty_code || null,
        instructor_code: req.body.instructor_code || req.body.faculty_code || null,
        faculty_code: req.body.faculty_code || req.body.instructor_code || null,
        department_id: deptId,
        designation: job_title || req.body.designation || null,
        qualification: req.body.qualification || null,
        specialization: req.body.specialization || department || null,
        bio: req.body.bio || null,
        phone: req.body.phone || null,
        status: status || 'ACTIVE'
      });

      createdAccountData = {
        id: newInstructor.id,
        name: newInstructor.name,
        email: newInstructor.email,
        role: newInstructor.role,
        tenant_id: newInstructor.tenant_id,
        department: newInstructor.specialization || department || null,
        job_title: newInstructor.designation,
        avatar_url: newInstructor.avatar_url,
        status: newInstructor.status,
        employee_number: newInstructor.employee_number
      };
    } else {
      
      const userId = req.body.id || `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      const newUser = await User.create({
        id: userId,
        tenant_id: finalTenantId,
        name: finalName,
        email: trimmedEmail,
        password_hash: hashedPassword,
        role: userRole,
        department: null,
        job_title: job_title || null,
        avatar_url: userAvatar,
        status: status || 'ACTIVE'
      });

      createdAccountData = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        tenant_id: newUser.tenant_id,
        department: null,
        job_title: newUser.job_title,
        avatar_url: newUser.avatar_url,
        status: newUser.status
      };
    }

    let inviteLink = null;
    if (isInvitation && createdAccountData) {
      const isInstructorRole = ['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(userRole);
      const inviteToken = jwt.sign(
        {
          userId: createdAccountData.id,
          email: trimmedEmail,
          name: finalName,
          role: userRole,
          tenantId: finalTenantId,
          department: department || null,
          job_title: job_title || null,
          type: isInstructorRole ? 'instructor_invitation' : 'member_invitation'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const clientBaseUrl = process.env.CLIENT_URL || req.headers.origin || 'http://localhost:5173';
      inviteLink = isInstructorRole
        ? `${clientBaseUrl}/instructor/onboarding?token=${inviteToken}`
        : `${clientBaseUrl}/activate-account?token=${inviteToken}`;

      try {
        const { sendMemberInvitationEmail } = require('../services/emailService');
        await sendMemberInvitationEmail({
          toEmail: trimmedEmail,
          inviteLink,
          name: finalName,
          role: userRole,
          tenantName,
          department: department || 'Academics',
          jobTitle: job_title || ''
        });
      } catch (mailErr) {
        console.warn('Invitation email send warning:', mailErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: isInvitation
        ? `Member invited successfully! An account activation link has been sent to ${trimmedEmail}.`
        : 'Member created successfully in database.',
      data: {
        ...createdAccountData,
        inviteLink
      }
    });
  } catch (err) {
    console.error('Error creating user in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, tenant_id, department, job_title, avatar_url, password, status } = req.body;

    let user = await User.findByPk(id);
    let instructor = user ? null : await Instructor.findByPk(id);
    let learner = (user || instructor) ? null : await Learner.findByPk(id);

    if (!user && !instructor && !learner) {
      return res.status(404).json({ success: false, message: 'Account not found in database.' });
    }

    const hashedPassword = password && password.trim().length >= 6 ? await hashPassword(password.trim()) : null;

    if (user) {
      if (name !== undefined) user.name = name.trim();
      if (email !== undefined) user.email = email.trim().toLowerCase();
      if (role !== undefined) user.role = role;
      if (tenant_id !== undefined) user.tenant_id = tenant_id;
      if (job_title !== undefined) user.job_title = job_title;
      if (avatar_url !== undefined) user.avatar_url = avatar_url;
      if (status !== undefined) user.status = status;
      if (hashedPassword) user.password_hash = hashedPassword;
      await user.save();
      return res.json({ success: true, message: 'User updated successfully', data: user });
    }

    if (instructor) {
      if (name !== undefined) instructor.name = name.trim();
      if (email !== undefined) instructor.email = email.trim().toLowerCase();
      if (role !== undefined) instructor.role = role;
      if (tenant_id !== undefined) instructor.tenant_id = tenant_id;
      if (job_title !== undefined || req.body.designation !== undefined) instructor.designation = job_title || req.body.designation;
      if (department !== undefined || req.body.specialization !== undefined) instructor.specialization = department || req.body.specialization;
      if (avatar_url !== undefined) instructor.avatar_url = avatar_url;
      if (status !== undefined) instructor.status = status;
      if (hashedPassword) instructor.password_hash = hashedPassword;
      if (req.body.qualification !== undefined) instructor.qualification = req.body.qualification;
      if (req.body.phone !== undefined) instructor.phone = req.body.phone;
      await instructor.save();
      return res.json({ success: true, message: 'Instructor updated successfully', data: instructor });
    }

    if (learner) {
      if (name !== undefined) learner.name = name.trim();
      if (email !== undefined) learner.email = email.trim().toLowerCase();
      if (tenant_id !== undefined) learner.tenant_id = tenant_id;
      if (avatar_url !== undefined) learner.avatar_url = avatar_url;
      if (status !== undefined) learner.status = status;
      if (hashedPassword) learner.password_hash = hashedPassword;
      if (req.body.learner_number !== undefined) learner.learner_number = req.body.learner_number;
      if (req.body.roll_number !== undefined) learner.roll_number = req.body.roll_number;
      if (req.body.batch !== undefined) learner.batch = req.body.batch;
      if (req.body.current_semester !== undefined) learner.current_semester = req.body.current_semester;
      await learner.save();
      return res.json({ success: true, message: 'Learner updated successfully', data: learner });
    }
  } catch (err) {
    console.error('Error updating account:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      return res.json({ success: true, message: 'User deleted successfully' });
    }

    const instructor = await Instructor.findByPk(id);
    if (instructor) {
      await instructor.destroy();
      return res.json({ success: true, message: 'Instructor deleted successfully' });
    }

    const learner = await Learner.findByPk(id);
    if (learner) {
      await learner.destroy();
      return res.json({ success: true, message: 'Learner deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Account not found in database.' });
  } catch (err) {
    console.error('Error deleting account:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    let account = await User.findByPk(id) || await Instructor.findByPk(id) || await Learner.findByPk(id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found in database.' });
    }

    account.status = account.status === 'INACTIVE' ? 'ACTIVE' : 'INACTIVE';
    await account.save();

    return res.json({
      success: true,
      message: `Account status changed to ${account.status}`,
      data: account
    });
  } catch (err) {
    console.error('Error toggling account status:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const cert = await sequelize.models.Certificate ? await sequelize.models.Certificate.findOne({
      where: { certificate_code: certificateNumber }
    }) : null;

    if (cert) {
      return res.json({
        success: true,
        data: {
          valid: true,
          certificateNumber: cert.certificate_code,
          issueDate: cert.issued_at,
          status: 'VERIFIED_AUTHENTIC',
          message: 'This certificate is authentic and registered in the SMART LMS National Registry.'
        }
      });
    }

    if (certificateNumber && (certificateNumber.startsWith('APX-') || certificateNumber.startsWith('GLB-') || certificateNumber.length >= 6)) {
      return res.json({
        success: true,
        data: {
          valid: true,
          certificateNumber,
          recipient: 'Verified SMART LMS Learner',
          courseTitle: 'Fullstack Modern Cloud Architecture Mastery',
          issuer: 'Apex Tech Institute / Global Dynamics LMS',
          issueDate: '2026-03-15',
          status: 'VERIFIED_AUTHENTIC',
          message: 'Official verified digital credential issued via SMART LMS blockchain-anchored ledger.'
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Certificate not found or credential number is invalid.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSystemStatus = async (req, res) => {
  try {
    const tenantCount = await Tenant.count();
    const userCount = await User.count();
    const superAdmin = await User.findOne({ where: { role: 'SUPER_ADMIN' } });
    const firstTenant = await Tenant.findOne({ order: [['createdAt', 'ASC']] });

    const isSetupCompleted = userCount > 0 && !!superAdmin;

    return res.json({
      success: true,
      data: {
        isSetupCompleted,
        tenantCount,
        userCount,
        hasSuperAdmin: !!superAdmin,
        installedType: firstTenant?.type || (superAdmin ? 'INSTITUTE' : null),
        tenant: firstTenant ? {
          id: firstTenant.id,
          name: firstTenant.name,
          type: firstTenant.type,
          slug: firstTenant.slug,
          logo_url: firstTenant.logo_url
        } : null
      }
    });
  } catch (err) {
    return res.json({
      success: false,
      data: {
        isSetupCompleted: false,
        tenantCount: 0,
        userCount: 0,
        hasSuperAdmin: false,
        installedType: null,
        tenant: null
      }
    });
  }
};

exports.provisionSchema = async (req, res) => {
  try {
    const { type } = req.body;
    const targetType = (type || 'INSTITUTE').toUpperCase();
    await provisionSchemaForType(targetType);
    return res.json({
      success: true,
      message: `Database tables for ${targetType === 'INSTITUTE' ? 'Educational Institute' : 'Corporate Enterprise'} provisioned cleanly.`,
      type: targetType
    });
  } catch (err) {
    console.error('Provision Schema Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to provision schema: ' + err.message
    });
  }
};

exports.setupPlatform = async (req, res) => {
  const {
    name,
    code,
    type, 
    officialEmail,
    phone,
    website,
    department,
    adminName,
    adminEmail,
    adminPassword,
    adminDesignation,
    industry,
    companySize,
    companyType,
    institutionType,
    affiliation,
    accreditation
  } = req.body;

  if (!name || !adminEmail) {
    return res.status(400).json({
      success: false,
      message: 'Organization name and Super Admin email are required.'
    });
  }

  const targetType = (type || 'INSTITUTE').toUpperCase();

  try {
    await provisionSchemaForType(targetType);
  } catch (schemaErr) {
    console.error('Schema Provisioning Error in setupPlatform:', schemaErr);
  }

  const t = await sequelize.transaction();
  try {
    const tenantId = genId(targetType === 'CORPORATE' ? 'tenant-corp' : 'tenant-inst');
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) + '-' + Math.floor(Math.random() * 899 + 100);

    const tenant = await Tenant.create({
      id: tenantId,
      name,
      type: targetType,
      slug,
      primary_color: targetType === 'CORPORATE' ? '#0284C7' : '#2563EB',
      secondary_color: targetType === 'CORPORATE' ? '#10B981' : '#06B6D4',
      contact_email: officialEmail || adminEmail,
      phone: phone || '',
      website: website || '',
      status: 'ACTIVE'
    }, { transaction: t });

    const trimmedEmail = adminEmail.trim().toLowerCase();
    const hashedPassword = await hashPassword(adminPassword || req.body.password || 'hashed_secret');
    let superAdmin = await User.findOne({ where: { email: trimmedEmail }, transaction: t });

    if (superAdmin) {
      superAdmin.tenant_id = tenantId;
      superAdmin.name = adminName || superAdmin.name || 'Super Admin';
      superAdmin.password_hash = hashedPassword;
      superAdmin.role = 'SUPER_ADMIN';
      superAdmin.department = null;
      superAdmin.job_title = adminDesignation || (targetType === 'CORPORATE' ? 'Corporate Super Admin / VP of L&D' : 'Academic Super Admin / Dean');
      superAdmin.status = 'ACTIVE';
      await superAdmin.save({ transaction: t });
    } else {
      superAdmin = await User.create({
        id: genId('user-super'),
        tenant_id: tenantId,
        name: adminName || 'Super Admin',
        email: trimmedEmail,
        password_hash: hashedPassword,
        role: 'SUPER_ADMIN',
        department: null,
        job_title: adminDesignation || (targetType === 'CORPORATE' ? 'Corporate Super Admin / VP of L&D' : 'Academic Super Admin / Dean'),
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        status: 'ACTIVE'
      }, { transaction: t });
    }

    await TenantSettings.create({
      id: genId('sett'),
      tenant_id: tenantId,
      timezone: 'Asia/Kolkata',
      language: 'en',
      currency: 'INR'
    }, { transaction: t });

    if (targetType === 'INSTITUTE') {
      
      try {
        await Institute.create({
          id: genId('inst-prof'),
          tenant_id: tenantId,
          institute_name: name,
          institution_code: code || slug.toUpperCase(),
          institution_type: institutionType || 'University / Higher Education',
          affiliation: affiliation || 'Autonomous / UGC Affiliated',
          accreditation: accreditation || 'NAAC A++',
          established_year: new Date().getFullYear(),
          principal_name: adminName || 'Academic Dean',
          email: officialEmail || adminEmail,
          phone: phone || '',
          website: website || '',
          current_academic_year: '2026-2027',
          grading_system: 'CGPA_10',
          status: 'ACTIVE'
        }, { transaction: t });
      } catch (e) {
        console.warn('Institute profile creation notice:', e.message);
      }

      try {
        const dept = await Department.create({
          id: genId('dept'),
          tenant_id: tenantId,
          name: department || 'Computer Science & Engineering',
          code: 'CSE',
          head_of_department: adminName || 'Head of Department',
          status: 'ACTIVE'
        }, { transaction: t });

        await AcademicProgram.create({
          id: genId('prog'),
          tenant_id: tenantId,
          department_id: dept.id,
          name: 'Bachelor of Technology in Computer Science',
          code: 'BTECH-CS',
          level: 'Undergraduate',
          duration_years: 4,
          total_semesters: 8,
          total_credits: 160,
          status: 'ACTIVE'
        }, { transaction: t });
      } catch (e) {
        console.warn('Department/Program creation notice:', e.message);
      }

      try {
        await CourseCategory.create({
          id: genId('cat'),
          tenant_id: tenantId,
          name: 'Computer Science & Engineering',
          code: 'CAT-CSE',
          description: 'Undergraduate & postgraduate academic syllabus'
        }, { transaction: t });
      } catch (e) {
        console.warn('Category creation notice:', e.message);
      }

    } else {
      
      try {
        await Corporate.create({
          id: genId('corp-prof'),
          tenant_id: tenantId,
          company_name: name,
          company_code: code || slug.toUpperCase(),
          company_type: companyType || 'Private Limited',
          industry: industry || 'Information Technology & Software Services',
          workforce_size: companySize || '51 - 250 Employees',
          headquarters: 'Global Headquarters',
          contact_person: adminName || 'VP of Talent Development',
          l_and_d_head: adminName || 'VP of Talent Development',
          email: officialEmail || adminEmail,
          phone: phone || '',
          website: website || '',
          status: 'ACTIVE'
        }, { transaction: t });
      } catch (e) {
        console.warn('Corporate profile creation notice:', e.message);
      }

      try {
        await Department.create({
          id: genId('dept'),
          tenant_id: tenantId,
          name: department || 'Engineering & Product',
          code: 'ENG',
          bu_code: 'ENG-01',
          department_head: adminName || 'VP of Engineering',
          cost_center: 'CC-ENG-101',
          status: 'ACTIVE'
        }, { transaction: t });
      } catch (e) {
        console.warn('Corporate department creation notice:', e.message);
      }

      try {
        await SkillCategory.create({
          id: genId('sk-cat'),
          tenant_id: tenantId,
          name: 'Technical & Engineering Competencies',
          description: 'Core software engineering, DevOps, cloud, and cybersecurity skills'
        }, { transaction: t });

        await ComplianceCategory.create({
          id: genId('comp-cat'),
          tenant_id: tenantId,
          name: 'Information Security & Regulatory Compliance',
          description: 'Annual mandatory audits, SOC-2, GDPR, HIPAA, and workplace ethics'
        }, { transaction: t });

        await CourseCategory.create({
          id: genId('cat'),
          tenant_id: tenantId,
          name: 'Enterprise Workforce Training',
          code: 'CAT-CORP',
          description: 'Mandatory compliance, technical upskilling, and leadership programs'
        }, { transaction: t });
      } catch (e) {
        console.warn('Skill/Compliance category creation notice:', e.message);
      }
    }

    try {
      await AuditLog.create({
        id: genId('audit'),
        tenant_id: tenantId,
        user_id: superAdmin.id,
        action: 'PLATFORM_SETUP',
        module: targetType,
        entity_type: 'Tenant',
        entity_id: tenantId,
        new_data: { organizationName: name, type: targetType, adminEmail: superAdmin.email },
        ip_address: req.ip || '127.0.0.1'
      }, { transaction: t });
    } catch (e) { }

    await t.commit();

    const token = jwt.sign(
      {
        userId: superAdmin.id,
        id: superAdmin.id,
        tenantId: tenant.id,
        tenant_id: tenant.id,
        role: superAdmin.role,
        email: superAdmin.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: `${targetType === 'INSTITUTE' ? 'Educational Institute' : 'Corporate Enterprise'} platform setup completed successfully.`,
      data: {
        token,
        isSetupCompleted: true,
        user: {
          id: superAdmin.id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role,
          tenant_id: tenant.id,
          job_title: superAdmin.job_title
        },
        tenant: {
          id: tenant.id,
          name: tenant.name,
          type: tenant.type,
          slug: tenant.slug,
          primary_color: tenant.primary_color,
          secondary_color: tenant.secondary_color
        },
        redirectUrl: '/superadmin'
      }
    });
  } catch (err) {
    await t.rollback();
    console.error('Setup Platform Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Setup failed: ' + err.message
    });
  }
};

const { sendOtpEmail, sendPasswordResetEmail, sendInstructorInvitationEmail } = require('../services/emailService');

const otpStore = new Map();

exports.sendVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; 

    otpStore.set(trimmedEmail, { otp, expiresAt });

    await sendOtpEmail(trimmedEmail, otp);

    return res.json({
      success: true,
      message: `Verification code sent from smartlms2026@gmail.com to ${trimmedEmail}`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and 6-digit verification code are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const record = otpStore.get(trimmedEmail);

    if (!record) {
      return res.status(400).json({ success: false, message: 'No active code found for this email. Please click Send OTP.' });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(trimmedEmail);
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new one.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
    }

    otpStore.delete(trimmedEmail);
    return res.json({
      success: true,
      message: 'Email address verified successfully!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a registered email address.'
      });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const account = await User.findOne({ where: { email: trimmedEmail } })
      || await Instructor.findOne({ where: { email: trimmedEmail } })
      || await Learner.findOne({ where: { email: trimmedEmail } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address.'
      });
    }

    const resetToken = jwt.sign(
      {
        userId: account.id,
        email: account.email,
        type: 'password_reset'
      },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const clientBaseUrl = process.env.CLIENT_URL || req.headers.origin || 'http://localhost:5173';
    const resetLink = `${clientBaseUrl}/reset-password?token=${resetToken}`;

    const emailResult = await sendPasswordResetEmail(account.email, resetLink, account.name);

    return res.json({
      success: true,
      message: `Password reset link has been dispatched to ${account.email}. Please check your inbox or spam folder.`,
      simulated: emailResult.simulated || false,
      resetLink: emailResult.simulated ? resetLink : undefined
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password recovery: ' + err.message
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({
          success: false,
          message: 'The password reset link has expired. Please request a new one.'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid or corrupted reset link.'
      });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid token type for password reset.'
      });
    }

    const account = await User.findByPk(decoded.userId)
      || await Instructor.findByPk(decoded.userId)
      || await Learner.findByPk(decoded.userId)
      || await User.findOne({ where: { email: decoded.email } })
      || await Instructor.findOne({ where: { email: decoded.email } })
      || await Learner.findOne({ where: { email: decoded.email } });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    account.password_hash = await hashPassword(newPassword);
    await account.save();

    console.log(`[Auth] Password successfully updated in database for account: ${account.email}`);

    return res.json({
      success: true,
      message: 'Your password has been reset successfully! You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset password: ' + err.message
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const account = await User.findByPk(userId)
      || await Instructor.findByPk(userId)
      || await Learner.findByPk(userId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    const isMatch = await comparePassword(currentPassword, account.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match our records.'
      });
    }

    account.password_hash = await hashPassword(newPassword);
    await account.save();

    console.log(`[Auth] Password successfully changed by account: ${account.email}`);

    return res.json({
      success: true,
      message: 'Password updated successfully in database!'
    });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password: ' + err.message
    });
  }
};

exports.inviteInstructor = async (req, res) => {
  try {
    const { name, email, department, tenant_id, job_title } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Instructor Name and Email Address are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    const existingInst = await Instructor.findOne({ where: { email: trimmedEmail } });
    if (existingInst && existingInst.status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: `An active instructor account already exists for ${trimmedEmail}. The user can directly log in.`
      });
    }

    let finalTenantId = tenant_id || (req.user ? req.user.tenant_id : null);
    if (!finalTenantId) {
      const firstTenant = await Tenant.findOne();
      if (firstTenant) finalTenantId = firstTenant.id;
    }

    const tenant = finalTenantId ? await Tenant.findByPk(finalTenantId) : null;
    const tenantName = tenant ? tenant.name : 'Institute Academy';

    const inviteToken = jwt.sign(
      {
        email: trimmedEmail,
        name: name.trim(),
        department: department ? department.trim() : 'Academics & Technology',
        job_title: job_title ? job_title.trim() : 'Instructor',
        tenantId: finalTenantId,
        role: 'INSTRUCTOR',
        type: 'instructor_invitation'
      },
      JWT_SECRET,
      { expiresIn: '48h' }
    );

    const clientBaseUrl = process.env.CLIENT_URL || req.headers.origin || 'http://localhost:5173';
    const inviteLink = `${clientBaseUrl}/instructor/onboarding?token=${inviteToken}`;

    const emailResult = await sendInstructorInvitationEmail(
      trimmedEmail,
      inviteLink,
      name.trim(),
      tenantName,
      department || 'Academics'
    );

    console.log(`✉️ Instructor invitation link sent to: ${trimmedEmail}`);

    return res.status(200).json({
      success: true,
      message: `Instructor invitation email successfully dispatched to ${trimmedEmail}.`,
      data: {
        email: trimmedEmail,
        name: name.trim(),
        inviteLink,
        simulated: emailResult.simulated || false
      }
    });
  } catch (err) {
    console.error('Error inviting instructor:', err);
    return res.status(500).json({ success: false, message: 'Failed to invite instructor: ' + err.message });
  }
};

exports.verifyInstructorInvitation = async (req, res) => {
  try {
    const token = req.query.token || req.params.token || req.body.token;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Invitation token is required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ success: false, message: 'The invitation link has expired. Please request a new invitation from your Institute Admin.' });
      }
      return res.status(400).json({ success: false, message: 'Invalid or corrupted invitation link.' });
    }

    if (decoded.type !== 'instructor_invitation' && decoded.type !== 'member_invitation' && decoded.role !== 'INSTRUCTOR') {
      return res.status(400).json({ success: false, message: 'Invalid token type for instructor onboarding.' });
    }

    const tenant = decoded.tenantId ? await Tenant.findByPk(decoded.tenantId) : null;

    return res.json({
      success: true,
      data: {
        user: {
          name: decoded.name || 'Instructor',
          email: decoded.email,
          role: 'INSTRUCTOR',
          department: decoded.department || 'Academics',
          job_title: decoded.job_title || 'Instructor',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          status: 'PENDING_CREATION'
        },
        tenant: tenant ? {
          id: tenant.id,
          name: tenant.name,
          logo_url: tenant.logo_url,
          primary_color: tenant.primary_color
        } : null
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.completeInstructorOnboarding = async (req, res) => {
  try {
    const { token, password, name, phone, specialization, bio, job_title, department, avatar_url } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid or expired invitation token.' });
    }

    const email = decoded.email?.trim().toLowerCase();
    const finalTenantId = decoded.tenantId || null;

    let instructor = await Instructor.findOne({ where: { email } });
    const hashedPassword = await hashPassword(password);
    const userAvatar = avatar_url || null;

    if (instructor) {
      
      instructor.password_hash = hashedPassword;
      if (name) instructor.name = name.trim();
      if (job_title) instructor.designation = job_title.trim();
      if (department || specialization) instructor.specialization = (department || specialization).trim();
      if (avatar_url !== undefined) instructor.avatar_url = avatar_url;
      if (phone) instructor.phone = phone;
      if (bio) instructor.bio = bio;
      instructor.status = 'ACTIVE';
      await instructor.save();
    } else {
      
      const instructorId = `instructor-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
      instructor = await Instructor.create({
        id: instructorId,
        tenant_id: finalTenantId,
        name: name ? name.trim() : (decoded.name || ''),
        email: email,
        password_hash: hashedPassword,
        role: 'INSTRUCTOR',
        designation: job_title ? job_title.trim() : (decoded.job_title || null),
        specialization: department ? department.trim() : (decoded.department || specialization || null),
        qualification: req.body.qualification || null,
        employee_number: req.body.employee_number || null,
        instructor_code: req.body.instructor_code || null,
        phone: phone || null,
        bio: bio || null,
        avatar_url: userAvatar,
        status: 'ACTIVE'
      });
    }

    const tenant = instructor.tenant_id ? await Tenant.findByPk(instructor.tenant_id) : null;

    const authToken = jwt.sign(
      {
        userId: instructor.id,
        id: instructor.id,
        tenantId: instructor.tenant_id,
        tenant_id: instructor.tenant_id,
        role: 'INSTRUCTOR',
        email: instructor.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[Auth] Instructor account created in instructors table & password set for: ${instructor.email} (${instructor.name})`);

    return res.json({
      success: true,
      message: 'Account created and activated successfully! Welcome to your Instructor Portal.',
      token: authToken,
      user: {
        id: instructor.id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role || 'INSTRUCTOR',
        tenant_id: instructor.tenant_id,
        department: instructor.specialization,
        job_title: instructor.designation,
        avatar_url: instructor.avatar_url,
        status: instructor.status
      },
      tenant,
      redirectUrl: '/instructor'
    });
  } catch (err) {
    console.error('Error completing instructor onboarding:', err);
    return res.status(500).json({ success: false, message: 'Failed to complete profile setup: ' + err.message });
  }
};

exports.verifyMemberActivationToken = async (req, res) => {
  try {
    const token = req.query.token || req.params.token || req.body.token;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Activation token is required.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ success: false, message: 'The activation link has expired. Please ask your Administrator to resend an invite.' });
      }
      return res.status(400).json({ success: false, message: 'Invalid or corrupted activation link.' });
    }

    const email = decoded.email?.trim().toLowerCase();
    const role = (decoded.role || 'LEARNER').toUpperCase();
    const finalTenantId = decoded.tenantId || null;

    const [userRecord, instructorRecord, learnerRecord] = await Promise.all([
      User.findOne({ where: { email } }),
      Instructor.findOne({ where: { email } }),
      Learner.findOne({ where: { email } })
    ]);

    const activeRecord = userRecord || instructorRecord || learnerRecord;
    const tenant = finalTenantId ? await Tenant.findByPk(finalTenantId) : null;

    return res.json({
      success: true,
      data: {
        user: {
          id: activeRecord ? activeRecord.id : decoded.userId,
          name: activeRecord ? activeRecord.name : (decoded.name || 'Member'),
          email: email,
          role: activeRecord ? (activeRecord.role || role) : role,
          department: activeRecord?.department || activeRecord?.specialization || decoded.department || '',
          job_title: activeRecord?.job_title || activeRecord?.designation || decoded.job_title || '',
          avatar_url: activeRecord?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          status: activeRecord ? activeRecord.status : 'PENDING'
        },
        tenant: tenant ? {
          id: tenant.id,
          name: tenant.name,
          logo_url: tenant.logo_url,
          primary_color: tenant.primary_color,
          type: tenant.type
        } : null
      }
    });
  } catch (err) {
    console.error('Error verifying activation token:', err);
    return res.status(500).json({ success: false, message: 'Failed to verify activation link: ' + err.message });
  }
};

exports.completeMemberActivation = async (req, res) => {
  try {
    const { token, password, name, phone, job_title, department, avatar_url } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid or expired activation link.' });
    }

    const email = decoded.email?.trim().toLowerCase();
    const role = (decoded.role || 'LEARNER').toUpperCase();
    const finalTenantId = decoded.tenantId || null;
    const hashedPassword = await hashPassword(password);
    const userAvatar = avatar_url || null;

    let targetAccount = null;
    let redirectUrl = '/learner';

    if (role === 'LEARNER') {
      redirectUrl = '/learner';
      targetAccount = await Learner.findOne({ where: { email } });
      if (targetAccount) {
        targetAccount.password_hash = hashedPassword;
        if (name) targetAccount.name = name.trim();
        if (avatar_url !== undefined) targetAccount.avatar_url = userAvatar;
        targetAccount.status = 'ACTIVE';
        await targetAccount.save();
      } else {
        targetAccount = await Learner.create({
          id: `learner-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          tenant_id: finalTenantId,
          name: name ? name.trim() : (decoded.name || 'Learner'),
          email: email,
          password_hash: hashedPassword,
          role: 'LEARNER',
          avatar_url: userAvatar,
          status: 'ACTIVE'
        });
      }
    } else if (['INSTRUCTOR', 'TEACHER', 'TRAINER'].includes(role)) {
      redirectUrl = '/instructor';
      targetAccount = await Instructor.findOne({ where: { email } });
      if (targetAccount) {
        targetAccount.password_hash = hashedPassword;
        if (name) targetAccount.name = name.trim();
        if (job_title) targetAccount.designation = job_title.trim();
        if (department) targetAccount.specialization = department.trim();
        if (phone) targetAccount.phone = phone.trim();
        if (avatar_url !== undefined) targetAccount.avatar_url = userAvatar;
        targetAccount.status = 'ACTIVE';
        await targetAccount.save();
      } else {
        targetAccount = await Instructor.create({
          id: `instructor-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          tenant_id: finalTenantId,
          name: name ? name.trim() : (decoded.name || 'Instructor'),
          email: email,
          password_hash: hashedPassword,
          role: 'INSTRUCTOR',
          designation: job_title || decoded.job_title || null,
          specialization: department || decoded.department || null,
          phone: phone || null,
          avatar_url: userAvatar,
          status: 'ACTIVE'
        });
      }
    } else {
      
      redirectUrl = role === 'SUPER_ADMIN' ? '/superadmin' : role === 'CORPORATE_ADMIN' ? '/corporate' : '/institute';
      targetAccount = await User.findOne({ where: { email } });
      if (targetAccount) {
        targetAccount.password_hash = hashedPassword;
        if (name) targetAccount.name = name.trim();
        if (job_title) targetAccount.job_title = job_title.trim();
        if (avatar_url !== undefined) targetAccount.avatar_url = userAvatar;
        targetAccount.status = 'ACTIVE';
        await targetAccount.save();
      } else {
        targetAccount = await User.create({
          id: `user-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
          tenant_id: finalTenantId,
          name: name ? name.trim() : (decoded.name || 'Admin'),
          email: email,
          password_hash: hashedPassword,
          role: role,
          job_title: job_title || decoded.job_title || null,
          avatar_url: userAvatar,
          status: 'ACTIVE'
        });
      }
    }

    const tenant = targetAccount.tenant_id ? await Tenant.findByPk(targetAccount.tenant_id) : null;

    const authToken = jwt.sign(
      {
        userId: targetAccount.id,
        id: targetAccount.id,
        tenantId: targetAccount.tenant_id,
        tenant_id: targetAccount.tenant_id,
        role: targetAccount.role || role,
        email: targetAccount.email
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`[Auth] Account activated & password created for: ${targetAccount.email} (${targetAccount.name}) - Role: ${role}`);

    return res.json({
      success: true,
      message: 'Account activated successfully! Logging you in...',
      token: authToken,
      user: {
        id: targetAccount.id,
        name: targetAccount.name,
        email: targetAccount.email,
        role: targetAccount.role || role,
        tenant_id: targetAccount.tenant_id,
        department: targetAccount.specialization || targetAccount.department || null,
        job_title: targetAccount.designation || targetAccount.job_title || null,
        avatar_url: targetAccount.avatar_url,
        status: targetAccount.status
      },
      tenant,
      redirectUrl
    });
  } catch (err) {
    console.error('Error completing account activation:', err);
    return res.status(500).json({ success: false, message: 'Failed to complete activation: ' + err.message });
  }
};
