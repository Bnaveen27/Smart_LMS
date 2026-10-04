const {
  Institute,
  Department,
  AcademicProgram,
  Learner,
  Instructor,
  Teacher,
  User,
  Course,
  Enrollment,
  Certificate
} = require('../models');

exports.getInstituteDashboard = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId;

    let learnersCount = 0;
    let instructorsCount = 0;
    let coursesCount = 0;
    let enrollmentsCount = 0;
    let certificatesCount = 0;
    let departments = [];

    if (tenantId) {
      learnersCount = await Learner.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      instructorsCount = await Instructor.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      coursesCount = await Course.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      enrollmentsCount = await Enrollment.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      certificatesCount = await Certificate.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      departments = await Department.findAll({ where: { tenant_id: tenantId } }).catch(() => []);
    }

    return res.json({
      success: true,
      data: {
        stats: {
          totalLearners: learnersCount,
          totalInstructors: instructorsCount,
          totalTeachers: instructorsCount,
          totalCourses: coursesCount,
          totalEnrollments: enrollmentsCount,
          certificatesIssued: certificatesCount,
          avgCompletionRate: enrollmentsCount > 0 ? `${Math.round((certificatesCount / enrollmentsCount) * 100)}%` : '0%',
          revenue: '₹ 0.00'
        },
        departments,
        recentActivities: []
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const departments = await Department.findAll({ where });
    return res.json({ success: true, data: departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.body.tenant_id;
    const { name, code, description } = req.body;
    const dept = await Department.create({
      id: `dept-${Date.now()}`,
      tenant_id: tenantId,
      name,
      code: code || 'DEPT',
      description,
      status: 'ACTIVE'
    });
    return res.status(201).json({ success: true, message: 'Department created successfully', data: dept });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPrograms = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const programs = await AcademicProgram.findAll({ where });
    return res.json({ success: true, data: programs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.body.tenant_id;
    const { name, code, level, duration, department_id, description } = req.body;
    const prog = await AcademicProgram.create({
      id: `prog-${Date.now()}`,
      tenant_id: tenantId,
      department_id,
      name,
      code: code || 'PROG',
      level: level || 'Undergraduate',
      duration: duration || '4 Years',
      description,
      status: 'ACTIVE'
    });
    return res.status(201).json({ success: true, message: 'Academic Program created successfully', data: prog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getLearners = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const learners = await Learner.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: learners });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const instructors = await Instructor.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json({ success: true, data: instructors });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTeachers = exports.getInstructors;
