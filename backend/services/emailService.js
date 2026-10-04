let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

const createTransporter = () => {
  if (!nodemailer) return null;

  const user = process.env.SMTP_USER || 'smartlms2026@gmail.com';
  const pass = process.env.SMTP_PASS || '';

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: user,
      pass: pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

async function sendOtpEmail(toEmail, otp) {
  const fromEmail = process.env.SMTP_USER || 'smartlms2026@gmail.com';
  console.log(`\n======================================================`);
  console.log(`📧 [OTP DISPATCH] From: ${fromEmail} To: ${toEmail}`);
  console.log(`🔑 Verification OTP: [ ${otp} ]`);
  console.log(`======================================================\n`);

  if (!nodemailer) {
    console.warn('⚠️ nodemailer not yet ready. OTP logged to console above.');
    return { success: true, simulated: true, otp };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, simulated: true, otp };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 540px; margin: 30px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 32px 28px; text-align: center; color: #334155; }
        .title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .desc { font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 24px; }
        .otp-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; display: inline-block; margin-bottom: 24px; }
        .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: 8px; margin: 0; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
        .warning { font-size: 12px; color: #e11d48; font-weight: 600; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart LMS Platform</h1>
          <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">Secure Account Verification</p>
        </div>
        <div class="content">
          <div class="title">Verify Your Organization Email</div>
          <p class="desc">
            Thank you for setting up your Smart LMS portal. Please enter the 6-digit verification code below to confirm your email address and activate your Super Admin master account.
          </p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="warning">⏰ This code will expire in 10 minutes.</p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 16px;">
            If you did not request this verification, please safely ignore this email.
          </p>
        </div>
        <div class="footer">
          &copy; 2026 Smart LMS Enterprise & Education. Sent from <b>smartlms2026@gmail.com</b>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Smart LMS Security" <${fromEmail}>`,
      to: toEmail,
      subject: `Your Verification Code: ${otp} - Smart LMS Account Setup`,
      text: `Your Smart LMS verification code is: ${otp}. This code will expire in 10 minutes. Sent from ${fromEmail}`,
      html: htmlContent
    });

    console.log(`[Email Service] Email successfully dispatched via Gmail SMTP: ${info.messageId}`);
    return { success: true, messageId: info.messageId, otp };
  } catch (err) {
    console.warn(`[Email Service] Gmail SMTP Dispatch Notice (${err.message}). OTP logged to console.`);
    return { success: true, simulated: true, error: err.message, otp };
  }
}

