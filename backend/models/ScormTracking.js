const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScormTracking = sequelize.define('ScormTracking', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  scorm_package_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lesson_status: {
    type: DataTypes.STRING(50),
    defaultValue: 'not attempted' 
  },
  lesson_location: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  suspend_data: {
    type: DataTypes.TEXT('long'),
    allowNull: true
  },
  score_raw: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  score_min: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  score_max: {
    type: DataTypes.FLOAT,
    defaultValue: 100
  },
  score_scaled: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  total_time: {
    type: DataTypes.STRING(50),
    defaultValue: '00:00:00'
  },
  session_time: {
    type: DataTypes.STRING(50),
    defaultValue: '00:00:00'
  },
  attempt_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  last_accessed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  cmi_data: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'scorm_trackings',
  timestamps: true
});

module.exports = ScormTracking;
