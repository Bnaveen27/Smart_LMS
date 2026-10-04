const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Manager = sequelize.define('Manager', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING(100),
    defaultValue: 'Engineering Manager'
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'managers',
  timestamps: true
});

module.exports = Manager;
