const table = ({}) => async (t) => {
	t.increments('userId').primary();
	t.string('login', 32).notNullable().unique();
	t.string('password', 32).notNullable();
};

module.exports = {
	up: async (knex) => {
		if(await knex.schema.hasTable('user')) {
			return;
		}
		return await knex.schema.createTable('user', table(knex));
	},
	down: async (knex) => knex.schema.dropTableIfExists('user'),
};
