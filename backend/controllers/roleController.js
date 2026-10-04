const { Role, Permission, User, UserRole, RolePermission } = require('../models');
const {
  seedRolesAndPermissions,
  assignRoleToUser,
  getUserRolesAndPermissions
} = require('../services/roleService');

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          through: { attributes: [] }
        }
      ],
      order: [['name', 'ASC']]
    });

    return res.json({
      success: true,
      data: roles
    });
  } catch (err) {
    console.error('Error fetching roles from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['module', 'ASC'], ['action', 'ASC']]
    });

    return res.json({
      success: true,
      data: permissions
    });
  } catch (err) {
    console.error('Error fetching permissions from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { user_id, role_code } = req.body;

    if (!user_id || !role_code) {
      return res.status(400).json({
        success: false,
        message: 'user_id and role_code are required'
      });
    }

    const result = await assignRoleToUser(user_id, role_code);

    return res.json({
      success: true,
      message: `Role ${role_code} successfully assigned to user in database`,
      data: result
    });
  } catch (err) {
    console.error('Error assigning role:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { role_code, permissions } = req.body;

    if (!role_code) {
      return res.status(400).json({
        success: false,
        message: 'role_code is required'
      });
    }

    const role = await Role.findOne({ where: { code: role_code.toUpperCase() } });
    if (!role) {
      return res.status(404).json({
        success: false,
        message: `Role ${role_code} not found in database`
      });
    }

    await RolePermission.destroy({ where: { role_id: role.id } });

    let enabledPermCodes = [];
    if (Array.isArray(permissions)) {
      enabledPermCodes = permissions;
    } else if (typeof permissions === 'object' && permissions !== null) {
      enabledPermCodes = Object.entries(permissions)
        .filter(([_, isEnabled]) => Boolean(isEnabled))
        .map(([code]) => code);
    }

    if (enabledPermCodes.length > 0) {
      const perms = await Permission.findAll({
        where: {
          code: enabledPermCodes
        }
      });

      for (const perm of perms) {
        await RolePermission.create({
          role_id: role.id,
          permission_id: perm.id
        });
      }
    }

    const updatedRole = await Role.findByPk(role.id, {
      include: [{ model: Permission, through: { attributes: [] } }]
    });

    console.log(`[RBAC] Updated permissions for role ${role_code} in MySQL database (${enabledPermCodes.length} active permissions)`);

    return res.json({
      success: true,
      message: `Permissions for ${role_code} successfully saved to database!`,
      data: updatedRole
    });
  } catch (err) {
    console.error('Error updating role permissions in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserRoles = async (req, res) => {
  try {
    const { id } = req.params;
    const userRoleData = await getUserRolesAndPermissions(id);

    if (!userRoleData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: userRoleData
    });
  } catch (err) {
    console.error('Error fetching user roles:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.seedRoles = async (req, res) => {
  try {
    await seedRolesAndPermissions();
    return res.json({
      success: true,
      message: 'Roles and permissions seeded successfully in database'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
