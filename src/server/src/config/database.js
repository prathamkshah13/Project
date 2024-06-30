// config/database.js
const { Sequelize } = require('sequelize');
const keys = require('../../keys');

let sequelize;

if (process.env.NODE_ENV === 'test') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:', // In-memory storage for testing
    logging: false,      // Disable logging for tests
  });
} else {
  sequelize = new Sequelize(keys.pgDatabase, keys.pgUser, keys.pgPassword, {
    host: keys.pgHost,
    dialect: 'postgres',
    port: keys.pgPort,
    define: {
      timestamps: false,
    }
  });
}

module.exports = sequelize;
