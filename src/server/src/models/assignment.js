const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('assignment', {
  assignmentid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  courseid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  assignmentname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  assignmentdescription: {
    type: DataTypes.TEXT,
  },
  submissiontype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answerkey: {
    type: DataTypes.STRING,  
  },
  rubric: {
    type: DataTypes.STRING, 
  },
  prompt: {
    type: DataTypes.TEXT,
  },
  maxscore: {
    type: DataTypes.INTEGER,
  },
  averagescore: {
    type: DataTypes.FLOAT,
  },
  startdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  enddate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = Assignment;
