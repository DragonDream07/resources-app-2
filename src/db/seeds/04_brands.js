'use strict';

/**
 * Sample brands
 */
exports.seed = async function (knex) {
  await knex('brands').del();

  await knex('brands').insert([
    {
      id: '00000000-0000-0000-0002-000000000001',
      name: 'Samsung',
      slug: 'samsung',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0002-000000000002',
      name: 'Apple',
      slug: 'apple',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0002-000000000003',
      name: 'Nike',
      slug: 'nike',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0002-000000000004',
      name: 'Dell',
      slug: 'dell',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0002-000000000005',
      name: 'Philips',
      slug: 'philips',
      logo_url: null,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
