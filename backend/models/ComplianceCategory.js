const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComplianceCategory = sequelize.define('ComplianceCategory', {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'compliance_categories',
  timestamps: true
});

module.exports = ComplianceCategory;
