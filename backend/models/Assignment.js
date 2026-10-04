const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lesson_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  max_marks: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  allowed_file_types: {
    type: DataTypes.STRING(100),
    defaultValue: 'pdf,doc,docx,zip'
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'CLOSED', 'ARCHIVED'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'assignments',
  timestamps: true
});

module.exports = Assignment;
