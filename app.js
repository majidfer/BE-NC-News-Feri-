const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getArticle } = require("./controllers/articles.controllers.js")

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg});
});

// // 404 Error - Route not found
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

// 500 Error
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
