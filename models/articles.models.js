const db = require("../db/connection.js");

exports.fetchArticle = (article_id) => {
  const queryStr = `
  SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.body,
    articles.created_at,
    articles.votes,
    COUNT(comment_id)::int AS total_comments
  FROM
    articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`;
  
  return db
    .query(queryStr, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else return rows[0];
    });
};

exports.fetchArticleToPatch = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else return rows[0];
    });
};
