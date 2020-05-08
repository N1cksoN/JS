const sqlite3 = require('sqlite3');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './src/lib/db/data/dev.sqlite3'
  },
  migrations: {
    directory: './src/lib/db/migrations'
  },
  seeds: {
    directory: './src/lib/db/seeds'
  },
  useNullAsDefault: true
};