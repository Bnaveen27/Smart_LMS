const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Institute = sequelize.define('Institute', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  institute_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  institution_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  institution_type: {
    type: DataTypes.STRING(100),
    defaultValue: 'College'
  },
  affiliation: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  accreditation: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  established_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India'
  },
  pincode: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  website: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  principal_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'institutes',
  timestamps: true
});

module.exports = Institute;
