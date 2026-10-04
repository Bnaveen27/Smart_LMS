const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Corporate = sequelize.define('Corporate', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  company_name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  company_code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  company_type: {
    type: DataTypes.STRING(100),
    defaultValue: 'Private Limited'
  },
  industry: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  registration_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tax_number: {
    type: DataTypes.STRING(100),
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
  contact_person: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'corporates',
  timestamps: true
});

module.exports = Corporate;
