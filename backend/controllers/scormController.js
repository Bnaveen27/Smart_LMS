const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const { ScormPackage, ScormTracking, Course, User, Tenant } = require('../models');
const { processScormZip, SCORM_UPLOAD_DIR } = require('../services/scormParser');

const genId = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

exports.uploadPackage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach a SCORM .zip file.' });
    }

    let tenantId = req.user?.tenant_id || req.body.tenant_id || null;
    let courseId = req.body.course_id || null;

    if (tenantId) {
      const t = await Tenant.findByPk(tenantId);
      if (!t) tenantId = null;
    }
    if (courseId) {
      const c = await Course.findByPk(courseId);
      if (!c) courseId = null;
    }

    const packageId = genId('scorm-pkg');
    const customTitle = req.body.title;

    const parsed = await processScormZip(req.file.buffer || req.file.path, packageId);

    const scormPackage = await ScormPackage.create({
      id: packageId,
      tenant_id: tenantId,
      course_id: courseId,
      title: customTitle || parsed.title,
      description: req.body.description || `Interactive ${parsed.version.replace('_', ' ')} eLearning Module`,
      version: parsed.version,
      manifest_identifier: parsed.manifest_identifier,
      launch_url: parsed.launch_url,
      entry_point: parsed.entry_point,
      package_path: parsed.package_path,
      mastery_score: parsed.mastery_score,
      file_size_bytes: req.file.size || 0,
      thumbnail: req.body.thumbnail || (parsed.version === 'SCORM_2004'
        ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80'),
      status: 'ACTIVE'
    });

    return res.status(201).json({
      success: true,
      message: `${parsed.version.replace('_', ' ')} package uploaded and initialized successfully!`,
      data: scormPackage
    });
  } catch (err) {
    console.error('SCORM Upload error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process SCORM package: ' + err.message });
  }
};

