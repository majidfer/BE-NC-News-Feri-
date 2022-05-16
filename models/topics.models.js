const db = require("../db/connection.js");

exports.fetchTopics = () => {
    let queryStr = "SELECT * FROM topics";
    return db.query(queryStr).then((result) => {
        return result.rows;
    });
};