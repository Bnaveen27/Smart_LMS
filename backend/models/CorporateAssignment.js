const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CorporateAssignment = sequelize.define('CorporateAssignment', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  assigned_by_user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  assigned_to_user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  employee_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  course_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'),
    defaultValue: 'NOT_STARTED'
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'corporate_assignments',
  timestamps: true
});

module.exports = CorporateAssignment;
