const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Timetable = sequelize.define('Timetable', {
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
    type: DataTypes.STRING(150),
    allowNull: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  course_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  day_of_week: {
    type: DataTypes.STRING(30),
    allowNull: false,
    defaultValue: 'Monday'
  },
  start_time: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  end_time: {
    type: DataTypes.STRING(30),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  session_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'LECTURE' 
  },
  location: {
    type: DataTypes.STRING(150),
    defaultValue: 'Lecture Hall / Online'
  },
  meeting_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(30),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'timetables',
  timestamps: true
});

module.exports = Timetable;
