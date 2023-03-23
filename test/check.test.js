const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const Check = require("../models/checkModel");
const User = require("../models/userModel");
const Report = require("../models/reportModel");

beforeAll(async () => {
  await Report.deleteMany();
});

beforeEach(async () => {
  await User.deleteMany();
  await User.create(userOne);
  await Check.deleteMany();
  await Check.create(checkOne);
});
test("Should Add Check", async () => {
  await request(app)
    .post("/api/check/")
    .set("Authorization", `Bearer ${token}`)
    .send(checkTwo)
    .expect(201);
});

test("Should Get Single Check", async () => {
  console.log(checkOneId, userOneId);
  await request(app)
    .get(`/api/check/${checkOneId.toString()}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});

test("Should Get All Checks", async () => {
  console.log(checkOneId, userOneId);
  await request(app)
    .get(`/api/check`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});

test("Should Get All Reports", async () => {
  console.log(checkOneId, userOneId);
  await request(app)
    .get(`/api/report`)
    .set("Authorization", `Bearer ${token}`)
    .expect(200);
});

const userOneId = new mongoose.Types.ObjectId();
const checkOneId = new mongoose.Types.ObjectId();
const checkTwoId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: userOneId }, process.env.JWT_SECRET);
const userOne = {
  _id: userOneId,
  name: "mahmoud",
  email: "check@email.com",
  password: "pass123",
};
const checkOne = {
  _id: checkOneId,
  name: "1st Check",
  url: "http://localhost:3000",
  protocol: "HTTP",
  path: "/1",
  port: 3851,
  webhook: "https://example.com/webhook",
  timeout: 5,
  interval: 2,
  threshold: 1,
  authentication: {
    username: "username",
    password: "password",
  },
  httpHeaders: [
    { key: "Accept-Language", value: "en-US,en;q=0.9" },
    {
      key: "User-Agent",
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    },
  ],
  assert: {
    statusCode: 200,
  },
  tags: ["search engine", "popular"],
  ignoreSSL: false,
  owner: userOneId,
};
const checkTwo = {
  name: "2nd Check",
  url: "http://localhost:3000",
  protocol: "HTTP",
  path: "/2",
  port: 3851,
  webhook: "https://example.com/webhook",
  timeout: 5,
  interval: 2,
  threshold: 1,
  authentication: {
    username: "username",
    password: "password",
  },
  httpHeaders: [
    { key: "Accept-Language", value: "en-US,en;q=0.9" },
    {
      key: "User-Agent",
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    },
  ],
  assert: {
    statusCode: 200,
  },
  tags: ["search engine", "popular"],
  ignoreSSL: false,
};
