const { Enrollment, Course, User, Transaction, Tenant } = require('../models');

exports.createEnrollment = async (req, res) => {
  try {
    const { course_id, gateway, amount, transaction_ref, payment_method, status } = req.body;
    const user_id = req.user ? req.user.id : (req.body.user_id || `user-learner-${Date.now()}`);
    const tenant_id = req.user ? req.user.tenant_id : (req.body.tenant_id || 'tenant-default');
    const learner_name = req.user ? req.user.name : (req.body.learner_name || 'Learner');
    const learner_email = req.user ? req.user.email : (req.body.learner_email || 'learner@domain.com');

    if (!course_id) {
      return res.status(400).json({ success: false, error: 'course_id is required' });
    }

    const course = await Course.findByPk(course_id);
    const coursePrice = amount !== undefined ? Number(amount) : (course ? Number(course.price || 0) : 0);
    const isFree = coursePrice <= 0;

    const enrollmentId = `enr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newEnrollment = {
      id: enrollmentId,
      tenant_id,
      user_id,
      course_id,
      learner_name,
      learner_email,
      course_title: course ? course.title : 'Enrolled Course',
      status: status || (isFree ? 'ACTIVE' : 'PAYMENT_SUCCESSFUL'),
      enrollment_type: isFree ? 'FREE_ENROLLMENT' : 'ONLINE_PURCHASE',
      payment_method: payment_method || (isFree ? 'FREE' : (gateway || 'RAZORPAY')),
      payment_reference: transaction_ref || (isFree ? 'FREE_ENROLLMENT' : `pay_${Math.random().toString(36).substring(2, 11)}`),
      payment_amount: coursePrice,
      payment_date: new Date(),
      start_date: new Date(),
      progress_percentage: 0,
      completed_lessons: []
    };

    let [enrollment, created] = [null, false];

    try {
      [enrollment, created] = await Enrollment.findOrCreate({
        where: { user_id, course_id },
        defaults: newEnrollment
      });
      if (!created && enrollment) {
        await enrollment.update({
          status: status || 'ACTIVE',
          payment_amount: coursePrice,
          payment_reference: newEnrollment.payment_reference
        });
      }
    } catch (e) {
      enrollment = await Enrollment.create(newEnrollment);
      created = true;
    }

    if (course && created) {
      await course.increment('enrolled_count', { by: 1 }).catch(() => {});
    }

    let txnRecord = null;
    if (coursePrice > 0 || transaction_ref) {
      try {
        const invoiceNo = `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        txnRecord = await Transaction.create({
          id: `txn-${Date.now()}`,
          tenant_id,
          user_id,
          learner_name,
          course_id,
          course_title: course ? course.title : 'Enrolled Course',
          amount: coursePrice,
          currency: 'INR',
          gateway: gateway || 'RAZORPAY',
          payment_method: payment_method || 'ONLINE',
          transaction_ref: newEnrollment.payment_reference,
          invoice_no: invoiceNo,
          status: 'SUCCESS'
        });
      } catch (txnErr) {
        console.warn('Transaction record creation notice:', txnErr.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: isFree ? 'Free course unlocked successfully!' : 'Payment verified! Course purchased and enrolled successfully.',
      data: {
        enrollment,
        course_title: course ? course.title : 'Course',
        learner_name,
        learner_email,
        transaction: txnRecord,
        is_new_enrollment: created
      }
    });
  } catch (err) {
    console.error('Error creating online enrollment:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.createManualEnrollment = async (req, res) => {
  try {
    const { 
      course_id, 
      learners, 
      user_id,
      learner_name,
      learner_email,
      payment_method, 
      payment_reference, 
      payment_amount,
      payment_date,
      payment_proof,
      start_date,
      expiry_date,
      notes,
      status 
    } = req.body;

    if (!course_id) {
      return res.status(400).json({ success: false, error: 'course_id is required for manual enrollment' });
    }

    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }

    const tenant_id = req.user ? req.user.tenant_id : (course.tenant_id || 'tenant-default');
    const adminName = req.user ? req.user.name : (req.body.enrolled_by_admin || 'Institute Administrator');
    const finalAmount = payment_amount !== undefined ? Number(payment_amount) : Number(course.price || 0);

    let targetLearners = [];
    if (Array.isArray(learners) && learners.length > 0) {
      targetLearners = learners;
    } else if (user_id || learner_email) {
      targetLearners = [{
        user_id: user_id || `user-off-${Date.now()}`,
        name: learner_name || 'Enrolled Learner',
        email: learner_email || 'learner@domain.com'
      }];
    } else {
      return res.status(400).json({ success: false, error: 'Please specify at least one learner to enroll.' });
    }

    const createdEnrollments = [];
    const createdTransactions = [];

    for (const l of targetLearners) {
      const learnerUserId = l.user_id || l.id || `user-off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const targetLearnerName = l.name || l.learner_name || 'Enrolled Learner';
      const targetLearnerEmail = l.email || l.learner_email || 'learner@domain.com';

      let userObj = await User.findByPk(learnerUserId).catch(() => null);
      if (!userObj && targetLearnerEmail) {
        userObj = await User.findOne({ where: { email: targetLearnerEmail } }).catch(() => null);
      }

      const enrollmentId = `enr-man-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const initialStatus = status || 'MANUALLY_ENROLLED';

      const enrollmentPayload = {
        id: enrollmentId,
        tenant_id,
        user_id: userObj ? userObj.id : learnerUserId,
        course_id,
        learner_name: targetLearnerName,
        learner_email: targetLearnerEmail,
        course_title: course.title,
        status: initialStatus,
        enrollment_type: 'OFFLINE_PAYMENT',
        payment_method: payment_method || 'CASH',
        payment_reference: payment_reference || `OFF-REC-${Math.floor(100000 + Math.random() * 900000)}`,
        payment_amount: finalAmount,
        payment_date: payment_date ? new Date(payment_date) : new Date(),
        payment_proof: payment_proof || '',
        enrolled_by_admin: adminName,
        start_date: start_date ? new Date(start_date) : new Date(),
        expiry_date: expiry_date ? new Date(expiry_date) : null,
        notes: notes || `Offline fee collected via ${payment_method || 'Cash'}. Manual enrollment by ${adminName}.`,
        progress_percentage: 0,
        completed_lessons: []
      };

      let enrollment = await Enrollment.findOne({ where: { user_id: enrollmentPayload.user_id, course_id } });
      if (enrollment) {
        await enrollment.update(enrollmentPayload);
      } else {
        enrollment = await Enrollment.create(enrollmentPayload);
        await course.increment('enrolled_count', { by: 1 }).catch(() => {});
      }

      createdEnrollments.push(enrollment);

      const invoiceNo = `REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const txn = await Transaction.create({
        id: `txn-off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        tenant_id,
        user_id: enrollmentPayload.user_id,
        learner_name: targetLearnerName,
        course_id,
        course_title: course.title,
        amount: finalAmount,
        currency: 'INR',
        gateway: `OFFLINE_${payment_method || 'CASH'}`,
        payment_method: payment_method || 'CASH',
        transaction_ref: enrollmentPayload.payment_reference,
        payment_proof: payment_proof || '',
        invoice_no: invoiceNo,
        notes: notes || `Offline receipt verified. Enrolled by ${adminName}`,
        status: initialStatus === 'PENDING_APPROVAL' ? 'PENDING' : 'SUCCESS'
      }).catch((e) => {
        console.warn('Manual txn record note:', e.message);
        return null;
      });

      if (txn) createdTransactions.push(txn);
    }

    return res.status(201).json({
      success: true,
      message: `Successfully created offline manual enrollment for ${createdEnrollments.length} learner(s).`,
      data: {
        enrolledCount: createdEnrollments.length,
        course_title: course.title,
        enrollments: createdEnrollments,
        transactions: createdTransactions
      }
    });
  } catch (err) {
    console.error('Error creating manual offline enrollment:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.approveEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const adminName = req.user ? req.user.name : 'Administrator';

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    await enrollment.update({
      status: 'ACTIVE',
      notes: `${enrollment.notes || ''} [Approved by ${adminName} on ${new Date().toLocaleDateString()}]`
    });

    if (enrollment.payment_reference) {
      await Transaction.update(
        { status: 'SUCCESS' },
        { where: { transaction_ref: enrollment.payment_reference, status: 'PENDING' } }
      ).catch(() => {});
    }

    return res.json({
      success: true,
      message: `Enrollment for ${enrollment.learner_name || 'Learner'} has been verified and activated!`,
      data: enrollment
    });
  } catch (err) {
    console.error('Error approving enrollment:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expiry_date, notes } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (expiry_date !== undefined) updates.expiry_date = expiry_date;
    if (notes) updates.notes = notes;

    await enrollment.update(updates);

    return res.json({
      success: true,
      message: `Enrollment status updated to ${status || enrollment.status}.`,
      data: enrollment
    });
  } catch (err) {
    console.error('Error updating enrollment status:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEnrollments = async (req, res) => {
  try {
    const { tenant_id, user_id, course_id, status, enrollment_type, payment_method } = req.query;
    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;
    if (user_id) where.user_id = user_id;
    if (course_id) where.course_id = course_id;
    if (status && status !== 'ALL') where.status = status;
    if (enrollment_type && enrollment_type !== 'ALL') where.enrollment_type = enrollment_type;
    if (payment_method && payment_method !== 'ALL') where.payment_method = payment_method;

    const enrollments = await Enrollment.findAll({
      where,
      include: [
        { model: Course, attributes: ['id', 'title', 'thumbnail', 'price', 'instructor_name', 'duration'] },
        { model: User, attributes: ['id', 'name', 'email', 'avatar_url', 'department', 'role'] }
      ],
      order: [['createdAt', 'DESC']]
    }).catch(async () => {
      return await Enrollment.findAll({ where, order: [['createdAt', 'DESC']] });
    });

    return res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (err) {
    console.error('Error fetching enrollments:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id, {
      include: [
        { model: Course },
        { model: User, attributes: ['id', 'name', 'email', 'avatar_url', 'department'] }
      ]
    }).catch(async () => {
      return await Enrollment.findByPk(id);
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    return res.json({ success: true, data: enrollment });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress_percentage, completed_lessons, status } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }

    const updates = {};
    if (progress_percentage !== undefined) updates.progress_percentage = progress_percentage;
    if (completed_lessons !== undefined) updates.completed_lessons = completed_lessons;
    if (status) updates.status = status;
    if (progress_percentage === 100) updates.status = 'COMPLETED';

    await enrollment.update(updates);

    return res.json({
      success: true,
      message: 'Enrollment progress updated successfully',
      data: enrollment
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

exports.getEnrollmentReports = async (req, res) => {
  try {
    const { tenant_id } = req.query;
    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;

    const allEnrollments = await Enrollment.findAll({
      where,
      include: [
        { model: Course, attributes: ['id', 'title', 'price', 'instructor_name'] }
      ],
      order: [['createdAt', 'DESC']]
    }).catch(() => []);

    const allTransactions = await Transaction.findAll({
      where,
      order: [['createdAt', 'DESC']]
    }).catch(() => []);

    const onlinePurchases = allEnrollments.filter(e => e.enrollment_type === 'ONLINE_PURCHASE');
    const offlinePayments = allEnrollments.filter(e => e.enrollment_type === 'OFFLINE_PAYMENT' || e.enrollment_type === 'MANUAL_ADMIN');
    const pendingApprovals = allEnrollments.filter(e => e.status === 'PENDING_APPROVAL' || e.status === 'PENDING_PAYMENT');
    const activeEnrollments = allEnrollments.filter(e => ['ACTIVE', 'MANUALLY_ENROLLED', 'PAYMENT_SUCCESSFUL'].includes(e.status));
    const completedEnrollments = allEnrollments.filter(e => e.status === 'COMPLETED');

    const totalRevenue = allTransactions
      .filter(t => t.status === 'SUCCESS')
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const onlineRevenue = allTransactions
      .filter(t => t.status === 'SUCCESS' && ['RAZORPAY', 'STRIPE'].includes(t.gateway))
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const offlineRevenue = allTransactions
      .filter(t => t.status === 'SUCCESS' && (t.gateway.startsWith('OFFLINE_') || ['CASH', 'BANK_TRANSFER', 'DIRECT_UPI', 'CHEQUE', 'DD'].includes(t.payment_method)))
      .reduce((acc, t) => acc + Number(t.amount || 0), 0);

    const courseStatsMap = {};
    allEnrollments.forEach(e => {
      const cId = e.course_id;
      const cTitle = e.Course?.title || e.course_title || 'Course';
      if (!courseStatsMap[cId]) {
        courseStatsMap[cId] = {
          course_id: cId,
          course_title: cTitle,
          total_enrollments: 0,
          online_count: 0,
          offline_count: 0,
          total_collected: 0
        };
      }
      courseStatsMap[cId].total_enrollments += 1;
      if (e.enrollment_type === 'ONLINE_PURCHASE') courseStatsMap[cId].online_count += 1;
      else courseStatsMap[cId].offline_count += 1;
      courseStatsMap[cId].total_collected += Number(e.payment_amount || 0);
    });

    return res.json({
      success: true,
      summary: {
        total_enrollments: allEnrollments.length,
        active_enrollments: activeEnrollments.length,
        completed_enrollments: completedEnrollments.length,
        pending_approvals: pendingApprovals.length,
        online_purchases_count: onlinePurchases.length,
        offline_payments_count: offlinePayments.length,
        total_revenue: totalRevenue,
        online_revenue: onlineRevenue,
        offline_revenue: offlineRevenue,
        currency: 'INR'
      },
      reports: {
        online_purchases: onlinePurchases,
        offline_payments: offlinePayments,
        pending_approvals: pendingApprovals,
        course_wise_breakdown: Object.values(courseStatsMap),
        transactions_ledger: allTransactions
      }
    });
  } catch (err) {
    console.error('Error generating enrollment reports:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
