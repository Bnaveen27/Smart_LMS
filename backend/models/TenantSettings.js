const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TenantSettings = sequelize.define('TenantSettings', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  timezone: {
    type: DataTypes.STRING(50),
    defaultValue: 'Asia/Kolkata'
  },
  language: {
    type: DataTypes.STRING(20),
    defaultValue: 'en'
  },
  date_format: {
    type: DataTypes.STRING(20),
    defaultValue: 'DD/MM/YYYY'
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'INR'
  },
  notification_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notification_sms: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tenant_settings',
  timestamps: true
});

module.exports = TenantSettings;
