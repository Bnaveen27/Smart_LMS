const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Learner = sequelize.define('Learner', {
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
    defaultValue: 'LEARNER'
  },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  learner_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  roll_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  register_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  department_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  program_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  current_semester: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  admission_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  batch: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  gender: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  guardian_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  guardian_phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  guardian_email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  attendance_percentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 100.00
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'SUSPENDED', 'GRADUATED', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'learners',
  timestamps: true
});

module.exports = Learner;
