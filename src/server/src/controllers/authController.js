const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { User } = require('../models/user');
require('dotenv').config({ path: '.env' });

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateVerificationCode = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

const sendResetEmail = async (email, verificationCode) => {
  const msg = {
    to: email,
    from: 'capstone499t2@gmail.com', 
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${verificationCode}`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Failed to send email');
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ error: 'No user found with this email' });
    }

    const verificationCode = generateVerificationCode(6);
    await User.update({ verificationcode: verificationCode }, { where: { email: email } });
    await sendResetEmail(email, verificationCode);
    res.json({ message: 'Password reset code sent to your email' });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, password } = req.body;
  if (!email || !code || !password) {
    return res.status(400).json({ error: 'Email, code, and password are required' });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user || user.verificationcode !== code) {
      return res.status(400).json({ error: 'Invalid code or email' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    await User.update({ passwordhash: hashedPassword, verificationcode: null }, { where: { email: email } });
    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Error in resetPassword:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};
