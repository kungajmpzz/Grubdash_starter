// back-end/src/db/migrations/{timestamp}_create_household_members_table.js

exports.up = function (knex) {
  return knex.schema.createTable('household_members', (table) => {
    table.increments('id').primary();
    table.string('member_name').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('household_members');
};
