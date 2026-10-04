const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  module_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    defaultValue: 'video'
  },
  video_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  preview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  duration_mins: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'lessons',
  timestamps: true
});

module.exports = Lesson;
