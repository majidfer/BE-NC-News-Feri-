const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
  getComments,
  addComment,
} = require("./controllers/comments.controllers.js");
const {
  PSQLErrorHandler,
  customErrorHandler,
  routeErrorHandler,
  internalServerErrorHandler,
} = require("./controllers/errors.controllers.js");

const app = express();

app.use(express.json());

// Topic routes
app.get("/api/topics", getTopics);

// Article routes
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);

// Comment routes
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", addComment);

// User routes
app.get("/api/users", getUsers);

// Error handlers
app.use(PSQLErrorHandler);
app.use(customErrorHandler);
app.all("/*", routeErrorHandler);
app.use(internalServerErrorHandler);

module.exports = app;
