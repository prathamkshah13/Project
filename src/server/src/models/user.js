const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = sequelize.define('user', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstname: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  lastname: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  passwordhash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  roleid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'RoleID',
    },
  },
  verificationcode: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = {
  User,
};