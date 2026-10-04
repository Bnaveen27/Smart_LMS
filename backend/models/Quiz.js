const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Quiz = sequelize.define('Quiz', {
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
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  passing_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  attempt_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  randomize_questions: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED'),
    defaultValue: 'PUBLISHED'
  }
}, {
  tableName: 'quizzes',
  timestamps: true
});

module.exports = Quiz;
