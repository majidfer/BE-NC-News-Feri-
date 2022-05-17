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

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object according to passed article_id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
        });
      });
  });
  test("400: responds with a bad request message when passed invalid article_id", () => {
    return request(app)
      .get("/api/articles/mystery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: responds with a not found message when article is not in the database", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("Error handling", () => {
  test("404: responds with 404 error when received a request with invalid route(s)", () => {
    return request(app)
      .get("/apl")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
