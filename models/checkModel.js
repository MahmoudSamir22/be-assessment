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
    type: Number,
    default: 5,
  },
  interval: {
    type: Number,
    default: 10,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  httpHeaders: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  assert: {
    statusCode: { type: Number },
  },
  tags: [
    {
      type: String,
    },
  ],
  ignoreSSL: {
    type: Boolean,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Check = mongoose.model("Check", checkSchema);

module.exports = Check;