async function sendPasswordResetEmail(toEmail, resetLink, userName = 'User') {
  const fromEmail = process.env.SMTP_USER || 'smartlms2026@gmail.com';
  console.log(`\n======================================================`);
  console.log(`[PASSWORD RESET DISPATCH] From: ${fromEmail} To: ${toEmail}`);
  console.log(`Reset Link: ${resetLink}`);
  console.log(`======================================================\n`);

  if (!nodemailer) {
    console.warn('[Email Service] nodemailer not configured. Reset link logged above.');
    return { success: true, simulated: true, resetLink };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, simulated: true, resetLink };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #4338ca 0%, #3b82f6 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .content { padding: 36px 32px; text-align: center; color: #334155; }
        .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .desc { font-size: 14px; line-height: 1.6; color: #64748b; margin-bottom: 28px; text-align: left; }
        .btn-wrapper { margin: 28px 0; }
        .reset-btn { background: #4f46e5; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff !important; padding: 14px 32px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35); }
        .fallback-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-top: 24px; text-align: left; word-break: break-all; font-size: 12px; color: #64748b; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
        .warning { font-size: 13px; color: #e11d48; font-weight: 600; margin-top: 16px; background: #fff1f2; padding: 10px; border-radius: 8px; border: 1px solid #ffe4e6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart LMS Platform</h1>
          <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">Secure Account Access Recovery</p>
        </div>
        <div class="content">
          <div class="title">Password Reset Request</div>
          <p class="desc">
            Hello <strong>${userName}</strong>,<br><br>
            We received a request to reset the password for your <strong>Smart LMS</strong> account associated with <strong>${toEmail}</strong>. Click the button below to choose a new password:
          </p>
          
          <div class="btn-wrapper">
            <a href="${resetLink}" class="reset-btn" target="_blank">Reset Your Password</a>
          </div>

          <div class="warning">
            ⏳ This password reset link is valid for <strong>15 minutes</strong> and can only be used once.
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 20px; text-align: left;">
            If the button above does not work, copy and paste the following link into your web browser:
          </p>
          <div class="fallback-box">
            <a href="${resetLink}" style="color: #4f46e5; text-decoration: underline;">${resetLink}</a>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; text-align: left;">
            If you did not make this request, you can safely disregard this email. Your password will remain unchanged.
          </p>
        </div>
        <div class="footer">
          &copy; 2026 Smart LMS Enterprise & Education Platform.<br>
          Sent from <b>smartlms2026@gmail.com</b>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Smart LMS Security" <${fromEmail}>`,
      to: toEmail,
      subject: `🔐 Reset Your Password - Smart LMS Platform`,
      text: `Hello ${userName},\n\nWe received a request to reset your Smart LMS account password. Click the following link to reset your password:\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: htmlContent
    });

    console.log(`[Email Service] Password reset email successfully dispatched via Gmail SMTP: ${info.messageId}`);
    return { success: true, messageId: info.messageId, resetLink };
  } catch (err) {
    console.warn(`[Email Service] Gmail SMTP Dispatch Notice (${err.message}). Reset link logged to console.`);
    return { success: true, simulated: true, error: err.message, resetLink };
  }
}

async function sendInstructorInvitationEmail(toEmail, inviteLink, instructorName = 'Instructor', tenantName = 'Institute Academy', department = 'Academics') {
  const fromEmail = process.env.SMTP_USER || 'smartlms2026@gmail.com';
  console.log(`\n======================================================`);
  console.log(`[INSTRUCTOR INVITATION DISPATCH] From: ${fromEmail} To: ${toEmail}`);
  console.log(`Institute: ${tenantName} | Department: ${department}`);
  console.log(`Account Setup Link: ${inviteLink}`);
  console.log(`======================================================\n`);

  if (!nodemailer) {
    console.warn('[Email Service] nodemailer not configured. Invitation link logged above.');
    return { success: true, simulated: true, inviteLink };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, simulated: true, inviteLink };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 36px 32px; color: #334155; }
        .title { font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .desc { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
        .card-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .card-row:last-child { margin-bottom: 0; }
        .card-label { color: #64748b; font-weight: 600; }
        .card-value { color: #0f172a; font-weight: 700; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .action-btn { background: #4f46e5; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff !important; padding: 14px 34px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); }
        .fallback-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-top: 20px; word-break: break-all; font-size: 12px; color: #64748b; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
        .info-pill { background: #e0e7ff; color: #3730a3; padding: 10px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; margin-top: 16px; border: 1px solid #c7d2fe; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart LMS Platform</h1>
          <div class="badge">Instructor Portal</div>
        </div>
        <div class="content">
          <div class="title">Welcome, ${instructorName}!</div>
          <p class="desc">
            You have been added as an <strong>Instructor</strong> for <strong>${tenantName}</strong>. You can now complete your profile, choose your secure password, and begin creating and publishing courses.
          </p>

          <div class="card">
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
              <tr>
                <td style="color: #64748b; font-weight: 600;">Institution:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${tenantName}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 600;">Department:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${department}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 600;">Invited Email:</td>
                <td style="color: #4f46e5; font-weight: 700; text-align: right;">${toEmail}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 600;">Role:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">INSTRUCTOR (Course Creator)</td>
              </tr>
            </table>
          </div>
          
          <div class="btn-wrapper">
            <a href="${inviteLink}" class="action-btn" target="_blank">Activate Account & Set Password &rarr;</a>
          </div>

          <div class="info-pill">
            💡 On the setup page, you can configure your specialization, bio, designation, and password.
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
            Or copy and paste this direct link into your browser:
          </p>
          <div class="fallback-box">
            <a href="${inviteLink}" style="color: #4f46e5; text-decoration: underline;">${inviteLink}</a>
          </div>
        </div>
        <div class="footer">
          &copy; 2026 Smart LMS Academic Suite &bull; Sent from <b>smartlms2026@gmail.com</b>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Smart LMS Academic" <${fromEmail}>`,
      to: toEmail,
      subject: `🎓 Invitation to Join ${tenantName} as Instructor - Set Up Your Account`,
      text: `Hello ${instructorName},\n\nYou have been invited to join ${tenantName} (${department}) as an Instructor. Complete your profile and set your password here:\n${inviteLink}\n\nSent from ${fromEmail}`,
      html: htmlContent
    });

    console.log(`[Email Service] Instructor invitation email successfully dispatched via Gmail SMTP: ${info.messageId}`);
    return { success: true, messageId: info.messageId, inviteLink };
  } catch (err) {
    console.warn(`[Email Service] Gmail SMTP Dispatch Notice (${err.message}). Invite link logged to console.`);
    return { success: true, simulated: true, error: err.message, inviteLink };
  }
}

