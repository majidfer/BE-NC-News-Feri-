const express = require("express");
const { getTopics } = require("./controllers/topics.controllers.js");

const app = express();

app.get("/api/topics", getTopics);

// 404 Error - Route not found
app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "Route not found" });
  next();
});

// 500 Error
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
});

module.exports = app;
