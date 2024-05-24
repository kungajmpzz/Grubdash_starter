const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-03 - Assigning tasks to users", () => {
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

  describe("POST /tasks/:id/assign/:member_id", () => {
    test("returns 404 if task id does not exist", async () => {
      let response = await request(app)
        .post("/tasks/9999/assign/1")
        .set("Accept", "application/json")
        .send({ });
      expect(response.status).toBe(404);
    });
    test("returns 404 if member id does not exist", async () => {
      let response = await request(app)
        .post("/tasks/1/assign/9999")
        .set("Accept", "application/json")
        .send({ });
      expect(response.status).toBe(404);
    })
    test("returns 200 if member and task both exist", async () => {
      let taskCreationResponse = await request(app)
        .post("/tasks")
        .set("Accept", "application/json")
        .send({
          data: {
            title: "title",
            description: "description",
            due_date: "2050-01-01",
            importance: "low",
          },
        });
      let householdMemberCreationResponse = await request(app)
        .post("/household-members")
        .set("Accept", "application/json")
        .send({
          data: {
            member_name: "member name",
            // You can add more fields here if your API requires more
            // than the member_name
          },
        });
      let response = await request(app)
        .post(
          `/tasks/${taskCreationResponse.body.data.id}/assign/${householdMemberCreationResponse.body.data.id}`
        )
        .set("Accept", "application/json")
        .send({});
      expect(response.statusCode).toBe(201);
    });
  });
});
