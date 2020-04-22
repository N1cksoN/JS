// Update with your config settings.
require('dotenv').config();
const sqlite3 = require('./db/config/sqlite3.js');

module.exports = {

  dev: sqlite3,

};
