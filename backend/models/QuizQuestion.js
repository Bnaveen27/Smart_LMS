const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuizQuestion = sequelize.define('QuizQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  quiz_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  question_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  order_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  marks: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'quiz_questions',
  timestamps: false
});

module.exports = QuizQuestion;
