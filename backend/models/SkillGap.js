const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SkillGap = sequelize.define('SkillGap', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  employee_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  skill_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  current_level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  required_level: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  gap_score: {
    type: DataTypes.INTEGER,
    defaultValue: 3
  },
  status: {
    type: DataTypes.ENUM('OPEN', 'IN_TRAINING', 'RESOLVED'),
    defaultValue: 'OPEN'
  }
}, {
  tableName: 'skill_gaps',
  timestamps: true
});

module.exports = SkillGap;
