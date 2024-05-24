// const environment = process.env.NODE_ENV || "development";
// const config = require("../../knexfile")[environment];
// const knex = require("knex")(config);

// module.exports = knex;

// back-end/src/db/connection.js

const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile')[environment];
const knex = require('knex')(config);

module.exports = knex;

