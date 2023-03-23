const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const app = require("../src/app");

const generateOTP = require("../utils/generateOTP");
const User = require("../models/userModel");

const userOneId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: userOneId }, process.env.JWT_SECRET);
const otp = generateOTP();
const userOne = {
  _id: userOneId,
  name: "mahmoud",
  email: "test@email.com",
  password: "pass123",
  verifyCode: otp.hashedOTP,
  verifyCodeExpiration: otp.otpExpiration,
};
const userTwo = {
  name: "mahmoud",
  email: "test@test.com",
  password: "pass123",
};

beforeEach(async () => {
  await User.deleteMany();
  await User.create(userOne);
});

test("Should sign up a new user", async () => {
  await request(app)
    .post("/api/auth/signup")
    .send(userTwo)
    .expect(201);
}, 10000);

test("Should Login", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

test("Should Not Login", async () => {
  await request(app)
    .post("/api/auth/login")
    .send({
      email: "badEmail@email.com",
      password: "bad password",
    })
    .expect(400);
});

test("Verify Email Should Work", async () => {
  await request(app)
    .put("/api/auth/verifyEmail")
    .send({ email: userOne.email, otp: otp.otp })
    .expect(200);
});

test("Verify Email Should not Work", async () => {
  await request(app)
    .put("/api/auth/verifyEmail")
    .send({ email: userOne.email, otp: "Wronge" })
    .expect(404);
});
