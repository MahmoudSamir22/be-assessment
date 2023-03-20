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

reportSchema.statics.calcAverage = async function(){
    const result = await this.aggregate({
        
    })
}

reportSchema.pre("findOneAndUpdate", async function (next) {
  
});



const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
