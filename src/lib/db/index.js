const knex = require('./knex.js');
require('./objection.js');
const models = require('./models');

module.exports = {
	knex,
	models,
};

