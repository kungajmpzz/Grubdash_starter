const knex = require('../db/connection');

async function getAllIncompleteTasks() {
    return await knex('tasks').whereNull('completed_at').select('*');
}

async function getTask(id) {
    return await knex('tasks').where({ id }).first();
}

async function createTask(taskData) {
    return await knex('tasks').insert(taskData).returning('*');
}

async function validateMemberId(memberId) {
    const member = await knex('household_members').where({ id: memberId }).first();
    return !!member; // Returns true if member exists, false otherwise
}

async function updateTaskAssignment(taskId, memberId) {
    return await knex('tasks')
        .where({ id: taskId })
        .update({ assigned_to_member_id: memberId })
        .returning('*');
}


  
module.exports = {
    getAllIncompleteTasks,
    getTask,
    createTask,
    validateMemberId,
    updateTaskAssignment,

};
