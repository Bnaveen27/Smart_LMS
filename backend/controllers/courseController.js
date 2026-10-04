const { Course, Module, Lesson, Enrollment, CourseReview, User, Tenant, Instructor } = require('../models');

const genId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

const resolveValidForeignKeys = async (tenant_id, instructor_id) => {
  let resolvedTenantId = tenant_id || 'tenant-default';
  let resolvedInstructorId = instructor_id || null;

  try {
    if (resolvedTenantId && Tenant) {
      const t = await Tenant.findByPk(resolvedTenantId).catch(() => null);
      if (!t) {
        const firstT = await Tenant.findOne().catch(() => null);
        resolvedTenantId = firstT ? firstT.id : null;
      }
    }

    if (resolvedInstructorId && User) {
      const u = await User.findByPk(resolvedInstructorId).catch(() => null);
      if (!u) {
        if (Instructor) {
          const inst = await Instructor.findByPk(resolvedInstructorId).catch(() => null);
          if (inst && inst.user_id) {
            const linkedU = await User.findByPk(inst.user_id).catch(() => null);
            resolvedInstructorId = linkedU ? linkedU.id : null;
          } else {
            resolvedInstructorId = null;
          }
        } else {
          resolvedInstructorId = null;
        }
      }
    }
  } catch (e) {
    console.warn('Foreign key resolution warning:', e.message);
  }

  return { resolvedTenantId, resolvedInstructorId };
};

