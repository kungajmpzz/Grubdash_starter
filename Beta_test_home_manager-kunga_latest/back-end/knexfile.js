require('dotenv').config();
const path = require("path");
const { parse } = require("pg-connection-string");

const {
  DATABASE_URL = "postgres://luoqolsc:jIbVmmrjvx-6ILBhbVCkR-AejXgIUq2Q@chunee.db.elephantsql.com/luoqolsc",
  DEBUG,
} = process.env;

// Parse the connection URL
const connectionOptions = parse(DATABASE_URL);

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: connectionOptions,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: connectionOptions,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: connectionOptions,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};