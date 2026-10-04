const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  instructor_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  instructor_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  category_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    defaultValue: 'Development'
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  learning_outcomes: {
    type: DataTypes.JSON,
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  is_enterprise_eligible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  level: {
    type: DataTypes.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
    defaultValue: 'BEGINNER'
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0
  },
  enrolled_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  published: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'courses',
  timestamps: true
});

module.exports = Course;
