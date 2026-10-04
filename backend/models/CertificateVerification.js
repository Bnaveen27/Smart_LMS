const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CertificateVerification = sequelize.define('CertificateVerification', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  certificate_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  certificate_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  recipient_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  course_title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  issuer_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  issue_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  verified_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_verified_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'certificate_verifications',
  timestamps: true
});

module.exports = CertificateVerification;
