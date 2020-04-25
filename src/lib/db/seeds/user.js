const data = [
  {
    userId: 1,
    login: 'admin',
    password: 'admin',
  },
  {
    userId: 2,
    login: 'user',
    password: 'user',
  },
];

module.exports = {
  seed: async (knex) => {
    await knex('user').del();
    await knex('user').insert(data);
  },
};

