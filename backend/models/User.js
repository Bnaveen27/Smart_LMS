const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('SUPER_ADMIN', 'INSTITUTE_ADMIN', 'CORPORATE_ADMIN'),
    allowNull: false,
    defaultValue: 'INSTITUTE_ADMIN'
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  job_title: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
