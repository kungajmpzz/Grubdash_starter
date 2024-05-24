const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-02 - Manage tasks", () => {
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

  describe("POST /tasks", () => {
    test("returns 400 if task due date is in the past", async () => {
      const data = {
        title: "title",
        description: "description",
        due_date: "1999-01-01",
        importance: "low",
      };

      const response = await request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toContain("past");
      expect(response.status).toBe(400);
    });
    test("returns 400 if task importance is not one of low, medium, or high", async () => {
      const data = {
        title: "title",
        description: "description",
        due_date: "2500-01-01",
        importance: "very",
      };

      const response = await request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toContain("importance");
      expect(response.status).toBe(400);
    });
  });
});
