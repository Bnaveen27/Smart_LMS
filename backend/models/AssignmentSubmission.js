const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  assignment_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  file_path: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submission_text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  marks: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  graded_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  graded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'GRADED', 'REJECTED'),
    defaultValue: 'PENDING'
  }
}, {
  tableName: 'assignment_submissions',
  timestamps: true
});

module.exports = AssignmentSubmission;
