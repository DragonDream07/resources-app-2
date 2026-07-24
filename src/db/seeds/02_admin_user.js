'use strict';

const bcrypt = require('bcrypt');

/**
 * Seed default admin user for development
 */
exports.seed = async function (knex) {
  const ADMIN_USER_ID = '00000000-0000-0000-0000-100000000001';
  const ADMIN_ROLE_ID = '00000000-0000-0000-0000-000000000003';

  const passwordHash = await bcrypt.hash('Admin@1234', 10);

  await knex('user_roles').where({ user_id: ADMIN_USER_ID }).del();
  await knex('users').where({ id: ADMIN_USER_ID }).del();

  await knex('users').insert([
    {
      id: ADMIN_USER_ID,
      name: 'Super Admin',
      email: 'admin@example.com',
      phone: '9000000000',
      password_hash: passwordHash,
      is_guest: false,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  await knex('user_roles').insert([
    {
      id: '00000000-0000-0000-0000-200000000001',
      user_id: ADMIN_USER_ID,
      role_id: ADMIN_ROLE_ID,
      created_at: knex.fn.now(),
    },
  ]);
};
