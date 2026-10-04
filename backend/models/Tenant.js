const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('INSTITUTE', 'CORPORATE'),
    allowNull: false,
    defaultValue: 'INSTITUTE'
  },
  slug: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  logo_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  primary_color: {
    type: DataTypes.STRING(20),
    defaultValue: '#4F46E5'
  },
  secondary_color: {
    type: DataTypes.STRING(20),
    defaultValue: '#06B6D4'
  },
  domain: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'SUSPENDED'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'tenants',
  timestamps: true
});

module.exports = Tenant;
