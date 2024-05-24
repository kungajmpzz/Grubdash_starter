const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-05 - Marking a task complete", () => {
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

  describe("PUT /tasks/:task_id", () => {
    let task;

    beforeEach(async () => {
      const data = {
        title: "title",
        description: "description",
        due_date: "2050-01-01",
        importance: "low",
      };

      const taskResponse = await request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send({data})
      task = taskResponse.body.data;
    });

    test("returns 404 for non-existent task_id", async () => {
      const response = await request(app)
        .put("/tasks/99")
        .set("Accept", "application/json")
        .send({ datum: {} });

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });

    test("returns 200 and task is marked complete ", async () => {
      expect(task).not.toBeUndefined();
      expect(task.completed).toEqual(false);

      const response = await request(app)
        .put(`/tasks/${task.id}`)
        .set("Accept", "application/json")
        .send({ data: { 
          ...task,
          completed: true
         } });

      expect(response.body.error).toBeUndefined();
      expect(response.status).toBe(201);

      const fetchTaskResponse = await request(app)
        .get(`/tasks/${task.id}`)
        .set("Accept", "application/json");

      expect(fetchTaskResponse.body.error).toBeUndefined();
      expect(fetchTaskResponse.status).toBe(200);
      expect(fetchTaskResponse.body.data.completed).toEqual(true);
    });
  });
});
