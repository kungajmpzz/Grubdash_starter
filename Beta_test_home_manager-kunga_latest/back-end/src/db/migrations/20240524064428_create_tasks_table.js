exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
      table.increments('id').primary();
      table.string('task_name').notNullable();
      table.string('assigned_to').notNullable();
      table.date('due_date').notNullable();
      table.string('status').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
  };
  