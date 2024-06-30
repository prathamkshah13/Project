const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and Password are required' });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordhash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

   const token = jwt.sign({ userid: user.userid, roleid: user.roleid, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });



    res.status(201).json({user, token});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
const registerUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  if (!firstname) {
    return res.status(400).json({ error: 'First Name is required' });
  }
  if (!lastname) {
    return res.status(400).json({ error: 'Last Name is required' });
  }
  if(!email && !password){
    return res.status(400).json({ error: 'Email and Password are required' });
  }
  if(!email){
    return res.status(400).json({ error: 'Email is required' });
  }
  if(!emailRegex.test(email)){
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if(!password){
    return res.status(400).json({ error: 'Password is required' });
  }
  if(!passwordRegex.test(password)){
    return res.status(400).json({ error: 'Password does not meet strength requirements' });
  }

  try {
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      passwordhash: hashedPassword,
      roleid: 1,
      verificationcode: null,
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message});
  }
};

module.exports = {
  registerUser,
  loginUser,
};