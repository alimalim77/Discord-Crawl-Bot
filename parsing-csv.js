const fs = require("fs");
const csv = require("csv-parser");

const parser = () => {
  let data = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream("emails.csv")
      .pipe(csv())
      .on("data", (row) => {
        data.push(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed.");
        resolve(data);
      })
      .on("error", (error) => {
        console.error("Error occurred while parsing CSV:", error);
        reject(error);
      });
  });
};

module.exports = parser;
