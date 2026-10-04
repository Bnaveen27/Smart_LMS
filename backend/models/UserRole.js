const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  role_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'user_roles',
  timestamps: false
});

module.exports = UserRole;
