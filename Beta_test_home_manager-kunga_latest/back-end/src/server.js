// const { PORT = 5001 } = process.env;

// const app = require("./app");
// const knex = require("./db/connection");

// knex.migrate
//   .latest()
//   .then((migrations) => {
//     console.log("migrations", migrations);
//     app.listen(PORT, listener);
//   })
//   .catch((error) => {
//     console.error(error);
//     knex.destroy();
//   });

// function listener() {
//   console.log(`Listening on Port ${PORT}!`);
// }

// back-end/src/server.js

const express = require('express');
const knex = require('./db/connection');
const householdMembersRouter = require('./routes/householdMembers');
const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());

app.use('/household_members', householdMembersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

