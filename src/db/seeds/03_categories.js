'use strict';

/**
 * Sample category tree
 *
 * Tree structure:
 *   Electronics
 *     ├── Mobiles
 *     └── Laptops
 *   Fashion
 *     ├── Men
 *     └── Women
 *   Home & Kitchen
 */
exports.seed = async function (knex) {
  await knex('categories').del();

  // Root categories
  await knex('categories').insert([
    {
      id: '00000000-0000-0000-0001-000000000001',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and accessories',
      parent_id: null,
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0001-000000000002',
      name: 'Fashion',
      slug: 'fashion',
      description: 'Clothing, footwear and accessories',
      parent_id: null,
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0001-000000000003',
      name: 'Home & Kitchen',
      slug: 'home-kitchen',
      description: 'Home essentials, furniture and kitchen appliances',
      parent_id: null,
      image_url: null,
      is_active: true,
      sort_order: 3,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // Child categories — Electronics
  await knex('categories').insert([
    {
      id: '00000000-0000-0000-0001-000000000011',
      name: 'Mobiles',
      slug: 'mobiles',
      description: 'Smartphones and mobile accessories',
      parent_id: '00000000-0000-0000-0001-000000000001',
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0001-000000000012',
      name: 'Laptops',
      slug: 'laptops',
      description: 'Laptops and computing devices',
      parent_id: '00000000-0000-0000-0001-000000000001',
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // Child categories — Fashion
  await knex('categories').insert([
    {
      id: '00000000-0000-0000-0001-000000000021',
      name: 'Men',
      slug: 'men',
      description: "Men's clothing and accessories",
      parent_id: '00000000-0000-0000-0001-000000000002',
      image_url: null,
      is_active: true,
      sort_order: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0001-000000000022',
      name: 'Women',
      slug: 'women',
      description: "Women's clothing and accessories",
      parent_id: '00000000-0000-0000-0001-000000000002',
      image_url: null,
      is_active: true,
      sort_order: 2,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
