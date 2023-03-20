const axios = require("axios");
const Check = require("../models/checkModel");
const Report = require("../models/reportModel");

const checkUrl = async (check) => {
  let report = await Report.findOne({ request: check._id });
  if (!report) {
    report = await Report.create({ owner: check.user, request: check._id });
  }
  let startTime = new Date().getTime();
  axios
    .get(check.url)
    .then(async (response) => {
      // const startTime = response.config.metadata.startTime;
      const endTime = new Date().getTime();
      const responseTime = endTime - startTime;
      await Report.findByIdAndUpdate(report._id, {
        status: "up",
        $push: {
          history: {
            timestamp: Date.now(),
            status: "up",
            responseTime: responseTime,
          },
        },
      });
    })
    .catch(async (error) => {
      // const startTime = response.config.metadata.startTime;
      const endTime = new Date().getTime();
      const responseTime = endTime - startTime;
      await Report.findByIdAndUpdate(report._id, {
        status: "down",
        outages: report.outages + 1,
        $push: {
          history: {
            timestamp: Date.now(),
            status: "down",
            responseTime: responseTime,
          },
        },
      });
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
