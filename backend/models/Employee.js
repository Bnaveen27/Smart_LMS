const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
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
  employee_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  department_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  manager_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  joining_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  employment_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'Full-Time'
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'PROBATION', 'TERMINATED', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'employees',
  timestamps: true
});

module.exports = Employee;
