/**
 * Migration: create order_status_history table FK → orders
 */
exports.up = async function (knex) {
  await knex.schema.createTable('order_status_history', (table) => {
    table.increments('id').primary();
    table
      .integer('order_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('orders')
      .onDelete('CASCADE');
    table.string('status', 64).notNullable();
    table.text('comment').nullable();
    table
      .integer('changed_by')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('order_status_history');
};
