const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-04 - Tasks by household member", () => {
  beforeAll(() => {
    return knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback(null, true))
    .then(() => knex.migrate.latest());
  });
  
  beforeEach(() => {
    return knex.seed.run();
  });
  
  afterAll(async () => {
    return await knex.migrate.rollback(null, true).then(() => knex.destroy());
  });
  
  describe("View one user's tasks", () => {
    test("returns 404 for non-existent id", async () => {
      const response = await request(app)
      .get("/household-members/99999")
      .set("Accept", "application/json");
      
      expect(response.body.error).toContain("99999");
      expect(response.status).toBe(404);
    });

    test("returns tasks assigned to one user", async () => {
      const taskData = {
        title: "title",
        description: "description",
        due_date: "2050-01-01",
        importance: "low",
      };
      const postHouseholdMember = await request(app)
        .post("/household-members")
        .set("Accept", "application/json")
        .send({
          data: { member_name: "name" },
        });
      const postTask = await request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send({
          data: taskData
        })
      const taskId = postTask.body.data.id;
      const householdMemberId = postHouseholdMember.body.data.id;
      const assign = await request(app)
        .post(`/tasks/${taskId}/assign/${householdMemberId}`)
        .set("Accept", "application/json");
      
      const response = await request(app)
        .get(`/household-members/${householdMemberId}`)
        .set("Accept", "application/json");
      expect(response.body.data.id).toEqual(householdMemberId);
      const responseTasks = response.body.data.tasks;
      expect(responseTasks).toHaveLength(1);
      expect(responseTasks[0]).toMatchObject(taskData);
      expect(response.status).toBe(200);
    })
  });
});
