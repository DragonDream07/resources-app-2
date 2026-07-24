/**
 * Migration: create order_tracking table FK → orders
 */
exports.up = async function (knex) {
  await knex.schema.createTable('order_tracking', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('carrier', 128).nullable();
    table.string('tracking_number', 255).nullable();
    table.string('tracking_url', 1024).nullable();
    table.string('status', 64).notNullable();
    table.text('description').nullable();
    table.string('location', 255).nullable();
    table.timestamp('event_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('order_tracking');
};