async function sendMemberInvitationEmail({ toEmail, inviteLink, name = 'Member', role = 'LEARNER', tenantName = 'Smart LMS Academy', department = 'Academics', jobTitle = '' }) {
  const fromEmail = process.env.SMTP_USER || 'smartlms2026@gmail.com';
  const roleDisplay = role === 'INSTRUCTOR' ? 'Instructor / Faculty' : role === 'LEARNER' ? 'Student / Learner' : role === 'INSTITUTE_ADMIN' ? 'Institute Dean / Administrator' : role;
  
  console.log(`\n======================================================`);
  console.log(`[MEMBER INVITATION DISPATCH] From: ${fromEmail} To: ${toEmail}`);
  console.log(`Name: ${name} | Role: ${roleDisplay} | Institution: ${tenantName}`);
  console.log(`Account Activation Link: ${inviteLink}`);
  console.log(`======================================================\n`);

  if (!nodemailer) {
    console.warn('[Email Service] nodemailer not configured. Invitation link logged above.');
    return { success: true, simulated: true, inviteLink };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return { success: true, simulated: true, inviteLink };
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 36px 30px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 36px 32px; color: #334155; }
        .title { font-size: 19px; font-weight: 800; color: #0f172a; margin-bottom: 14px; }
        .desc { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .action-btn { background: #4f46e5; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff !important; padding: 14px 34px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35); }
        .fallback-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-top: 20px; word-break: break-all; font-size: 12px; color: #64748b; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; }
        .info-pill { background: #e0e7ff; color: #3730a3; padding: 10px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; margin-top: 16px; border: 1px solid #c7d2fe; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Smart LMS Platform</h1>
          <div class="badge">${roleDisplay} Portal</div>
        </div>
        <div class="content">
          <div class="title">Welcome, ${name}!</div>
          <p class="desc">
            You have been invited to join <strong>${tenantName}</strong> as a <strong>${roleDisplay}</strong>. Click the button below to create your password and activate your account.
          </p>

          <div class="card">
            <table width="100%" cellpadding="4" cellspacing="0" style="font-size: 13px;">
              <tr>
                <td style="color: #64748b; font-weight: 600;">Institution:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${tenantName}</td>
              </tr>
              ${department ? `
              <tr>
                <td style="color: #64748b; font-weight: 600;">Department:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${department}</td>
              </tr>` : ''}
              <tr>
                <td style="color: #64748b; font-weight: 600;">Invited Email:</td>
                <td style="color: #4f46e5; font-weight: 700; text-align: right;">${toEmail}</td>
              </tr>
              <tr>
                <td style="color: #64748b; font-weight: 600;">Assigned Role:</td>
                <td style="color: #0f172a; font-weight: 700; text-align: right;">${roleDisplay}</td>
              </tr>
            </table>
          </div>
          
          <div class="btn-wrapper">
            <a href="${inviteLink}" class="action-btn" target="_blank">Activate Account & Choose Password &rarr;</a>
          </div>

          <div class="info-pill">
            💡 Clicking the button will take you to your personal account setup page to choose your password.
          </div>

          <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
            Or copy and paste this direct link into your browser:
          </p>
          <div class="fallback-box">
            <a href="${inviteLink}" style="color: #4f46e5; text-decoration: underline;">${inviteLink}</a>
          </div>
        </div>
        <div class="footer">
          &copy; 2026 Smart LMS Enterprise &bull; Sent from <b>smartlms2026@gmail.com</b>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Smart LMS Portal" <${fromEmail}>`,
      to: toEmail,
      subject: `🎉 Invitation to Join ${tenantName} as ${roleDisplay} - Set Up Your Account`,
      text: `Hello ${name},\n\nYou have been invited to join ${tenantName} as ${roleDisplay}. Complete your account activation and choose your password here:\n${inviteLink}\n\nSent from ${fromEmail}`,
      html: htmlContent
    });

    console.log(`[Email Service] Member invitation email successfully dispatched via Gmail SMTP: ${info.messageId}`);
    return { success: true, messageId: info.messageId, inviteLink };
  } catch (err) {
    console.warn(`[Email Service] Gmail SMTP Dispatch Notice (${err.message}). Invite link logged to console.`);
    return { success: true, simulated: true, error: err.message, inviteLink };
  }
}

module.exports = {
  sendOtpEmail,
  sendPasswordResetEmail,
  sendInstructorInvitationEmail,
  sendMemberInvitationEmail
};
