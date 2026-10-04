const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Instructor = sequelize.define('Instructor', {
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
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.STRING(50),
    defaultValue: 'INSTRUCTOR'
  },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  employee_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  instructor_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  faculty_code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  department_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  designation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  specialization: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'ON_LEAVE', 'RESIGNED', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'instructors',
  timestamps: true
});

module.exports = Instructor;
