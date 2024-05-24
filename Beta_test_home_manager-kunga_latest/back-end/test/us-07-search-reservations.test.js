const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-07 - Recurring tasks", () => {
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

  describe("POST /tasks/:id to complete a recurring task", () => {
    test("completing a recurring task creates a new task", async () => {
      const data = {
        title: "title",
        description: "description",
        due_date: "2050-01-01",
        importance: "low",
        recurring: 7
      }
      const response = await request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send({data});
      expect(response.statusCode).toEqual(201);
      expect(response.body.data.recurring).toEqual(true);
      const {id} = response.body.data;

      const putResponse = await request(app)
        .put(`/tasks/${id}`)
        .set('Accept', 'application/json')
        .send({
          ...response.body.data,
          completed: true
        });
      const incompleteTasksResponse = await request(app)
        .get('/tasks?completed=false')
        .set("Accept", "application/json");
      expect(incompleteTasksResponse.statusCode).toEqual(200);
      const incompleteTasks = incompleteTasksResponse.body.data;
      expect(incompleteTasks).not.toHaveLength(0);
      expect(incompleteTasks).toContainObject({due_date: "2050-01-08"})
    });
  });
});
