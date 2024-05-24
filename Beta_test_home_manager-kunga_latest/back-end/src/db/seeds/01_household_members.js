// back-end/src/db/seeds/01_household_members.js

exports.seed = function (knex) {
  return knex('household_members').del()
    .then(function () {
      return knex('household_members').insert([
        { member_name: 'Alice' },
        { member_name: 'Bob' },
        { member_name: 'Charlie' },
      ]);
    });
};
