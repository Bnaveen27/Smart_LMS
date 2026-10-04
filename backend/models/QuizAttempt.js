const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizAttempt = sequelize.define('QuizAttempt', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  quiz_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  attempt_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  score: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  percentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  passed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('IN_PROGRESS', 'SUBMITTED', 'EVALUATED'),
    defaultValue: 'SUBMITTED'
  },
  started_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'quiz_attempts',
  timestamps: true
});

module.exports = QuizAttempt;
