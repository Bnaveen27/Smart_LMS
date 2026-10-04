const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcademicProgram = sequelize.define('AcademicProgram', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  department_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  level: {
    type: DataTypes.STRING(50),
    defaultValue: 'Undergraduate'
  },
  duration: {
    type: DataTypes.STRING(50),
    defaultValue: '4 Years'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'academic_programs',
  timestamps: true
});

module.exports = AcademicProgram;
