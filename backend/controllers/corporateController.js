const {
  Corporate,
  Department,
  Employee,
  User,
  Course,
  Skill,
  ComplianceTraining,
  CorporateAssignment,
  AuditLog
} = require('../models');

exports.getCorporateDashboard = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;

    let employeesCount = 0;
    let departmentsCount = 0;
    let skillsCount = 0;
    let complianceCount = 0;
    let assignmentsCount = 0;
    let completedAssignmentsCount = 0;
    let departments = [];

    if (tenantId) {
      employeesCount = await User.count({ where: { tenant_id: tenantId, role: ['EMPLOYEE', 'MANAGER', 'TRAINER', 'LEARNER'] } }).catch(() => 0);
      departmentsCount = await Department.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      skillsCount = await Skill.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      complianceCount = await ComplianceTraining.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      assignmentsCount = await CorporateAssignment.count({ where: { tenant_id: tenantId } }).catch(() => 0);
      completedAssignmentsCount = await CorporateAssignment.count({ where: { tenant_id: tenantId, status: 'COMPLETED' } }).catch(() => 0);
      departments = await Department.findAll({ where: { tenant_id: tenantId } }).catch(() => []);
    }

    const complianceRate = assignmentsCount > 0 
      ? `${Math.round((completedAssignmentsCount / assignmentsCount) * 100)}%` 
      : '0%';

    const skills = await Skill.findAll({ where: tenantId ? { tenant_id: tenantId } : {} }).catch(() => []);
    const complianceModules = await ComplianceTraining.findAll({ where: tenantId ? { tenant_id: tenantId } : {} }).catch(() => []);

    return res.json({
      success: true,
      data: {
        stats: {
          totalEmployees: employeesCount,
          departmentsCount: departmentsCount,
          activeTrainingCount: assignmentsCount,
          complianceRate: complianceRate,
          learningHours: `${assignmentsCount * 8} hrs`,
          skillGapsIdentified: skillsCount,
          certificationsAchieved: completedAssignmentsCount
        },
        skills,
        complianceModules,
        departments
      }
    });
  } catch (err) {
    console.error('Error in getCorporateDashboard:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCorporateAssignments = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const assignments = await CorporateAssignment.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: assignments });
  } catch (err) {
    console.error('Error fetching corporate assignments from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignTraining = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.body.tenant_id;
    const { course_id, employee_id, due_date, department } = req.body;

    const assignment = await CorporateAssignment.create({
      id: `asgn-${Date.now()}`,
      tenant_id: tenantId,
      assigned_by_user_id: req.user?.id || req.user?.userId || 'admin',
      assigned_to_user_id: employee_id,
      course_id: course_id,
      department: department || 'General',
      due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'NOT_STARTED',
      progress_percentage: 0
    });

    return res.status(201).json({
      success: true,
      message: 'Training assigned successfully in database',
      data: assignment
    });
  } catch (err) {
    console.error('Error creating corporate assignment in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress_percentage, status } = req.body;

    const assignment = await CorporateAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment record not found.' });
    }

    if (progress_percentage !== undefined) assignment.progress_percentage = progress_percentage;
    if (status !== undefined) assignment.status = status;
    if (progress_percentage === 100) {
      assignment.status = 'COMPLETED';
      assignment.completed_at = new Date();
    }
    await assignment.save();

    return res.json({ success: true, message: 'Assignment updated successfully in database', data: assignment });
  } catch (err) {
    console.error('Error updating assignment status in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSkills = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const skills = await Skill.findAll({ where, order: [['createdAt', 'DESC']] });

    return res.json({ success: true, data: skills });
  } catch (err) {
    console.error('Error fetching skills from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSkill = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.body.tenant_id;
    const { name, description, level_count } = req.body;
    const skill = await Skill.create({
      id: `sk-${Date.now()}`,
      tenant_id: tenantId,
      name,
      description,
      level_count: level_count || 5,
      status: 'ACTIVE'
    });
    return res.status(201).json({ success: true, message: 'Skill created successfully in database', data: skill });
  } catch (err) {
    console.error('Error creating skill in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = {
      role: ['EMPLOYEE', 'MANAGER', 'TRAINER'],
      ...(tenantId && { tenant_id: tenantId })
    };
    const employees = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'role', 'department', 'job_title', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: employees });
  } catch (err) {
    console.error('Error fetching corporate employees from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
