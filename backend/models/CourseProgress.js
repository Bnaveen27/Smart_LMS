const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseProgress = sequelize.define('CourseProgress', {
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
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lesson_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  progress_percent: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_accessed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'course_progress',
  timestamps: true
});

module.exports = CourseProgress;
