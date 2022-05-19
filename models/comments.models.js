const db = require("../db/connection.js");

exports.fetchComments = (article_id) => {
  const queryStr = `
    SELECT 
        comments.comment_id,
        comments.body,
        comments.author,
        comments.votes,
        comments.created_at
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1;`;
  return db.query(queryStr, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else if (rows[0].comment_id === null) {
      return [];
    } else return rows;
  });
};

exports.postComment = (article_id, username, body) => {
  const queryStr = `
  INSERT INTO comments (body, article_id, author)
  VALUES ($1, $2, $3)
  RETURNING *;`
  return db.query(queryStr, [body, article_id, username]).then(({ rows }) => {
    return rows[0];
  });
};
