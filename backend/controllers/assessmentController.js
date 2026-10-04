const {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Assignment,
  AssignmentSubmission
} = require('../models');

exports.getQuizzes = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const quizzes = await Quiz.findAll({
      where,
      include: QuizQuestion ? [{ model: QuizQuestion, as: 'questions', required: false }] : [],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: quizzes });
  } catch (err) {
    console.error('Error fetching quizzes from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { score, percentage } = req.body;
    const userId = req.user?.id || req.user?.userId;
    const tenantId = req.user?.tenant_id || req.user?.tenantId;

    const attempt = await QuizAttempt.create({
      id: `attempt-${Date.now()}`,
      tenant_id: tenantId,
      quiz_id: id,
      user_id: userId,
      score: score || 0,
      percentage: percentage || 0,
      passed: (percentage || 0) >= 60,
      status: 'EVALUATED',
      submitted_at: new Date()
    });

    return res.json({
      success: true,
      message: 'Quiz submitted and evaluated successfully',
      data: attempt
    });
  } catch (err) {
    console.error('Error submitting quiz attempt in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.user?.tenantId || req.query?.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const assignments = await Assignment.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: assignments });
  } catch (err) {
    console.error('Error fetching assignments from DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { submission_text, file_path } = req.body;
    const userId = req.user?.id || req.user?.userId;
    const tenantId = req.user?.tenant_id || req.user?.tenantId;

    const submission = await AssignmentSubmission.create({
      id: `sub-${Date.now()}`,
      tenant_id: tenantId,
      assignment_id: id,
      user_id: userId,
      submission_text: submission_text || '',
      file_path: file_path || null,
      status: 'PENDING'
    });

    return res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: submission
    });
  } catch (err) {
    console.error('Error submitting assignment in DB:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
