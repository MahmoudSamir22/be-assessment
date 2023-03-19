const axios = require("axios");
const Check = require("../models/checkModel");

const checkUrl = (urlOptions) => {
  axios
    .get(urlOptions.url)
    .then((response) => {
      console.log(
        `Successfully fetched data from ${urlOptions.url}:`,
        response.data
      );
    })
    .catch((error) => {
      console.error(
        `Error fetching data from ${urlOptions.url}: ${error.message}`
      );
    });
};

const monitorUrl = async () => {
  console.log("Monitoring started");
  const checks = await Check.find();
  checks.forEach((check) => {
    checkUrl(check);
    setInterval(() => {
      checkUrl(check);
    }, check.interval * 1000 * 30);
  });
};
module.exports = monitorUrl;
