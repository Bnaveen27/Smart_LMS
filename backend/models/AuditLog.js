const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  module: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  entity_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  entity_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  old_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  new_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false 
});

module.exports = AuditLog;
