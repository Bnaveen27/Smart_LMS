const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeSkill = sequelize.define('EmployeeSkill', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  employee_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  skill_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  current_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  target_level: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  assessed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  assessed_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'employee_skills',
  timestamps: true
});

module.exports = EmployeeSkill;
