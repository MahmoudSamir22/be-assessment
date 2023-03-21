const mongoose = require("mongoose");
const { report } = require("../routes/checkTestRoutes");

const reportSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["up", "down"],
  },
  availability: {
    type: Number,
    default: 0,
  },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  responseTime: {
    type: Number,
    default: 0,
  },
  history: [
    {
      timestamp: Date,
      status: {
        type: String,
        enum: ["up", "down"],
      },
      responseTime: Number,
    },
  ],
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  request: {
    type: mongoose.Schema.ObjectId,
    ref: "Check",
  },
});

reportSchema.post("findOneAndUpdate", async function (doc) {
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
      lastTimeStamp = entry.timestamp
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
    let availability
    if(history.length > 1){
      availability = (doc.uptime / (doc.uptime + doc.downtime)) * 100;
    }
    doc.availability = availability;
    await doc.save();
  }
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
