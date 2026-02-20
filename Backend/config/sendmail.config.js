const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (mailOptions) => {
  try {
    let info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    // console.error("Error sending email: ", error);
    throw error;
  }
};

module.exports = { transporter, sendMail };
