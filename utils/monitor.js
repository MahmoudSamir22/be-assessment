const axios = require("axios");
const sendEmail = require("./sendMail");
const Check = require("../models/checkModel");
const Report = require("../models/reportModel");
const User = require('../models/userModel')

const updateReportStatus = async (doc) => {
  let sum = 0;
  let totalUpTime = 0;
  let totalDownTime = 0;
  const history = doc.history;
  if (history.length > 0) {
    let status = history[0].status; // Set starting status
    let lastTimeStamp = history[0].timestamp; // Set starting time stamp
    history.forEach((entry) => {
      sum += entry.responseTime;
      const timeInMS = entry.timestamp.getTime() - lastTimeStamp.getTime();
      lastTimeStamp = entry.timestamp;
      if (status == "up") {
        totalUpTime += timeInMS;
      } else {
        totalDownTime += timeInMS;
      }
    });
    const avgResponseTime = (sum / history.length / 1000).toFixed(3);
    doc.responseTime = avgResponseTime;
    doc.downtime = (totalDownTime / 1000).toFixed(0);
    doc.uptime = (totalUpTime / 1000).toFixed(0);
    let availability;
    if (history.length > 1) {
      availability = (doc.uptime / (doc.uptime + doc.downtime)) * 100;
    }
    doc.availability = availability;
    await doc.save();
  }
};

const checkUrl = async (check, threshold = 1) => {
  // Find report or create if not exist
  let report = await Report.findOne({ request: check._id });
  if (!report) {
    report = await Report.create({ owner: check.owner, request: check._id });
  }
  // Setup Needed Vars
  let startTime = new Date().getTime(); // Help to count the request Response time
  const requestTimeOut = check.timeout * 1000 || 5000; // Set the timeout in MS it
  //Create  Headers Object
  let headers = {};
  if (check.httpHeaders) {
    check.httpHeaders.forEach((header) => {
      const tempObj = {};
      tempObj[header.key] = header.value;
      headers = { ...headers, ...tempObj };
    });
  }
  //Create Authentication Object
  let auth = {};
  if (check.authentication) {
    auth.username = check.authentication.username;
    auth.password = check.authentication.password;
  }
  // Create the request URL
  let url = check.url;
  if (check.path) {
    url = url + check.path;
  }
  //Send Request
  axios
    .get(url, { timeout: requestTimeOut, auth, headers })
    .then(async (response) => {
      const endTime = new Date().getTime(); // End the request response time
      const responseTime = endTime - startTime;
      // Push the success polling request into the history
      report = await Report.findByIdAndUpdate(
        report._id,
        {
          status: "up",
          $push: {
            history: {
              timestamp: Date.now(),
              status: "up",
              responseTime: responseTime,
            },
          },
        },
        { new: true }
      );
      // Do the Requests response caculations
      await updateReportStatus(report);
    })
    .catch(async (error) => {
      if (threshold < check.threshold) {
        checkUrl(check, threshold + 1);
      }
      const endTime = new Date().getTime();
      const responseTime = endTime - startTime;
      // Push the Failed polling request into the history
      report = await Report.findByIdAndUpdate(
        report._id,
        {
          status: "down",
          outages: report.outages + 1,
          $push: {
            history: {
              timestamp: Date.now(),
              status: "down",
              responseTime: responseTime,
            },
          },
        },
        { new: true }
      );
      // Do the Requests response caculations
      await updateReportStatus(report);
      const user = await User.findById(check.owner)
      await sendEmail({
        email: user.email,
        subject: "URL Down",
        message: `Your URL ${url} is Down right now`,
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
    }, check.interval * 1000 * 60);
  });
};
module.exports = { monitorUrl, checkUrl };
