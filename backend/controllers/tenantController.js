const { Tenant } = require('../models');

exports.getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(tenants);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const { name, type, slug, logo_url, domain, primary_color, secondary_color } = req.body;
    const tenantData = {
      id: req.body.id || `tenant-${Date.now()}`,
      name,
      type: type || 'INSTITUTE',
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      logo_url: logo_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
      domain: domain || `${slug || 'tenant'}.lms.com`,
      primary_color: primary_color || '#4F46E5',
      secondary_color: secondary_color || '#06B6D4',
      status: 'ACTIVE'
    };

    const created = await Tenant.create(tenantData);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;
    await Tenant.destroy({ where: { id } });
    return res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

