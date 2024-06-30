const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('announcement', {
  AnnouncementID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  CourseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  DatePosted: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = { Announcement };