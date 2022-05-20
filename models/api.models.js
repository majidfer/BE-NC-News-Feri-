const fs = require("fs/promises");

exports.fetchEndpoints = () => {
  return fs.readFile("./endpoints.json").then((endpoints) => {
    const parsedEndpoints = JSON.parse(endpoints) ;
    return parsedEndpoints;
  });
};
