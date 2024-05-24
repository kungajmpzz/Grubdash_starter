const request = require("supertest");

const app = require("../src/app");
const knex = require("../src/db/connection");


expect.extend({
  toContainObject(received, argument) {

    const pass = this.equals(received, 
      expect.arrayContaining([
        expect.objectContaining(argument)
      ])
    )

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
        pass: false
      }
    }
  }
})

describe("US-06 - Tracking completed tasks", () => {
  const taskData = [
    {
      title: "title",
      description: "description",
      due_date: "2050-01-01",
      importance: "low",
    },
    {
      title: "title2",
      description: "description2",
      due_date: "2049-01-01",
      importance: "medium",
    },
    {
      title: "title3",
      description: "description3",
      due_date: "2048-01-01",
      importance: "high",
    }
  ]
  beforeAll(() => {
    return knex.migrate
      .forceFreeMigrationsLock()
      .then(() => knex.migrate.rollback(null, true))
      .then(() => knex.migrate.latest())
      .then(() =>
        Promise.all(
          taskData.map((data) =>
            request(app)
              .post("/tasks")
              .set("Accept", "application/json")
              .send({ data })
          )
        ).then((taskResponses) =>
          request(app)
            .put(`/tasks/${taskResponses[0].body.data.id}`)
            .set("Accept", "application/json")
            .send({
              data: {
                ...taskResponses[0].body.data,
                completed: true,
              },
            })
        )
      );
  });

    afterAll(async () => {
      return await knex.migrate.rollback(null, true).then(() => knex.destroy());
    });
    
    describe("GET /tasks", () => {
      test("returns all tasks with no query params", async () => {
        const response = await request(app)
        .get("/tasks")
        .set("Accept", "application/json");
        
        expect(response.body.error).toBeUndefined();
        const tasks = response.body.data;
        expect(tasks).toHaveLength(3);
        expect(tasks).toContainObject(taskData[0]);
        expect(tasks).toContainObject(taskData[1]);
        expect(tasks).toContainObject(taskData[2]);
        expect(response.status).toBe(200);
      });

      test("returns only completed tasks with ?complete=true", async () => {
        const response = await request(app)
        .get("/tasks?complete=true")
        .set("Accept", "application/json");
        
        expect(response.body.error).toBeUndefined();
        const tasks = response.body.data;
        expect(tasks).toHaveLength(1);
        expect(response.status).toBe(200);
      });

      test("returns only incomplete tasks with ?complete=false", async () => {
        const response = await request(app)
        .get("/tasks?complete=false")
        .set("Accept", "application/json");
        
        expect(response.body.error).toBeUndefined();
        const tasks = response.body.data;
        expect(tasks).toHaveLength(2);
        expect(response.status).toBe(200);
      });

    });
    
  });
  
  