import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const emailUser = (process.env.EMAIL_USER || "").trim();
  const emailPass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (!emailUser || !emailPass) {
    throw new Error("Email configuration missing: set EMAIL_USER and EMAIL_PASS in .env.local");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: "Spliterr",
    to,
    subject,
    text,
  });
};