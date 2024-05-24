const knex = require("../db/connection");

const getHouseholdMember = (id) => {
    return knex("household_members").where({ id }).first();
};

const createHouseholdMember = (member_name) => {
    return knex("household_members")
        .insert({ member_name })
        .returning("*")
        .then((rows) => rows[0]); // Return the first element of the array
};

const getAllHouseholdMembers = () => {
    return knex("household_members").select("*");
};
async function getHouseholdMemberTasks(req, res, next) {
    const { householdMemberId } = req.params;
    try {
      const memberWithTasks = await service.getHouseholdMemberTasks(householdMemberId);
      if (!memberWithTasks) {
        return res.status(404).json({ error: `Household member with ID ${householdMemberId} not found.` });
      }
      res.json({ data: memberWithTasks });
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    getHouseholdMember,
    createHouseholdMember,
    getAllHouseholdMembers,
    getHouseholdMemberTasks
};
