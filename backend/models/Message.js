const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.STRING(50),
    primaryKey: true
  },
  tenant_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sender_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  sender_name: {
    type: DataTypes.STRING(100),
    defaultValue: 'Administrator'
  },
  recipient_id: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  recipient_name: {
    type: DataTypes.STRING(100),
    defaultValue: 'All Users'
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  channel: {
    type: DataTypes.STRING(50),
    defaultValue: 'INTERNAL' 
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'SENT' 
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;
