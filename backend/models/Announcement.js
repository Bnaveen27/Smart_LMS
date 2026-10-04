const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    defaultValue: 'General'
  },
  priority: {
    type: DataTypes.STRING(50),
    defaultValue: 'NORMAL' 
  },
  target_audience: {
    type: DataTypes.STRING(50),
    defaultValue: 'ALL' 
  },
  pinned: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  author: {
    type: DataTypes.STRING(100),
    defaultValue: 'Administrator'
  },
  created_by: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'PUBLISHED'
  }
}, {
  tableName: 'announcements',
  timestamps: true
});

module.exports = Announcement;
