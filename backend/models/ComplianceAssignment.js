const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComplianceAssignment = sequelize.define('ComplianceAssignment', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  training_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'compliance_assignments',
  timestamps: true
});

module.exports = ComplianceAssignment;
