const {
  fetchComments,
  postComment,
  deleteComment,
} = require("../models/comments.models.js");

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.addComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  postComment(article_id, username, body)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentToDelete = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then((result) => {
      res.status(204).send({ result });
    })
    .catch((err) => {
      next(err);
    });
};
