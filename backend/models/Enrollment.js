const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
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
  course_id: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  learner_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  learner_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  course_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'PENDING_PAYMENT',
      'PAYMENT_SUCCESSFUL',
      'PENDING_APPROVAL',
      'MANUALLY_ENROLLED',
      'ACTIVE',
      'COMPLETED',
      'EXPIRED',
      'CANCELLED'
    ),
    defaultValue: 'ACTIVE'
  },
  enrollment_type: {
    type: DataTypes.ENUM('ONLINE_PURCHASE', 'OFFLINE_PAYMENT', 'MANUAL_ADMIN', 'FREE_ENROLLMENT'),
    defaultValue: 'ONLINE_PURCHASE'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    defaultValue: 'RAZORPAY' 
  },
  payment_reference: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  payment_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  payment_proof: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  enrolled_by_admin: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  progress_percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completed_lessons: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'enrollments',
  timestamps: true
});

module.exports = Enrollment;
