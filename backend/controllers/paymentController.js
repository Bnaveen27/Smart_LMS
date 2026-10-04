const { Transaction, Enrollment, Course, Certificate } = require('../models');

exports.processCheckout = async (req, res) => {
  try {
    const { course_id, gateway, amount } = req.body;
    const user_id = req.user ? req.user.id : null;
    const tenant_id = req.user ? req.user.tenant_id : null;

    let courseTitle = 'Paid Course Purchase';
    let coursePrice = amount || 999.00;

    const course = await Course.findByPk(course_id);
    if (course) {
      courseTitle = course.title;
      coursePrice = amount || course.price;
    }

    const newTransaction = {
      id: `txn-${Date.now()}`,
      tenant_id: tenant_id,
      user_id: user_id,
      learner_name: req.user ? req.user.name : 'Learner',
      course_id: course_id,
      course_title: courseTitle,
      amount: coursePrice,
      currency: 'INR',
      gateway: gateway || 'RAZORPAY',
      payment_method: gateway || 'ONLINE',
      transaction_ref: `${gateway === 'RAZORPAY' ? 'pay_' : 'ch_'}${Math.random().toString(36).substr(2, 9)}`,
      status: 'SUCCESS'
    };

    const newEnrollment = {
      id: `enr-${Date.now()}`,
      tenant_id: tenant_id,
      user_id: user_id,
      course_id: course_id,
      learner_name: req.user ? req.user.name : 'Learner',
      learner_email: req.user ? req.user.email : '',
      course_title: courseTitle,
      status: 'ACTIVE',
      enrollment_type: 'ONLINE_PURCHASE',
      payment_method: gateway || 'RAZORPAY',
      payment_reference: newTransaction.transaction_ref,
      payment_amount: coursePrice,
      payment_date: new Date(),
      start_date: new Date(),
      progress_percentage: 0
    };

    const createdTxn = await Transaction.create(newTransaction);
    if (user_id && course_id) {
      await Enrollment.findOrCreate({
        where: { user_id, course_id },
        defaults: newEnrollment
      });
    }

    return res.json({
      success: true,
      message: 'Payment processed successfully via Sequelize ORM! Course unlocked.',
      transaction: createdTxn
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;
    const txns = await Transaction.findAll({ where, order: [['createdAt', 'DESC']] });
    return res.json(txns);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.issueCertificate = async (req, res) => {
  try {
    const { course_id, user_id, certificate_code } = req.body;
    const certCode = certificate_code || `CERT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCert = await Certificate.create({
      id: `cert-${Date.now()}`,
      tenant_id: req.user ? req.user.tenant_id : null,
      user_id: user_id || (req.user ? req.user.id : null),
      course_id: course_id,
      certificate_code: certCode,
      issued_at: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Certificate issued successfully',
      data: newCert
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
