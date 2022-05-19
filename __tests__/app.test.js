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

describe("GET /api/articles", () => {
  test("200: responds with an articles array of article objects (sorted by date in descending order)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).not.toHaveLength(0);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
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
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 3,
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
          })
        );
      });
  });
  test("200: responds with an article object (including total count of all the comments for the article) according to passed article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            comment_count: 11,
          })
        );
      });
  });
  test("400: responds with a bad request message when passed invalid article_id", () => {
    return request(app)
      .get("/api/articles/mystery")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input");
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

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id when passed a valid article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("400: responds with a bad request message when passed invalid article_id", () => {
    return request(app)
      .get("/api/articles/mystery/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input");
      });
  });
  test("404: responds with a not found message when article is not in the database", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("200: responds with an empty array when article is valid but has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the newly posted comment for the given article_id when passed a valid article_id and a comment object", () => {
    const newComment = {
      username: "rogersop",
      body: "This is a new comment for article_id 1",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment).toEqual(
          expect.objectContaining({
            body: "This is a new comment for article_id 1",
            author: "rogersop",
            article_id: 1,
          })
        );
      });
  });
  test("400: responds with a bad request message when passed invalid article_id", () => {
    const newComment = {
      username: "rogersop",
      body: "This is another comment from rogersop for unknown article",
    };
    return request(app)
      .post("/api/articles/mystery/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input");
      });
  });
  test("400: responds with a bad request message when passed invalid username", () => {
    const newComment = {
      username: "gandalf",
      body: "This is a gandalf comment for article_id 4",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input")
      });
  });
  test("400: responds with a bad request message when passed invalid username type", () => {
    const newComment = {
      username: 1,
      body: "This is a gandalf comment for article_id 4",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input")
      });
  });
  test("400: responds with a not found message when article is not in the database", () => {
    const newComment = {
      username: "rogersop",
      body: "This is another comment from rogersop",
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input")
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with the updated article object", () => {
    const requestVote = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(requestVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 10,
        });
      });
  });
  test("400: responds with a bad request message when no inc_votes passed", () => {
    return request(app)
      .patch("/api/articles/3")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input");
      });
  });
  test("400: responds with a bad request message when passed invalid inc_votes", () => {
    const requestVote = {
      inc_votes: "woohooo!",
    };
    return request(app)
      .patch("/api/articles/3")
      .send(requestVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input");
      });
  });
  test("400: responds with a bad request message when passed invalid article_id", () => {
    const requestVote = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/mystery")
      .send(requestVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request, please provide valid input");
      });
  });
  test("404: responds with a not found message when article is not in the database", () => {
    const requestVote = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/999999")
      .send(requestVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an object with a key of users, and a value of the array full of users.", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).not.toHaveLength(0);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
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
