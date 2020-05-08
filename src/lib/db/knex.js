const knex = require('knex');
const process = require('process');
const configs = require('../../../knexfile.js');


const mode = process.env.NODE_ENV || 'dev';
const config = configs[mode];


module.exports = knex(config);
