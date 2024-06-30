const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('submissions', {
  submissionid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  assignmentid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'qssignment',
      key: 'assignmentid',
    },
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'userid',
    },
  },
  submissiondate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  contenttype: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['html', 'css', 'js', 'link']],
    },
  },
  contentlink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Submission;