exports.getCourses = async (req, res) => {
  try {
    const { tenant_id, search } = req.query;
    const where = {};
    if (tenant_id) where.tenant_id = tenant_id;
    
    const courses = await Course.findAll({ 
      where, 
      include: [
        {
          model: Module,
          include: [{ model: Lesson }]
        }
      ],
      order: [['createdAt', 'DESC']] 
    });

    const enriched = await Promise.all(courses.map(async (c) => {
      const dbEnrollmentCount = await Enrollment.count({ where: { course_id: c.id } }).catch(() => 0);
      const dbReviews = CourseReview ? await CourseReview.findAll({ where: { course_id: c.id } }).catch(() => []) : [];
      
      const plain = c.get({ plain: true });
      plain.enrolled_count = Math.max(Number(plain.enrolled_count) || 0, dbEnrollmentCount);

      if (dbReviews && dbReviews.length > 0) {
        const totalRating = dbReviews.reduce((acc, r) => acc + (Number(r.rating) || 5.0), 0);
        plain.rating = Number((totalRating / dbReviews.length).toFixed(1));
        plain.rating_count = dbReviews.length;
      } else {
        plain.rating = plain.rating !== undefined && plain.rating !== null ? Number(plain.rating) : 5.0;
        plain.rating_count = 0;
      }

      return plain;
    }));

    return res.json(enriched);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id, {
      include: [{ model: Module, include: [Lesson] }]
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    
    const dbEnrollmentCount = await Enrollment.count({ where: { course_id: id } }).catch(() => 0);
    const dbReviews = CourseReview ? await CourseReview.findAll({ where: { course_id: id } }).catch(() => []) : [];
    
    const plain = course.get({ plain: true });
    plain.enrolled_count = Math.max(Number(plain.enrolled_count) || 0, dbEnrollmentCount);

    if (dbReviews && dbReviews.length > 0) {
      const totalRating = dbReviews.reduce((acc, r) => acc + (Number(r.rating) || 5.0), 0);
      plain.rating = Number((totalRating / dbReviews.length).toFixed(1));
      plain.rating_count = dbReviews.length;
    } else {
      plain.rating = plain.rating !== undefined && plain.rating !== null ? Number(plain.rating) : 5.0;
      plain.rating_count = 0;
    }
    
    return res.json(plain);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.submitCourseReview = async (req, res) => {
  try {
    const { id } = req.params; 
    const { rating, feedback, user_id, user_name, tenant_id } = req.body;

    if (!rating || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Please provide a valid rating between 1 and 5 stars.' });
    }

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const finalUserId = user_id || (req.user ? req.user.id : `learner-${Date.now()}`);
    const finalUserName = user_name || (req.user ? req.user.name : 'Learner');
    const numericRating = Math.max(1, Math.min(5, Number(rating)));

    let review;
    if (user_id) {
      review = await CourseReview.findOne({ where: { course_id: id, user_id: finalUserId } });
    }

    if (review) {
      review.rating = numericRating;
      review.feedback = feedback || review.feedback;
      review.user_name = finalUserName;
      await review.save();
    } else {
      review = await CourseReview.create({
        id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        course_id: id,
        user_id: finalUserId,
        user_name: finalUserName,
        tenant_id: tenant_id || course.tenant_id,
        rating: numericRating,
        feedback: feedback || ''
      });
    }

    const allReviews = await CourseReview.findAll({ where: { course_id: id } });
    const totalScore = allReviews.reduce((acc, r) => acc + Number(r.rating || 5.0), 0);
    const newAvgRating = Number((totalScore / Math.max(1, allReviews.length)).toFixed(1));

    course.rating = newAvgRating;
    await course.save();

    console.log(`⭐ New review submitted for "${course.title}": ${numericRating} stars by ${finalUserName}. New Average: ${newAvgRating} (${allReviews.length} reviews)`);

    return res.json({
      success: true,
      message: 'Thank you for your rating and feedback! Course review saved.',
      data: {
        course_id: id,
        rating: newAvgRating,
        rating_count: allReviews.length,
        review
      }
    });
  } catch (err) {
    console.error('Submit review error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit review: ' + err.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await CourseReview.findAll({
      where: { course_id: id },
      order: [['createdAt', 'DESC']]
    });
    return res.json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { id, title, code, subtitle, description, thumbnail, price, level, tenant_id, instructor_id, instructor_name, modules, category, learning_outcomes, published } = req.body;
    
    const { resolvedTenantId, resolvedInstructorId } = await resolveValidForeignKeys(
      tenant_id || (req.user ? req.user.tenant_id : null),
      instructor_id || (req.user ? req.user.id : null)
    );

    const courseId = id || genId('course');
    const newCourse = {
      id: courseId,
      tenant_id: resolvedTenantId,
      instructor_id: resolvedInstructorId,
      instructor_name: instructor_name || (req.user ? req.user.name : 'Course Instructor'),
      code: code || `CRS-${Math.floor(100 + Math.random() * 900)}`,
      category: category || 'Development',
      title,
      subtitle: subtitle || '',
      description: description || '',
      learning_outcomes: learning_outcomes || [],
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      price: parseFloat(price) || 0.00,
      is_enterprise_eligible: true,
      level: level || 'BEGINNER',
      rating: 5.0,
      enrolled_count: 0,
      published: published !== undefined ? published : true
    };

    const created = await Course.create(newCourse);

    if (modules && Array.isArray(modules) && modules.length > 0) {
      for (let mIdx = 0; mIdx < modules.length; mIdx++) {
        const mod = modules[mIdx];
        const moduleId = mod.id || genId('mod');
        
        const createdMod = await Module.create({
          id: moduleId,
          course_id: courseId,
          title: mod.title || `Module ${mIdx + 1}`,
          sort_order: mIdx + 1
        });

        if (mod.lessons && Array.isArray(mod.lessons) && mod.lessons.length > 0) {
          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            await Lesson.create({
              id: les.id || genId('les'),
              module_id: createdMod.id,
              title: les.title || `Lesson ${lIdx + 1}`,
              type: les.type || 'video',
              video_url: les.video_url || null,
              content: les.description || les.content || null,
              preview: Boolean(les.preview),
              duration_mins: Number(les.duration_mins) || 15,
              sort_order: lIdx + 1
            });
          }
        }
      }
    }

    const fullCourse = await Course.findByPk(courseId, {
      include: [{ model: Module, include: [Lesson] }]
    });

    console.log(`[Course] Saved new course with curriculum in DB: "${title}" (ID: ${courseId})`);

    return res.status(201).json(fullCourse || created);
  } catch (err) {
    console.error('Create course error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const { title, code, category, learning_outcomes, subtitle, description, thumbnail, price, level, published, modules, instructor_name, instructor_id, tenant_id } = req.body;

    if (title !== undefined) course.title = title;
    if (code !== undefined) course.code = code;
    if (category !== undefined) course.category = category;
    if (learning_outcomes !== undefined) course.learning_outcomes = learning_outcomes;
    if (subtitle !== undefined) course.subtitle = subtitle;
    if (description !== undefined) course.description = description;
    if (thumbnail !== undefined) course.thumbnail = thumbnail;
    if (price !== undefined) course.price = parseFloat(price) || 0.00;
    if (level !== undefined) course.level = level;
    if (published !== undefined) course.published = published;
    if (instructor_name !== undefined) course.instructor_name = instructor_name;

    if (instructor_id !== undefined || tenant_id !== undefined) {
      const { resolvedTenantId, resolvedInstructorId } = await resolveValidForeignKeys(
        tenant_id || course.tenant_id,
        instructor_id !== undefined ? instructor_id : course.instructor_id
      );
      if (tenant_id !== undefined) course.tenant_id = resolvedTenantId;
      if (instructor_id !== undefined) course.instructor_id = resolvedInstructorId;
    }

    await course.save();

    if (modules && Array.isArray(modules)) {
      
      await Module.destroy({ where: { course_id: id } });

      for (let mIdx = 0; mIdx < modules.length; mIdx++) {
        const mod = modules[mIdx];
        const moduleId = mod.id || genId('mod');
        
        const createdMod = await Module.create({
          id: moduleId,
          course_id: id,
          title: mod.title || `Module ${mIdx + 1}`,
          sort_order: mIdx + 1
        });

        if (mod.lessons && Array.isArray(mod.lessons) && mod.lessons.length > 0) {
          for (let lIdx = 0; lIdx < mod.lessons.length; lIdx++) {
            const les = mod.lessons[lIdx];
            await Lesson.create({
              id: les.id || genId('les'),
              module_id: createdMod.id,
              title: les.title || `Lesson ${lIdx + 1}`,
              type: les.type || 'video',
              video_url: les.video_url || null,
              content: les.description || les.content || null,
              preview: Boolean(les.preview),
              duration_mins: Number(les.duration_mins) || 15,
              sort_order: lIdx + 1
            });
          }
        }
      }
    }

    const updated = await Course.findByPk(id, {
      include: [{ model: Module, include: [Lesson] }]
    });

    return res.json(updated);
  } catch (err) {
    console.error('Update course error:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    await course.destroy();
    return res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const fs = require('fs');
const path = require('path');

exports.uploadContent = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const uploadDir = path.join(__dirname, '../uploads/lessons');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(req.file.originalname) || '';
    const safeName = `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const targetPath = path.join(uploadDir, safeName);

    fs.writeFileSync(targetPath, req.file.buffer);

    const relativeUrl = `/uploads/lessons/${safeName}`;
    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol || 'http';
    const fullUrl = `${protocol}://${host}${relativeUrl}`;

    return res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: fullUrl,
        relativeUrl: relativeUrl,
        fileName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype
      }
    });
  } catch (err) {
    console.error('Lesson content upload error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
