const { Sequelize, Op, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('role', {
    RoleId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        notNull: true
    },
    RoleName: {
        type: DataTypes.STRING,
        notNull: true,
        isIn:[[
            'Student',
            'Admin',
            'Instructor',
            'TA'
        ]]
    }
});