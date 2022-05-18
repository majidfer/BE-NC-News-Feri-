const {
  fetchArticle,
  fetchArticleToPatch,
} = require("../models/articles.models.js");

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
