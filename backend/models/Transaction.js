const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
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
  learner_name: {
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
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'INR'
  },
  gateway: {
    type: DataTypes.STRING(50),
    defaultValue: 'RAZORPAY' 
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'ONLINE'
  },
  transaction_ref: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  payment_proof: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  invoice_no: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED', 'CANCELLED'),
    defaultValue: 'SUCCESS'
  }
}, {
  tableName: 'transactions',
  timestamps: true
});

module.exports = Transaction;
