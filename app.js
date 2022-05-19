const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticle);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticle);

// Handling PSQL error
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res
      .status(400)
      .send({ msg: "Bad request, please provide valid input" });
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
