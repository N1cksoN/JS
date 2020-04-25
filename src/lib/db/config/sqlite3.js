const sqlite3 = require('sqlite3');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './db/data/dev.sqlite3'
  },
  migrations: {
    directory: './db/migrations'
  },
  seeds: {
    directory: './db/seeds'
  },
  useNullAsDefault: true
};