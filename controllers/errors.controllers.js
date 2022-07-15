// PSQL error handler
exports.PSQLErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request, please provide valid input" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_author_fkey"
  ) {
    res.status(404).send({ msg: "Username not found" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_article_id_fkey"
  ) {
    res.status(404).send({ msg: "Article not found" });
  } else {
    next(err);
  }
};

// Custom error handler
exports.customErrorHandler = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

// Route error handler
exports.routeErrorHandler = (req, res) => {
  res.status(404).send({ msg: "Route not found" });
};

// Internal server error handler
exports.internalServerErrorHandler = (err, req, res, next) => {
  res.status(500).send({ message: "Internal server error" });
};
