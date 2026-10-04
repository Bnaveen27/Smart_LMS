const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScormPackage = sequelize.define('ScormPackage', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.ENUM('SCORM_1.2', 'SCORM_2004'),
    defaultValue: 'SCORM_1.2'
  },
  manifest_identifier: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  launch_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  entry_point: {
    type: DataTypes.STRING(255),
    defaultValue: 'index.html'
  },
  package_path: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  mastery_score: {
    type: DataTypes.FLOAT,
    defaultValue: 80.0
  },
  max_time_allowed: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  time_limit_action: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  file_size_bytes: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'ARCHIVED'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'scorm_packages',
  timestamps: true
});

module.exports = ScormPackage;
