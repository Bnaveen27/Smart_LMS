const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  course_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  certificate_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  issued_at: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'certificates',
  timestamps: true
});

module.exports = Certificate;
