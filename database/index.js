const { db } = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize( db.dbName, db.username, db.password, {
  host: db.host,
  port: 5432,
  dialect: 'postgres',
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection to database successful');
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });

sequelize.sync({ force: false })
  .then(() => {
    console.log('It worked!');
  }, (err) => {
    console.log('An error occurred while creating the table:', err);
});