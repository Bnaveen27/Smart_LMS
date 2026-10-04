const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseCategory = sequelize.define('CourseCategory', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
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
  tableName: 'course_categories',
  timestamps: true
});

module.exports = CourseCategory;