exports.getPackages = async (req, res) => {
  try {
    const tenantId = req.user?.tenant_id || req.query.tenant_id;
    const where = { status: 'ACTIVE' };
    if (tenantId) where.tenant_id = tenantId;

    const packages = await ScormPackage.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.json({ success: true, data: packages });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPackageDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await ScormPackage.findByPk(id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'SCORM Package not found' });
    }
    return res.json({ success: true, data: pkg });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTracking = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.user?.id || req.query.user_id || 'user-demo';

    let tracking = await ScormTracking.findOne({
      where: { scorm_package_id: packageId, user_id: userId }
    });

    if (!tracking) {
      
      const pkg = await ScormPackage.findByPk(packageId);
      tracking = await ScormTracking.create({
        id: genId('scorm-trk'),
        tenant_id: pkg ? pkg.tenant_id : null,
        user_id: userId,
        scorm_package_id: packageId,
        course_id: pkg ? pkg.course_id : null,
        lesson_status: 'not attempted',
        lesson_location: '',
        suspend_data: '',
        score_raw: null,
        score_min: 0,
        score_max: 100,
        score_scaled: null,
        total_time: '00:00:00',
        session_time: '00:00:00',
        attempt_count: 1,
        last_accessed_at: new Date(),
        cmi_data: {}
      });
    }

    return res.json({
      success: true,
      data: tracking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.commitTracking = async (req, res) => {
  try {
    const { packageId } = req.params;
    const userId = req.user?.id || req.body.user_id || 'user-demo';
    const {
      lesson_status,
      lesson_location,
      suspend_data,
      score_raw,
      score_min,
      score_max,
      score_scaled,
      session_time,
      total_time,
      is_new_attempt,
      cmi_data
    } = req.body;

    let validUserId = null;
    if (userId) {
      const u = await User.findByPk(userId);
      if (u) validUserId = userId;
    }

    let tracking = await ScormTracking.findOne({
      where: { 
        scorm_package_id: packageId, 
        ...(validUserId ? { user_id: validUserId } : {}) 
      }
    });

    if (!tracking) {
      const pkg = await ScormPackage.findByPk(packageId);
      tracking = await ScormTracking.create({
        id: genId('scorm-trk'),
        tenant_id: pkg ? pkg.tenant_id : null,
        user_id: validUserId,
        scorm_package_id: packageId,
        course_id: pkg ? pkg.course_id : null,
        lesson_status: lesson_status || 'incomplete',
        lesson_location: lesson_location || '',
        suspend_data: suspend_data || '',
        score_raw: score_raw !== undefined ? score_raw : null,
        score_min: score_min || 0,
        score_max: score_max || 100,
        score_scaled: score_scaled !== undefined ? score_scaled : null,
        session_time: session_time || '00:00:00',
        total_time: total_time || session_time || '00:00:00',
        attempt_count: 1,
        last_accessed_at: new Date(),
        cmi_data: cmi_data || {}
      });
    } else {
      const updatedFields = {
        last_accessed_at: new Date()
      };

      if (lesson_status !== undefined) updatedFields.lesson_status = lesson_status;
      if (lesson_location !== undefined) updatedFields.lesson_location = lesson_location;
      if (suspend_data !== undefined) updatedFields.suspend_data = suspend_data;
      if (score_raw !== undefined) updatedFields.score_raw = score_raw;
      if (score_min !== undefined) updatedFields.score_min = score_min;
      if (score_max !== undefined) updatedFields.score_max = score_max;
      if (score_scaled !== undefined) updatedFields.score_scaled = score_scaled;
      if (session_time !== undefined) updatedFields.session_time = session_time;
      if (total_time !== undefined) updatedFields.total_time = total_time;
      if (cmi_data !== undefined) updatedFields.cmi_data = { ...tracking.cmi_data, ...cmi_data };
      if (is_new_attempt) updatedFields.attempt_count = (tracking.attempt_count || 1) + 1;

      await tracking.update(updatedFields);
    }

    return res.json({
      success: true,
      message: 'SCORM tracking committed successfully',
      data: tracking
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const packageId = req.params.packageId || req.query.package_id;
    const tenantId = req.user?.tenant_id || req.query.tenant_id;
    const where = {};
    if (tenantId) where.tenant_id = tenantId;
    if (packageId) where.scorm_package_id = packageId;

    const trackings = await ScormTracking.findAll({
      where,
      include: [
        { model: ScormPackage, attributes: ['id', 'title', 'version', 'mastery_score'] },
        { model: User, attributes: ['id', 'name', 'email', 'role'], required: false }
      ],
      order: [['last_accessed_at', 'DESC']]
    });

    let targetPackage = null;
    if (packageId) {
      targetPackage = await ScormPackage.findByPk(packageId);
    }
    const packages = await ScormPackage.findAll({ where: tenantId ? { tenant_id: tenantId } : {} });

    let totalAttempts = 0;
    let completedCount = 0;
    let passedCount = 0;
    let failedCount = 0;
    let incompleteCount = 0;
    let scoreSum = 0;
    let scoredCount = 0;

    trackings.forEach(t => {
      totalAttempts += t.attempt_count || 1;
      const status = (t.lesson_status || '').toLowerCase();
      if (status === 'completed' || status === 'passed') completedCount++;
      if (status === 'passed') passedCount++;
      if (status === 'failed') failedCount++;
      if (status === 'incomplete' || status === 'in_progress') incompleteCount++;
      if (t.score_raw !== null && t.score_raw !== undefined) {
        scoreSum += parseFloat(t.score_raw);
        scoredCount++;
      }
    });

    const averageScore = scoredCount > 0 ? Math.round(scoreSum / scoredCount) : 0;
    const passRate = trackings.length > 0 ? Math.round((passedCount / trackings.length) * 100) : 0;
    const completionRate = trackings.length > 0 ? Math.round((completedCount / trackings.length) * 100) : 0;

    const summary = {
      total_learners: trackings.length,
      totalPackages: packages.length,
      totalTrackings: trackings.length,
      totalAttempts,
      completed_count: completedCount,
      passed_count: passedCount,
      failed_count: failedCount,
      incomplete_count: incompleteCount,
      avg_score: averageScore,
      averageScore,
      pass_rate: passRate,
      completionRate
    };

    return res.json({
      success: true,
      data: {
        package: targetPackage,
        summary,
        records: trackings,
        trackings,
        packages
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await ScormPackage.findByPk(id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    if (pkg.package_path && fs.existsSync(pkg.package_path)) {
      try {
        fs.rmSync(pkg.package_path, { recursive: true, force: true });
      } catch (e) {
        console.warn('Could not remove directory:', e.message);
      }
    }

    await pkg.destroy();
    return res.json({ success: true, message: 'SCORM Package removed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.generateSamplePackage = async (req, res) => {
  try {
    const { version, tenant_id, course_id } = req.body || {};
    const scormVer = (version === 'SCORM_2004') ? 'SCORM_2004' : 'SCORM_1.2';
    const packageId = genId('scorm-sample');
    const targetDir = path.join(SCORM_UPLOAD_DIR, packageId);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const title = scormVer === 'SCORM_2004'
      ? 'Cybersecurity & Data Privacy Protocol (SCORM 2004 4th Edition)'
      : 'Modern Workplace Safety & Compliance (SCORM 1.2 Interactive Track)';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
    body { background: #0f172a; color: #f8fafc; display: flex; flex-direction: column; min-height: 100vh; justify-content: space-between; }
    .header { background: #1e293b; border-bottom: 1px solid #334155; padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; }
    .badge { background: #4f46e5; color: white; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .container { max-width: 800px; margin: 30px auto; padding: 0 20px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; padding: 32px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
    .slide-title { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #ffffff; }
    .slide-desc { font-size: 14px; line-height: 1.7; color: #94a3b8; margin-bottom: 24px; }
    .quiz-option { background: #0f172a; border: 2px solid #334155; border-radius: 12px; padding: 14px 18px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 600; }
    .quiz-option:hover { border-color: #6366f1; background: #1e1b4b; }
    .quiz-option.selected { border-color: #4f46e5; background: #312e81; color: white; }
    .nav-bar { display: flex; justify-content: space-between; margin-top: 24px; padding-top: 18px; border-top: 1px solid #334155; }
    .btn { background: #4f46e5; color: white; border: none; padding: 10px 22px; border-radius: 12px; font-weight: 700; font-size: 13px; cursor: pointer; transition: background 0.2s; }
    .btn:hover { background: #4338ca; }
    .btn-secondary { background: #334155; color: #cbd5e1; }
    .btn-secondary:hover { background: #475569; }
    .status-box { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 12px 16px; margin-top: 16px; font-size: 12px; display: flex; justify-content: space-between; font-family: monospace; }
  </style>
</head>
<body>

  <div class="header">
    <div>
      <h1 style="font-size: 16px; font-weight: 800;">${title}</h1>
      <p style="font-size: 11px; color: #94a3b8;">Standard: <b>${scormVer}</b> • Real-time RTE Synchronized</p>
    </div>
    <span class="badge" id="rteStatus">RTE Initializing...</span>
  </div>

  <div class="container">
    <div class="card" id="slideCard">
      <!-- Dynamic slide content injected by script -->
    </div>
  </div>

  <script>
    // SCORM API Discovery & Wrapper
    let scormAPI = null;
    const is2004 = "${scormVer}" === "SCORM_2004";

    function findAPI(win) {
      let findAttempts = 0;
      while ((!win.API && !win.API_1484_11) && (win.parent) && (win.parent !== win) && (findAttempts <= 10)) {
        findAttempts++;
        win = win.parent;
      }
      return is2004 ? win.API_1484_11 : win.API;
    }

    scormAPI = findAPI(window);

    // Initialize SCORM Session
    let isInitialized = false;
    if (scormAPI) {
      const initResult = is2004 ? scormAPI.Initialize("") : scormAPI.LMSInitialize("");
      isInitialized = (initResult === "true" || initResult === true);
      document.getElementById('rteStatus').textContent = isInitialized ? "Connected to LMS API" : "RTE Standalone Mode";
      document.getElementById('rteStatus').style.background = "#059669";
    } else {
      document.getElementById('rteStatus').textContent = "Demo Sandbox Mode";
    }

    // Slides Data
    const slides = [
      {
        title: "Module 1: Fundamental Principles & Best Practices",
        content: "Welcome to this interactive SCORM module. In this training, you will explore mandatory standards, risk management protocols, and essential operational procedures.",
        type: "info"
      },
      {
        title: "Knowledge Check 1: Primary Authentication Protocol",
        content: "What is the recommended industry standard for securing multi-tenant cloud LMS access?",
        type: "quiz",
        options: [
          "Single-factor simple passwords",
          "Multi-Factor Authentication (MFA) & Verified Work Emails",
          "Shared generic team credentials",
          "Public API tokens without expiry"
        ],
        correctIndex: 1
      },
      {
        title: "Module 2: Compliance & Progress Check",
        content: "Your score and completion status will be saved back into the LMS gradebook and learner profile in real time.",
        type: "info"
      },
      {
        title: "Assessment Final: Security Protocols",
        content: "How often should enterprise compliance audits be conducted?",
        type: "quiz",
        options: [
          "Once every ten years",
          "Quarterly or upon major system configuration updates",
          "Never, if backups exist",
          "Only when a data breach happens"
        ],
        correctIndex: 1
      },
      {
        title: "🎉 Training Completed!",
        content: "Congratulations! You have completed all learning objectives for this module. Your score has been transmitted to your Smart LMS profile.",
        type: "complete"
      }
    ];

    let currentSlide = 0;
    let userAnswers = {};
    let earnedScore = 0;

    // Restore Location & SuspendData (Resume Learning Feature)
    if (scormAPI && isInitialized) {
      try {
        const savedLoc = is2004 ? scormAPI.GetValue("cmi.location") : scormAPI.LMSGetValue("cmi.core.lesson_location");
        if (savedLoc && !isNaN(parseInt(savedLoc))) {
          currentSlide = Math.min(parseInt(savedLoc), slides.length - 1);
        }
      } catch (e) {}
    }

    function renderSlide() {
      const slide = slides[currentSlide];
      const card = document.getElementById('slideCard');
      
      let html = '<div class="slide-title">' + slide.title + '</div>';
      html += '<p class="slide-desc">' + slide.content + '</p>';

      if (slide.type === 'quiz') {
        html += '<div class="quiz-options">';
        slide.options.forEach((opt, idx) => {
          const isSelected = userAnswers[currentSlide] === idx;
          html += '<div class="quiz-option ' + (isSelected ? 'selected' : '') + '" onclick="selectAnswer(' + idx + ')">';
          html += '<span style="font-weight: 800; color: #818cf8;">' + String.fromCharCode(65 + idx) + '.</span> ' + opt;
          html += '</div>';
        });
        html += '</div>';
      }

      if (slide.type === 'complete') {
        const finalPercent = Math.round((earnedScore / 2) * 100);
        html += '<div style="text-align: center; padding: 20px 0;">';
        html += '<div style="font-size: 48px; font-weight: 900; color: #10b981;">' + finalPercent + '%</div>';
        html += '<p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Final Mastery Score</p>';
        html += '</div>';
      }

      html += '<div class="nav-bar">';
      if (currentSlide > 0 && slide.type !== 'complete') {
        html += '<button class="btn btn-secondary" onclick="prevSlide()">← Previous</button>';
      } else {
        html += '<div></div>';
      }

      if (currentSlide < slides.length - 1) {
        html += '<button class="btn" onclick="nextSlide()">Continue →</button>';
      } else {
        html += '<button class="btn" style="background: #059669;" onclick="finishCourse()">Submit & Finish Module ✓</button>';
      }
      html += '</div>';

      html += '<div class="status-box">';
      html += '<span>Slide ' + (currentSlide + 1) + ' of ' + slides.length + '</span>';
      html += '<span>Bookmark (cmi.location): ' + currentSlide + '</span>';
      html += '</div>';

      card.innerHTML = html;

      // Commit Location to SCORM RTE
      if (scormAPI && isInitialized) {
        try {
          if (is2004) {
            scormAPI.SetValue("cmi.location", currentSlide.toString());
            scormAPI.SetValue("cmi.completion_status", currentSlide === slides.length - 1 ? "completed" : "incomplete");
            scormAPI.Commit("");
          } else {
            scormAPI.LMSSetValue("cmi.core.lesson_location", currentSlide.toString());
            scormAPI.LMSSetValue("cmi.core.lesson_status", currentSlide === slides.length - 1 ? "completed" : "incomplete");
            scormAPI.LMSCommit("");
          }
        } catch (e) {}
      }
    }

    window.selectAnswer = function(idx) {
      userAnswers[currentSlide] = idx;
      renderSlide();
    };

    window.nextSlide = function() {
      const slide = slides[currentSlide];
      if (slide.type === 'quiz') {
        if (userAnswers[currentSlide] === undefined) {
          alert('Please select an answer to proceed.');
          return;
        }
        if (userAnswers[currentSlide] === slide.correctIndex) {
          earnedScore += 1;
        }
      }
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        renderSlide();
      }
    };

    window.prevSlide = function() {
      if (currentSlide > 0) {
        currentSlide--;
        renderSlide();
      }
    };

    window.finishCourse = function() {
      const finalPercent = Math.round((earnedScore / 2) * 100);
      const isPassed = finalPercent >= 70;

      if (scormAPI && isInitialized) {
        try {
          if (is2004) {
            scormAPI.SetValue("cmi.score.raw", finalPercent.toString());
            scormAPI.SetValue("cmi.score.scaled", (finalPercent / 100).toString());
            scormAPI.SetValue("cmi.completion_status", "completed");
            scormAPI.SetValue("cmi.success_status", isPassed ? "passed" : "failed");
            scormAPI.Commit("");
            scormAPI.Terminate("");
          } else {
            scormAPI.LMSSetValue("cmi.core.score.raw", finalPercent.toString());
            scormAPI.LMSSetValue("cmi.core.lesson_status", isPassed ? "passed" : "completed");
            scormAPI.LMSCommit("");
            scormAPI.LMSFinish("");
          }
        } catch (e) {}
      }
      alert('Module completed successfully with score: ' + finalPercent + '%! Status: ' + (isPassed ? 'PASSED' : 'COMPLETED'));
    };

    renderSlide();
  </script>
</body>
</html>`;

    const manifestXml = scormVer === 'SCORM_2004'
      ? `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${packageId}" version="1.0"
          xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
          xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
          xmlns:imsss="http://www.imsglobal.org/xsd/imsss">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>2004 4th Edition</schemaversion>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${title}</title>
      <item identifier="ITEM-1" identifierref="RES-1">
        <title>${title}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormType="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`
      : `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${packageId}" version="1.0"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="ORG-1">
    <organization identifier="ORG-1">
      <title>${title}</title>
      <item identifier="ITEM-1" identifierref="RES-1">
        <title>${title}</title>
        <adlcp:masteryscore>70</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES-1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;

    fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
    fs.writeFileSync(path.join(targetDir, 'imsmanifest.xml'), manifestXml, 'utf8');

    let validTenantId = null;
    const reqTenantId = tenant_id || req.user?.tenant_id;
    if (reqTenantId) {
      const t = await Tenant.findByPk(reqTenantId);
      if (t) validTenantId = reqTenantId;
    }

    let validCourseId = null;
    if (course_id) {
      const c = await Course.findByPk(course_id);
      if (c) validCourseId = course_id;
    }

    const scormPackage = await ScormPackage.create({
      id: packageId,
      tenant_id: validTenantId,
      course_id: validCourseId,
      title: title,
      description: `Interactive ${scormVer.replace('_', ' ')} verified compliance package with live score tracking, resume bookmarks, and RTE API.`,
      version: scormVer,
      manifest_identifier: packageId,
      launch_url: `/uploads/scorm/${packageId}/index.html`,
      entry_point: 'index.html',
      package_path: targetDir,
      mastery_score: 70.0,
      file_size_bytes: htmlContent.length + manifestXml.length,
      thumbnail: scormVer === 'SCORM_2004'
        ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      status: 'ACTIVE'
    });

    return res.status(201).json({
      success: true,
      message: `Sample ${scormVer.replace('_', ' ')} package generated successfully!`,
      data: scormPackage
    });
  } catch (err) {
    console.error('Sample SCORM generate error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
