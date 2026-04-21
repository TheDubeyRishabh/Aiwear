import nodemailer from "nodemailer";

/**
 * Sends an email if EMAIL_USER + EMAIL_PASS are configured.
 * Returns true on success, false if credentials are missing (soft-skip).
 * Throws on actual send failure.
 */
const sendEmail = async (to, subject, html) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email not configured (EMAIL_USER / EMAIL_PASS missing) — skipping email send.");
    return false; // caller checks this
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"AI Wear" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return true;
};

export default sendEmail;
