const {
  Announcement,
  Notification,
  Message,
  CourseReview,
  Department,
  CourseCategory,
  AcademicProgram,
  Tenant
} = require('../models');

exports.getAnnouncements = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const announcements = await Announcement.findAll({
      where,
      order: [['pinned', 'DESC'], ['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: announcements });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      category = 'General',
      priority = 'NORMAL',
      target_audience = 'ALL',
      pinned = false,
      author = 'Administrator',
      tenant_id
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newAnnouncement = await Announcement.create({
      id: `ann-${Date.now()}`,
      tenant_id: tenant_id || null,
      title,
      content,
      category,
      priority,
      target_audience,
      pinned: Boolean(pinned),
      author,
      created_by: author,
      status: 'PUBLISHED'
    });

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      data: newAnnouncement
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    await announcement.update(req.body);
    return res.json({ success: true, message: 'Announcement updated successfully', data: announcement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    await Announcement.destroy({ where: { id } });
    return res.json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    const userId = req.query.user_id;
    const where = {};
    if (tenantId) where.tenant_id = tenantId;
    if (userId) where.user_id = userId;

    const notifications = await Notification.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type = 'INFO',
      channel = 'IN_APP',
      target_audience = 'ALL',
      tenant_id,
      user_id
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const newNotification = await Notification.create({
      id: `notif-${Date.now()}`,
      tenant_id: tenant_id || null,
      user_id: user_id || null,
      title,
      message,
      type,
      channel,
      target_audience,
      status: 'SENT',
      is_read: false
    });

    return res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: newNotification
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.destroy({ where: { id } });
    return res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const messages = await Message.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const {
      subject,
      body,
      recipient_name = 'All Users',
      recipient_id,
      sender_name = 'Administrator',
      sender_id,
      channel = 'INTERNAL',
      tenant_id
    } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ success: false, message: 'Subject and body are required' });
    }

    const newMessage = await Message.create({
      id: `msg-${Date.now()}`,
      tenant_id: tenant_id || null,
      sender_id: sender_id || null,
      sender_name,
      recipient_id: recipient_id || null,
      recipient_name,
      subject,
      body,
      channel,
      status: 'SENT',
      is_read: false
    });

    return res.status(201).json({
      success: true,
      message: 'Message dispatched successfully',
      data: newMessage
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.destroy({ where: { id } });
    return res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const reviews = await CourseReview.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const {
      course_id,
      user_name = 'Student Learner',
      user_id,
      rating = 5.0,
      feedback,
      tenant_id
    } = req.body;

    const newReview = await CourseReview.create({
      id: `rev-${Date.now()}`,
      course_id: course_id || 'course-general',
      user_id: user_id || null,
      user_name,
      tenant_id: tenant_id || null,
      rating: parseFloat(rating) || 5.0,
      feedback: feedback || 'Excellent learning experience'
    });

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: newReview
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    await CourseReview.destroy({ where: { id } });
    return res.json({ success: true, message: 'Feedback removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const departments = await Department.findAll({
      where,
      include: [{ model: AcademicProgram, required: false }],
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, data: departments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, code, head_of_department, description, tenant_id } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Department name is required' });
    }

    const dept = await Department.create({
      id: `dept-${Date.now()}`,
      tenant_id: tenant_id || null,
      name,
      code: code || name.slice(0, 4).toUpperCase(),
      description: description || '',
      status: 'ACTIVE'
    });

    return res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: dept
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await Department.destroy({ where: { id } });
    return res.json({ success: true, message: 'Department deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const tenantId = req.query.tenant_id;
    const where = tenantId ? { tenant_id: tenantId } : {};
    const categories = await CourseCategory.findAll({
      where,
      order: [['name', 'ASC']]
    });
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, tenant_id } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const cat = await CourseCategory.create({
      id: `cat-${Date.now()}`,
      tenant_id: tenant_id || null,
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      description: description || ''
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: cat
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CourseCategory.destroy({ where: { id } });
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
