const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseReview = sequelize.define('CourseReview', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5.0
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'course_reviews',
  timestamps: true
});

module.exports = CourseReview;
