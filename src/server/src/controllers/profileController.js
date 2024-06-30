const e = require('express');
const { User } = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

// fucntion to get user profile by requesting user id from the api endpoint
const getUserProfile = async (req, res) => {
  const {id} = req.params;
  try{
    const user = await User.findOne({ where: { userid: id }});
    res.json(user);
  }catch(err){
    res.status(500).json({error: err.message});
  }
};

module.exports = {
  getUserProfile
};
