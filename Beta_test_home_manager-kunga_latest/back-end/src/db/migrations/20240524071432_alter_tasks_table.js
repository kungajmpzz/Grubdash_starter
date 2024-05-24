exports.up = function(knex) {
    return knex.schema.table('tasks', function(table) {
      table.integer('assigned_to_member_id').unsigned();
      table.foreign('assigned_to_member_id').references('id').inTable('household_members');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('tasks', function(table) {
      table.dropColumn('assigned_to_member_id');
    });
  };
  