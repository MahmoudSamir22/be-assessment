const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    required: true,
    enum: ["HTTP", "HTTPS", "TCP"],
  },
  path: {
    type: String,
  },
  port: {
    type: Number,
  },
  webhook: {
    type: String,
  },
  timeout: {
    type: String,
    default: 5,
  },
  interval: {
    type: String,
    default: 10,
  },
  threshold: {
    type: String,
    default: 1
  },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  httpHeaders: [{
    type: String,
  }],
  assert: { statusCode: {

  } },
  tags: [{
    type: String,
  }],
  ignoreSSL: {
    type: String,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

const Check = mongoose.model("Check", checkSchema);

module.exports = Check;
