const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'INFO'
  },
  channel: {
    type: DataTypes.STRING(50),
    defaultValue: 'IN_APP' 
  },
  target_audience: {
    type: DataTypes.STRING(50),
    defaultValue: 'ALL'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'SENT' 
  },
  reference_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  reference_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;
