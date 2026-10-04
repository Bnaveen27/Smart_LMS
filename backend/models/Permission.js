const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  module: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'permissions',
  timestamps: true
});

module.exports = Permission;
