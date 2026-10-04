const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LiveClass = sequelize.define('LiveClass', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  trainer_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  meeting_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  start_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'),
    defaultValue: 'SCHEDULED'
  }
}, {
  tableName: 'live_classes',
  timestamps: true
});

module.exports = LiveClass;
