const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");

describe("US-01 - ", () => {
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

  describe("App", () => {
    describe("not found handler", () => {
      test("returns 404 for non-existent route", async () => {
        const response = await request(app)
          .get("/fastidious")
          .set("Accept", "application/json");

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Path not found: /fastidious");
      });
    });
  });

  describe("GET /household-members/:id", () => {
    test("returns 404 for non-existent id", async () => {
      const response = await request(app)
        .get("/household-members/99")
        .set("Accept", "application/json");

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });
  });

  describe("POST /household-members", () => {
    test("returns 400 if data is missing", async () => {
      const response = await request(app)
        .post("/household-members")
        .set("Accept", "application/json")
        .send({ datum: {} });

      expect(response.body.error).toBeDefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if member_name is missing", async () => {
      const data = {
      };

      const response = await request(app)
        .post("/household-members")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toContain("member_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if member_name is empty", async () => {
      const data = {
        member_name: ""
      };

      const response = await request(app)
        .post("/household-members")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toContain("member_name");
      expect(response.status).toBe(400);
    });

    test("returns 201 if data is valid", async () => {
      const data = {
        member_name: "household member",
      };

      const response = await request(app)
        .post("/household-members")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(
        expect.objectContaining({
          member_name: "household member",
          id: expect.any(Number)
        })
      );
      expect(response.status).toBe(201);
    });
  });

  describe("GET /household-members", () => {
    test("returns household members", async () => {
      const response = await request(app)
        .get("/household-members")
        .set("Accept", "application/json");

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].member_name).toBeDefined();
      expect(response.body.data[0].id).toBeDefined();
      expect(response.status).toBe(200);
    });
  });
});
