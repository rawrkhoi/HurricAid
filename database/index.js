const { db } = require('../config');
const pgp = require('pg-promise')();

const connection = {
  host: db.host, 
  port: 5432,
  database: db.dbName,
  user: db.username,
  password: db.password,
};

const datab = pgp(connection);

module.exports = {
  getUserById: (userId) => datab.any(`SELECT * FROM public."Users" WHERE id = $1`, [userId]).then(([user]) => user),
  addNewUser: () => datab.any(`INSERT INTO public."Users" (first_name, last_name, email, password, photo_url, emergency_contact) VALUES ()`, []),
  addNewPhone: (num) => datab.any(`INSERT INTO public."Phone" (number) VALUES ($1)`, [num]),
};
