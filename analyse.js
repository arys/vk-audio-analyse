const fs = require("fs");
const { sortBy } = require("lodash");

const data = JSON.parse(fs.readFileSync("data.json"));

const top20 = sortBy(data.similarity.filter((el) => !el.err), "similarity")
  .reverse()
  .slice(0, 20)
  .map((el) => `${el.first_name} ${el.last_name}(${el[`count${el.id}`]}/${el.intersection}) ${(el.similarity * 100).toFixed(2)}%`);

console.log(top20);
