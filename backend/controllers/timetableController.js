const { Timetable, Course, Tenant } = require('../models');

const genId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

exports.getTimetable = async (req, res) => {
  try {
    const { tenant_id, instructor_id, day_of_week } = req.query;
    const where = {};

    if (tenant_id) where.tenant_id = tenant_id;
    if (instructor_id) where.instructor_id = instructor_id;
    if (day_of_week) where.day_of_week = day_of_week;

    const entries = await Timetable.findAll({
      where,
      order: [['day_of_week', 'ASC'], ['start_time', 'ASC']]
    });

    return res.json({
      success: true,
      data: entries
    });
  } catch (err) {
    console.error('Error fetching timetable from DB:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch timetable: ' + err.message });
  }
};

exports.createTimetable = async (req, res) => {
  try {
    const {
      tenant_id,
      instructor_id,
      instructor_name,
      course_id,
      course_title,
      day_of_week,
      start_time,
      end_time,
      title,
      session_type,
      location,
      meeting_url
    } = req.body;

    if (!day_of_week || !start_time || !end_time || !title) {
      return res.status(400).json({
        success: false,
        message: 'Day of week, start time, end time, and title are required.'
      });
    }

    let finalTenantId = tenant_id || (req.user ? req.user.tenant_id : null);
    if (!finalTenantId) {
      const firstTenant = await Tenant.findOne();
      if (firstTenant) finalTenantId = firstTenant.id;
    }

    const newEntry = await Timetable.create({
      id: genId('tt'),
      tenant_id: finalTenantId || 'tenant-default',
      instructor_id: instructor_id || (req.user ? req.user.id : null),
      instructor_name: instructor_name || (req.user ? req.user.name : 'Faculty Member'),
      course_id: course_id || null,
      course_title: course_title || title,
      day_of_week,
      start_time,
      end_time,
      title: title.trim(),
      session_type: session_type || 'LECTURE',
      location: location || 'Lecture Hall / Online',
      meeting_url: meeting_url || null,
      status: 'ACTIVE'
    });

    console.log(`[Timetable] Saved new timetable slot in DB: "${newEntry.title}" for ${newEntry.day_of_week} (${newEntry.start_time} - ${newEntry.end_time})`);

    return res.status(201).json({
      success: true,
      message: 'Timetable lecture slot successfully scheduled and saved in database!',
      data: newEntry
    });
  } catch (err) {
    console.error('Error creating timetable slot in DB:', err);
    return res.status(500).json({ success: false, message: 'Failed to save timetable slot: ' + err.message });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByPk(id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Timetable entry not found.' });
    }

    const {
      day_of_week,
      start_time,
      end_time,
      title,
      course_id,
      course_title,
      session_type,
      location,
      meeting_url,
      status
    } = req.body;

    if (day_of_week !== undefined) entry.day_of_week = day_of_week;
    if (start_time !== undefined) entry.start_time = start_time;
    if (end_time !== undefined) entry.end_time = end_time;
    if (title !== undefined) entry.title = title.trim();
    if (course_id !== undefined) entry.course_id = course_id;
    if (course_title !== undefined) entry.course_title = course_title;
    if (session_type !== undefined) entry.session_type = session_type;
    if (location !== undefined) entry.location = location;
    if (meeting_url !== undefined) entry.meeting_url = meeting_url;
    if (status !== undefined) entry.status = status;

    await entry.save();

    return res.json({
      success: true,
      message: 'Timetable slot updated successfully!',
      data: entry
    });
  } catch (err) {
    console.error('Error updating timetable slot in DB:', err);
    return res.status(500).json({ success: false, message: 'Failed to update timetable slot: ' + err.message });
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Timetable.findByPk(id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Timetable entry not found.' });
    }

    await entry.destroy();
    console.log(`🗑️ Deleted timetable slot: ${id}`);

    return res.json({
      success: true,
      message: 'Timetable slot removed successfully!'
    });
  } catch (err) {
    console.error('Error deleting timetable slot in DB:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete timetable slot: ' + err.message });
  }
};
