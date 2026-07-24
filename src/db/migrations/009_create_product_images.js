/**
 * Migration: create product_images table FK → products
 */
exports.up = async function (knex) {
  await knex.schema.createTable('product_images', (table) => {
    table.increments('id').primary();
    table
      .integer('product_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');
    table.string('url', 1024).notNullable();
    table.string('alt_text', 512).nullable();
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.integer('sort_order').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('product_images');
};
