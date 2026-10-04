const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  head_of_department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  department_head: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  hod_email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  contact_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  bu_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  cost_center: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'departments',
  timestamps: true
});

module.exports = Department;
