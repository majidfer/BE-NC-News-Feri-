const {
  fetchArticle,
  fetchArticles,
  fetchArticleToPatch,
} = require("../models/articles.models.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  fetchArticles(sort_by, order)
    .then((articles) => {
    res.status(200).send({ articles });
  }).catch((err) => {
    next(err);
  });
};

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const parsedArticleId = parseInt(req.params.article_id);
  const { inc_votes } = req.body;
  fetchArticleToPatch(parsedArticleId, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};
