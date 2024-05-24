exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('tasks').del()
    .then(function () {
    
      return knex('tasks').insert([
        { task_name: 'Task 1', assigned_to: 'Alice', due_date: '2024-06-01', status: 'pending' },
        { task_name: 'Task 2', assigned_to: 'Bob', due_date: '2024-06-02', status: 'pending' },
        { task_name: 'Task 3', assigned_to: 'Charlie', due_date: '2024-06-03', status: 'completed' },
      ]);
    });
};
