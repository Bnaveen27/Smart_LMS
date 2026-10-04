const { Tenant, User, Course, Transaction, CorporateAssignment } = require('../models');

exports.getInstituteStats = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;

    const totalCourses = await Course.count({ where });
    const totalLearners = await User.count({ where: { ...(tenant_id && { tenant_id }), role: 'LEARNER' } });
    const transactions = await Transaction.findAll({ where: { ...(tenant_id && { tenant_id }), status: 'SUCCESS' } });
    const totalRevenue = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    return res.json({
      total_courses: totalCourses,
      total_learners: totalLearners,
      total_revenue: totalRevenue.toFixed(2),
      instructor_payouts: (totalRevenue * 0.70).toFixed(2),
      platform_fee: (totalRevenue * 0.30).toFixed(2),
      monthly_sales: [
        { month: 'Jan', revenue: 0 },
        { month: 'Feb', revenue: 0 },
        { month: 'Mar', revenue: 0 },
        { month: 'Apr', revenue: 0 },
        { month: 'May', revenue: 0 },
        { month: 'Jun', revenue: totalRevenue }
      ]
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getCorporateStats = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;

    const totalEmployees = await User.count({ where: { ...(tenant_id && { tenant_id }), role: 'EMPLOYEE' } });
    const totalAssignments = await CorporateAssignment.count({ where });
    const completedAssignments = await CorporateAssignment.count({ where: { ...where, status: 'COMPLETED' } });
    const complianceRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

    return res.json({
      total_employees: totalEmployees,
      assigned_trainings: totalAssignments,
      completed_trainings: completedAssignments,
      compliance_rate: complianceRate,
      department_breakdown: []
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getSuperAdminStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.count();
    const totalInstitutes = await Tenant.count({ where: { type: 'INSTITUTE' } });
    const totalCorporates = await Tenant.count({ where: { type: 'CORPORATE' } });
    const totalUsers = await User.count();

    const transactions = await Transaction.findAll({ where: { status: 'SUCCESS' } });
    const totalGMV = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    return res.json({
      total_tenants: totalTenants,
      total_institutes: totalInstitutes,
      total_corporates: totalCorporates,
      total_users: totalUsers,
      platform_gmv: `$${totalGMV.toFixed(2)}`,
      active_subscriptions: totalTenants,
      platform_uptime: '99.99%'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
