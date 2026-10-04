const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  category_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  level_count: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
    defaultValue: 'ACTIVE'
  }
}, {
  tableName: 'skills',
  timestamps: true
});

module.exports = Skill;
