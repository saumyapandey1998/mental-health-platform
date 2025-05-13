const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../models/User"); // Adjust path as needed

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

test("should create a user with default values", async () => {
  const user = new User({ username: "testuser", password: "password123" });
  const savedUser = await user.save();

  expect(savedUser.username).toBe("testuser");
  expect(savedUser.assignedTherapist).toBe(null);
  expect(savedUser.therapistChangeRequested).toBe(false);
});

test("should not allow missing required fields", async () => {
  const user = new User({}); // missing username and password
  let error;
  try {
    await user.save();
  } catch (err) {
    error = err;
  }
  expect(error).toBeDefined();
  expect(error.name).toBe("ValidationError");
});
