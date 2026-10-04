const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Module = sequelize.define('Module', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'modules',
  timestamps: true
});

module.exports = Module;
