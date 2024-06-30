const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('course', {
  CourseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Term: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  StartDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  AccessCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  hooks: {
    beforeCreate: (course, options) => {
      const accessCode = generateAccessCode(); // replace this with your access code generation logic
      course.AccessCode = accessCode;
    }
  }
});

const { v4: uuidv4 } = require('uuid');

function generateAccessCode() {
  return uuidv4();
}

module.exports = { Course };