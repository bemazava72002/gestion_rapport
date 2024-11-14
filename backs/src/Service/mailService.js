// mailService.js
const nodemailer = require('nodemailer');
require('dotenv').config()

// emailService.js


const transporter = nodemailer.createTransport({
  service:'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });
}

module.exports = { sendEmail };
