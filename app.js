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

const app = express();

app.use(express.json());

// Topics route
app.get("/api/topics", getTopics);

// Articles route
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticle);

// Comments route
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", addComment);

// Users route
app.get("/api/users", getUsers);

// Handling PSQL error
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request, please provide valid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Request parameter not found"});
  } else {
    next(err);
  }
});

// Custom error
app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

// 404 Error - Route not found
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

// 500 Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
