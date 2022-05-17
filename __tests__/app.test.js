process.env.NODE_ENV = "test";

const request = require("supertest");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const app = require("../app.js");
const db = require("../db/connection.js");

afterAll(() => {
  db.end();
});

beforeEach(() => seed(testData));

describe("GET /api/topics", () => {
  test("200: responds with an object with a key of topics, and a value of the array full of topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const { topics } = res.body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).not.toHaveLength(0);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("Error handling", () => {
  test("404: responds with 404 error when received a request with invalid route(s)", () => {
    return request(app)
      .get("/*")
      .expect(404)
      .then((res) => {
        const { message } = res.body;
        expect(message).toBe("Route not found");
      });
  });
});
