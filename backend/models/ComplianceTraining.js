const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComplianceTraining = sequelize.define('ComplianceTraining', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  category_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  due_days: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'compliance_training',
  timestamps: true
});

module.exports = ComplianceTraining;
