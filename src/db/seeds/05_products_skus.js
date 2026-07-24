'use strict';

/**
 * Sample products and SKU variants
 */
exports.seed = async function (knex) {
  await knex('skus').del();
  await knex('products').del();

  // ── Products ─────────────────────────────────────────────────────────────
  await knex('products').insert([
    {
      id: '00000000-0000-0000-0003-000000000001',
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Latest Samsung flagship smartphone with AI features.',
      category_id: '00000000-0000-0000-0001-000000000011',
      brand_id: '00000000-0000-0000-0002-000000000001',
      base_price: 79999.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0003-000000000002',
      name: 'Apple iPhone 15',
      slug: 'apple-iphone-15',
      description: 'Apple iPhone 15 with Dynamic Island and USB-C.',
      category_id: '00000000-0000-0000-0001-000000000011',
      brand_id: '00000000-0000-0000-0002-000000000002',
      base_price: 89999.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0003-000000000003',
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description: 'High-performance laptop with OLED display.',
      category_id: '00000000-0000-0000-0001-000000000012',
      brand_id: '00000000-0000-0000-0002-000000000004',
      base_price: 149999.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0003-000000000004',
      name: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Comfortable running shoes for men.',
      category_id: '00000000-0000-0000-0001-000000000021',
      brand_id: '00000000-0000-0000-0002-000000000003',
      base_price: 11999.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0003-000000000005',
      name: 'Philips Air Fryer HD9200',
      slug: 'philips-air-fryer-hd9200',
      description: 'Healthy cooking with Rapid Air technology.',
      category_id: '00000000-0000-0000-0001-000000000003',
      brand_id: '00000000-0000-0000-0002-000000000005',
      base_price: 8499.00,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);

  // ── SKUs ──────────────────────────────────────────────────────────────────
  await knex('skus').insert([
    // Samsung Galaxy S24 — 128 GB / 256 GB
    {
      id: '00000000-0000-0000-0004-000000000001',
      product_id: '00000000-0000-0000-0003-000000000001',
      sku_code: 'SAM-S24-128-PHN',
      attributes: JSON.stringify({ storage: '128GB', color: 'Phantom Black' }),
      price: 79999.00,
      stock_quantity: 50,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0004-000000000002',
      product_id: '00000000-0000-0000-0003-000000000001',
      sku_code: 'SAM-S24-256-CLY',
      attributes: JSON.stringify({ storage: '256GB', color: 'Cream' }),
      price: 84999.00,
      stock_quantity: 30,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // Apple iPhone 15 — 128 GB / 256 GB
    {
      id: '00000000-0000-0000-0004-000000000003',
      product_id: '00000000-0000-0000-0003-000000000002',
      sku_code: 'APL-IP15-128-BLK',
      attributes: JSON.stringify({ storage: '128GB', color: 'Black' }),
      price: 89999.00,
      stock_quantity: 40,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0004-000000000004',
      product_id: '00000000-0000-0000-0003-000000000002',
      sku_code: 'APL-IP15-256-PNK',
      attributes: JSON.stringify({ storage: '256GB', color: 'Pink' }),
      price: 99999.00,
      stock_quantity: 25,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // Dell XPS 15 — 16 GB RAM
    {
      id: '00000000-0000-0000-0004-000000000005',
      product_id: '00000000-0000-0000-0003-000000000003',
      sku_code: 'DLL-XPS15-16-512',
      attributes: JSON.stringify({ ram: '16GB', storage: '512GB SSD' }),
      price: 149999.00,
      stock_quantity: 15,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0004-000000000006',
      product_id: '00000000-0000-0000-0003-000000000003',
      sku_code: 'DLL-XPS15-32-1TB',
      attributes: JSON.stringify({ ram: '32GB', storage: '1TB SSD' }),
      price: 179999.00,
      stock_quantity: 10,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // Nike Air Max 270 — sizes
    {
      id: '00000000-0000-0000-0004-000000000007',
      product_id: '00000000-0000-0000-0003-000000000004',
      sku_code: 'NKE-AM270-8-BLK',
      attributes: JSON.stringify({ size: 'UK 8', color: 'Black/White' }),
      price: 11999.00,
      stock_quantity: 20,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0004-000000000008',
      product_id: '00000000-0000-0000-0003-000000000004',
      sku_code: 'NKE-AM270-9-BLK',
      attributes: JSON.stringify({ size: 'UK 9', color: 'Black/White' }),
      price: 11999.00,
      stock_quantity: 18,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: '00000000-0000-0000-0004-000000000009',
      product_id: '00000000-0000-0000-0003-000000000004',
      sku_code: 'NKE-AM270-10-RED',
      attributes: JSON.stringify({ size: 'UK 10', color: 'Red/White' }),
      price: 12499.00,
      stock_quantity: 12,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },

    // Philips Air Fryer — single SKU
    {
      id: '00000000-0000-0000-0004-000000000010',
      product_id: '00000000-0000-0000-0003-000000000005',
      sku_code: 'PHL-AF9200-WHT',
      attributes: JSON.stringify({ color: 'White', capacity: '4.1L' }),
      price: 8499.00,
      stock_quantity: 35,
      is_active: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
