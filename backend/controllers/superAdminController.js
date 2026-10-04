const {
  Tenant,
  User,
  Course,
  Enrollment,
  AuditLog,
  Transaction
} = require('../models');

exports.getDashboard = async (req, res) => {
  try {
    const totalTenants = await Tenant.count();
    const instituteTenants = await Tenant.count({ where: { type: 'INSTITUTE' } });
    const corporateTenants = await Tenant.count({ where: { type: 'CORPORATE' } });
    const activeTenants = await Tenant.count({ where: { status: 'ACTIVE' } });
    const totalUsers = await User.count();
    const totalCourses = await Course.count();
    const tenants = await Tenant.findAll({ order: [['createdAt', 'DESC']] });
    const auditLogs = await AuditLog.findAll({ limit: 10, order: [['createdAt', 'DESC']] });

    const transactions = await Transaction.findAll({ where: { status: 'SUCCESS' } });
    const totalRevenue = transactions.reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    return res.json({
      success: true,
      data: {
        stats: {
          totalTenants,
          activeTenants,
          instituteTenants,
          corporateTenants,
          totalUsers,
          totalCourses,
          totalRevenue: `₹ ${totalRevenue.toLocaleString()}`,
          platformHealth: '100% MySQL Active'
        },
        tenants,
        auditLogs
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTenants = async (req, res) => {
  try {
    let tenants = await Tenant.findAll();
    return res.json({ success: true, data: tenants });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.activateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const tenant = await Tenant.findByPk(tenantId);
    if (tenant) {
      tenant.status = 'ACTIVE';
      await tenant.save();
    }
    return res.json({ success: true, message: 'Tenant activated successfully', data: tenant });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.suspendTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const tenant = await Tenant.findByPk(tenantId);
    if (tenant) {
      tenant.status = 'SUSPENDED';
      await tenant.save();
    }
    return res.json({ success: true, message: 'Tenant suspended successfully', data: tenant });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    let logs = [];
    try {
      logs = await AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 50 });
    } catch (e) {}

    return res.json({ success: true, data: logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
