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
  {
    userId: 3,
    login: 'a',
    password: '1',
  },
  {
    userId: 4,
    login: 'b',
    password: '1',
  },
  {
    userId: 5,
    login: 'c',
    password: '1',
  },
  {
    userId: 6,
    login: 'd',
    password: '1',
  },
  {
    userId: 7,
    login: 'e',
    password: '1',
  },
];

module.exports = {
  seed: async (knex) => {
    await knex('user').del();
    await knex('user').insert(data);
  },
};

