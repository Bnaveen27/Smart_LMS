const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  category_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  question_type: {
    type: DataTypes.ENUM('MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY'),
    defaultValue: 'MCQ'
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  options: {
    type: DataTypes.JSON, 
    allowNull: true
  },
  correct_answer: {
    type: DataTypes.TEXT, 
    allowNull: false
  },
  marks: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  negative_marks: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  difficulty: {
    type: DataTypes.ENUM('EASY', 'MEDIUM', 'HARD'),
    defaultValue: 'MEDIUM'
  },
  explanation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'questions',
  timestamps: true
});

module.exports = Question;
